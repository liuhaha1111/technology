import React from 'react';

export default function ContractManagement() {
  const approvedProjects = [
    { id: '20150414055GH', year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', department: '国际合作处', category: '科技引导计划-国际科技合作项目' },
    { id: '20200201182JC', year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', department: '基础研究处', category: '吉林省自然科学基金-自然科学基金（吉林省重点实验室研究专项和主题科学家专项）' },
    { id: '20190303133SF', year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', department: '社发处', category: '技术攻关-社会发展' },
    { id: '20260206039ZP', year: '2026', name: '激光共聚焦显微镜设备功能提升改造', leader: '张昕', department: '科技资源统筹处', category: '重点研发-科技资源开发' },
  ];

  const acceptedProjects = [
    { id: '20150414055GH', year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', department: '国际合作处', category: '科技引导计划-国际科技合作项目' },
    { id: '20190303133SF', year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', department: '社发处', category: '技术攻关-社会发展' },
    { id: '20200201182JC', year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', department: '基础研究处', category: '吉林省自然科学基金-自然科学基金（吉林省重点实验室研究专项和主题科学家专项）' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-full rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <span className="material-icons-outlined text-blue-500 text-2xl">analytics</span>
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">我的项目</h2>
      </div>

      <div className="mb-6">
        <p className="text-red-500 text-sm font-medium">当前查询项目负责人身份证号为: 220183198309150239</p>
      </div>

      {/* 立项项目 Table */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">立项项目</h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
          <table className="w-full text-sm text-center">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-16">序号</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">任务书编号</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">年度</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 text-left">项目名称</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">项目负责人</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">管理处室</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 text-left">项目类别</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {approvedProjects.map((project, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.id}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.year}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-left">{project.name}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.leader}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.department}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-left">{project.category}</td>
                  <td className="py-3 px-4">
                    <button className="text-slate-400 hover:text-blue-500 transition" title="下载">
                      <span className="material-icons-outlined text-xl">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 验收项目 Table */}
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">验收项目</h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
          <table className="w-full text-sm text-center">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-16">序号</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">任务书编号</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">年度</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 text-left">项目名称</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">项目负责人</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">管理处室</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 text-left">项目类别</th>
                <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {acceptedProjects.map((project, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.id}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.year}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-left">{project.name}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.leader}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{project.department}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-left">{project.category}</td>
                  <td className="py-3 px-4">
                    <button className="text-slate-400 hover:text-blue-500 transition" title="下载">
                      <span className="material-icons-outlined text-xl">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
