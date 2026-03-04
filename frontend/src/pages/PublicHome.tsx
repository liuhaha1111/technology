import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';
import UnitAuthModal from '../components/UnitAuthModal';

export default function PublicHome() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authRedirectPath, setAuthRedirectPath] = useState('/app');
  
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [unitModalMode, setUnitModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register', redirectPath = '/app') => {
    setAuthModalMode(mode);
    setAuthRedirectPath(redirectPath);
    setIsAuthModalOpen(true);
  };

  const openUnitModal = (mode: 'login' | 'register') => {
    setUnitModalMode(mode);
    setIsUnitModalOpen(true);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200 min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundColor: '#3b82f6', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <span className="material-icons-outlined text-4xl">science</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                吉林省科技计划项目管理信息系统
              </h1>
              <p className="text-blue-100 text-sm mt-1 opacity-90">Jilin Province Science and Technology Plan Project Management Information System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition backdrop-blur-sm flex items-center gap-2">
              <span className="material-icons-outlined text-sm">help_outline</span>
              帮助中心
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: '指南查看', icon: 'menu_book', color: 'text-blue-600', bg: 'bg-blue-50', action: () => {} },
              { name: '项目申报', icon: 'edit_note', color: 'text-orange-600', bg: 'bg-orange-50', action: () => openAuthModal('register') },
              { name: '任务书签订', icon: 'assignment_turned_in', color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => openAuthModal('login', '/app/approval') },
              { name: '中期检查', icon: 'content_paste_search', color: 'text-purple-600', bg: 'bg-purple-50', action: () => openAuthModal('login', '/app/midterm') },
              { name: '科技报告', icon: 'summarize', color: 'text-cyan-600', bg: 'bg-cyan-50', action: () => openAuthModal('login', '/app/tech-report') },
              { name: '项目验收', icon: 'verified', color: 'text-rose-600', bg: 'bg-rose-50', action: () => openAuthModal('login', '/app/acceptance') },
            ].map((item, idx) => (
              <button key={idx} onClick={item.action} className="group bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition flex flex-col items-center justify-center text-center gap-3">
                <div className={`w-14 h-14 ${item.bg} dark:bg-opacity-20 ${item.color} rounded-full flex items-center justify-center transition group-hover:scale-110`}>
                  <span className="material-icons-outlined text-3xl">{item.icon}</span>
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="material-icons-outlined text-blue-600">support_agent</span>
                网上申报操作咨询
              </h3>
              <ul className="space-y-4 text-sm relative z-10">
                <li className="flex items-start gap-3">
                  <span className="material-icons-outlined text-slate-400 text-lg mt-0.5">phone</span>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide">技术咨询电话</span>
                    <div className="font-medium text-slate-700 dark:text-slate-200">0431-89101521</div>
                    <div className="font-medium text-slate-700 dark:text-slate-200">0431-89101522</div>
                    <div className="font-medium text-slate-700 dark:text-slate-200">0431-89101523</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-icons-outlined text-slate-400 text-lg mt-0.5">schedule</span>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide">工作时间</span>
                    <div className="text-slate-700 dark:text-slate-300">周一 至 周五</div>
                    <div className="text-slate-700 dark:text-slate-300">上午 9:00-11:30 | 下午 13:30-16:30</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-icons-outlined text-slate-400 text-lg mt-0.5">contact_phone</span>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wide">科技报告咨询</span>
                    <div className="font-medium text-slate-700 dark:text-slate-200">0431-85643581</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: '吉林省聚力攻坚专项', img: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800', color: 'from-blue-900/80' },
            { title: '技术合同认定', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', color: 'from-indigo-900/80' },
            { title: '吉林省实验室专项', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', color: 'from-emerald-900/80' },
            { title: '吉林研究院项目系统', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', color: 'from-sky-900/80' },
            { title: '吉林省与中国科学院', subtitle: '科技合作高新技术产业化专项项目申报', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', color: 'from-violet-900/80', tags: ['申报', '评审', '管理'] },
            { title: '科创专员申报', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', color: 'from-orange-900/80' },
          ].map((item, idx) => (
            <a key={idx} href="#" className="group relative overflow-hidden rounded-xl h-32 md:h-40 shadow-sm">
              <img alt={item.title} src={item.img} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110 filter brightness-75 group-hover:brightness-90" />
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} to-transparent flex items-center px-8`}>
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-bold tracking-wide group-hover:translate-x-2 transition duration-300">{item.title}</h3>
                  {item.subtitle && <p className="text-sm md:text-base opacity-90 mt-1">{item.subtitle}</p>}
                  {item.tags && (
                    <div className="mt-2 flex gap-2">
                      {item.tags.map(tag => <span key={tag} className="bg-white/20 px-2 py-0.5 rounded text-xs">{tag}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-amber-500">campaign</span>
                通知公告 <span className="text-xs text-slate-400 font-normal uppercase mt-1">Notice</span>
              </h3>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                更多 <span className="material-icons-outlined text-sm">double_arrow</span>
              </a>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {[
                  { title: '关于发布《吉林省科技发展计划2026年度项目申报指南》...', date: '2025/08/01' },
                  { title: '关于发布吉林省科技发展计划项目立项和吉林省科技创新...', date: '2024/04/22' },
                  { title: '关于对2024年度吉林省科技发展计划拟支持项目（吉林省...', date: '2023/11/20' },
                  { title: '关于发布省科技发展计划“吉林省生物药和高端医疗器械...', date: '2023/10/16' },
                ].map((item, idx) => (
                  <li key={idx} className="group">
                    <a href="#" className="flex justify-between items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded transition">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition line-clamp-1">{item.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{item.date}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-blue-500">cloud_download</span>
                相关下载 <span className="text-xs text-slate-400 font-normal uppercase mt-1">Download</span>
              </h3>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                更多 <span className="material-icons-outlined text-sm">double_arrow</span>
              </a>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {[
                  { title: '吉林省科技发展计划项目验收资金使用情况报告-样本', date: '2025/11/26' },
                  { title: '推荐函格式下载', date: '2025/08/20' },
                  { title: '吉林省科技发展计划项目申报科技伦理审查意见书', date: '2025/08/01' },
                  { title: '吉林省科技计划项目资金预算编报指南', date: '2024/08/21' },
                ].map((item, idx) => (
                  <li key={idx} className="group">
                    <a href="#" className="flex justify-between items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded transition">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition line-clamp-1">{item.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{item.date}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '单位登录/注册', icon: 'app_registration', color: 'text-blue-600', bg: 'bg-blue-100', action: () => openUnitModal('login') },
              { name: '专家库管理', icon: 'manage_accounts', color: 'text-teal-600', bg: 'bg-teal-100', action: () => {} },
              { name: '网上评审', icon: 'rate_review', color: 'text-indigo-600', bg: 'bg-indigo-100', action: () => {} },
              { name: '"双随机一公开" 网上评审', icon: 'shuffle', color: 'text-orange-600', bg: 'bg-orange-100', action: () => {} },
            ].map((item, idx) => (
              <button key={idx} onClick={item.action} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md dark:hover:bg-slate-700 transition group border border-slate-100 dark:border-slate-700 w-full text-left">
                <div className={`${item.bg} dark:bg-opacity-20 p-3 rounded-full ${item.color} group-hover:scale-110 transition`}>
                  <span className="material-icons-outlined">{item.icon}</span>
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p>© 2008-2025 吉林省科学技术厅版权所有 吉林省科技创新平台管理中心 技术支持: 吉ICP备10001665号-2</p>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode} 
        redirectPath={authRedirectPath}
      />
      
      <UnitAuthModal 
        isOpen={isUnitModalOpen} 
        onClose={() => setIsUnitModalOpen(false)} 
        initialMode={unitModalMode} 
      />
    </div>
  );
}
