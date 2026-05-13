import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import HUD from './components/HUD.jsx';
import Hero from './components/Hero.jsx';
import HuntCard from './components/HuntCard.jsx';
import RanksStrip from './components/RanksStrip.jsx';
import Achievements from './components/Achievements.jsx';
import TabBar from './components/TabBar.jsx';
import Celebration from './components/Celebration.jsx';
import { ToastContainer, useToasts } from './components/Toast.jsx';
import { useHunterState } from './lib/useHunterState.js';
import { burstFromCenter } from './lib/confetti.js';

export default function App() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');

  const photographerIdRef = useRef(null);
  if (photographerIdRef.current === null) {
    const pFromUrl = searchParams.get('p');
    if (pFromUrl) {
      photographerIdRef.current = pFromUrl;
    } else {
      const stored = localStorage.getItem('by_photographer_id');
      if (stored) {
        photographerIdRef.current = stored;
      } else {
        photographerIdRef.current = 'p_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('by_photographer_id', photographerIdRef.current);
      }
    }
  }

  const {
    hunts,
    foundSet,
    unlockedAchievements,
    xp,
    totalXP,
    currentRank,
    nextRank,
    loading,
    toggleHunt,
  } = useHunterState(eventId, photographerIdRef.current);

  const { toasts, showToast } = useToasts();
  const [celebration, setCelebration] = useState(null);
  const prevRankIdxRef = useRef(currentRank.index);

  useEffect(() => {
    if (currentRank.index > prevRankIdxRef.current) {
      setCelebration({
        emoji: '🎖️',
        title: `דרגה חדשה: ${currentRank.name}!`,
        desc: `${xp} XP בכיס. תמשיך ככה.`,
      });
      burstFromCenter();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }
    prevRankIdxRef.current = currentRank.index;
  }, [currentRank.index, currentRank.name, xp]);

  const handleToggle = (huntId) => {
    const result = toggleHunt(huntId);
    if (result.nowFound) {
      showToast(`+${result.hunt.xp} XP`, result.hunt.title);
      if (navigator.vibrate) navigator.vibrate(30);
    } else {
      showToast(`−${result.hunt.xp} XP`);
    }

    if (result.newlyUnlocked.length > 0) {
      setTimeout(() => {
        const ach = result.newlyUnlocked[0];
        setCelebration({ emoji: ach.icon, title: `${ach.name}!`, desc: ach.desc });
        burstFromCenter();
        if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 100]);
      }, 600);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#6a6a6a] text-sm font-mono">טוען...</div>
      </div>
    );
  }

  return (
    <>
      <HUD rank={currentRank} xp={xp} totalXP={totalXP} foundCount={foundSet.size} totalCount={hunts.length} nextRank={nextRank} />
      <ToastContainer toasts={toasts} />
      <Celebration open={!!celebration} emoji={celebration?.emoji} title={celebration?.title} desc={celebration?.desc} onClose={() => setCelebration(null)} />

      <main>
        <div id="hero"><Hero /></div>

        <section className="border-t border-b py-8 px-5" style={{ borderColor: 'var(--border)', background: 'linear-gradient(180deg, transparent, rgba(255, 61, 122, 0.04), transparent)' }}>
          <SectionHeader num="01" label="הגישה" />
          <h2 className="font-display font-black text-[30px] md:text-[40px] leading-[1.02] mb-5" style={{ letterSpacing: '-1.5px' }}>
            השקענו חודשים.<br /><em className="italic font-black" style={{ color: 'var(--accent)' }}>פעם אחת</em> נחיה את זה.
          </h2>
          <p className="text-[15px] leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
            ב-B.Y עיצבנו כל פינה. הדפסנו כל שלט. הקמנו כל סט.
          </p>
          <div className="text-[22px] leading-[1.3] my-7 pr-4 font-medium border-r-[3px]" style={{ borderRightColor: 'var(--accent)' }}>
            "אנחנו לא מבקשים תיעוד.<br />אנחנו מבקשים <em className="italic" style={{ color: 'var(--accent)' }}>שתסתכל</em>."
          </div>
          <p className="text-[15px] leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
            למפיק/ת התוכן בשטח יש את <strong className="text-white font-semibold">הרשימה המלאה</strong>. עבדו ביחד. מה שאנחנו רוצים מצידנו — <strong className="text-white font-semibold">את העין שלך</strong>.
          </p>
        </section>

        <section id="hunts" className="py-8 px-5">
          <SectionHeader num="02" label="הצידה · 8 שוטים" />
          <h2 className="font-display font-black text-[30px] md:text-[40px] leading-[1.02] mb-5" style={{ letterSpacing: '-1.5px' }}>
            תפוס את ה-<em className="italic font-black" style={{ color: 'var(--accent)' }}>8</em>.<br />קבל את התואר.
          </h2>
          <p className="text-[15px] leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
            כל שוט שווה XP. לחץ על כרטיס כדי לראות איך אנחנו אוהבים את זה — וסמן כשתפסת.
          </p>
          <RanksStrip currentRankIdx={currentRank.index} xp={xp} />
          <div className="flex flex-col gap-3 mt-6">
            {hunts.map((hunt, i) => (
              <HuntCard key={hunt.id} hunt={hunt} index={i} isFound={foundSet.has(hunt.id)} onToggle={() => handleToggle(hunt.id)} />
            ))}
          </div>
        </section>

        <section id="achievements" className="py-8 px-5">
          <SectionHeader num="03" label="תגים" />
          <h2 className="font-display font-black text-[30px] md:text-[40px] leading-[1.02] mb-5" style={{ letterSpacing: '-1.5px' }}>
            הישגים <em className="italic font-black" style={{ color: 'var(--accent)' }}>שמחכים לך</em>.
          </h2>
          <p className="text-[15px] leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
            כל תג שתשחרר יישאר על הפרופיל גם באירועים הבאים.
          </p>
          <Achievements unlockedSet={unlockedAchievements} />
        </section>

        <section className="py-8 px-5">
          <SectionHeader num="04" label="חוקי המשחק" />
          <h2 className="font-display font-black text-[30px] md:text-[40px] leading-[1.02] mb-5" style={{ letterSpacing: '-1.5px' }}>
            4 דברים <em className="italic font-black" style={{ color: 'var(--accent)' }}>שיורידו</em> את הציון.
          </h2>
          <p className="text-[15px] leading-relaxed font-light mb-6" style={{ color: 'var(--text-dim)' }}>
            לא הוראות. רק כאבי לב מאירועים קודמים.
          </p>
          <div>
            {[
              { num: '01', text: 'להשאיר זנבות לשוטים.', why: 'שנייה-שתיים מיותרות לפני ואחרי — אוויר לעריכה.' },
              { num: '02', text: 'לא לקטוע באמצע משפט.', why: 'גם כשנדמה שהוא סיים — תמתין עוד שנייה. תמיד יש עוד מילה.' },
              { num: '03', text: 'תקריב של אנשים — רק עם אישור.', why: 'פנים מזוהות = אישור לפרסום. אם אין, עדיף פריים שלא ניתן לזהות.' },
              { num: '04', text: 'תמיד שיהיה משהו מעוצב בפריים.', why: 'שוט של אנשים בלי רקע ממותג — לא נכנס לסרט. עם המיתוג מאחור — חומר זהב.' },
            ].map((item, i, arr) => (
              <div key={item.num} className="flex gap-4 py-4 border-b" style={{ borderBottomColor: i === arr.length - 1 ? 'transparent' : 'var(--border)' }}>
                <div className="font-mono text-[11px] font-bold min-w-[24px] pt-[3px] tracking-[1px]" style={{ color: 'var(--accent2)' }}>{item.num}</div>
                <div className="text-[15px] text-white leading-snug flex-1 font-medium">
                  {item.text}
                  <span className="block text-[13px] mt-1 font-light leading-snug" style={{ color: 'var(--text-dim)' }}>{item.why}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="end" className="text-center py-14 px-6 border-t" style={{ background: 'var(--bg-soft)', borderTopColor: 'var(--border)' }}>
          <div className="text-[30px] mb-3 font-black" style={{ color: 'var(--accent)' }}>— · —</div>
          <h2 className="font-display font-black text-[30px] leading-[1.02] mb-4" style={{ letterSpacing: '-1.5px' }}>
            זהו. <em className="italic" style={{ color: 'var(--accent)' }}>בהצלחה</em>.
          </h2>
          <p className="text-[15px] leading-relaxed font-light mx-auto max-w-[300px]" style={{ color: 'var(--text-dim)' }}>
            בסיום הערב — תעביר את החומרים למפיק/ת התוכן בשטח, לפני שאתה עוזב.
          </p>
          <div className="block py-4 rounded-2xl font-black text-[13px] mt-6 tracking-[1.5px] uppercase" style={{ background: 'var(--accent)', color: '#000' }}>
            תודה שאתה חלק מהערב
          </div>
          <div className="mt-10 text-[9px] tracking-[3px] uppercase font-mono" style={{ color: 'var(--text-faint)' }}>
            B.Y · SHOT HUNTER v2.0
          </div>
        </section>
      </main>

      <TabBar huntsBadge={foundSet.size} />
    </>
  );
}

function SectionHeader({ num, label }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="font-mono text-[11px] font-bold tracking-[2px]" style={{ color: 'var(--accent)' }}>{num}</span>
      <span className="h-px w-6" style={{ background: 'var(--accent)' }} />
      <span className="flex-grow h-px" style={{ background: 'var(--border)' }} />
      <span className="text-[10px] tracking-[2.5px] uppercase font-mono" style={{ color: 'var(--text-faint)' }}>{label}</span>
    </div>
  );
}
