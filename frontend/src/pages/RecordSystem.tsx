import React from 'react';

export default function RecordSystem() {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-2 mb-6 flex items-center text-sm shadow-sm rounded">
        <span className="material-icons-outlined text-orange-400 mr-2 text-lg bg-white rounded-sm">volume_up</span>
        <span className="text-white mr-1">您当前的位置:</span>
        <span className="text-white">备案系统</span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">吉林省医药健康产业发展专项切块资金备案系统</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition shadow-sm">
            填写择优支持备案表
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition shadow-sm">
            填写奖励补助备案表
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-h-[100px]">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <tr>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-16 text-center">序号</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">项目类别</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">承担单位</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">项目名称</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">项目负责人</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">联系电话</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">切块资金（万元）</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">年度</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">项目状态</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Empty state as shown in the image */}
            <tr>
              <td colSpan={10} className="py-8 text-center text-slate-500 dark:text-slate-400">
                暂无数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
