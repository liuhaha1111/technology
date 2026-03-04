import React from 'react';

export default function UserManagement() {
  return (
    <div className="p-4 bg-white dark:bg-surface-dark min-h-full rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">项目负责人信息管理</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">审核通过</span>
          <span className="text-red-500">(注:信息修改会变为资料完善状态，需要重新提交等待审核)</span>
          <button className="text-blue-500 hover:text-blue-700 transition">修改密码</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>姓名:
              </label>
              <input type="text" defaultValue="张昕" className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">证件类型:</label>
              <div className="flex-1 flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <input type="radio" name="idType" defaultChecked className="text-blue-600 focus:ring-blue-500" /> 身份证
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="idType" disabled className="text-blue-600 focus:ring-blue-500" /> 军官证
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="idType" disabled className="text-blue-600 focus:ring-blue-500" /> 护照
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="idType" disabled className="text-blue-600 focus:ring-blue-500" /> 外国人永久居留身份证
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">账号:</label>
              <input type="text" defaultValue="220183198309150239" disabled className="flex-1 rounded-md border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">项目负责人所属单位:</label>
              <input type="text" defaultValue="长春理工大学" disabled className="flex-1 rounded-md border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed" />
            </div>

            <div className="flex items-start pt-2">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300 mt-2">
                <span className="text-red-500 mr-1">*</span>身份证明材料(人像面):
              </label>
              <div className="flex-1">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 flex items-center justify-center bg-slate-50 h-40 relative group cursor-pointer hover:bg-slate-100 transition">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 rounded-br"></div>
                  
                  {/* ID Card Placeholder */}
                  <div className="w-48 h-28 bg-white rounded-md shadow-sm border border-slate-200 flex items-center p-4 gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                    </div>
                    <div className="w-12 h-16 bg-blue-100 rounded-sm flex items-end justify-center overflow-hidden">
                      <div className="w-8 h-10 bg-blue-300 rounded-t-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>邮箱:
              </label>
              <input type="email" defaultValue="zhangxin@cust.edu.cn" className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>职称:
              </label>
              <select className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>正高级</option>
                <option>副高级</option>
                <option>中级</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>学历:
              </label>
              <select className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>博士研究生</option>
                <option>硕士研究生</option>
                <option>本科</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>学位:
              </label>
              <select className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>博士</option>
                <option>硕士</option>
                <option>学士</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-center h-9">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">企事业单位负责人:</label>
              <div className="flex-1 flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="isEnterpriseLeader" disabled className="text-blue-600 focus:ring-blue-500" /> 是
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="isEnterpriseLeader" disabled defaultChecked className="text-blue-600 focus:ring-blue-500" /> 否
                </label>
                <span className="text-red-500 text-sm">(内设机构不算)</span>
              </div>
            </div>

            <div className="flex items-center h-9">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">企事业单位法人:</label>
              <div className="flex-1 flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="isLegalPerson" disabled className="text-blue-600 focus:ring-blue-500" /> 是
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-400">
                  <input type="radio" name="isLegalPerson" disabled defaultChecked className="text-blue-600 focus:ring-blue-500" /> 否
                </label>
              </div>
            </div>

            <div className="flex items-center h-9">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">是否为院士:</label>
              <div className="flex-1 flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <input type="radio" name="isAcademician" className="text-blue-600 focus:ring-blue-500" /> 是
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <input type="radio" name="isAcademician" defaultChecked className="text-blue-600 focus:ring-blue-500" /> 否
                </label>
              </div>
            </div>

            <div className="flex items-center h-9"></div> {/* Spacer to align with left column */}

            <div className="flex items-start pt-2">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300 mt-2">
                <span className="text-red-500 mr-1">*</span>身份证明材料(国徽面):
              </label>
              <div className="flex-1">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 flex items-center justify-center bg-slate-50 h-40 relative group cursor-pointer hover:bg-slate-100 transition">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 rounded-br"></div>
                  
                  {/* ID Card Placeholder (Back) */}
                  <div className="w-48 h-28 bg-white rounded-md shadow-sm border border-slate-200 flex flex-col items-center justify-center p-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-amber-200"></div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-slate-400">中华人民共和国</div>
                        <div className="text-xs font-bold text-slate-600 tracking-widest">居民身份证</div>
                      </div>
                    </div>
                    <div className="w-full space-y-1.5 mt-2">
                      <div className="h-1.5 bg-slate-200 rounded w-full"></div>
                      <div className="h-1.5 bg-slate-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>手机号码:
              </label>
              <input type="text" defaultValue="15904318543" className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>职称证明材料:
              </label>
              <div className="flex-1 flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition">上传</button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm transition">预览</button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 mr-1">*</span>学历证明材料:
              </label>
              <div className="flex-1 flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition">上传</button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm transition">预览</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
