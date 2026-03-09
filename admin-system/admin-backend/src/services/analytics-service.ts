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

export const analyticsService = {
  getOverview: () => ({
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
  }),

  getTrends: () => ({
    login7d: [8, 10, 12, 9, 13, 11, 14],
    login30d: [8, 7, 9, 10, 8, 11, 12, 10, 9, 13, 12, 11, 13, 14, 9, 10, 12, 11, 13, 12, 10, 9, 8, 11, 10, 12, 13, 12, 11, 14],
    errorRate7d: [0.8, 0.7, 0.6, 0.9, 0.5, 0.4, 0.6]
  }),

  getFunnel: () => ({
    declaration: 100,
    approval: 76,
    midterm: 61,
    acceptance: 49
  }),

  listAudits: (page: number, size: number) => {
    const start = (page - 1) * size;
    return {
      total: auditEvents.length,
      items: auditEvents.slice(start, start + size)
    };
  },

  recordAudit: (event: Omit<AuditEvent, "id" | "createdAt">) => {
    const created: AuditEvent = {
      id: `a-${auditEvents.length + 1}`,
      createdAt: new Date().toISOString(),
      ...event
    };
    auditEvents.unshift(created);
    return created;
  }
};
