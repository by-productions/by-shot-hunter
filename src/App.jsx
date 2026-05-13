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

        <section className="border-t border-b py-6 px-4" style={{ borderColor: 'var(--border)', background: 'linear-gradient(180deg, transparent, rgba(255, 61, 122, 0.03), transparent)' }}>
          <SectionHeader num="01" label="הגישה" />
          <h2 className="font-serif font-black text-[28px] md:text-[36px] leading-[1.05] mb-4 -tracking-[1px]">
            השקענו חודשים. <em className="italic" style={{ color: 'var(--accent)' }}>פעם אחת</em> נחיה את זה.
          </h2>
          <p className="text-[15px] leading-snug font-light" style={{ color: 'var(--text-dim)' }}>
            ב-B.Y עיצבנו כל פינה. הדפסנו כל שלט. בנינו כל גוביילים.
          </p>
          <div className="font-serif text-[24px] leading-[1.25] my-6 pr-4 italic font-medium border-r-[3px]" style={{ borderRightColor: 'var(--accent)' }}>
            "אנחנו לא מבקשים תיעוד. אנחנו מבקשים שתסתכל."
          </div>
          <p className="text-[15px] leading-snug font-light" style={{ color: 'var(--text-dim)' }}>
            למפיק/ת התוכן בשטח יש את <strong className="text-white font-medium">הרשימה</strong>. תפסו אותם, תעבדו ביחד. מה שאנחנו רוצים מצידנו — <strong className="text-white font-medium">את העין שלך</strong>.
          </p>
        </section>

        <section id="hunts" className="py-6 px-4">
          <SectionHeader num="02" label="הצידה · 8 שוטים" />
          <h2 className="font-serif font-black text-[28px] md:text-[36px] leading-[1.05] mb-4 -tracking-[1px]">
            תפוס את ה-<em className="italic" style={{ color: 'var(--accent)' }}>8</em>.<br />תקבל את התואר.
          </h2>
          <p className="text-[15px] leading-snug font-light" style={{ color: 'var(--text-dim)' }}>
            כל שוט שווה XP. תלחץ לראות איך אנחנו אוהבים שזה ייראה — סמן כשתפסת.
          </p>
          <RanksStrip currentRankIdx={currentRank.index} xp={xp} />
          <div className="flex flex-col gap-2.5 mt-5">
            {hunts.map((hunt, i) => (
              <HuntCard key={hunt.id} hunt={hunt} index={i} isFound={foundSet.has(hunt.id)} onToggle={() => handleToggle(hunt.id)} />
            ))}
          </div>
        </section>

        <section id="achievements" className="py-6 px-4">
          <SectionHeader num="03" label="תגים" />
          <h2 className="font-serif font-black text-[28px] md:text-[36px] leading-[1.05] mb-4 -tracking-[1px]">
            הישגים <em className="italic" style={{ color: 'var(--accent)' }}>שצריך לשחרר</em>.
          </h2>
          <p className="text-[15px] leading-snug font-light" style={{ color: 'var(--text-dim)' }}>
            תגים שיופיעו על הפרופיל באירועים הבאים.
          </p>
          <Achievements unlockedSet={unlockedAchievements} />
        </section>

        <section className="py-6 px-4">
          <SectionHeader num="04" label="חוקי המשחק" />
          <h2 className="font-serif font-black text-[28px] md:text-[36px] leading-[1.05] mb-4 -tracking-[1px]">
            4 דברים <em className="italic" style={{ color: 'var(--accent)' }}>שיורידו</em> את הציון.
          </h2>
          <p className="text-[15px] leading-snug font-light mb-5" style={{ color: 'var(--text-dim)' }}>
            לא הוראות. רק כאבי לב מאירועים קודמים.
          </p>
          <div>
            {[
              { num: '01', text: 'להשאיר זנבות לשוטים.', why: 'שניה-שתיים מיותרות לפני ואחרי — אוויר לעריכה.' },
              { num: '02', text: 'לא לקטוע באמצע משפט.', why: 'גם כשנדמה שהוא סיים — תמתין עוד שנייה. תמיד יש עוד מילה.' },
              { num: '03', text: 'קלוז-אפ של אנשים — רק עם אישור.', why: 'פנים מזוהות = אישור לפרסום. עדיף שוט שלא ניתן לזהות.' },
              { num: '04', text: 'תמיד שיהיה משהו מעוצב בפריים.', why: 'שוט של אנשים בלי רקע ממותג — לא נכנס לסרט. עם הגוביילים מאחור — חומר זהב.' },
            ].map((item, i, arr) => (
              <div key={item.num} className="flex gap-3.5 py-4 border-b" style={{ borderBottomColor: i === arr.length - 1 ? 'transparent' : 'var(--border)' }}>
                <div className="font-mono text-[11px] font-bold min-w-[24px] pt-[3px] tracking-[1px]" style={{ color: 'var(--accent2)' }}>{item.num}</div>
                <div className="text-[15px] text-white leading-snug flex-1">
                  {item.text}
                  <span className="block text-[12px] mt-[3px] font-light leading-snug" style={{ color: 'var(--text-dim)' }}>{item.why}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="end" className="text-center py-12 px-5 border-t" style={{ background: 'var(--bg-soft)', borderTopColor: 'var(--border)' }}>
          <div className="font-serif text-[30px] mb-3" style={{ color: 'var(--accent)' }}>— · —</div>
          <h2 className="font-serif font-black text-[28px] leading-[1.05] mb-4 -tracking-[1px]">
            זהו. <em className="italic" style={{ color: 'var(--accent)' }}>בהצלחה</em>.
          </h2>
          <p className="text-[15px] leading-snug font-light mx-auto" style={{ color: 'var(--text-dim)' }}>
            כשתסיים, תעביר את החומרים למפיק/ת התוכן בשטח לפני העזיבה.
          </p>
          <div className="block py-4 rounded-xl font-black text-[13px] mt-5 tracking-[1px] uppercase" style={{ background: 'var(--accent)', color: '#000' }}>
            תודה שאתה חלק מהערב
          </div>
          <div className="mt-8 text-[9px] tracking-[2.5px] uppercase font-mono" style={{ color: 'var(--text-faint)' }}>
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
    <div className="flex items-center gap-2.5 mb-4">
      <span className="font-mono text-[11px] font-bold tracking-[2px]" style={{ color: 'var(--accent)' }}>{num}</span>
      <span className="flex-grow h-px" style={{ background: 'var(--border)' }} />
      <span className="text-[10px] tracking-[2.5px] uppercase font-mono" style={{ color: 'var(--text-faint)' }}>{label}</span>
    </div>
  );
}
