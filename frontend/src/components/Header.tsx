import { Link } from "react-router-dom";
import { clearPortalSession } from "../lib/session";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md flex-none z-20">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/app" className="text-2xl font-bold tracking-wide flex items-baseline">
            吉林省科技计划项目管理信息系统
            <span className="text-sm font-light ml-2 opacity-80">v6.0</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <button className="flex items-center bg-blue-400 bg-opacity-30 hover:bg-opacity-50 px-4 py-1.5 rounded-full transition border border-blue-300 border-opacity-40">
            <span className="material-icons-outlined text-yellow-300 mr-2 text-xl">smart_toy</span>
            <span className="font-medium text-sm">科管系统智能客服</span>
          </button>
          <button className="flex items-center bg-blue-400 bg-opacity-30 hover:bg-opacity-50 px-4 py-1.5 rounded-full transition border border-blue-300 border-opacity-40">
            <span className="material-icons-outlined text-pink-300 mr-2 text-xl">feedback</span>
            <span className="font-medium text-sm">意见建议反馈专栏</span>
          </button>
          <Link
            to="/"
            onClick={() => clearPortalSession()}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex items-center shadow-sm text-sm"
          >
            <span className="material-icons-outlined text-base mr-1">logout</span>
            退出
          </Link>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-300 via-white to-blue-300 opacity-30"></div>
    </header>
  );
}
