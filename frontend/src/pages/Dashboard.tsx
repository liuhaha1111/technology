import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-l-4 border-orange-400 p-2 mb-4 flex items-center text-sm shadow-sm rounded-r">
        <span className="material-icons-outlined text-orange-500 mr-2 text-lg">volume_up</span>
        <span className="text-muted-light dark:text-muted-dark mr-1">您当前的位置:</span>
        <span className="font-bold text-gray-800 dark:text-white">首页</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-surface-light dark:bg-surface-dark rounded shadow border border-border-light dark:border-border-dark flex flex-col h-48">
          <div className="flex justify-between items-center px-4 py-2 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 rounded-t">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold">
              <span className="material-icons-outlined mr-2">description</span>
              指南查看
            </div>
            <a href="#" className="text-xs text-muted-light dark:text-muted-dark hover:text-blue-600 dark:hover:text-blue-400">更多»</a>
          </div>
          <div className="p-3 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-2 scrollbar-thin flex-1">
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">吉林省科技发展计划2026年度项目指南</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2">2025-08-01</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded shadow border border-border-light dark:border-border-dark flex flex-col h-48">
          <div className="flex justify-between items-center px-4 py-2 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 rounded-t">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold">
              <span className="material-icons-outlined mr-2">campaign</span>
              通知公告
            </div>
            <a href="#" className="text-xs text-muted-light dark:text-muted-dark hover:text-blue-600 dark:hover:text-blue-400">更多»</a>
          </div>
          <div className="p-3 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-2 scrollbar-thin flex-1">
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">关于发布《吉林省科技发展计划2026年度项目...</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2025-08-01</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">关于发布吉林省科技发展计划项目立项和吉林...</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2024-04-22</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">关于对2024年度吉林省科技发展计划拟支持项...</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2023-11-20</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">关于发布省科技发展计划“吉林省生物药和高...</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2023-10-16</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded shadow border border-border-light dark:border-border-dark flex flex-col h-48">
          <div className="flex justify-between items-center px-4 py-2 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 rounded-t">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold">
              <span className="material-icons-outlined mr-2">mail_outline</span>
              系统消息
            </div>
            <a href="#" className="text-xs text-muted-light dark:text-muted-dark hover:text-blue-600 dark:hover:text-blue-400">更多»</a>
          </div>
          <div className="p-3 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-2 scrollbar-thin flex-1">
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">签订任务书审核提示</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2025.12.27</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">项目申报推荐提示</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2025.08.28</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">项目申报推荐提示</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2025.08.27</span>
            </div>
            <div className="flex justify-between items-start group cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 group-hover:bg-blue-500"></span>
              <span className="flex-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">验收备案归档完成提示</span>
              <span className="text-xs text-muted-light dark:text-muted-dark ml-2 flex-shrink-0">2025.08.21</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
