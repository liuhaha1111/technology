import React from 'react';

export default function IntegrityReview() {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-2 mb-6 flex items-center text-sm shadow-sm rounded">
        <span className="material-icons-outlined text-orange-400 mr-2 text-lg bg-white rounded-sm">volume_up</span>
        <span className="text-white mr-1">您当前的位置:</span>
        <span className="text-white">成果评价</span>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-4 mb-4 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">诚信复议</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-sm transition font-medium">
          填 写
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left border-collapse min-h-[100px]">
          <thead className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 w-16">序号</th>
              <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">姓名/单位名称</th>
              <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">申请时间</th>
              <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">复议材料</th>
              <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">项目状态</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Empty state as shown in the image */}
            <tr>
              <td colSpan={6} className="py-8"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
