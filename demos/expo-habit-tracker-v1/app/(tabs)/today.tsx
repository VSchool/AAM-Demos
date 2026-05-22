/* /today — the Today tab. The static channel list carried over from
   v0; the fake tab bar is dropped because the real navigator now draws
   one. Channel rows carry the v1 PressFade touch feedback. */

import TabScreen from "@/components/TabScreen";
import TodayInstrument from "@/components/TodayInstrument";

export default function TodayTab() {
  return (
    <TabScreen>
      <TodayInstrument tabBar={false} />
    </TabScreen>
  );
}
