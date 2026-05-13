import { ACHIEVEMENTS } from '../data/defaults.js';

export default function Achievements({ unlockedSet }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mt-5">
      {ACHIEVEMENTS.map((ach) => {
        const unlocked = unlockedSet.has(ach.id);
        return (
          <div
            key={ach.id}
            className="py-[18px] px-3 rounded-2xl text-center relative transition-all duration-400 border"
            style={{
              background: unlocked ? 'linear-gradient(180deg, var(--accent-soft), var(--bg-card))' : 'var(--bg-card)',
              borderColor: unlocked ? 'var(--accent)' : 'var(--border)',
              opacity: unlocked ? 1 : 0.45,
            }}
          >
            {!unlocked && (
              <div className="absolute top-2 left-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>🔒</div>
            )}
            <span
              className="text-[36px] mb-2.5 block transition-all duration-400"
              style={{
                filter: unlocked ? 'grayscale(0)' : 'grayscale(1)',
                animation: unlocked ? 'achPop 0.5s' : 'none',
              }}
            >
              {ach.icon}
            </span>
            <div className="font-serif font-bold text-[14px] mb-1 leading-tight">{ach.name}</div>
            <div className="text-[11px] leading-tight font-light" style={{ color: 'var(--text-dim)' }}>{ach.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
