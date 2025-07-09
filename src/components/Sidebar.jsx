import { useState } from 'react';

export default function Sidebar({ sections = [], current = '', onSelect }) {
  const [open, setOpen] = useState(
    sections.map(() => true)
  );

  const toggle = idx => {
    setOpen(o => o.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <aside className="w-64 bg-base-200 min-h-screen p-4 space-y-4">
      {sections.map((section, idx) => (
        <div key={section.label} className="border border-base-300 rounded">
          <button
            className="w-full px-4 py-2 flex justify-between items-center font-semibold"
            onClick={() => toggle(idx)}
          >
            <span>{section.label}</span>
            <span>{open[idx] ? '-' : '+'}</span>
          </button>
          {open[idx] && (
            <ul className="menu px-2 py-2">
              {section.items.map(item => (
                <li key={item.id}>
                  {item.href ? (
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon />
                      {item.label}
                    </a>
                  ) : (
                    <a
                      onClick={() => onSelect(item.id)}
                      className={`flex items-center gap-2 ${
                        current === item.id ? 'active' : ''
                      }`}
                    >
                      <item.icon />
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
