import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";

type UserItem = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
};

export function UsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .getUsers()
      .then((response) => setItems((response.data?.items ?? []) as UserItem[]))
      .catch(() => setError("用户数据加载失败"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="panel">
      <h2>用户管理</h2>
      {loading ? <p>加载中...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error ? (
        <table className="simple-table">
          <thead>
            <tr>
              <th>邮箱</th>
              <th>姓名</th>
              <th>状态</th>
              <th>角色</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.email}</td>
                <td>{item.displayName}</td>
                <td>{item.status}</td>
                <td>{item.roles.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
