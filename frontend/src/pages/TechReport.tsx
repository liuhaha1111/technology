import React, { useState } from 'react';

export default function TechReport() {
  const [activeTab, setActiveTab] = useState('提交科技报告');

  const submittedReports = [
    { id: 1, year: '2019', reportName: '', projectName: '面向城市精细化治理的智能路径规划服务', leader: '张昕', unit: '长春理工大学', category: '社会发展', submitTime: '' },
    { id: 2, year: '2020', reportName: '', projectName: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', unit: '长春理工大学', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', submitTime: '' },
  ];

  const printedReports = [
    { id: 1, year: '2019', reportName: '面向城市精细化治理的智能路径规划服务', reportNo: '12756090P-20190303133SF/01', projectName: '面向城市精细化治理的智能路径规划服务', leader: '张昕', unit: '长春理工大学', category: '社会发展', submitTime: '2022-07-13', status: '审核通过' },
    { id: 2, year: '2020', reportName: '基于位置服务发现的新能源交通设施规划方法研究', reportNo: '12756090P-20200201182JC/01', projectName: '基于位置服务发现的新能源交通设施规划方法研究', leader: '张昕', unit: '长春理工大学', category: '自然科学基金（吉林省重点实验室研究专项和主题科学家专项）', submitTime: '2024-03-29', status: '审核通过' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-screen">
      <div className="mb-6 border-b-2 border-blue-200 dark:border-blue-800 pb-2 flex items-center">
        <span className="material-icons-outlined text-blue-500 mr-2">insights</span>
        <h2 className="text-lg font-bold text-blue-500">科技报告</h2>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {['填写科技报告', '提交科技报告', '打印科技报告'].map((tab) => (
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
            {activeTab === '提交科技报告' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">报告名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">承担单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">提交时间</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '打印科技报告' && (
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">报告名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">报告编号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">承担单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">提交时间</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">状态</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            )}
            {activeTab === '填写科技报告' && (
              <tr>
                <th className="py-3 px-4">提示</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeTab === '提交科技报告' && submittedReports.map((report) => (
              <tr key={report.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.reportName}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.projectName}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.unit}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.submitTime}</td>
                <td className="py-3 px-4">
                  <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="提交">upload_file</span>
                </td>
              </tr>
            ))}

            {activeTab === '打印科技报告' && printedReports.map((report) => (
              <tr key={report.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.id}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.year}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.reportName}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.reportNo}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.projectName}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.leader}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.unit}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.category}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.submitTime}</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{report.status}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载报告原文">download</span>
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载承诺书">download</span>
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载最终报告pdf">download</span>
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载收录证书">download</span>
                  </div>
                </td>
              </tr>
            ))}

            {activeTab === '填写科技报告' && (
              <tr>
                <td className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
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
