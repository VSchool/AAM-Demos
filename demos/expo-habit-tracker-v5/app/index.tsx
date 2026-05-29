/* Home (PILOT). The deployed URL now boots straight into the app —
   opening Pulse shows the phone running the Today screen (inside the
   DeviceShell bezel on web), not a web landing page. The teaching content
   that used to live here is demoted to the external CalloutRail + the
   in-phone Tour (see components/DeviceShell.tsx).

   The previous rich landing (hero, FeaturesStrip, Inside-v6 bento, motion
   tour) is preserved in git history (commit 9bca889) — mine it from there
   if/when we decide what teaching surface survives after the pilot review. */

import { Redirect } from "expo-router";

export default function Home() {
  return <Redirect href="/today" />;
}
