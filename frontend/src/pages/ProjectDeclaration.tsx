import { useState } from 'react';

export default function ProjectDeclaration() {
  const [activeTab, setActiveTab] = useState('填报申报书');
  const [activeSubTab, setActiveSubTab] = useState('创新能力建设');
  const [activeSubCategory, setActiveSubCategory] = useState('科技创新平台建设');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = ['填报申报书', '我的申报书', '提交申报书', '打印申报书'];
  
  const subCategories: Record<string, string[]> = {
    '基础研究': ['吉林省自然科学基金'],
    '技术研发': ['重点研发'],
    '成果转化': ['科技成果转化'],
    '创新能力建设': ['科技创新平台建设', '科技企业创新引导', '科技人才培养', '区域创新体系建设', '科技创新战略研究'],
    '氢能专项': ['重大科技专项'],
    '意愿征集': ['科技创新平台建设']
  };

  const getTableData = () => {
    if (activeSubTab === '基础研究' && activeSubCategory === '吉林省自然科学基金') {
      return [
        { source: '省科技创新专项资金支持方向', plan: '吉林省自然科学基金', project: '青年科学基金项目（A类）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '省科技创新专项资金支持方向', plan: '吉林省自然科学基金', project: '青年科学基金项目（B类）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '中央引导地方科技发展资金支持...', plan: '吉林省自然科学基金', project: '自由探索项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '中央引导地方科技发展资金支持...', plan: '吉林省自然科学基金', project: '主题引导项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '省科技创新专项资金支持方向', plan: '吉林省自然科学基金', project: '省企联合基金（恒瑞专项）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '中央引导地方科技发展资金支持...', plan: '吉林省自然科学基金', project: '行业联合基金（气象专项）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '中央引导地方科技发展资金支持...', plan: '吉林省自然科学基金', project: '面上项目（医学科学领域）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省自然科学基金管理办...' },
        { source: '省科技创新专项资金支持方向', plan: '吉林省自然科学基金', project: '面上项目（不含医学科学）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '基础研究与科研条件处' },
      ];
    }
    if (activeSubTab === '成果转化' && activeSubCategory === '科技成果转化') {
      return [
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '成果转化引导项目（医药健康领域）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '医药健康科技处' },
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '揭榜挂帅（军令状）机制项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技发展规划处' },
        { source: '中央引导地方科技发展资金支持...', plan: '科技成果转化', project: '成果转化引导项目（概念验证、中试中心、以演代评）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技成果转化促进处' },
        { source: '中央引导地方科技发展资金支持...', plan: '科技成果转化', project: '成果转化引导项目（示范区、产学研转化）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技成果转化促进处' },
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '技术转移体系建设项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技成果转化促进处' },
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '科技协同创新（先投后股）项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '省科技创新研究院' },
        { source: '中央引导地方科技发展资金支持...', plan: '科技成果转化', project: '院士工作站成果转化项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '创新体系与政策法规处' },
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '“揭榜挂帅”（成果转化榜单）', start: '2026-01-05 08:30:00', end: '2026-01-23 17:00:00', dept: '科技发展规划处' },
        { source: '省科技创新专项资金支持方向', plan: '科技成果转化', project: '“揭榜挂帅”（技术需求榜单）', start: '2026-01-05 08:30:00', end: '2026-01-23 17:00:00', dept: '科技发展规划处' },
      ];
    }
    if (activeSubTab === '氢能专项' && activeSubCategory === '重大科技专项') {
      return [
        { source: '氢能专项', plan: '重大科技专项', project: '吉林省氢能产业综合研究院科技专项', start: '2025-11-07 09:00:00', end: '2025-11-14 16:00:00', dept: '重大任务与省实验室处' },
      ];
    }
    if (activeSubTab === '意愿征集' && activeSubCategory === '科技创新平台建设') {
      return [
        { source: '省科技创新专项资金支持方向', plan: '科技创新平台建设', project: '吉林省科技创新中心建设意愿征集', start: '2026-01-19 09:00:00', end: '2026-02-14 09:00:00', dept: '科技资源统筹处' }
      ];
    }
    if (activeSubTab === '创新能力建设') {
      if (activeSubCategory === '科技创新平台建设') {
        return [
          { source: '省科技创新专项资金支持方向', plan: '科技创新平台建设', project: '省科技创新中心建设意愿征集', start: '2026-01-19 09:00:00', end: '2026-02-14 09:00:00', dept: '科技资源统筹处' }
        ];
      }
      if (activeSubCategory === '科技企业创新引导') {
        return [
          { source: '省科技创新专项资金支持方向', plan: '科技企业创新引导', project: '科技型中小微企业“破茧成蝶”专项', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技成果转化促进处' },
          { source: '省科技创新专项资金支持方向', plan: '科技企业创新引导', project: '中国创新创业大赛（吉林赛区）获奖企业项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技人才处' },
        ];
      }
      if (activeSubCategory === '科技人才培养') {
        return [
          { source: '省科技创新专项资金支持方向', plan: '科技人才培养', project: '中青年科技人才（团队）项目（高层次人才培养项目）', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技人才处' },
          { source: '省科技创新专项资金支持方向', plan: '科技人才培养', project: '中青年科技创新人才（团队）培育项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技人才处' },
          { source: '省科技创新专项资金支持方向', plan: '科技人才培养', project: '中青年科技创业人才（团队）培育项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技人才处' },
          { source: '省科技创新专项资金支持方向', plan: '科技人才培养', project: '青年科技人才培养项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '科技人才处' },
        ];
      }
      if (activeSubCategory === '区域创新体系建设') {
        return [
          { source: '省科技创新专项资金支持方向', plan: '区域创新体系建设', project: '科技特派员区域创新服务项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '农村科技处' },
          { source: '省科技创新专项资金支持方向', plan: '区域创新体系建设', project: '区域科技创新能力提升项目', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '创新体系与政策法规处' },
        ];
      }
      if (activeSubCategory === '科技创新战略研究') {
        return [
          { source: '省科技创新专项资金支持方向', plan: '科技创新战略研究', project: '科技创新战略研究', start: '2025-08-07 17:00:00', end: '2025-08-29 17:00:00', dept: '创新体系与政策法规处' },
        ];
      }
    }
    return [
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '高新技术领域（企业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '高新技术处（科...' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '高新技术领域（产业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '高新技术处（科...' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '现代农业领域（企业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '农村科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '现代农业领域（产业关键技术-专项任务）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '农村科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '现代农业领域（产业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '农村科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '社会发展领域（企业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '社会发展科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '社会发展领域（产业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '社会发展科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '医药健康领域（企业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '医药健康科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '医药健康领域（产业关键技术）', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '医药健康科技处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '国际科技合作', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '国际合作处' },
      { source: '省科技创新专项资金支...', plan: '重点研发', project: '科技资源开发', start: '2025-08-07 17:0...', end: '2025-08-29 17:0...', dept: '科技资源统筹处' },
    ];
  };

  const tableData = getTableData();

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-l-4 border-orange-400 p-2 mb-4 flex items-center text-sm shadow-sm rounded-r">
        <span className="material-icons-outlined text-orange-500 mr-2 text-lg">volume_up</span>
        <span className="text-muted-light dark:text-muted-dark mr-1">您当前的位置:</span>
        <span className="font-bold text-gray-800 dark:text-white">项目申报</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 指南查看 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <span className="material-icons-outlined mr-2 text-lg">description</span>
              指南查看
            </div>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">更多》</a>
          </div>
          <div className="p-3">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 吉林省科技发展计划2026年度项目指南</span>
                <span className="text-gray-500 whitespace-nowrap">2025-08-01</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 通知公告 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <span className="material-icons-outlined mr-2 text-lg">campaign</span>
              通知公告
            </div>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">更多》</a>
          </div>
          <div className="p-3">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于发布《吉林省科技发展计划2026年度项目指南》的通知</span>
                <span className="text-gray-500 whitespace-nowrap">2025-08-01</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于发布吉林省科技发展计划项目立项和吉林省科技创新专项资...</span>
                <span className="text-gray-500 whitespace-nowrap">2024-04-22</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于对2024年度吉林省科技发展计划拟支持项目（吉林省科技...</span>
                <span className="text-gray-500 whitespace-nowrap">2023-11-20</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于发布省科技发展计划“吉林省生物药和高端医疗器械产业重...</span>
                <span className="text-gray-500 whitespace-nowrap">2023-10-16</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于发布《吉林省科技专家库管理办法》的通知</span>
                <span className="text-gray-500 whitespace-nowrap">2023-06-09</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 关于修订发布《吉林省科技发展计划项目管理办法》的通知</span>
                <span className="text-gray-500 whitespace-nowrap">2023-06-09</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 系统消息 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <span className="material-icons-outlined mr-2 text-lg">mail_outline</span>
              系统消息
            </div>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">更多》</a>
          </div>
          <div className="p-3">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 签订任务书审核提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.12.27</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 项目申报推荐提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.08.28</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 项目申报推荐提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.08.27</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 项目申报推荐提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.08.27</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 验收备案归档完成提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.08.21</span>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 truncate pr-4">· 验收证书会后完善情况单位审核提示</span>
                <span className="text-gray-500 whitespace-nowrap">2025.07.14</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-1 border-b border-gray-300 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-medium rounded-t transition shadow-sm border-t border-l border-r ${
                activeTab === tab
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold border-gray-300 dark:border-gray-600'
                  : 'bg-surface-light dark:bg-surface-dark text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent border-b-gray-300 dark:border-b-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === '填报申报书' && (
          <div className="bg-blue-50 dark:bg-gray-800 p-2 border-b border-blue-200 dark:border-gray-700 flex space-x-6 text-sm relative">
            {Object.keys(subCategories).map(tab => (
              <div
                key={tab}
                className="relative group"
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <button
                  onClick={() => {
                    setActiveSubTab(tab);
                    setActiveSubCategory(subCategories[tab][0]);
                  }}
                  className={`pb-1 ${
                    activeSubTab === tab
                      ? 'font-bold text-blue-700 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {tab}
                </button>
                
                {/* Dropdown */}
                {hoveredTab === tab && subCategories[tab].length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded z-10 py-1">
                    {subCategories[tab].map(subCat => (
                      <button
                        key={subCat}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSubTab(tab);
                          setActiveSubCategory(subCat);
                          setHoveredTab(null);
                        }}
                        className={`block w-full text-center px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                          activeSubCategory === subCat && activeSubTab === tab ? 'text-blue-600 bg-blue-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {subCat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === '填报申报书' && (
        <div className="bg-surface-light dark:bg-surface-dark rounded shadow overflow-x-auto border border-border-light dark:border-border-dark">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">资金来源</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">计划类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">模板</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">申报开始时间</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">申报截止时间</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">管理单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">联系电话</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.source}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.plan}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.project}</td>
                  <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg">download</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{row.start}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{row.end}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.dept}</td>
                  <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">
                    <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg">search</span>
                  </td>
                  <td className="py-3 px-4 text-red-500 font-medium">未开启</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === '我的申报书' && (
        <div className="bg-surface-light dark:bg-surface-dark rounded shadow overflow-x-auto border border-border-light dark:border-border-dark mt-4">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">条码号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">承担单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">联系电话</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目状态</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 1, barcode: '252805XM0105137195', year: '2026', name: '激光共聚焦显微镜设备功...', category: '科技资源开发', leader: '张昕', unit: '长春理工大学', phone: '15904318543', status: '已受理', statusColor: 'text-green-600' },
                { id: 2, barcode: '192477JC010158867', year: '2020', name: '基于位置服务发现的新能...', category: '自然科学基金（吉林省重点...', leader: '张昕', unit: '长春理工大学', phone: '15904318543', status: '已受理', statusColor: 'text-green-600' },
                { id: 3, barcode: '182447SF010153900', year: '2019', name: '面向城市精细化治理的智...', category: '社会发展', leader: '张昕', unit: '长春理工大学', phone: '15904318543', status: '已受理', statusColor: 'text-green-600' },
                { id: 4, barcode: '172421GG037141', year: '2018', name: '吉林省农业物联网科技协...', category: '科技创新中心（工程技术研...', leader: '蒋振刚', unit: '长春理工大学', phone: '15904318543', status: '正在填报', statusColor: 'text-red-500' },
                { id: 5, barcode: '140402GH010015954', year: '2015', name: '具有长服务周期的工业复...', category: '国际科技合作项目', leader: '张昕', unit: '长春理工大学', phone: '', status: '已受理', statusColor: 'text-green-600' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.id}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.barcode}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.year}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.category}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.leader}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.unit}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.phone}</td>
                  <td className={`py-3 px-4 font-medium border-r border-gray-200 dark:border-gray-700 ${row.statusColor}`}>{row.status}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    {row.status === '正在填报' ? (
                      <>
                        <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="编辑">edit</span>
                        <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="查看">find_in_page</span>
                        <span className="material-icons-outlined text-gray-400 hover:text-red-600 cursor-pointer text-lg" title="删除">delete</span>
                      </>
                    ) : (
                      <span className="material-icons-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-lg" title="下载">download</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === '提交申报书' || activeTab === '打印申报书') && (
        <div className="bg-surface-light dark:bg-surface-dark rounded shadow overflow-x-auto border border-border-light dark:border-border-dark mt-4">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">序号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">条码号</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">年度</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目名称</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目类别</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">项目负责人</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">承担单位</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">联系电话</th>
                <th className="py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="py-8 text-gray-500 dark:text-gray-400 bg-blue-50/30 dark:bg-gray-800/30">
                  没有满足条件数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
