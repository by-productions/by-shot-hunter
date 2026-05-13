import { useState, useEffect, useCallback } from 'react';
import { supabase, hasSupabase } from './supabase.js';
import { DEFAULT_HUNTS, RANKS, ACHIEVEMENTS } from '../data/defaults.js';

export function useHunterState(eventId = null, photographerId = null) {
  const [hunts, setHunts] = useState(DEFAULT_HUNTS);
  const [foundSet, setFoundSet] = useState(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const storageKey = `by_hunter_${eventId || 'default'}`;

  useEffect(() => {
    let cancelled = false;
    async function loadHunts() {
      if (hasSupabase && eventId) {
        const { data, error } = await supabase
          .from('event_hunts')
          .select('*')
          .eq('event_id', eventId)
          .order('order_idx', { ascending: true });

        if (!cancelled && data && data.length > 0 && !error) {
          setHunts(
            data.map((h) => ({
              id: h.id,
              title: h.title,
              hint: h.hint,
              xp: h.xp,
              details: h.details || [],
            }))
          );
        }
      }
      if (!cancelled) setLoading(false);
    }
    loadHunts();
    return () => { cancelled = true; };
  }, [eventId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setFoundSet(new Set(data.found || []));
        setUnlockedAchievements(new Set(data.achievements || []));
      }
    } catch (e) {
      console.warn('Failed to load local state:', e);
    }

    if (hasSupabase && eventId && photographerId) {
      supabase
        .from('hunt_progress')
        .select('*')
        .eq('event_id', eventId)
        .eq('photographer_id', photographerId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setFoundSet(new Set(data.found_ids || []));
            setUnlockedAchievements(new Set(data.achievements || []));
          }
        });
    }
  }, [eventId, photographerId, storageKey]);

  const saveState = useCallback(
    async (newFound, newAchievements) => {
      const payload = {
        found: [...newFound],
        achievements: [...newAchievements],
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to save local state:', e);
      }

      if (hasSupabase && eventId && photographerId) {
        const xp = computeXP(hunts, newFound);
        await supabase.from('hunt_progress').upsert(
          {
            event_id: eventId,
            photographer_id: photographerId,
            found_ids: [...newFound],
            achievements: [...newAchievements],
            xp,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'event_id,photographer_id' }
        );
      }
    },
    [eventId, photographerId, storageKey, hunts]
  );

  const toggleHunt = useCallback(
    (huntId) => {
      const newFound = new Set(foundSet);
      const wasFound = newFound.has(huntId);
      if (wasFound) {
        newFound.delete(huntId);
      } else {
        newFound.add(huntId);
      }
      setFoundSet(newFound);

      const state = {
        found: newFound.size,
        total: hunts.length,
        foundList: [...newFound],
        maxXp: Math.max(
          0,
          ...[...newFound].map((id) => hunts.find((h) => h.id === id)?.xp || 0)
        ),
      };

      const newAchievements = new Set(unlockedAchievements);
      const newlyUnlocked = [];
      ACHIEVEMENTS.forEach((ach) => {
        if (!newAchievements.has(ach.id) && ach.condition(state)) {
          newAchievements.add(ach.id);
          newlyUnlocked.push(ach);
        }
      });
      setUnlockedAchievements(newAchievements);

      saveState(newFound, newAchievements);

      return {
        wasFound,
        nowFound: !wasFound,
        hunt: hunts.find((h) => h.id === huntId),
        newlyUnlocked,
      };
    },
    [foundSet, unlockedAchievements, hunts, saveState]
  );

  const xp = computeXP(hunts, foundSet);
  const totalXP = hunts.reduce((s, h) => s + h.xp, 0);
  const currentRank = getCurrentRank(xp);
  const nextRank = RANKS[currentRank.index + 1] || null;

  return {
    hunts,
    foundSet,
    unlockedAchievements,
    xp,
    totalXP,
    currentRank,
    nextRank,
    loading,
    toggleHunt,
  };
}

function computeXP(hunts, foundSet) {
  let xp = 0;
  foundSet.forEach((id) => {
    const hunt = hunts.find((h) => h.id === id);
    if (hunt) xp += hunt.xp;
  });
  return xp;
}

function getCurrentRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].xpMin) return { ...RANKS[i], index: i };
  }
  return { ...RANKS[0], index: 0 };
}
