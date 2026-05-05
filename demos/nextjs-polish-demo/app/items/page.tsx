import { getItems } from "@/lib/items";
import { ItemsContent } from "./ItemsContent";

export default function ItemsPage() {
  const items = getItems();
  return <ItemsContent items={items} />;
}
