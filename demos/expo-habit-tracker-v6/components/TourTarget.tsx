/* TourTarget — wraps an element the tour wants to SPOTLIGHT. It reports
   its on-screen rect (window coords) into the tour context whenever the
   tour is open or advances a step, so the overlay can ring it. Harmless
   when the tour is closed. */

import { useEffect, useRef, type ReactNode } from "react";
import { View } from "react-native";
import { useTour } from "@/lib/tour";

export default function TourTarget({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<View>(null);
  const { setTargetRect, measureTick, open } = useTour();

  const measure = () => {
    const node = ref.current;
    if (!node) return;
    node.measureInWindow((x, y, w, h) => {
      if (w && h) setTargetRect(id, { x, y, w, h });
    });
  };

  useEffect(() => {
    if (!open) return;
    measure();
    // re-measure after a frame so layout / scroll / spring settle first
    const t = setTimeout(measure, 70);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, measureTick]);

  // drop our rect when unmounted so a stale target never gets ringed
  useEffect(() => () => setTargetRect(id, null), [id, setTargetRect]);

  return (
    <View ref={ref} collapsable={false} onLayout={() => open && measure()}>
      {children}
    </View>
  );
}
