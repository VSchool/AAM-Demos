export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

export const items: Item[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    category: "Input Devices",
    price: 49.99,
    description:
      "Ergonomic wireless mouse with precision tracking and silent clicks. Connects via Bluetooth or USB-C dongle with up to 60 days of battery life.",
    inStock: true,
  },
  {
    id: "2",
    name: "USB-C Hub",
    category: "Connectivity",
    price: 79.99,
    description:
      "7-in-1 hub with HDMI, SD card, USB-A, and power delivery passthrough. Machined aluminum shell dissipates heat during heavy file transfers.",
    inStock: true,
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    category: "Input Devices",
    price: 129.99,
    description:
      "Compact 75% layout with hot-swappable switches and per-key RGB lighting. PBT double-shot keycaps resist shine and feel great after months of use.",
    inStock: true,
  },
  {
    id: "4",
    name: "Monitor Stand",
    category: "Ergonomics",
    price: 39.99,
    description:
      "Adjustable monitor riser with built-in cable management and storage drawer. Raises your screen to eye level to reduce neck strain.",
    inStock: false,
  },
  {
    id: "5",
    name: "Webcam",
    category: "Video",
    price: 89.99,
    description:
      "1080p wide-angle webcam with auto-focus and built-in ring light. Works instantly with Zoom, Teams, and Google Meet without installing drivers.",
    inStock: true,
  },
  {
    id: "6",
    name: "Desk Lamp",
    category: "Lighting",
    price: 59.99,
    description:
      "LED desk lamp with five color temperatures and stepless dimming. The flexible arm positions light exactly where you need it.",
    inStock: true,
  },
  {
    id: "7",
    name: "Cable Organizer",
    category: "Accessories",
    price: 19.99,
    description:
      "Silicone cable management clips that attach to the edge of any desk. Keeps charging cables, headphones, and peripherals tangle-free.",
    inStock: true,
  },
  {
    id: "8",
    name: "Laptop Stand",
    category: "Ergonomics",
    price: 44.99,
    description:
      "Foldable aluminum laptop stand with six adjustable angles. Collapses flat for travel and supports laptops up to 17 inches.",
    inStock: false,
  },
];

export function getItems(): Item[] {
  return items;
}

export function getItem(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}
