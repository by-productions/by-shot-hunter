import { useEffect, useState } from 'react';

const TABS = [
  { id: 'hero', icon: '⌖', label: 'בית' },
  { id: 'hunts', icon: '◎', label: 'מצוד', showBadge: true },
  { id: 'achievements', icon: '★', label: 'תגים' },
  { id: 'end', icon: '✓', label: 'סיום' },
];

export default function TabBar({ huntsBadge }) {
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      let active = 'hero';
      TABS.forEach((tab) => {
        const el = document.getElementById(tab.id);
        if (el && el.offsetTop <= scrollY) {
          active = tab.id;
        }
      });
      setActiveTab(active);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed bottom-0 right-0 left-0 z-[100] backdrop-blur-xl bg-black/90 border-t border-white/[0.08] flex justify-around"
      style={{ padding: '8px 8px calc(8px + var(--safe-bot))' }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className="flex-1 py-2.5 px-1 text-center cursor-pointer transition-colors duration-200 relative no-underline active:scale-95"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)' }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[22px] mb-1 block leading-none">{tab.icon}</span>
            <span className="text-[10px] font-bold tracking-[1px] uppercase font-mono">{tab.label}</span>
            {tab.showBadge && huntsBadge > 0 && (
              <span
                className="absolute top-1 min-w-[16px] h-4 px-1 rounded-lg text-[9px] font-black flex items-center justify-center font-mono border-2 border-black"
                style={{ background: 'var(--accent)', color: '#000', right: '50%', transform: 'translateX(50%) translateX(14px)' }}
              >
                {huntsBadge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
