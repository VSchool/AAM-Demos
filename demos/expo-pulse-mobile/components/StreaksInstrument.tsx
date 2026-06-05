/* StreaksInstrument — the v1 Streaks tab: the "meter-bridge".
   Momentum you can see, not just a number (feature brief §6). One
   total-uptime gauge crowns a rack of channel meters — each a live
   streak readout plus a 7-day LED bar. Rest days read calm-grey, never
   as a break. Pure read off lib/habits; the bars come straight from
   each channel's history. No fake tab bar — the live navigator draws it. */

import { View } from "react-native";
import { getAll, lastDays, uptimePct } from "@/lib/habits";
import { AppBar, MeterRow, Stage, UptimeGauge } from "./instrument";

export default function StreaksInstrument() {
  const habits = getAll();
  const pct = uptimePct();

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="The rack · all channels" subtitle="Momentum" seg="▲" segRole="done" />
      <Stage style={{ gap: 9 }}>
        <UptimeGauge pct={pct} unit={`30-day uptime · ${habits.length} channels live`} />
        {habits.map((h) => (
          <MeterRow
            key={h.id}
            ledRole={h.status}
            name={h.name}
            days={lastDays(h.history, 7)}
            streak={String(h.streak).padStart(2, "0")}
          />
        ))}
      </Stage>
    </View>
  );
}
