import React, { useState } from 'react';

export default function ProjectApproval() {
  const [activeTab, setActiveTab] = useState('提交任务书');

  const printedProjects = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', department: '国际合作处', taskNo: '20150414055GH', category: '国际科技合作项目' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', department: '社发处', taskNo: '20190303133SF', category: '社会发展' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', department: '基础研究处', taskNo: '20200201182JC', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）' },
    { id: 4, year: '2026', name: '激光共聚焦显微镜设备功能提升改造', leader: '张昕', department: '科技资源统筹处', taskNo: '20260206039ZP', category: '科技资源开发' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-screen">
      <div className="mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2 flex items-center">
        <span className="material-icons-outlined text-blue-500 mr-2">edit_note</span>
        <h2 className="text-lg font-bold text-blue-500">项目立项</h2>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {['填写任务书', '提交任务书', '打印任务书'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理处室</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">任务书编号</th>
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeTab === '提交任务书' && (
              <tr>
                <td colSpan={8} className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
                  没有满足条件数据
                </td>
              </tr>
            )}
            
            {activeTab === '打印任务书' && printedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.department}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.taskNo}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4">
                  <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载">download</span>
                </td>
              </tr>
            ))}

            {activeTab === '填写任务书' && (
              <tr>
                <td colSpan={8} className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
                  请选择其他标签页查看数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
