import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnitAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function UnitAuthModal({ isOpen, onClose, initialMode = 'login' }: UnitAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/unit');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/unit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden w-full ${mode === 'register' ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] flex flex-col transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex space-x-4">
            <button 
              onClick={() => setMode('login')}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${mode === 'login' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              单位登录
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${mode === 'register' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              单位注册
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar-thin">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用户名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-gray-400 text-lg">person</span>
                  </div>
                  <input type="text" required placeholder="请输入用户名" className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-gray-400 text-lg">lock</span>
                  </div>
                  <input type="password" required placeholder="请输入密码" className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">验证码</label>
                <div className="flex space-x-3">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons-outlined text-gray-400 text-lg">verified_user</span>
                    </div>
                    <input type="text" required placeholder="验证码" className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-11" />
                  </div>
                  <div className="flex-none cursor-pointer group relative" title="点击刷新">
                    <div className="w-24 h-11 bg-gray-200 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 6px)' }}>
                      <span className="font-serif text-xl font-bold tracking-widest italic text-gray-700 dark:text-gray-800 transform -rotate-2 select-none">ca36</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm py-1">
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400">忘记账号密码?</a>
              </div>
              
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                登录系统
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">单位基本信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">用户名：</label>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input type="text" required className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="text-blue-600 font-bold">*</span>
                  <span className="text-xs text-gray-500">(任意8到16位字母、数字组成,区分大小写、不允许含有空格)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">密码：</label>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input type="password" required className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="text-blue-600 font-bold">*</span>
                  <span className="text-xs text-gray-500">(8-16个数字、字母、特殊符号组成，必须包含一个大写字母和一个特殊符号)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">确认密码：</label>
                <div className="md:col-span-5">
                  <input type="password" required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">单位名称：</label>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input type="text" required className="w-full max-w-[250px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <span className="text-blue-600 font-bold">*</span>
                  <span className="text-xs text-gray-500">单位名称注册后不可变更（请保持与组织机构代码证一致）</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">社会信用代码：</label>
                <div className="md:col-span-5">
                  <input type="text" className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">所在地区：</label>
                <div className="md:col-span-9 flex flex-wrap items-center gap-2">
                  <span className="text-sm">省/直辖市:</span>
                  <select className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>吉林</option>
                  </select>
                  <span className="text-sm ml-2">市/州:</span>
                  <select className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>长春市</option>
                  </select>
                  <span className="text-sm ml-2">区/县:</span>
                  <select className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>朝阳区</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">验证码：</label>
                <div className="md:col-span-9 flex items-center gap-3">
                  <input type="text" required className="w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <div className="h-9 w-24 bg-gray-200 flex items-center justify-center rounded overflow-hidden relative">
                    <span className="font-serif text-lg font-bold tracking-widest text-blue-500 transform -rotate-6">6</span>
                    <span className="font-serif text-lg font-bold tracking-widest text-yellow-600 transform rotate-12">S</span>
                    <span className="font-serif text-lg font-bold tracking-widest text-orange-500 transform -rotate-12">F</span>
                    <span className="font-serif text-lg font-bold tracking-widest text-blue-800 transform rotate-6">F</span>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                  </div>
                  <button type="button" className="text-blue-600 hover:underline text-sm">换一张</button>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" required className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">我已阅读并同意遵守 <a href="#" className="text-blue-600 hover:underline">[隐私政策]</a></span>
                </label>
              </div>

              <div className="flex justify-center pt-4 pb-2">
                <button type="submit" className="bg-gradient-to-b from-blue-50 to-gray-200 border border-gray-400 hover:from-gray-100 hover:to-gray-300 text-gray-800 px-8 py-1.5 rounded shadow-sm flex items-center gap-1 font-medium">
                  <span className="material-icons-outlined text-blue-600 text-lg">save</span>
                  保存
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
