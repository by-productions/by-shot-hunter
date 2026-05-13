export default function Hero() {
  return (
    <section
      className="min-h-[92vh] flex flex-col justify-center relative overflow-hidden"
      style={{ padding: '40px 20px 60px', paddingTop: 'calc(80px + var(--safe-top))' }}
    >
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute rounded-full blur-[60px] animate-float" style={{ width: 320, height: 320, background: 'var(--accent)', top: -80, right: -80, opacity: 0.18 }} />
        <div className="absolute rounded-full blur-[60px] animate-float" style={{ width: 280, height: 280, background: 'var(--accent2)', bottom: '10%', left: -60, opacity: 0.14, animationDelay: '-7s' }} />
        <div className="absolute rounded-full blur-[60px] animate-float" style={{ width: 200, height: 200, background: 'var(--accent3)', top: '40%', right: '30%', opacity: 0.1, animationDelay: '-3s' }} />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] z-0 opacity-30">
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'var(--accent)' }} />
          <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'var(--accent)' }} />
          <div className="absolute inset-[20%] rounded-full animate-ring-pulse" style={{ border: '1px solid var(--accent)' }} />
        </div>
      </div>

      <div className="relative z-[1]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] tracking-[2px] font-bold mb-5 animate-fade-up font-mono" style={{ background: 'rgba(255, 61, 122, 0.12)', border: '1px solid rgba(255, 61, 122, 0.3)', color: 'var(--accent)', animationDelay: '0.2s' }}>
          <span className="w-[5px] h-[5px] rounded-full animate-pulse-dot" style={{ background: 'var(--accent)' }} />
          <span>SHOT HUNTER · MISSION</span>
        </div>

        <h1 className="font-display font-black mb-3 animate-fade-up" style={{ fontSize: 'clamp(44px, 14vw, 68px)', lineHeight: 0.92, letterSpacing: '-2px', animationDelay: '0.4s' }}>
          ערב טוב,<br />
          <span className="italic" style={{ color: 'var(--accent)' }}>צייד.</span>
        </h1>

        <div className="font-black uppercase mb-6 animate-fade-up" style={{ fontSize: 'clamp(56px, 18vw, 88px)', lineHeight: 0.88, letterSpacing: '-3px', color: 'transparent', WebkitTextStroke: '1.5px white', animationDelay: '0.55s' }}>
          SHOT<br />
          <span style={{ color: 'var(--accent)', WebkitTextStroke: 0 }}>HUNTER</span>
        </div>

        <p className="text-[15px] leading-relaxed mb-8 font-light animate-fade-up max-w-[320px]" style={{ color: 'var(--text-dim)', animationDelay: '0.7s' }}>
          היום אתה לא צלם — אתה <strong className="text-white font-semibold">צייד פריימים</strong>.<br />
          8 שוטים. 4 דרגות. בסוף הערב, אם תפסת הכל — תג <strong className="text-white font-semibold">Master</strong>.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-8 animate-fade-up" style={{ animationDelay: '0.9s' }}>
          {[{ num: 8, label: 'שוטים' }, { num: 4, label: 'דרגות' }, { num: 6, label: 'תגים' }].map((s) => (
            <div key={s.label} className="py-4 px-2 bg-bg-card rounded-xl text-center border" style={{ borderColor: 'var(--border)' }}>
              <div className="font-display font-black leading-none mb-1.5" style={{ fontSize: 30, letterSpacing: '-1.5px', color: 'var(--accent)' }}>{s.num}</div>
              <div className="text-[9px] tracking-[1.5px] uppercase font-mono" style={{ color: 'var(--text-faint)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <a
          href="#hunts"
          className="w-full flex items-center justify-center gap-2.5 py-[18px] px-6 rounded-2xl no-underline font-black text-[16px] tracking-[1px] cursor-pointer animate-fade-up animate-glow"
          style={{ background: 'var(--accent)', color: '#000', animationDelay: '1.1s, 1.5s' }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('hunts')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>התחל את המצוד</span>
          <span className="text-[20px]">←</span>
        </a>
      </div>
    </section>
  );
}
