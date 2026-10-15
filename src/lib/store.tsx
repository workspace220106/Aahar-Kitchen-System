import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { DEMO_ITEMS, Item } from './data';
import { Quality } from './quality';

export type Shot = { id: string; src: string; quality: Quality; source: 'camera' | 'upload' };

type Kitchen = {
  shots: Shot[];
  addShot: (s: Shot) => void;
  removeShot: (id: string) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  detected: boolean;
  setDetected: (v: boolean) => void;
};

const Ctx = createContext<Kitchen | null>(null);

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [shots, setShots] = useState<Shot[]>([]);
  const [items, setItems] = useState<Item[]>(DEMO_ITEMS);
  const [detected, setDetected] = useState(false);

  const value = useMemo<Kitchen>(
    () => ({
      shots,
      addShot: (s) => setShots((prev) => [...prev, s].slice(-6)),
      removeShot: (id) => setShots((prev) => prev.filter((s) => s.id !== id)),
      items,
      setItems,
      detected,
      setDetected,
    }),
    [shots, items, detected],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useKitchen() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useKitchen must be used inside KitchenProvider');
  return v;
}
