/* /settings — the Settings tab: the day-mode switch, hardware toggles,
   reset-to-seed, About, Log out, and the honest fine print. (Coach tone +
   the daily-reminder console arrive in v6 — the push beat.) */

import TabScreen from "@/components/TabScreen";
import SettingsInstrument from "@/components/SettingsInstrument";

export default function SettingsTab() {
  return (
    <TabScreen>
      <SettingsInstrument />
    </TabScreen>
  );
}
