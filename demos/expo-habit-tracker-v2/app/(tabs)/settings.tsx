/* /settings — the Settings tab: Coach-tone dial, reminder clock, the
   day-mode switch, hardware toggles, and the honest fine print. */

import TabScreen from "@/components/TabScreen";
import SettingsInstrument from "@/components/SettingsInstrument";

export default function SettingsTab() {
  return (
    <TabScreen>
      <SettingsInstrument />
    </TabScreen>
  );
}
