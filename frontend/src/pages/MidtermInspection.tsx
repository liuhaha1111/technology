import React, { useState } from 'react';

export default function MidtermInspection() {
  const [activeTab, setActiveTab] = useState('提交中期检查');

  const submittedProjects = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', category: '国际科技合作项目', status: 'upload' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', category: '社会发展', status: 'upload' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', status: '等待【本单位】审核' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-screen">
      <div className="mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2 flex items-center">
        <span className="material-icons-outlined text-blue-500 mr-2">event_note</span>
        <h2 className="text-lg font-bold text-blue-500">中期检查</h2>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {['填写中期检查', '提交中期检查'].map((tab) => (
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
              <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
              <th className="py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeTab === '提交中期检查' && submittedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4">
                  {project.status === 'upload' ? (
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="提交">upload_file</span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">{project.status}</span>
                  )}
                </td>
              </tr>
            ))}

            {activeTab === '填写中期检查' && (
              <tr>
                <td colSpan={6} className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
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
