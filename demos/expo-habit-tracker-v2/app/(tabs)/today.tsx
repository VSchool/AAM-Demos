/* /today — the Today tab. v2's beat: the channel list is now a FlatList
   with an inline add-a-habit form pinned as its header, reading + mutating
   the in-memory store. The static TodayInstrument carried over from v0/v1
   still renders the home-page device preview; the live tab uses TodayList. */

import TabScreen from "@/components/TabScreen";
import TodayList from "@/components/TodayList";

export default function TodayTab() {
  return (
    <TabScreen>
      <TodayList />
    </TabScreen>
  );
}
