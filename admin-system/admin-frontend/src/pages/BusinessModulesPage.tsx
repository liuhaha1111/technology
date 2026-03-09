import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";

type ModuleRecord = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
};

export function BusinessModulesPage() {
  const [items, setItems] = useState<ModuleRecord[]>([]);
  const [error, setError] = useState("");

  const load = () =>
    apiClient
      .getModuleRecords("declaration")
      .then((res) => setItems((res.data?.items ?? []) as ModuleRecord[]))
      .catch(() => setError("业务数据加载失败"));

  useEffect(() => {
    load();
  }, []);

  const approveFirst = async () => {
    if (!items.length) {
      return;
    }
    try {
      await apiClient.reviewProject(items[0].id, "approved", "后台审核通过");
      await load();
    } catch {
      setError("审核操作失败");
    }
  };

  return (
    <section className="panel">
      <h2>业务模块管理</h2>
      <button type="button" className="secondary-btn" onClick={approveFirst}>
        审核通过首条
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      <table className="simple-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.status}</td>
              <td>{item.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
