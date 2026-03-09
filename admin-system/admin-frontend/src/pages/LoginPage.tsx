import { FormEvent, useState } from "react";
import { login } from "../lib/api-client";

type LoginPageProps = {
  onLoggedIn?: (token: string) => void;
};

export function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("请输入邮箱");
      return;
    }
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await login({ email, password });
      const token = result?.data?.accessToken as string | undefined;
      if (!token) {
        throw new Error("缺少令牌");
      }
      onLoggedIn?.(token);
    } catch {
      setError("登录失败，请检查账号或密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="login-card">
        <h1 className="login-title">后台管理系统</h1>
        <p className="login-subtitle">统一用户、权限、业务与统计管理</p>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            邮箱
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
            />
          </label>
          <label>
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="******"
            />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button type="submit" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
