import React, { useState } from 'react';

export default function ProjectAcceptance() {
  const [activeTab, setActiveTab] = useState('已填写验收');

  const messages = [
    { text: '签订任务书审核提示', date: '2025.12.27' },
    { text: '项目申报推荐提示', date: '2025.08.28' },
    { text: '项目申报推荐提示', date: '2025.08.27' },
  ];

  const filledAcceptanceProjects = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', unit: '长春理工大学', department: '国际合作处', category: '国际科技合作项目', planCategory: '科技引导计划', status: '已推荐' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', unit: '长春理工大学', department: '社发处', category: '社会发展', planCategory: '技术攻关', status: '已推荐' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', unit: '长春理工大学', department: '基础研究处', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', planCategory: '吉林省自然科学基金', status: '已推荐' },
  ];

  const postMeetingProjects = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', leader: '张昕', department: '国际合作处', unit: '长春理工大学', category: '国际科技合作项目', planCategory: '科技引导计划' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', leader: '张昕', department: '社发处', unit: '长春理工大学', category: '社会发展', planCategory: '技术攻关' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', department: '基础研究处', unit: '长春理工大学', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', planCategory: '吉林省自然科学基金' },
  ];

  const printedProjects = [
    { id: 1, year: '2015', name: '具有长服务周期的工业复杂系统可适化方法研究', category: '国际科技合作项目', planCategory: '科技引导计划', department: '国际合作处', unit: '长春理工大学', leader: '张昕' },
    { id: 2, year: '2019', name: '面向城市精细化治理的智能路径规划服务', category: '社会发展', planCategory: '技术攻关', department: '社发处', unit: '长春理工大学', leader: '张昕' },
    { id: 3, year: '2020', name: '基于位置服务发现的新能源交通设施规划方法研究', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', planCategory: '吉林省自然科学基金', department: '基础研究处', unit: '长春理工大学', leader: '张昕' },
  ];

  const fillApplicationProjects = [
    { id: 1, year: '2026', name: '激光共聚焦显微镜设备功能提升改造', leader: '张昕', category: '科技资源开发', unit: '长春理工大学' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-screen">
      <div className="mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2 flex items-center">
        <span className="material-icons-outlined text-blue-500 mr-2">verified</span>
        <h2 className="text-lg font-bold text-blue-500">项目验收</h2>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {['填写验收申请', '已填写验收', '提交验收申请', '会后完善申请', '打印验收证书'].map((tab) => (
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
            {activeTab === '已填写验收' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">推荐单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理处室</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">计划类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目状态</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '提交验收申请' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">推荐单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理处室</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">计划类别</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '会后完善申请' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理处室</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">推荐单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">计划类别</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '打印验收证书' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">计划类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理处室</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">推荐单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '填写验收申请' && (
              <tr>
                <th colSpan={7} className="py-3 px-4 text-left bg-blue-500 text-white font-bold border-b border-blue-600">
                  已填申请表
                </th>
              </tr>
            )}
            {activeTab === '填写验收申请' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">承担单位</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeTab === '已填写验收' && filledAcceptanceProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.unit}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.department}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.planCategory}</td>
                <td className="py-3 px-4 text-green-600 border-r border-gray-200 dark:border-gray-700">{project.status}</td>
                <td className="py-3 px-4">
                  <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="查看">search</span>
                </td>
              </tr>
            ))}

            {activeTab === '提交验收申请' && (
              <tr>
                <td colSpan={9} className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
                  没有满足条件数据
                </td>
              </tr>
            )}

            {activeTab === '会后完善申请' && postMeetingProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.department}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.unit}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.planCategory}</td>
                <td className="py-3 px-4">
                  <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="查看">search</span>
                </td>
              </tr>
            ))}

            {activeTab === '打印验收证书' && printedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.planCategory}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.department}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.unit}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载">download</span>
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="查看">search</span>
                  </div>
                </td>
              </tr>
            ))}

            {activeTab === '填写验收申请' && fillApplicationProjects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.name}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{project.unit}</td>
                <td className="py-3 px-4">
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer underline decoration-blue-600 underline-offset-2">填写项目</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
