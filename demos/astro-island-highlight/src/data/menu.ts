export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sourdough' | 'pastry' | 'bagel' | 'focaccia';
  tag?: string;
}

export const menu: MenuItem[] = [
  {
    id: 'country-loaf',
    name: 'Country Loaf',
    description: 'Naturally leavened sourdough, 24-hour cold ferment, dark crackling crust.',
    price: 8,
    category: 'sourdough',
    tag: "Maya's pick",
  },
  {
    id: 'walnut-levain',
    name: 'Walnut Levain',
    description: 'Wheat levain folded with toasted black walnuts. Heavy, rustic, faintly bitter.',
    price: 9,
    category: 'sourdough',
  },
  {
    id: 'seeded-rye',
    name: 'Seeded Rye',
    description: 'Whole rye, caraway, fennel, flax. Dense crumb. Holds a smear of butter.',
    price: 8,
    category: 'sourdough',
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    description: 'Laminated butter dough wrapped around two batons of 70% Valrhona.',
    price: 4.5,
    category: 'pastry',
  },
  {
    id: 'cinnamon-roll',
    name: 'Cinnamon Roll',
    description: 'Brioche-based, brown butter glaze, finished with Maldon flakes.',
    price: 5,
    category: 'pastry',
    tag: 'Sat + Sun only',
  },
  {
    id: 'lemon-tart',
    name: 'Lemon Tart',
    description: 'Sablé crust, Meyer lemon curd, torched Italian meringue.',
    price: 6,
    category: 'pastry',
  },
  {
    id: 'sesame-bagel',
    name: 'Sesame Bagel',
    description: 'Boiled in barley malt water, baked dark, crusted in toasted sesame.',
    price: 3,
    category: 'bagel',
  },
  {
    id: 'olive-focaccia',
    name: 'Olive Focaccia',
    description: 'Castelvetrano olives, rosemary, finishing salt. Sold by the slab.',
    price: 7,
    category: 'focaccia',
  },
];
