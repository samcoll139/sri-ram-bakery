// Mock product catalogue for Sriram Cakes & Sweets Shop.
// Replace with API-backed data once the Spring Boot backend is connected
// (see src/services/api.js -> getProducts()).

export const CATEGORIES = [
  { id: 'cakes', name: 'Cakes', emoji: '🎂', image: '/images/category-cakes.jpg' },
  { id: 'sweets', name: 'Traditional Sweets', emoji: '🍬', image: '/images/category-sweets.jpg' },
  { id: 'savouries', name: 'Savouries', emoji: '🥨', image: '/images/category-savouries.jpg' },
  { id: 'nuts', name: 'Nuts', emoji: '🥜', image: '/images/category-nuts.jpg' },
  { id: 'cookies', name: 'Cookies', emoji: '🍪', image: '/images/category-cookies.jpg' },
  { id: 'bakery', name: 'Bakery Items', emoji: '🥐', image: '/images/category-bakery.jpg' },
  { id: 'icecreams', name: 'Ice Creams', emoji: '🍦', image: '/images/dobcone.png' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤', image: '/images/pepsi.jpg' },
  { id: 'desserts', name: 'Premium Desserts', emoji: '🍮', image: '/images/red-velvet-cake.jpg' },
  { id: 'hampers', name: 'Gift Hampers', emoji: '🎁', image: '/images/kaju-katli.jpg' },
];

function withFinalPrice(p) {
  const finalPrice = Math.round(p.originalPrice * (1 - p.discount / 100));
  return { ...p, finalPrice };
}

const raw = [
  // CAKES
  {
    id: 1, name: 'Chocolate Truffle Cake', category: 'cakes',
    description: 'Rich layers of chocolate sponge soaked in cocoa syrup, finished with silky truffle ganache.',
    ingredients: ['Cocoa', 'Dark chocolate', 'Fresh cream', 'Butter', 'Sugar', 'Wheat flour'],
    image: '/images/chocolate-truffle-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.8, reviews: 142, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 18,
    tags: ['chocolate', 'birthday', 'bestseller', 'eggless-available'],
  },
  {
    id: 2, name: 'Black Forest Cake', category: 'cakes',
    description: 'Classic sponge layered with cherries and whipped cream, topped with chocolate shavings.',
    ingredients: ['Chocolate sponge', 'Cherries', 'Fresh cream', 'Chocolate shavings'],
    image: '/images/black-forest-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.7, reviews: 118, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 22,
    tags: ['chocolate', 'classic', 'birthday'],
  },
  {
    id: 3, name: 'Red Velvet Cake', category: 'cakes',
    description: 'Velvety cocoa sponge with a hint of vanilla, layered with cream-cheese frosting.',
    ingredients: ['Cocoa', 'Buttermilk', 'Cream cheese', 'Vanilla', 'Beetroot colour'],
    image: '/images/red-velvet-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.9, reviews: 96, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 12,
    tags: ['premium', 'anniversary', 'bestseller'],
  },
  {
    id: 4, name: 'Butterscotch Cake', category: 'cakes',
    description: 'Soft vanilla sponge with caramelised butterscotch chips and praline crunch.',
    ingredients: ['Butterscotch chips', 'Praline', 'Fresh cream', 'Vanilla sponge'],
    image: '/images/butterscotch-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.6, reviews: 87, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 20,
    tags: ['caramel', 'kids-favourite'],
  },
  {
    id: 5, name: 'Vanilla Cake', category: 'cakes',
    description: 'Light, fluffy vanilla bean sponge with a delicate buttercream finish.',
    ingredients: ['Vanilla bean', 'Butter', 'Fresh cream', 'Wheat flour'],
    image: '/images/vanilla-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.5, reviews: 64, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 25,
    tags: ['classic', 'kids-favourite', 'eggless-available'],
  },
  {
    id: 39, name: 'Pineapple Cake', category: 'cakes',
    description: 'Soft vanilla sponge layered with fresh pineapple chunks and light cream.',
    ingredients: ['Pineapple', 'Fresh cream', 'Vanilla sponge', 'Sugar'],
    image: '/images/pineapple-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.5, reviews: 52, manufacturingDate: '2026-09-01', expiryDate: '2026-09-04', stock: 20,
    tags: ['fruit', 'classic'],
  },
  {
    id: 40, name: 'Fruit Cake', category: 'cakes',
    description: 'Rich sponge studded with candied fruits and a hint of spice.',
    ingredients: ['Mixed candied fruit', 'Butter', 'Wheat flour', 'Spices'],
    image: '/images/fruit-cake.jpg', originalPrice: 450, discount: 0, weight: '500 g',
    rating: 4.4, reviews: 38, manufacturingDate: '2026-09-01', expiryDate: '2026-09-06', stock: 18,
    tags: ['festival', 'gift'],
  },

  // TRADITIONAL SWEETS
  {
    id: 6, name: 'Mysore Pak', category: 'sweets',
    description: 'Melt-in-the-mouth gram flour sweet, slow-roasted in ghee the traditional way.',
    ingredients: ['Gram flour', 'Ghee', 'Sugar'],
    image: '/images/mysore-pak.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.8, reviews: 203, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 40,
    tags: ['ghee-sweet', 'festival', 'bestseller'],
  },
  {
    id: 7, name: 'Kaju Katli', category: 'sweets',
    description: 'Diamond-cut cashew fudge finished with a delicate silver leaf.',
    ingredients: ['Cashew', 'Sugar', 'Silver leaf', 'Cardamom'],
    image: '/images/kaju-katli.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.9, reviews: 256, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 30,
    tags: ['premium', 'festival', 'bestseller', 'gift'],
  },
  {
    id: 8, name: 'Gulab Jamun', category: 'sweets',
    description: 'Soft khoya dumplings soaked in fragrant rose and cardamom syrup.',
    ingredients: ['Khoya', 'Sugar syrup', 'Rose water', 'Cardamom'],
    image: '/images/gulab-jamun.jpg', originalPrice: 200, discount: 0, weight: '500 g (12 pcs)',
    rating: 4.7, reviews: 189, manufacturingDate: '2026-09-01', expiryDate: '2026-09-06', stock: 35,
    tags: ['syrup-sweet', 'festival', 'wedding'],
  },
  {
    id: 9, name: 'Laddu', category: 'sweets',
    description: 'Classic besan laddu rolled with ghee, cardamom and roasted nuts.',
    ingredients: ['Gram flour', 'Ghee', 'Cardamom', 'Cashew', 'Sugar'],
    image: '/images/laddu.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.6, reviews: 154, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 45,
    tags: ['ghee-sweet', 'festival'],
  },
  {
    id: 10, name: 'Jangiri', category: 'sweets',
    description: 'Crisp urad dal spirals soaked in saffron-scented sugar syrup.',
    ingredients: ['Urad dal', 'Sugar syrup', 'Saffron', 'Ghee'],
    image: '/images/jangiri.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 71, manufacturingDate: '2026-09-01', expiryDate: '2026-09-08', stock: 28,
    tags: ['syrup-sweet', 'festival'],
  },
  {
    id: 25, name: 'Rasagulla', category: 'sweets',
    description: 'Soft, spongy cottage-cheese balls soaked in light sugar syrup.',
    ingredients: ['Cottage cheese', 'Sugar syrup', 'Cardamom'],
    image: '/images/rasagulla.jpg', originalPrice: 200, discount: 0, weight: '500 g (8 pcs)',
    rating: 4.6, reviews: 84, manufacturingDate: '2026-09-01', expiryDate: '2026-09-06', stock: 32,
    tags: ['syrup-sweet', 'festival', 'wedding'],
  },
  {
    id: 26, name: 'Motichoor Ladoo', category: 'sweets',
    description: 'Tiny gram-flour pearls bound with ghee and sugar syrup into a soft, melt-in-mouth ladoo.',
    ingredients: ['Gram flour', 'Ghee', 'Sugar syrup', 'Cardamom'],
    image: '/images/Motichoor-Ladoo.webp', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.7, reviews: 102, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 38,
    tags: ['ghee-sweet', 'festival', 'bestseller'],
  },
  {
    id: 27, name: 'Soan Papdi', category: 'sweets',
    description: 'Flaky, melt-in-the-mouth gram flour and sugar strands layered into delicate squares.',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cardamom'],
    image: '/images/soanpapdi.webp', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 63, manufacturingDate: '2026-08-30', expiryDate: '2026-09-20', stock: 35,
    tags: ['festival', 'gift'],
  },
  {
    id: 28, name: 'Inippu Sev', category: 'sweets',
    description: 'A sweet take on classic sev — fine gram-flour strands cooked with jaggery and cardamom.',
    ingredients: ['Gram flour', 'Jaggery', 'Ghee', 'Cardamom'],
    image: '/images/inippu-sev.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.4, reviews: 41, manufacturingDate: '2026-08-30', expiryDate: '2026-09-20', stock: 30,
    tags: ['festival'],
  },
  {
    id: 41, name: 'Badam Halwa', category: 'sweets',
    description: 'Rich, ghee-laden almond halwa with a deep, nutty sweetness.',
    ingredients: ['Almonds', 'Ghee', 'Sugar', 'Cardamom'],
    image: '/images/badam-halwa.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.7, reviews: 59, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 24,
    tags: ['ghee-sweet', 'premium', 'gift'],
  },
  {
    id: 42, name: 'Adhirasam', category: 'sweets',
    description: 'Traditional jaggery and rice-flour fried sweet with a chewy, syrupy centre.',
    ingredients: ['Rice flour', 'Jaggery', 'Cardamom', 'Ghee'],
    image: '/images/adhirasam.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 47, manufacturingDate: '2026-08-30', expiryDate: '2026-09-13', stock: 28,
    tags: ['festival', 'ghee-sweet'],
  },

  // SAVOURIES
  {
    id: 11, name: 'Mixture', category: 'savouries',
    description: 'A crunchy, spiced blend of sev, peanuts, curry leaves and fried lentils.',
    ingredients: ['Gram flour', 'Peanuts', 'Curry leaves', 'Spices'],
    image: '/images/mixture.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 132, manufacturingDate: '2026-08-28', expiryDate: '2026-09-27', stock: 50,
    tags: ['spicy', 'tea-time', 'bestseller'],
  },
  {
    id: 12, name: 'Murukku', category: 'savouries',
    description: 'Crisp, spiral-shaped rice-flour snack seasoned with cumin and sesame.',
    ingredients: ['Rice flour', 'Urad dal flour', 'Cumin', 'Sesame'],
    image: '/images/murukku.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.6, reviews: 98, manufacturingDate: '2026-08-28', expiryDate: '2026-09-27', stock: 42,
    tags: ['tea-time', 'festival'],
  },
  {
    id: 13, name: 'Kara Sev', category: 'savouries',
    description: 'Fine, spicy gram-flour strands fried to a golden crunch.',
    ingredients: ['Gram flour', 'Red chilli', 'Asafoetida'],
    image: '/images/kara-sev.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.4, reviews: 60, manufacturingDate: '2026-08-28', expiryDate: '2026-09-27', stock: 38,
    tags: ['spicy', 'tea-time'],
  },
  {
    id: 14, name: 'Ribbon Pakoda', category: 'savouries',
    description: 'Thin, ribbon-shaped crisps made from rice and gram flour with a mild spice kick.',
    ingredients: ['Rice flour', 'Gram flour', 'Butter', 'Chilli powder'],
    image: '/images/ribbon-pakoda.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 55, manufacturingDate: '2026-08-28', expiryDate: '2026-09-27', stock: 36,
    tags: ['tea-time', 'kids-favourite'],
  },
  {
    id: 29, name: 'Banana Chips', category: 'savouries',
    description: 'Thin-sliced raw bananas, deep-fried to a crisp golden crunch and lightly salted.',
    ingredients: ['Raw banana', 'Coconut oil', 'Salt', 'Turmeric'],
    image: '/images/banana-chips-1.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 68, manufacturingDate: '2026-08-28', expiryDate: '2026-10-28', stock: 45,
    tags: ['spicy', 'tea-time'],
  },
  {
    id: 43, name: 'Thattai', category: 'savouries',
    description: 'Crisp, spiced rice-flour discs with a satisfying crunch — a South Indian tea-time classic.',
    ingredients: ['Rice flour', 'Urad dal', 'Curry leaves', 'Chilli'],
    image: '/images/thattai.jpg', originalPrice: 50, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 44, manufacturingDate: '2026-08-28', expiryDate: '2026-09-27', stock: 40,
    tags: ['tea-time', 'festival'],
  },

  // NUTS
  {
    id: 15, name: 'Cashew Nuts', category: 'nuts',
    description: 'Whole, premium-grade roasted cashews — lightly salted.',
    ingredients: ['Cashew', 'Salt'],
    image: '/images/cashew-nuts.jpg', originalPrice: 899, discount: 10, weight: '500 g',
    rating: 4.8, reviews: 174, manufacturingDate: '2026-08-15', expiryDate: '2026-11-15', stock: 60,
    tags: ['healthy', 'gift', 'bestseller'],
  },
  {
    id: 16, name: 'Almonds', category: 'nuts',
    description: 'California almonds, sun-dried and naturally rich in flavour.',
    ingredients: ['Almonds'],
    image: '/images/almonds.jpg', originalPrice: 799, discount: 8, weight: '500 g',
    rating: 4.7, reviews: 140, manufacturingDate: '2026-08-15', expiryDate: '2026-11-15', stock: 55,
    tags: ['healthy', 'gift'],
  },
  {
    id: 17, name: 'Pistachios', category: 'nuts',
    description: 'Roasted pistachios with a delicate crack and rich, buttery flavour.',
    ingredients: ['Pistachios', 'Salt'],
    image: '/images/pistachios.jpg', originalPrice: 999, discount: 12, weight: '500 g',
    rating: 4.8, reviews: 88, manufacturingDate: '2026-08-15', expiryDate: '2026-11-15', stock: 30,
    tags: ['premium', 'gift'],
  },
  {
    id: 45, name: 'Walnuts', category: 'nuts',
    description: 'Whole, fresh walnut halves — rich in flavour and satisfyingly crunchy.',
    ingredients: ['Walnuts'],
    image: '/images/walnuts.jpg', originalPrice: 849, discount: 8, weight: '500 g',
    rating: 4.6, reviews: 52, manufacturingDate: '2026-08-15', expiryDate: '2026-11-15', stock: 34,
    tags: ['healthy', 'gift'],
  },

  // COOKIES
  {
    id: 18, name: 'Butter Cookies', category: 'cookies',
    description: 'Crumbly, all-butter cookies baked golden with a light vanilla note.',
    ingredients: ['Butter', 'Wheat flour', 'Sugar', 'Vanilla'],
    image: '/images/butter-cookies.jpg', originalPrice: 220, discount: 10, weight: '250 g',
    rating: 4.6, reviews: 110, manufacturingDate: '2026-08-25', expiryDate: '2026-09-25', stock: 48,
    tags: ['tea-time', 'kids-favourite'],
  },
  {
    id: 19, name: 'Chocolate Cookies', category: 'cookies',
    description: 'Double chocolate cookies loaded with dark chocolate chunks.',
    ingredients: ['Cocoa', 'Dark chocolate chips', 'Butter', 'Wheat flour'],
    image: '/images/chocolate-cookies.jpg', originalPrice: 250, discount: 12, weight: '250 g',
    rating: 4.7, reviews: 133, manufacturingDate: '2026-08-25', expiryDate: '2026-09-25', stock: 40,
    tags: ['chocolate', 'kids-favourite', 'bestseller'],
  },
  {
    id: 20, name: 'Coconut Cookies', category: 'cookies',
    description: 'Crisp cookies packed with desiccated coconut for a nutty bite.',
    ingredients: ['Desiccated coconut', 'Butter', 'Wheat flour', 'Sugar'],
    image: '/images/coconut-cookies.jpg', originalPrice: 210, discount: 8, weight: '250 g',
    rating: 4.4, reviews: 47, manufacturingDate: '2026-08-25', expiryDate: '2026-09-25', stock: 33,
    tags: ['tea-time'],
  },
  {
    id: 46, name: 'Oats Cookies', category: 'cookies',
    description: 'Wholesome oat cookies with a lightly chewy centre — a healthier tea-time bite.',
    ingredients: ['Rolled oats', 'Butter', 'Jaggery', 'Wheat flour'],
    image: '/images/oats-cookies.jpg', originalPrice: 230, discount: 5, weight: '250 g',
    rating: 4.5, reviews: 39, manufacturingDate: '2026-08-25', expiryDate: '2026-09-25', stock: 30,
    tags: ['healthy', 'tea-time'],
  },

  // BAKERY ITEMS
  {
    id: 21, name: 'Veg Puff', category: 'bakery',
    description: 'Flaky, golden puff pastry filled with a lightly spiced vegetable stuffing.',
    ingredients: ['Puff pastry', 'Mixed vegetables', 'Spices'],
    image: '/images/veg-puff.jpg', originalPrice: 40, discount: 0, weight: '1 pc',
    rating: 4.5, reviews: 210, manufacturingDate: '2026-09-02', expiryDate: '2026-09-03', stock: 80,
    tags: ['snack', 'bestseller'],
  },
  {
    id: 22, name: 'Fresh Bread', category: 'bakery',
    description: 'Soft, daily-baked white bread loaf, perfect for breakfast.',
    ingredients: ['Wheat flour', 'Yeast', 'Milk', 'Butter'],
    image: '/images/fresh-bread.jpg', originalPrice: 55, discount: 0, weight: '400 g',
    rating: 4.3, reviews: 90, manufacturingDate: '2026-09-02', expiryDate: '2026-09-05', stock: 60,
    tags: ['daily-fresh', 'breakfast'],
  },
  {
    id: 23, name: 'Donuts', category: 'bakery',
    description: 'Soft, fried donuts glazed with a chocolate or sugar coating.',
    ingredients: ['Wheat flour', 'Sugar glaze', 'Chocolate coating', 'Yeast'],
    image: '/images/donuts.jpg', originalPrice: 60, discount: 0, weight: '1 pc',
    rating: 4.6, reviews: 122, manufacturingDate: '2026-09-02', expiryDate: '2026-09-04', stock: 70,
    tags: ['kids-favourite', 'snack'],
  },
  {
    id: 24, name: 'Cream Bun', category: 'bakery',
    description: 'Fluffy bun filled generously with sweetened whipped cream.',
    ingredients: ['Wheat flour', 'Fresh cream', 'Sugar', 'Yeast'],
    image: '/images/cream-bun.jpg', originalPrice: 45, discount: 0, weight: '1 pc',
    rating: 4.4, reviews: 76, manufacturingDate: '2026-09-02', expiryDate: '2026-09-04', stock: 65,
    tags: ['kids-favourite', 'snack'],
  },
  {
    id: 47, name: 'Bread Rolls', category: 'bakery',
    description: 'Soft dinner rolls, baked fresh daily — perfect alongside any meal.',
    ingredients: ['Wheat flour', 'Butter', 'Yeast', 'Milk'],
    image: '/images/bread-rolls.jpg', originalPrice: 50, discount: 0, weight: '4 pcs',
    rating: 4.3, reviews: 34, manufacturingDate: '2026-09-02', expiryDate: '2026-09-05', stock: 50,
    tags: ['daily-fresh'],
  },

  // ICE CREAMS
  {
    id: 30, name: 'Butterscotch Ice Cream', category: 'icecreams',
    description: 'Creamy butterscotch ice cream loaded with crunchy caramelised nut brittle.',
    ingredients: ['Milk', 'Cream', 'Butterscotch chips', 'Sugar'],
    image: '/images/butterscotchice.jpg', originalPrice: 70, discount: 0, weight: '1 cup',
    rating: 4.5, reviews: 58, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 50,
    tags: ['dessert', 'kids-favourite'],
  },
  {
    id: 31, name: 'Chocolate Ice Cream Cup', category: 'icecreams',
    description: 'Rich, double-chocolate ice cream served in a convenient cup.',
    ingredients: ['Milk', 'Cream', 'Cocoa', 'Sugar'],
    image: '/images/chocoice.jpg', originalPrice: 75, discount: 0, weight: '1 cup',
    rating: 4.6, reviews: 71, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 48,
    tags: ['chocolate', 'kids-favourite', 'bestseller'],
  },
  {
    id: 32, name: 'Choco Bar', category: 'icecreams',
    description: 'Classic vanilla ice cream bar coated in a crackling chocolate shell.',
    ingredients: ['Milk', 'Cream', 'Chocolate coating', 'Sugar'],
    image: '/images/chice.jpg', originalPrice: 50, discount: 0, weight: '1 pc',
    rating: 4.5, reviews: 49, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 55,
    tags: ['chocolate', 'kids-favourite'],
  },
  {
    id: 33, name: 'Coconut Ice Cream', category: 'icecreams',
    description: 'Delicately sweet ice cream made with real coconut milk and shredded coconut.',
    ingredients: ['Coconut milk', 'Cream', 'Sugar', 'Shredded coconut'],
    image: '/images/coc.webp', originalPrice: 65, discount: 0, weight: '1 cup',
    rating: 4.4, reviews: 33, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 40,
    tags: ['dessert'],
  },
  {
    id: 34, name: 'Double Scoop Cone', category: 'icecreams',
    description: 'Two generous scoops of your favourite flavours piled onto a crisp waffle cone.',
    ingredients: ['Milk', 'Cream', 'Sugar', 'Waffle cone'],
    image: '/images/dobcone.png', originalPrice: 90, discount: 0, weight: '1 cone',
    rating: 4.7, reviews: 62, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 36,
    tags: ['bestseller', 'kids-favourite'],
  },
  {
    id: 35, name: 'Strawberry Cone', category: 'icecreams',
    description: 'Fresh strawberry ice cream swirled onto a crunchy waffle cone.',
    ingredients: ['Milk', 'Cream', 'Strawberry', 'Sugar', 'Waffle cone'],
    image: '/images/strawcone.jpg', originalPrice: 70, discount: 0, weight: '1 cone',
    rating: 4.5, reviews: 40, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 42,
    tags: ['kids-favourite'],
  },
  {
    id: 36, name: 'Strawberry Ice Cream Cup', category: 'icecreams',
    description: 'Light and fruity strawberry ice cream, made with real fruit puree.',
    ingredients: ['Milk', 'Cream', 'Strawberry puree', 'Sugar'],
    image: '/images/strawice.jpg', originalPrice: 60, discount: 0, weight: '1 cup',
    rating: 4.4, reviews: 37, manufacturingDate: '2026-09-05', expiryDate: '2027-03-05', stock: 44,
    tags: ['dessert'],
  },

  // BEVERAGES
  {
    id: 37, name: 'Pepsi', category: 'beverages',
    description: 'Chilled, refreshing cola — perfect alongside a spicy snack.',
    ingredients: ['Carbonated water', 'Sugar', 'Cola concentrate'],
    image: '/images/pepsi.jpg', originalPrice: 40, discount: 0, weight: '750 ml',
    rating: 4.3, reviews: 29, manufacturingDate: '2026-08-20', expiryDate: '2027-02-20', stock: 80,
    tags: ['cold-drink'],
  },
  {
    id: 38, name: 'Sprite', category: 'beverages',
    description: 'Crisp, lemon-lime soda served chilled.',
    ingredients: ['Carbonated water', 'Sugar', 'Lemon-lime flavouring'],
    image: '/images/sprite.avif', originalPrice: 40, discount: 0, weight: '750 ml',
    rating: 4.2, reviews: 24, manufacturingDate: '2026-08-20', expiryDate: '2027-02-20', stock: 80,
    tags: ['cold-drink'],
  },

  // PREMIUM DESSERTS
  {
    id: 48, name: 'Belgian Chocolate Mousse', category: 'desserts',
    description: 'Silky Belgian dark-chocolate mousse layered in a glass, finished with cocoa shavings.',
    ingredients: ['Belgian dark chocolate', 'Fresh cream', 'Eggs', 'Sugar'],
    image: '/images/black-forest-cake.jpg', originalPrice: 179, discount: 5, weight: '150 g cup',
    rating: 4.7, reviews: 41, manufacturingDate: '2026-09-13', expiryDate: '2026-09-15', stock: 24,
    tags: ['premium', 'french', 'chilled'],
  },
  {
    id: 49, name: 'Classic Tiramisu Cup', category: 'desserts',
    description: 'Espresso-soaked sponge layered with mascarpone cream and a dusting of cocoa.',
    ingredients: ['Mascarpone cream', 'Coffee', 'Sponge fingers', 'Cocoa powder'],
    image: '/images/vanilla-cake.jpg', originalPrice: 199, discount: 0, weight: '150 g cup',
    rating: 4.8, reviews: 33, manufacturingDate: '2026-09-13', expiryDate: '2026-09-15', stock: 20,
    tags: ['premium', 'french', 'chilled', 'bestseller'],
  },
  {
    id: 50, name: 'Blueberry Cheesecake Slice', category: 'desserts',
    description: 'Baked cream-cheese cheesecake on a biscuit base, topped with blueberry compote.',
    ingredients: ['Cream cheese', 'Digestive biscuit', 'Blueberry compote', 'Fresh cream'],
    image: '/images/red-velvet-cake.jpg', originalPrice: 25, discount: 0, weight: '120 g slice',
    rating: 4.6, reviews: 27, manufacturingDate: '2026-09-13', expiryDate: '2026-09-16', stock: 16,
    tags: ['premium', 'fruit', 'chilled'],
  },
  {
    id: 51, name: 'French Choux Pastry Box', category: 'desserts',
    description: 'Delicate choux buns filled with vanilla custard cream, boxed for gifting.',
    ingredients: ['Choux pastry', 'Vanilla custard', 'Fresh cream', 'Icing sugar'],
    image: '/images/cream-bun.jpg', originalPrice: 249, discount: 10, weight: 'Box of 4',
    rating: 4.5, reviews: 19, manufacturingDate: '2026-09-13', expiryDate: '2026-09-15', stock: 14,
    tags: ['premium', 'french', 'gift'],
  },

  // GIFT HAMPERS
  {
    id: 52, name: 'Festive Sweets Hamper', category: 'hampers',
    description: 'An assorted box of our best-loved traditional sweets, packed for gifting.',
    ingredients: ['Assorted sweets', 'Ghee', 'Dry fruits', 'Sugar'],
    image: '/images/kaju-katli.jpg', originalPrice: 899, discount: 15, weight: '1 kg box',
    rating: 4.8, reviews: 56, manufacturingDate: '2026-09-10', expiryDate: '2026-09-24', stock: 12,
    tags: ['gift', 'festival', 'bestseller'],
  },
  {
    id: 53, name: 'Dry Fruit Gift Box', category: 'hampers',
    description: 'Premium almonds, cashews, pistachios and walnuts arranged in a gifting tray.',
    ingredients: ['Almonds', 'Cashews', 'Pistachios', 'Walnuts'],
    image: '/images/almonds.jpg', originalPrice: 1099, discount: 10, weight: '750 g box',
    rating: 4.9, reviews: 38, manufacturingDate: '2026-09-10', expiryDate: '2027-03-10', stock: 10,
    tags: ['gift', 'premium', 'nuts'],
  },
  {
    id: 54, name: 'Celebration Cookie Hamper', category: 'hampers',
    description: 'A mix of butter, chocolate and oats cookies in a decorative gift tin.',
    ingredients: ['Butter cookies', 'Chocolate cookies', 'Oats cookies'],
    image: '/images/coconut-cookies.jpg', originalPrice: 549, discount: 12, weight: '500 g tin',
    rating: 4.6, reviews: 22, manufacturingDate: '2026-09-11', expiryDate: '2026-10-11', stock: 18,
    tags: ['gift', 'cookies', 'kids-favourite'],
  },
  {
    id: 55, name: 'Diwali Assorted Hamper', category: 'hampers',
    description: 'A generous mix of sweets, savouries and dry fruits for the festive season.',
    ingredients: ['Assorted sweets', 'Savouries', 'Dry fruits'],
    image: '/images/soanpapdi.webp', originalPrice: 1299, discount: 18, weight: '1.5 kg box',
    rating: 4.7, reviews: 44, manufacturingDate: '2026-09-10', expiryDate: '2026-09-25', stock: 8,
    tags: ['gift', 'festival', 'bestseller'],
  },

  // EXTRA SWEETS — added from the new product image pack
  {
    id: 56, name: 'Achumurukku', category: 'sweets',
    description: 'Traditional South Indian sweet murukku with a crisp texture and festive flavour.',
    ingredients: ['Rice flour', 'Jaggery', 'Cardamom', 'Ghee'],
    image: '/images/achumuruku.jfif', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 34, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 30,
    tags: ['traditional', 'festival', 'sweet'],
  },
  {
    id: 57, name: 'Badhusa', category: 'sweets',
    description: 'Flaky, layered traditional sweet made with flour, sugar syrup and ghee.',
    ingredients: ['Wheat flour', 'Sugar', 'Ghee', 'Curd'],
    image: '/images/badhusa.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.6, reviews: 42, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 28,
    tags: ['traditional', 'festival'],
  },
  {
    id: 58, name: 'Boondi', category: 'sweets',
    description: 'Tiny golden gram-flour pearls prepared in fragrant sugar syrup.',
    ingredients: ['Gram flour', 'Sugar syrup', 'Cardamom', 'Ghee'],
    image: '/images/boondi.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 39, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 32,
    tags: ['traditional', 'festival'],
  },
  {
    id: 59, name: 'Cham Cham', category: 'sweets',
    description: 'Soft Bengali-style milk sweet soaked in light syrup and finished with a delicate filling.',
    ingredients: ['Milk', 'Sugar syrup', 'Paneer', 'Cardamom'],
    image: '/images/chamcham.webp', originalPrice: 200, discount: 0, weight: '500 g',
    rating: 4.6, reviews: 31, manufacturingDate: '2026-09-20', expiryDate: '2026-09-24', stock: 24,
    tags: ['milk-sweet', 'dessert'],
  },
  {
    id: 60, name: 'Coconut Barfi', category: 'sweets',
    description: 'Soft coconut fudge made with milk, sugar and fragrant cardamom.',
    ingredients: ['Coconut', 'Milk', 'Sugar', 'Cardamom'],
    image: '/images/cocobarfi.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 36, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 27,
    tags: ['coconut', 'milk-sweet', 'festival'],
  },
  {
    id: 61, name: 'Halwa', category: 'sweets',
    description: 'Rich, glossy traditional halwa with a soft texture and aromatic sweetness.',
    ingredients: ['Semolina', 'Ghee', 'Sugar', 'Cardamom'],
    image: '/images/halwa.webp', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.6, reviews: 45, manufacturingDate: '2026-09-20', expiryDate: '2026-09-27', stock: 25,
    tags: ['traditional', 'ghee-sweet'],
  },
  {
    id: 62, name: 'Malpua', category: 'sweets',
    description: 'Golden, soft traditional pancakes soaked in sweet syrup and lightly flavoured with cardamom.',
    ingredients: ['Wheat flour', 'Milk', 'Sugar', 'Cardamom'],
    image: '/images/malpua.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 28, manufacturingDate: '2026-09-20', expiryDate: '2026-09-25', stock: 22,
    tags: ['traditional', 'dessert'],
  },
  {
    id: 63, name: 'Milk Barfi', category: 'sweets',
    description: 'Creamy milk fudge finished with cardamom for a classic festive taste.',
    ingredients: ['Milk powder', 'Milk', 'Sugar', 'Cardamom'],
    image: '/images/milkbarfi.jpeg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.7, reviews: 51, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 26,
    tags: ['milk-sweet', 'premium', 'festival'],
  },
  {
    id: 64, name: 'Neyyappam', category: 'sweets',
    description: 'Soft, aromatic traditional rice-flour sweet with jaggery and ghee.',
    ingredients: ['Rice flour', 'Jaggery', 'Ghee', 'Cardamom'],
    image: '/images/nayyappam.jfif', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.5, reviews: 29, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 24,
    tags: ['traditional', 'jaggery', 'festival'],
  },
  {
    id: 65, name: 'Peda', category: 'sweets',
    description: 'Rich and creamy milk-based sweet with a soft, melt-in-the-mouth texture.',
    ingredients: ['Milk', 'Milk powder', 'Sugar', 'Cardamom'],
    image: '/images/peda.jpg', originalPrice: 100, discount: 0, weight: '250 g',
    rating: 4.6, reviews: 37, manufacturingDate: '2026-09-20', expiryDate: '2026-10-04', stock: 30,
    tags: ['milk-sweet', 'festival'],
  },
  {
    id: 66, name: 'Puran Poli', category: 'sweets',
    description: 'Soft flatbread filled with sweet lentil and jaggery stuffing, served as a festive favourite.',
    ingredients: ['Chana dal', 'Jaggery', 'Wheat flour', 'Cardamom'],
    image: '/images/puranpoli.JPG', originalPrice: 100, discount: 0, weight: '4 pcs',
    rating: 4.5, reviews: 33, manufacturingDate: '2026-09-20', expiryDate: '2026-09-24', stock: 20,
    tags: ['traditional', 'festival'],
  },
  {
    id: 67, name: 'Rasmalai', category: 'sweets',
    description: 'Soft cottage-cheese dumplings served in chilled saffron-cardamom milk.',
    ingredients: ['Milk', 'Paneer', 'Sugar', 'Saffron', 'Cardamom'],
    image: '/images/rasamalai.jfif', originalPrice: 60, discount: 0, weight: '500 g',
    rating: 4.8, reviews: 57, manufacturingDate: '2026-09-20', expiryDate: '2026-09-23', stock: 18,
    tags: ['milk-sweet', 'premium', 'dessert'],
  },


  // NEW SAVOURIES
  { id: 1001, name: 'Onion Pagoda', category: 'savouries', description: 'Crispy onion fritters seasoned with aromatic spices and curry leaves.', ingredients: ['Onion', 'Gram flour', 'Spices', 'Curry leaves'], image: '/images/onion-pagoda.jpg', originalPrice: 120, discount: 0, weight: '250 g', rating: 4.7, reviews: 34, manufacturingDate: '2026-09-29', expiryDate: '2026-10-13', stock: 30, tags: ['savoury', 'bestseller', 'new'] },
  { id: 1002, name: 'Masala Pagoda', category: 'savouries', description: 'Crunchy, spicy pagoda made with gram flour and a traditional masala blend.', ingredients: ['Gram flour', 'Chilli', 'Spices', 'Curry leaves'], image: '/images/masala-pagoda.jpg', originalPrice: 120, discount: 0, weight: '250 g', rating: 4.7, reviews: 29, manufacturingDate: '2026-09-29', expiryDate: '2026-10-13', stock: 28, tags: ['savoury', 'spicy', 'new'] },
  { id: 1003, name: 'Potato Chips', category: 'savouries', description: 'Thin, golden potato chips with a satisfying crunch for every snack break.', ingredients: ['Potato', 'Salt', 'Cooking oil'], image: '/images/potato-chips.jpg', originalPrice: 90, discount: 0, weight: '200 g', rating: 4.6, reviews: 41, manufacturingDate: '2026-09-29', expiryDate: '2026-10-29', stock: 45, tags: ['chips', 'new'] },
  { id: 1004, name: 'Sweet Potato Chips', category: 'savouries', description: 'Crispy sweet potato slices with a naturally rich, mildly sweet flavour.', ingredients: ['Sweet potato', 'Salt', 'Cooking oil'], image: '/images/sweet-potato-chips.jpg', originalPrice: 110, discount: 0, weight: '200 g', rating: 4.6, reviews: 25, manufacturingDate: '2026-09-29', expiryDate: '2026-10-29', stock: 35, tags: ['chips', 'new'] },
  { id: 1005, name: 'Salted Potato Chips', category: 'savouries', description: 'Classic lightly salted potato chips, crisp and perfect for tea time.', ingredients: ['Potato', 'Salt', 'Cooking oil'], image: '/images/salted-potato-chips.jpg', originalPrice: 90, discount: 0, weight: '200 g', rating: 4.5, reviews: 22, manufacturingDate: '2026-09-29', expiryDate: '2026-10-29', stock: 40, tags: ['chips', 'new'] },
  { id: 1006, name: 'Masala Kadalai Pakoda', category: 'savouries', description: 'Crunchy gram-based pakoda tossed with bold masala and curry leaves.', ingredients: ['Gram flour', 'Peanuts', 'Chilli', 'Curry leaves'], image: '/images/masala-kadalai-pakoda.jpg', originalPrice: 130, discount: 0, weight: '250 g', rating: 4.8, reviews: 37, manufacturingDate: '2026-09-29', expiryDate: '2026-10-13', stock: 32, tags: ['savoury', 'bestseller', 'new'] },
];

export const PRODUCTS = raw.map(withFinalPrice);

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === categoryId);
}

export function getRelatedProducts(product, count = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
}

export function getCategoryProductCount(categoryId) {
  return PRODUCTS.filter((p) => p.category === categoryId).length;
}

export function getBestRated(count = 6) {
  return [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, count);
}

export function getBiggestDiscounts(count = 6) {
  return [...PRODUCTS].sort((a, b) => b.discount - a.discount).slice(0, count);
}
