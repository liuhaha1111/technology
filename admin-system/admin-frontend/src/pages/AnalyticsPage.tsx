import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";

type Overview = {
  usersTotal: number;
  usersActive: number;
  projectsTotal: number;
  projectsPending: number;
  projectsApproved: number;
};

export function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiClient.getOverview(), apiClient.getTrends(), apiClient.getFunnel()])
      .then(([overviewRes]) => setOverview((overviewRes.data ?? null) as Overview | null))
      .catch(() => setError("统计数据加载失败"));
  }, []);

  return (
    <section className="panel">
      <h2>统计分析</h2>
      {error ? <p className="form-error">{error}</p> : null}
      {overview ? (
        <div className="stats-grid">
          <div>
            <strong>用户总数</strong>
            <p>{overview.usersTotal}</p>
          </div>
          <div>
            <strong>活跃用户</strong>
            <p>{overview.usersActive}</p>
          </div>
          <div>
            <strong>项目总数</strong>
            <p>{overview.projectsTotal}</p>
          </div>
          <div>
            <strong>待审核项目</strong>
            <p>{overview.projectsPending}</p>
          </div>
          <div>
            <strong>已通过项目</strong>
            <p>{overview.projectsApproved}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
