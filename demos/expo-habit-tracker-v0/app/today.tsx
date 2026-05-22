import { View } from "react-native";
import Screen from "@/components/Screen";
import { Eyebrow, H1, Lede } from "@/components/ui";
import { DeviceFrame } from "@/components/instrument";
import TodayInstrument from "@/components/TodayInstrument";
import DemoNote, { NoteCode, NoteText } from "@/components/DemoNote";

export default function Today() {
  return (
    <Screen>
      <Eyebrow>The instrument · /today</Eyebrow>
      <H1>Today.</H1>
      <Lede>
        Each habit is a channel: an indicator LED for today's state, a segment streak readout,
        and a switch you'll throw to complete it. In v0 it's static — a faithful render of the
        instrument in whichever theme is live. Throwing the switch is the v3 lesson.
      </Lede>

      <View style={{ alignItems: "center", marginTop: 8 }}>
        <DeviceFrame width={300}>
          <TodayInstrument />
        </DeviceFrame>
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <DemoNote title="Where this screen's data lives" meta="lib/habits.ts">
          <NoteText>
            The five channels render from <NoteCode>getAll()</NoteCode> in{" "}
            <NoteCode>lib/habits.ts</NoteCode> — typed sample data with status, streak and
            history. The Context store and AsyncStorage arrive at the v2/v4 beats; for now the
            list is read-only and resets on refresh.
          </NoteText>
        </DemoNote>
      </View>
    </Screen>
  );
}
