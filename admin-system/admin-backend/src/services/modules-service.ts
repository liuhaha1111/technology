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

export const modulesService = {
  listRecords: (moduleKey: string, page: number, size: number, orgUnitId?: string | null, status?: string) => {
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
  },

  reviewProject: (projectId: string, reviewerId: string, decision: string, comments?: string) => {
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
};
