import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-body transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-900 to-blue-500 w-full h-40 flex items-center justify-center shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img alt="Mountain landscape background" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" />
        </div>
        <div className="container mx-auto px-4 z-10 flex items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
              <span className="material-icons-outlined text-white text-4xl">flight_takeoff</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-md">
                吉林省科技计划项目管理信息系统
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1 tracking-wider opacity-90">Jilin Province Science and Technology Project Management System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 z-10 items-center">
          <div className="hidden md:flex flex-col justify-center space-y-6 text-text-light dark:text-text-dark">
            <h2 className="text-3xl font-bold text-primary dark:text-blue-400">
              欢迎登录
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-lg">
              本系统为吉林省科技计划项目全流程管理平台，提供项目申报、审核、立项、验收等一站式服务。
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex items-center space-x-3">
                <span className="material-icons-outlined text-blue-600 text-3xl">assignment</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">指南查看</h3>
                  <p className="text-xs text-gray-400">最新申报指南</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex items-center space-x-3">
                <span className="material-icons-outlined text-blue-600 text-3xl">edit_document</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">项目申报</h3>
                  <p className="text-xs text-gray-400">在线填报申请</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex items-center space-x-3">
                <span className="material-icons-outlined text-blue-600 text-3xl">fact_check</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">项目验收</h3>
                  <p className="text-xs text-gray-400">全流程跟踪</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex items-center space-x-3">
                <span className="material-icons-outlined text-blue-600 text-3xl">support_agent</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">咨询服务</h3>
                  <p className="text-xs text-gray-400">技术支持热线</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-sm border-l-4 border-blue-600 text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1 flex items-center"><span className="material-icons-outlined text-base mr-1">info</span> 通知公告</p>
              <p>关于发布《吉林省科技发展计划2026年度项目申报指南》的通知已更新。</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-10 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border-light dark:border-border-dark w-full max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <span className="material-icons-outlined text-blue-600 mr-2">login</span> 登录系统
              </h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">用户名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-gray-400 text-lg">person</span>
                  </div>
                  <input type="text" id="username" name="username" placeholder="请输入用户名" required className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-gray-400 text-lg">lock</span>
                  </div>
                  <input type="password" id="password" name="password" placeholder="请输入密码" required className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11" />
                </div>
              </div>
              
              <div>
                <label htmlFor="captcha" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">验证码</label>
                <div className="flex space-x-3">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons-outlined text-gray-400 text-lg">verified_user</span>
                    </div>
                    <input type="text" id="captcha" name="captcha" placeholder="验证码" required className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11" />
                  </div>
                  <div className="flex-none cursor-pointer group relative" title="点击刷新">
                    <div className="w-24 h-11 bg-gray-200 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 6px)' }}>
                      <span className="font-serif text-xl font-bold tracking-widest italic text-gray-700 dark:text-gray-800 transform -rotate-2 select-none">ca36</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm py-1">
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">忘记账号密码?</a>
                <a href="#" className="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400">负责人注册</a>
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">修改密码</a>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-grow flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  登录系统
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                推荐使用 Chrome, Firefox 或 Edge 浏览器访问本系统
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-surface-dark border-t border-border-light dark:border-border-dark py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2008-2025 吉林省科学技术厅版权所有
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            吉林省科技创新平台管理中心 技术支持：吉ICP备10001665号-2
          </p>
        </div>
      </footer>
    </div>
  );
}
