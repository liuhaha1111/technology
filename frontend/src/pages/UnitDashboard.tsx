import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UnitDashboard() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md flex-none z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveView('home')} className="text-2xl font-bold tracking-wide flex items-baseline hover:text-blue-100 transition">
              吉林省科技计划项目管理信息系统
              <span className="text-sm font-light ml-2 opacity-80">v6.0</span>
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center hover:text-blue-200 transition">
              <span className="material-icons-outlined text-pink-300 mr-2 text-xl">feedback</span>
              <span className="font-medium text-sm">意见建议反馈专栏</span>
            </button>
            <Link to="/" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex items-center shadow-sm text-sm">
              <span className="material-icons-outlined text-base mr-1">logout</span>
              退出
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col overflow-y-auto scrollbar-thin flex-none shadow-lg z-10">
          <div className="mb-2">
            <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
              相关信息
            </div>
            <div className="p-4 space-y-3 text-xs text-muted-light dark:text-muted-dark border-b border-border-light dark:border-border-dark">
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">身份:</span> <span>单位管理员</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">所属科技管理部门:</span> <span>吉林省科学技术厅</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">单位联系人:</span> <span>342833</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">联系电话:</span> <span>0431-88975536</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">单位:</span> <span>测试单位</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">账号:</span> <span className="truncate">liuyunhang391</span></div>
              <div className="flex"><span className="font-semibold w-24 flex-shrink-0">审核状态:</span> <span className="text-orange-500">正在审核中</span></div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
              常用操作
            </div>
            <div className="p-4 grid grid-cols-3 gap-4 border-b border-border-light dark:border-border-dark">
              {[
                { id: 'experts', name: '专家管理', icon: 'people', color: 'text-red-500', bg: 'bg-red-100' },
                { id: 'platform', name: '创新平台', icon: 'emoji_objects', color: 'text-pink-500', bg: 'bg-pink-100' },
                { id: 'users', name: '用户管理', icon: 'manage_accounts', color: 'text-blue-500', bg: 'bg-blue-100' },
                { id: 'info', name: '信息维护', icon: 'desktop_windows', color: 'text-teal-500', bg: 'bg-teal-100' },
                { id: 'support', name: '智能客服', icon: 'support_agent', color: 'text-cyan-500', bg: 'bg-cyan-100' },
              ].map((op, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (op.id === 'experts') setActiveView('experts');
                    if (op.id === 'platform') setActiveView('platform');
                    if (op.id === 'users') setActiveView('users');
                    if (op.id === 'info') setActiveView('info');
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded ${op.bg} dark:bg-opacity-20 flex items-center justify-center mb-1 group-hover:scale-105 transition ${activeView === op.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <span className={`material-icons-outlined ${op.color}`}>{op.icon}</span>
                  </div>
                  <span className={`text-xs text-center ${activeView === op.id ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>{op.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 border-l-4 border-blue-600 font-bold text-blue-900 dark:text-blue-100 text-sm">
              导航菜单
            </div>
            <div className="p-4 grid grid-cols-3 gap-x-4 gap-y-6">
              {[
                { id: 'project', name: '项目管理', icon: 'assignment', color: 'bg-red-500' },
                { id: 'contract', name: '合同管理', icon: 'edit_document', color: 'bg-cyan-500' },
                { id: 'midterm', name: '中期管理', icon: 'pending_actions', color: 'bg-yellow-500' },
                { id: 'acceptance', name: '验收管理', icon: 'verified', color: 'bg-green-500' },
                { id: 'review', name: '诚信复议', icon: 'gavel', color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (item.id === 'contract') setActiveView('contract');
                    if (item.id === 'acceptance') setActiveView('acceptance');
                    if (item.id === 'review') setActiveView('review');
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded ${item.color} shadow-sm flex items-center justify-center mb-1 group-hover:scale-105 transition ${activeView === item.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <span className="material-icons-outlined text-white">{item.icon}</span>
                  </div>
                  <span className={`text-xs text-center ${activeView === item.id ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          <div className="bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-2 mb-6 flex items-center text-sm shadow-sm rounded">
            <span className="material-icons-outlined text-orange-400 mr-2 text-lg bg-white rounded-sm">volume_up</span>
            <span className="text-white mr-1">您当前的位置:</span>
            <span className="text-white">{activeView === 'experts' ? '首页' : activeView === 'platform' ? '首页' : activeView === 'users' ? '首页' : activeView === 'info' ? '首页' : activeView === 'contract' ? '首页' : activeView === 'acceptance' ? '首页' : activeView === 'review' ? '首页' : '首页'}</span>
          </div>

          {activeView === 'home' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="material-icons-outlined text-blue-500 mr-2 text-lg">menu_book</span>
                      指南查看
                    </h3>
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">更多»</a>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex justify-between items-start text-sm">
                        <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-start">
                          <span className="mr-2 text-slate-400">•</span>
                          吉林省科技发展计划2026年度项目指南
                        </a>
                        <span className="text-slate-400 text-xs whitespace-nowrap ml-4">2025-08-01</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="material-icons-outlined text-blue-500 mr-2 text-lg">description</span>
                      单位立项及经费情况
                    </h3>
                  </div>
                  <div className="p-4 h-48 flex items-center justify-center text-slate-400 text-sm">
                    暂无数据
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="material-icons-outlined text-amber-500 mr-2 text-lg">campaign</span>
                      通知公告
                    </h3>
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">更多»</a>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-4">
                      {[
                        { title: '关于发布《吉林省科技发展计划2026年度项目申报指南》的通知', date: '2025-08-01' },
                        { title: '关于发布吉林省科技发展计划项目立项和吉林省科技创新资金...', date: '2024-04-22' },
                        { title: '关于对2024年度吉林省科技发展计划拟支持项目（吉林省科技创新...', date: '2023-11-20' },
                        { title: '关于发布省科技发展计划“吉林省生物药和高端医疗器械产业重大...', date: '2023-10-16' },
                        { title: '关于发布《吉林省科技专家库管理办法》的通知', date: '2023-06-09' },
                        { title: '关于修订发布《吉林省科技发展计划项目管理办法》的通知', date: '2023-06-09' },
                      ].map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start text-sm">
                          <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-start line-clamp-1">
                            <span className="mr-2 text-slate-400">•</span>
                            {item.title}
                          </a>
                          <span className="text-slate-400 text-xs whitespace-nowrap ml-4">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="material-icons-outlined text-blue-400 mr-2 text-lg">email</span>
                      系统消息
                    </h3>
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">更多»</a>
                  </div>
                  <div className="p-4 h-48 flex items-center justify-center text-slate-400 text-sm">
                    暂无系统消息
                  </div>
                </div>
              </div>
            </div>
          ) : activeView === 'experts' ? (
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800">
                <input 
                  type="text" 
                  placeholder="专家姓名" 
                  className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                />
                <input 
                  type="text" 
                  placeholder="专家账号" 
                  className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                />
                <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-40">
                  <option>全部</option>
                </select>
                <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-40">
                  <option>全部</option>
                </select>
                
                <div className="flex gap-2 ml-auto">
                  <button className="bg-[#4fb3d9] hover:bg-[#3fa0c4] text-white px-6 py-1.5 rounded text-sm transition shadow-sm">
                    搜索
                  </button>
                  <button className="bg-[#4fb3d9] hover:bg-[#3fa0c4] text-white px-6 py-1.5 rounded text-sm transition shadow-sm">
                    导出Excel
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse">
                  <thead className="bg-[#f5f5f5] dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700 w-16">序号</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">姓名</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">账号</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">手机号码</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">更新时间</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">注册时间</th>
                      <th className="py-3 px-4 border-r border-b border-slate-200 dark:border-slate-700">审核状态</th>
                      <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="py-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                        无数据
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeView === 'platform' ? (
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800">
                <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48">
                  <option>申报年度（全部）</option>
                </select>
                <input 
                  type="text" 
                  placeholder="项目名称" 
                  className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-64"
                />
                <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-8 py-1.5 rounded text-sm transition shadow-sm">
                  搜索
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse">
                  <thead className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-16">序号</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">项目名称</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-24">负责人</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-24">年度</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-32">计划类别</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-32">项目类别</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-32">管理处室</th>
                      <th className="py-3 px-4 border border-slate-200 dark:border-slate-700 w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="py-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                        {/* Empty row as per image */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center text-sm text-slate-600 dark:text-slate-400">
                <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-l text-slate-400 bg-slate-50 dark:bg-slate-700 cursor-not-allowed">上一页</button>
                <button className="px-3 py-1 border-t border-b border-r border-slate-300 dark:border-slate-600 rounded-r text-slate-400 bg-slate-50 dark:bg-slate-700 cursor-not-allowed mr-4">下一页</button>
                
                <span className="material-icons-outlined text-lg cursor-pointer hover:text-blue-500 mr-4">refresh</span>
                
                <span className="mr-2">到第</span>
                <input type="text" defaultValue="1" className="w-10 border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 text-center mr-2 dark:bg-slate-700 dark:text-white" />
                <span className="mr-4">页</span>
                
                <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition">确定</button>
              </div>
            </div>
          ) : activeView === 'users' ? (
            <div className="bg-white dark:bg-surface-dark shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800">
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300 mr-2">姓名:</span>
                  <input 
                    type="text" 
                    className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300 mr-2">身份证号/账号:</span>
                  <input 
                    type="text" 
                    className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-64"
                  />
                </div>
              </div>
              
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <thead className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 w-16 text-center font-normal">序号</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 font-normal">账号</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 font-normal">姓名</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 font-normal">邮箱</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 font-normal">电话</th>
                      <th className="py-3 px-4 font-normal w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                        {/* Empty row as per image */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeView === 'info' ? (
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">单位名称:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" value="测试单位" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*单位正在审核中</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">营业执照或法人证书有效期:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（长期选最大日期）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">社会信用代码:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" defaultValue="2200033112233333" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（与营业执照或法人证书一致）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">营业执照或法人证书图片(未上传):</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                    <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">上传</button>
                    <span className="ml-4 text-red-500 text-sm font-bold">*必传（大小限制1MB以内）</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300 mt-1.5">银行开户许可证图片(未上传):</label>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input type="text" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                      <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">上传</button>
                      <span className="ml-4 text-slate-800 dark:text-slate-200 text-sm font-bold">*必传（大小限制1MB以内）</span>
                    </div>
                    <div className="mt-1">
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">没有银行开户许可证?</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300 mt-1.5">拨款账户信息表(未上传):</label>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input type="text" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                      <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">上传</button>
                      <span className="ml-4 text-slate-800 dark:text-slate-200 text-sm font-bold">选传（大小限制1MB以内）</span>
                    </div>
                    <div className="mt-1">
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">模板下载</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300 mt-1.5">承诺书图片(未上传):</label>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input type="text" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                      <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">上传</button>
                      <span className="ml-4 text-slate-800 dark:text-slate-200 text-sm font-bold">选传（大小限制1MB以内）</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">说明</a>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">模板下载</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">所属科技管理部门:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" defaultValue="吉林省科学技术厅" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                    <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">搜索</button>
                    <span className="ml-4 text-red-500 text-sm font-bold">*请选择科学技术局（外省单位请选择"外省科学技术局"）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">单位性质 / 类型:</label>
                  <div className="flex-1 flex items-center space-x-4">
                    <select className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white">
                      <option>其它</option>
                    </select>
                    <select className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800">
                      <option>其它</option>
                    </select>
                    <span className="ml-4 text-red-500 text-sm font-bold">*单位性质必选 / *单位类型变更拨打业务咨询电话</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">行业类别:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" defaultValue="[]" disabled className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                    <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 px-6 py-1.5 rounded-r text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">选择</button>
                    <span className="ml-4 text-red-500 text-sm font-bold">*必选</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">联系人/联系方式:</label>
                  <div className="flex-1 flex items-center space-x-4">
                    <input type="text" className="w-1/3 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（联系方式必须是手机号码）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">省市区:</label>
                  <div className="flex-1 flex items-center space-x-4">
                    <select className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white">
                      <option>吉林</option>
                    </select>
                    <select className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white">
                      <option>长春市</option>
                    </select>
                    <select className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white">
                      <option>朝阳区</option>
                    </select>
                    <span className="ml-4 text-red-500 text-sm font-bold">*必选（与单位所在地区不符请拨打业务咨询电话）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">详细地址:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（例:XX路与XX街XXX号，无需填写省市区）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">单位法人:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（与营业执照或法人证书一致）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">开户名称:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（与单位名称保持一致）</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">开户银行:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（与银行开户许可证一致）</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">开户银行账号:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-red-500 text-sm font-bold">*必填（与银行开户许可证一致）</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">邮编:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-slate-800 dark:text-slate-200 text-sm font-bold">*选填</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="w-48 text-right pr-4 text-sm font-bold text-slate-700 dark:text-slate-300">联系电话:</label>
                  <div className="flex-1 flex items-center">
                    <input type="text" className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white" />
                    <span className="ml-4 text-slate-800 dark:text-slate-200 text-sm font-bold">*选填（区号-电话号-分机号）</span>
                  </div>
                </div>

                <div className="flex items-center pt-4">
                  <div className="w-48 pr-4"></div>
                  <button className="bg-[#337ab7] hover:bg-[#286090] text-white px-12 py-2 rounded text-sm transition shadow-sm">
                    确认修改
                  </button>
                </div>
              </div>
            </div>
          ) : activeView === 'contract' ? (
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-4 bg-white dark:bg-slate-800">
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">单位名称:</span>
                    <input 
                      type="text" 
                      className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">项目名称:</span>
                    <input 
                      type="text" 
                      className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">项目负责人:</span>
                    <input 
                      type="text" 
                      className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">年度:</span>
                    <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-32">
                      <option>2026</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">项目状态:</span>
                    <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-32">
                      <option>全部</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-20">
                      <option>20</option>
                    </select>
                  </div>
                  <button className="bg-[#f5f5f5] hover:bg-[#e8e8e8] text-slate-700 border border-slate-300 px-6 py-1 rounded text-sm transition shadow-sm">
                    搜索
                  </button>
                  <button className="bg-[#f5f5f5] hover:bg-[#e8e8e8] text-slate-700 border border-slate-300 px-6 py-1 rounded text-sm transition shadow-sm">
                    生成Excel
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs text-center border-collapse border border-[#bce8f1]">
                  <thead className="bg-[#d9edf7] text-[#31708f] font-bold">
                    <tr>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1] w-12">序号</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">项目编号</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">项目名称</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">验收情况</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">项目<br/>起止时间</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">项目<br/>承担单位</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1]">项目<br/>负责人</th>
                      <th colSpan={3} className="py-2 px-2 border border-[#bce8f1]">经费（万元）</th>
                      <th colSpan={3} className="py-2 px-2 border border-[#bce8f1]">拨款信息</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1] w-16">状态</th>
                      <th rowSpan={2} className="py-2 px-2 border border-[#bce8f1] w-16">操作</th>
                    </tr>
                    <tr>
                      <th className="py-2 px-2 border border-[#bce8f1]">总额</th>
                      <th className="py-2 px-2 border border-[#bce8f1]">
                        <div className="flex items-center justify-center">
                          <input type="text" defaultValue="2026年" className="w-16 border border-slate-300 rounded px-1 text-center text-xs" />
                        </div>
                      </th>
                      <th className="py-2 px-2 border border-[#bce8f1]">
                        <div className="flex items-center justify-center">
                          <input type="text" defaultValue="2027年及以后年度" className="w-32 border border-slate-300 rounded px-1 text-center text-xs" />
                        </div>
                      </th>
                      <th className="py-2 px-2 border border-[#bce8f1]">名称</th>
                      <th className="py-2 px-2 border border-[#bce8f1]">开户行</th>
                      <th className="py-2 px-2 border border-[#bce8f1]">账号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={15} className="py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#bce8f1]">
                        {/* Empty row as per image */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeView === 'acceptance' ? (
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800">
                <div className="flex items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">年度:</span>
                  <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-32">
                    <option>2025</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">项目名称:</span>
                  <input 
                    type="text" 
                    placeholder="请输入项目名称"
                    className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-64"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">项目负责人:</span>
                  <input 
                    type="text" 
                    placeholder="请输入项目负责人姓名"
                    className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">状态:</span>
                  <select className="border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white w-48">
                    <option>-----全部状态-----</option>
                  </select>
                </div>
                <button className="bg-[#f5f5f5] hover:bg-[#e8e8e8] text-slate-700 border border-slate-300 px-6 py-1.5 rounded text-sm transition shadow-sm">
                  搜索
                </button>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm text-center border-collapse border border-[#bce8f1]">
                  <thead className="bg-[#d9edf7] text-[#31708f] font-bold">
                    <tr>
                      <th className="py-3 px-2 border border-[#bce8f1] w-16">序号</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">项目名称</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">项目负责人</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">负责人电话</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">证件号码</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">管理处室</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">拨款金额</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">项目类别</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">年度</th>
                      <th className="py-3 px-2 border border-[#bce8f1]">状态</th>
                      <th className="py-3 px-2 border border-[#bce8f1] w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={11} className="py-4 px-4 text-left text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#bce8f1]">
                        共0条数据
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeView === 'review' ? (
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-slate-800 dark:text-white font-normal">诚信复议</h2>
                <button className="bg-[#337ab7] hover:bg-[#286090] text-white px-6 py-1.5 rounded text-sm transition shadow-sm">
                  填 写
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-slate-200 dark:border-slate-700">
                  <thead className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700 w-16">序号</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">姓名/单位名称</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">申请时间</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">复议材料</th>
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">项目状态</th>
                      <th className="py-3 px-4 w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                        {/* Empty row as per image */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
