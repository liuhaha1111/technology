import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { portalApi } from "../lib/api";
import { setPortalSession } from "../lib/session";

type RegionItem = {
  code: string;
  name: string;
};

type AddressMode = "select" | "manual";

interface UnitAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function UnitAuthModal({ isOpen, onClose, initialMode = "login" }: UnitAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [orgName, setOrgName] = useState("");
  const [socialCreditCode, setSocialCreditCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");

  const [addressMode, setAddressMode] = useState<AddressMode>("select");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [manualProvince, setManualProvince] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualDistrict, setManualDistrict] = useState("");

  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [cities, setCities] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);

  const navigate = useNavigate();

  const refreshCaptcha = async () => {
    try {
      const res = await portalApi.getCaptcha();
      setCaptchaId(res.data.captchaId);
      setCaptchaImage(res.data.imageData);
      setCaptchaCode("");
    } catch {
      setError("验证码获取失败，请重试。");
    }
  };

  const loadRegions = async () => {
    try {
      const res = await portalApi.getRegions("province");
      setProvinces((res.data.items ?? []) as RegionItem[]);
    } catch {
      setError("地区选项加载失败。");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setMode(initialMode);
    setAddressMode("select");
    setError("");
    setManualProvince("");
    setManualCity("");
    setManualDistrict("");
    refreshCaptcha();
    loadRegions();
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (addressMode !== "select") {
      return;
    }

    if (!provinceCode) {
      setCities([]);
      setCityCode("");
      return;
    }

    portalApi
      .getRegions("city", provinceCode)
      .then((res) => setCities((res.data.items ?? []) as RegionItem[]))
      .catch(() => setError("城市选项加载失败。"));
  }, [addressMode, provinceCode]);

  useEffect(() => {
    if (addressMode !== "select") {
      return;
    }

    if (!cityCode) {
      setDistricts([]);
      setDistrictCode("");
      return;
    }

    portalApi
      .getRegions("district", cityCode)
      .then((res) => setDistricts((res.data.items ?? []) as RegionItem[]))
      .catch(() => setError("区县选项加载失败。"));
  }, [addressMode, cityCode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await portalApi.loginUnit({
        email,
        password,
        captchaId,
        captchaCode
      });
      const token = res.data.accessToken as string | undefined;
      if (!token) {
        throw new Error("缺少登录令牌");
      }
      setPortalSession(token, "unit");
      navigate("/unit");
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "登录失败，请检查账号和密码。");
      await refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致。");
      return;
    }

    let finalProvinceCode = "";
    let finalCityCode = "";
    let finalDistrictCode = "";
    let finalProvinceName = "";
    let finalCityName = "";
    let finalDistrictName = "";

    if (addressMode === "manual") {
      const p = manualProvince.trim();
      const c = manualCity.trim();
      const d = manualDistrict.trim();
      if (!p || !c || !d) {
        setError("请手动填写省、市、区（县）。");
        return;
      }

      finalProvinceCode = p;
      finalCityCode = c;
      finalDistrictCode = d;
      finalProvinceName = p;
      finalCityName = c;
      finalDistrictName = d;
    } else {
      if (!provinceCode || !cityCode || !districtCode) {
        setError("请选择省、市、区（县）。");
        return;
      }

      const selectedProvince = provinces.find((item) => item.code === provinceCode);
      const selectedCity = cities.find((item) => item.code === cityCode);
      const selectedDistrict = districts.find((item) => item.code === districtCode);

      finalProvinceCode = provinceCode;
      finalCityCode = cityCode;
      finalDistrictCode = districtCode;
      finalProvinceName = selectedProvince?.name ?? provinceCode;
      finalCityName = selectedCity?.name ?? cityCode;
      finalDistrictName = selectedDistrict?.name ?? districtCode;
    }

    setLoading(true);
    try {
      await portalApi.registerOrganization({
        account: { email, password },
        organization: {
          name: orgName,
          socialCreditCode: socialCreditCode || undefined,
          contactName,
          contactPhone,
          provinceCode: finalProvinceCode,
          provinceName: finalProvinceName,
          cityCode: finalCityCode,
          cityName: finalCityName,
          districtCode: finalDistrictCode,
          districtName: finalDistrictName,
          address
        },
        captchaId,
        captchaCode
      });
      setError("注册信息已提交，请等待审核。");
      setMode("login");
      await refreshCaptcha();
    } catch (err: any) {
      setError(err?.message ?? "单位注册失败，请稍后重试。");
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
              单位登录
            </button>
            <button
              onClick={() => setMode("register")}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${
                mode === "register" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500"
              }`}
            >
              单位注册
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
                登录密码
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
                {loading ? "登录中..." : "登录"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">登录密码</label>
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
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">单位名称</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="w-full max-w-[300px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">统一社会信用代码</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={socialCreditCode}
                    onChange={(e) => setSocialCreditCode(e.target.value)}
                    className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">联系人</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full max-w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">联系电话</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full max-w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">所在地区</label>
                <div className="md:col-span-9 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddressMode("select")}
                      className={`px-3 py-1 rounded border text-sm ${
                        addressMode === "select" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-600"
                      }`}
                    >
                      下拉选择
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode("manual")}
                      className={`px-3 py-1 rounded border text-sm ${
                        addressMode === "manual" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-600"
                      }`}
                    >
                      手动填写
                    </button>
                  </div>

                  {addressMode === "select" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={provinceCode}
                        onChange={(e) => setProvinceCode(e.target.value)}
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">选择省份</option>
                        {provinces.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cityCode}
                        onChange={(e) => setCityCode(e.target.value)}
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">选择城市</option>
                        {cities.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={districtCode}
                        onChange={(e) => setDistrictCode(e.target.value)}
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">选择区县</option>
                        {districts.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={manualProvince}
                        onChange={(e) => setManualProvince(e.target.value)}
                        placeholder="请输入省份"
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={manualCity}
                        onChange={(e) => setManualCity(e.target.value)}
                        placeholder="请输入城市"
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={manualDistrict}
                        onChange={(e) => setManualDistrict(e.target.value)}
                        placeholder="请输入区县"
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">详细地址</label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="h-9 w-24 bg-gray-200 flex items-center justify-center rounded overflow-hidden"
                  >
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
                  {loading ? "提交中..." : "提交审核"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
