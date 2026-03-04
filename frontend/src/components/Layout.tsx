import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark antialiased h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
