import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { portalApi } from "../lib/api";
import { setPortalSession } from "../lib/session";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  redirectPath?: string;
}

type OrgOption = {
  id: string;
  name: string;
};

export default function AuthModal({ isOpen, onClose, initialMode = "login", redirectPath = "/app" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [organizations, setOrganizations] = useState<OrgOption[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("身份证");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isUnitLeader, setIsUnitLeader] = useState(false);
  const [isLegalRepresentative, setIsLegalRepresentative] = useState(false);

  const navigate = useNavigate();

  const refreshCaptcha = async () => {
    try {
      const res = await portalApi.getCaptcha();
      setCaptchaId(res.data.captchaId);
      setCaptchaImage(res.data.imageData);
      setCaptchaCode("");
    } catch {
      setError("验证码获取失败");
    }
  };

  const loadOrganizations = async () => {
    try {
      const res = await portalApi.getApprovedOrganizations();
      setOrganizations((res.data.items ?? []) as OrgOption[]);
    } catch {
      setError("已审核单位加载失败");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setMode(initialMode);
    setError("");
    refreshCaptcha();
    loadOrganizations();
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await portalApi.loginPrincipal({ email, password, captchaId, captchaCode });
      const token = res.data.accessToken as string | undefined;
      if (!token) {
        throw new Error("missing token");
      }
      setPortalSession(token, "principal");
      navigate(redirectPath);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "登录失败，请检查账号或密码");
      await refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!organizationId) {
      setError("请选择所属单位");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }
    setLoading(true);
    try {
      await portalApi.registerPrincipal({
        email,
        password,
        organizationId,
        fullName,
        idType,
        idNumber,
        phone,
        isUnitLeader,
        isLegalRepresentative,
        captchaId,
        captchaCode
      });
      setError("注册成功，请等待登录");
      setMode("login");
      await refreshCaptcha();
    } catch (err: any) {
      setError(err?.message ?? "负责人注册失败");
      await refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden w-full ${
          mode === "register" ? "max-w-4xl" : "max-w-md"
        } max-h-[90vh] flex flex-col transition-all duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex space-x-4">
            <button
              onClick={() => setMode("login")}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${
                mode === "login" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode("register")}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${
                mode === "register" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500"
              }`}
            >
              负责人注册
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin">
          {error ? <p className="text-red-600 text-sm mb-4">{error}</p> : null}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                账号邮箱
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11 px-3"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密码
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11 px-3"
                />
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">验证码</label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    required
                    value={captchaCode}
                    onChange={(e) => setCaptchaCode(e.target.value)}
                    placeholder="请输入验证码"
                    className="flex-1 block rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11 px-3"
                  />
                  <button type="button" onClick={refreshCaptcha} className="flex-none" title="点击刷新验证码">
                    <div className="w-24 h-11 bg-gray-200 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {captchaImage ? <img src={captchaImage} alt="captcha" className="w-full h-full object-cover" /> : "..."}
                    </div>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? "登录中..." : "登录系统"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">所属单位</label>
                <div className="md:col-span-9">
                  <select
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="w-full max-w-[300px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">--请选择已审核单位--</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">账号邮箱</label>
                <div className="md:col-span-9">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full max-w-[300px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full max-w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">证件类型</label>
                <div className="md:col-span-9">
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full max-w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>身份证</option>
                    <option>护照</option>
                    <option>军官证</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">证件号码</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                    className="w-full max-w-[260px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">手机号</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full max-w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">是否单位负责人</label>
                <div className="md:col-span-9 flex items-center gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" checked={isUnitLeader} onChange={() => setIsUnitLeader(true)} />
                    <span className="ml-2 text-sm">是</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" checked={!isUnitLeader} onChange={() => setIsUnitLeader(false)} />
                    <span className="ml-2 text-sm">否</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">是否法人</label>
                <div className="md:col-span-9 flex items-center gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" checked={isLegalRepresentative} onChange={() => setIsLegalRepresentative(true)} />
                    <span className="ml-2 text-sm">是</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" checked={!isLegalRepresentative} onChange={() => setIsLegalRepresentative(false)} />
                    <span className="ml-2 text-sm">否</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">密码</label>
                <div className="md:col-span-9">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">确认密码</label>
                <div className="md:col-span-9">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">验证码</label>
                <div className="md:col-span-9 flex items-center gap-3">
                  <input
                    type="text"
                    value={captchaCode}
                    onChange={(e) => setCaptchaCode(e.target.value)}
                    required
                    className="w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="button" onClick={refreshCaptcha} className="h-9 w-24 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                    {captchaImage ? <img src={captchaImage} alt="captcha" className="w-full h-full object-cover" /> : "..."}
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-4 pb-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-b from-blue-50 to-gray-200 border border-gray-400 hover:from-gray-100 hover:to-gray-300 text-gray-800 px-8 py-1.5 rounded shadow-sm flex items-center gap-1 font-medium"
                >
                  {loading ? "提交中..." : "提交注册"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
