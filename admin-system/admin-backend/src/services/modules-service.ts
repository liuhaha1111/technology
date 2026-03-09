import { supabaseAdmin } from "../lib/supabase";

export type ModuleRecord = {
  id: string;
  moduleKey: string;
  orgUnitId: string;
  title: string;
  status: string;
  updatedAt: string;
};

type ReviewItem = {
  reviewerId: string;
  decision: string;
  comments?: string;
  reviewedAt: string;
};

const records: ModuleRecord[] = [
  {
    id: "p-001",
    moduleKey: "declaration",
    orgUnitId: "00000000-0000-0000-0000-000000000001",
    title: "新材料关键工艺示范",
    status: "pending",
    updatedAt: new Date().toISOString()
  },
  {
    id: "p-002",
    moduleKey: "midterm",
    orgUnitId: "00000000-0000-0000-0000-000000000001",
    title: "机器人协同平台",
    status: "in_review",
    updatedAt: new Date().toISOString()
  }
];

const reviewsByProject: Record<string, ReviewItem[]> = {};

const listRecordsSupabase = async (
  moduleKey: string,
  page: number,
  size: number,
  orgUnitId?: string | null,
  status?: string
) => {
  let query = supabaseAdmin
    .from("projects")
    .select("id,module_key,org_unit_id,title,status,updated_at", { count: "exact" })
    .eq("module_key", moduleKey);

  if (orgUnitId) {
    query = query.eq("org_unit_id", orgUnitId);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await query.range(from, to).order("updated_at", { ascending: false });
  if (error) {
    throw error;
  }

  const items: ModuleRecord[] = (data ?? []).map((row: any) => ({
    id: row.id,
    moduleKey: row.module_key,
    orgUnitId: row.org_unit_id,
    title: row.title,
    status: row.status,
    updatedAt: row.updated_at
  }));

  return {
    total: count ?? items.length,
    items
  };
};

const reviewProjectSupabase = async (projectId: string, reviewerAuthId: string, decision: string, comments?: string) => {
  const { data: adminUser } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", reviewerAuthId)
    .maybeSingle();

  const reviewerId = adminUser?.id ?? null;

  const { data: updatedProject, error: updateError } = await supabaseAdmin
    .from("projects")
    .update({ status: decision, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select("id,module_key,org_unit_id,title,status,updated_at")
    .single();
  if (updateError || !updatedProject) {
    return null;
  }

  await supabaseAdmin.from("project_reviews").insert({
    project_id: projectId,
    reviewer_id: reviewerId,
    decision,
    comments
  });

  const { data: reviews } = await supabaseAdmin
    .from("project_reviews")
    .select("reviewer_id,decision,comments,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return {
    id: updatedProject.id,
    moduleKey: updatedProject.module_key,
    orgUnitId: updatedProject.org_unit_id,
    title: updatedProject.title,
    status: updatedProject.status,
    updatedAt: updatedProject.updated_at,
    reviews: (reviews ?? []).map((item) => ({
      reviewerId: item.reviewer_id ?? "unknown",
      decision: item.decision,
      comments: item.comments ?? undefined,
      reviewedAt: item.created_at
    }))
  };
};

export const modulesService = {
  listRecords: async (
    moduleKey: string,
    page: number,
    size: number,
    orgUnitId: string | null | undefined,
    status: string | undefined,
    useMock: boolean
  ) => {
    if (useMock) {
      const filtered = records.filter(
        (item) =>
          item.moduleKey === moduleKey &&
          (!orgUnitId || item.orgUnitId === orgUnitId) &&
          (!status || item.status === status)
      );
      const start = (page - 1) * size;
      return {
        total: filtered.length,
        items: filtered.slice(start, start + size)
      };
    }

    return listRecordsSupabase(moduleKey, page, size, orgUnitId, status);
  },

  reviewProject: async (
    projectId: string,
    reviewerId: string,
    decision: string,
    comments: string | undefined,
    useMock: boolean
  ) => {
    if (useMock) {
      const project = records.find((item) => item.id === projectId);
      if (!project) {
        return null;
      }

      project.status = decision;
      project.updatedAt = new Date().toISOString();
      reviewsByProject[projectId] = reviewsByProject[projectId] ?? [];
      reviewsByProject[projectId].push({
        reviewerId,
        decision,
        comments,
        reviewedAt: project.updatedAt
      });

      return {
        ...project,
        reviews: reviewsByProject[projectId]
      };
    }

    return reviewProjectSupabase(projectId, reviewerId, decision, comments);
  }
};
