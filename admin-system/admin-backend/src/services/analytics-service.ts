import { supabaseAdmin } from "../lib/supabase";

type AuditEvent = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actor: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

const auditEvents: AuditEvent[] = [
  {
    id: "a-001",
    action: "login",
    resourceType: "auth",
    resourceId: "session-100",
    actor: "admin@example.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "a-002",
    action: "review",
    resourceType: "project",
    resourceId: "p-001",
    actor: "analyst@example.com",
    createdAt: new Date().toISOString()
  }
];

const countByStatus = async (status: string) => {
  const { count } = await supabaseAdmin.from("projects").select("id", { count: "exact", head: true }).eq("status", status);
  return count ?? 0;
};

const getOverviewSupabase = async () => {
  const [{ count: usersTotal }, { count: usersActive }, { count: projectsTotal }, { count: authEventsLast30Days }] =
    await Promise.all([
      supabaseAdmin.from("admin_users").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("admin_users").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("audit_logs").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString())
    ]);

  const [projectsPending, projectsApproved, projectsRejected] = await Promise.all([
    countByStatus("pending"),
    countByStatus("approved"),
    countByStatus("rejected")
  ]);

  return {
    usersTotal: usersTotal ?? 0,
    usersActive: usersActive ?? 0,
    rolesDistribution: {},
    projectsTotal: projectsTotal ?? 0,
    projectsPending,
    projectsApproved,
    projectsRejected,
    authEventsLast30Days: authEventsLast30Days ?? 0,
    auditEventsLast30Days: authEventsLast30Days ?? 0
  };
};

const getTrendsSupabase = async () => {
  const since7d = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data } = await supabaseAdmin
    .from("daily_metrics")
    .select("metric_date,name,value")
    .gte("metric_date", since7d.slice(0, 10))
    .order("metric_date", { ascending: true });

  const login7d = (data ?? []).filter((item) => item.name === "logins").map((item) => Number(item.value));
  return {
    login7d: login7d.length ? login7d : [0, 0, 0, 0, 0, 0, 0],
    login30d: [],
    errorRate7d: []
  };
};

const getFunnelSupabase = async () => {
  const { data } = await supabaseAdmin.from("projects").select("status");
  const statuses = (data ?? []).map((row) => row.status);
  return {
    declaration: statuses.length,
    approval: statuses.filter((s) => s !== "draft").length,
    midterm: statuses.filter((s) => s === "in_review" || s === "approved").length,
    acceptance: statuses.filter((s) => s === "approved").length
  };
};

const listAuditsSupabase = async (page: number, size: number) => {
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, count } = await supabaseAdmin
    .from("audit_logs")
    .select("id,action,resource_type,resource_id,actor_user_id,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    total: count ?? 0,
    items: (data ?? []).map((row) => ({
      id: row.id,
      action: row.action,
      resourceType: row.resource_type,
      resourceId: row.resource_id ?? "",
      actor: row.actor_user_id ?? "unknown",
      createdAt: row.created_at
    }))
  };
};

export const analyticsService = {
  getOverview: async (useMock: boolean) => {
    if (useMock) {
      return {
        usersTotal: 12,
        usersActive: 9,
        rolesDistribution: {
          super_admin: 1,
          admin: 3,
          analyst: 4,
          viewer: 4
        },
        projectsTotal: 24,
        projectsPending: 8,
        projectsApproved: 11,
        projectsRejected: 5,
        authEventsLast30Days: 91,
        auditEventsLast30Days: auditEvents.length
      };
    }

    return getOverviewSupabase();
  },

  getTrends: async (useMock: boolean) => {
    if (useMock) {
      return {
        login7d: [8, 10, 12, 9, 13, 11, 14],
        login30d: [8, 7, 9, 10, 8, 11, 12, 10, 9, 13, 12, 11, 13, 14, 9, 10, 12, 11, 13, 12, 10, 9, 8, 11, 10, 12, 13, 12, 11, 14],
        errorRate7d: [0.8, 0.7, 0.6, 0.9, 0.5, 0.4, 0.6]
      };
    }

    return getTrendsSupabase();
  },

  getFunnel: async (useMock: boolean) => {
    if (useMock) {
      return {
        declaration: 100,
        approval: 76,
        midterm: 61,
        acceptance: 49
      };
    }

    return getFunnelSupabase();
  },

  listAudits: async (page: number, size: number, useMock: boolean) => {
    if (useMock) {
      const start = (page - 1) * size;
      return {
        total: auditEvents.length,
        items: auditEvents.slice(start, start + size)
      };
    }

    return listAuditsSupabase(page, size);
  },

  recordAudit: async (event: Omit<AuditEvent, "id" | "createdAt">, useMock: boolean) => {
    if (useMock) {
      const created: AuditEvent = {
        id: `a-${auditEvents.length + 1}`,
        createdAt: new Date().toISOString(),
        ...event
      };
      auditEvents.unshift(created);
      return created;
    }

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .insert({
        action: event.action,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        metadata: event.metadata ?? {}
      })
      .select("id,action,resource_type,resource_id,created_at")
      .single();

    if (error || !data) {
      throw error ?? new Error("Failed to record audit");
    }

    return {
      id: data.id,
      action: data.action,
      resourceType: data.resource_type,
      resourceId: data.resource_id ?? "",
      actor: event.actor,
      createdAt: data.created_at
    };
  }
};
