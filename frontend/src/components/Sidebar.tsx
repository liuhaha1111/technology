import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: '项目申报', icon: 'edit_note', path: '/app/declaration', color: 'bg-red-500' },
    { name: '项目立项', icon: 'fact_check', path: '/app/approval', color: 'bg-cyan-500' },
    { name: '中期检查', icon: 'pending_actions', path: '/app/midterm', color: 'bg-yellow-500' },
    { name: '科技报告', icon: 'summarize', path: '/app/tech-report', color: 'bg-indigo-500' },
    { name: '项目验收', icon: 'verified', path: '/app/acceptance', color: 'bg-yellow-600' },
    { name: '成果评价', icon: 'emoji_events', path: '/app/evaluation', color: 'bg-purple-500' },
    { name: '诚信复议', icon: 'gavel', path: '/app/integrity', color: 'bg-pink-500' },
    { name: '注销账号', icon: 'exit_to_app', path: '/', color: 'bg-green-600' },
  ];

  const commonOps = [
    { name: '个人中心', icon: 'person', path: '/app/users', color: 'text-green-600', bg: 'bg-green-100' },
    { name: '我的项目', icon: 'assignment', path: '/app/contracts', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: '人员调整', icon: 'manage_accounts', path: '/app/experts', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: '经费调整', icon: 'paid', path: '/app/fund-adjustment', color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: '单位调整', icon: 'business', path: '/app/unit-adjustment', color: 'text-red-600', bg: 'bg-red-100' },
    { name: '延期申请', icon: 'event_busy', path: '/app/extension', color: 'text-green-600', bg: 'bg-green-100' },
    { name: '终止撤销', icon: 'cancel_presentation', path: '/app/termination', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: '智能客服', icon: 'support_agent', path: '#', color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { name: '备案系统', icon: 'inventory', path: '/app/record', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col overflow-y-auto scrollbar-thin flex-none shadow-lg z-10">
      <div className="mb-2">
        <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
          相关信息
        </div>
        <div className="p-4 space-y-3 text-xs text-muted-light dark:text-muted-dark border-b border-border-light dark:border-border-dark">
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">身份:</span> <span>项目负责人</span></div>
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">所属科技管理部门:</span> <span>长春理工大学</span></div>
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">管理部门联系人:</span> <span>李正宇</span></div>
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">联系电话:</span> <span>0431-85582318</span></div>
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">单位:</span> <span>长春理工大学</span></div>
          <div className="flex"><span className="font-semibold w-24 flex-shrink-0">账号:</span> <span className="truncate">220183198309150239</span></div>
        </div>
      </div>

      <div className="mb-2">
        <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
          常用操作
        </div>
        <div className="p-4 grid grid-cols-3 gap-4 border-b border-border-light dark:border-border-dark">
          {commonOps.map((op, idx) => (
            <Link key={idx} to={op.path} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-10 h-10 rounded ${op.bg} dark:bg-opacity-20 flex items-center justify-center mb-1 group-hover:scale-105 transition`}>
                <span className={`material-icons-outlined ${op.color}`}>{op.icon}</span>
              </div>
              <span className="text-xs text-center text-gray-600 dark:text-gray-300">{op.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
          导航菜单
        </div>
        <div className="p-4 grid grid-cols-3 gap-x-4 gap-y-6">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={idx} to={item.path} className="flex flex-col items-center group cursor-pointer">
                <div className={`w-10 h-10 rounded ${item.color} shadow-sm flex items-center justify-center mb-1 group-hover:scale-105 transition`}>
                  <span className="material-icons-outlined text-white">{item.icon}</span>
                </div>
                <span className={`text-xs text-center ${isActive ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
