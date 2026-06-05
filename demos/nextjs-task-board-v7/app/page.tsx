import BoardsHome from "@/components/BoardsHome";

// Home = your boards. (V8 gates this behind login; V7 is frontend-only, so the
// boards live in this browser and there's no sign-in step.)
export default function Home() {
  return <BoardsHome />;
}
