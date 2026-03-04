import React from 'react';

export default function UnitAdjustment() {
  const tableData = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', unit: '长春理工大学', department: '国际合作处', process: '', data: '' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', unit: '长春理工大学', department: '社发处', process: '', data: '' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', unit: '长春理工大学', department: '基础研究处', process: '', data: '' },
    { id: 4, year: '2026', name: '激光共聚焦显微镜设备功能提升改造', leader: '张昕', unit: '长春理工大学', department: '科技资源统筹处', process: '', data: '' },
  ];

  return (
    <div className="p-4">
      <div className="bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-2 mb-4 flex items-center text-sm shadow-sm rounded">
        <span className="material-icons-outlined text-orange-400 mr-2 text-lg bg-white rounded-sm">volume_up</span>
        <span className="text-white mr-1">您当前的位置:</span>
        <span className="text-white">单位调整</span>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <tr>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-16">序号</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-24">年度</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-center">项目名称</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-32">项目负责人</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-40">承担单位</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-40">管理处室</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-32">审批流程</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-24">资料</th>
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-40">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-400">
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.id}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.year}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.name}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.leader}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.unit}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.department}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.process}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">{row.data}</td>
                <td className="py-3 px-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition">申请</button>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition">变更记录</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
