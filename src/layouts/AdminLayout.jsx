import Sidebar from '../components/Sidebar';
import UserMenu from '../components/UserMenu';

export default function AdminLayout({ sections, current, onSelect, children }) {
  return (
    <div className="flex">
      <Sidebar sections={sections} current={current} onSelect={onSelect} />
      <div className="p-4 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <UserMenu />
        </div>
        {children}
      </div>
    </div>
  );
}
