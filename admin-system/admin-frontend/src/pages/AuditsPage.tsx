import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";

type AuditItem = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actor: string;
  createdAt: string;
};

export function AuditsPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .getAudits()
      .then((res) => setItems((res.data?.items ?? []) as AuditItem[]))
      .catch(() => setError("审计日志加载失败"));
  }, []);

  return (
    <section className="panel">
      <h2>操作审计</h2>
      {error ? <p className="form-error">{error}</p> : null}
      <table className="simple-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>操作人</th>
            <th>动作</th>
            <th>资源</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.createdAt}</td>
              <td>{item.actor}</td>
              <td>{item.action}</td>
              <td>
                {item.resourceType}/{item.resourceId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
