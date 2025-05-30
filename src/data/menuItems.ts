import english from '../components/images/english.jpeg'
import blueberryMuffinImage from '../components/images/blueberry.jpeg'
import icedcoffeImage from '../components/images/icedcoffe.jpeg';
import frappuccinoImage from '../components/images/frapper.jpeg';
import mochaImage from '../components/images/mocha.jpeg';
import icedLatteImage from '../components/images/iced latte.jpeg';


export const menuItems = [
  // Breakfast Items
  {
    id: 'breakfast-1',
    title: 'Full English Breakfast',
    price: 125,
    category: 'breakfast',
    description: 'Two eggs any style, bacon, sausage, grilled tomato, mushrooms, baked beans, and toast',
    image: english,
    allergens: ['eggs', 'gluten']
  },
  {
    id: 'breakfast-2',
    title: 'Eggs Benedict',
    price: 95,
    category: 'breakfast',
    description: 'Poached eggs on English muffin with hollandaise sauce and ham',
    image: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['eggs', 'gluten', 'dairy']
  },
  {
    id: 'breakfast-3',
    title: 'Avocado Toast',
    price: 85,
    category: 'breakfast',
    description: 'Smashed avocado on sourdough toast with poached eggs and microgreens',
    image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['eggs', 'gluten']
  },
  {
    id: 'breakfast-4',
    title: 'Buttermilk Pancakes',
    price: 75,
    category: 'breakfast',
    description: 'Stack of fluffy pancakes served with maple syrup and fresh berries',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['gluten', 'dairy', 'eggs']
  },

  // Pastries
  {
    id: 'pastry-1',
    title: 'Butter Croissant',
    price: 35,
    category: 'pastries',
    description: 'Freshly baked flaky butter croissant',
    image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'pastry-2',
    title: 'Pain au Chocolat',
    price: 40,
    category: 'pastries',
    description: 'Chocolate-filled buttery pastry',
    image: 'https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'pastry-3',
    title: 'Blueberry Muffin',
    price: 38,
    category: 'pastries',
    description: 'Moist muffin filled with fresh blueberries',
    image: blueberryMuffinImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'pastry-4',
    title: 'Cinnamon Roll',
    price: 42,
    category: 'pastries',
    description: 'Soft roll with cinnamon filling and cream cheese frosting',
    image: 'https://images.pexels.com/photos/267308/pexels-photo-267308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['gluten', 'dairy', 'eggs']
  },

  // Hot Beverages
  {
    id: 'hot-1',
    title: 'Espresso',
    price: 25,
    category: 'hot beverages',
    description: 'Single shot of our signature espresso blend',
    image: 'https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: []
  },
  {
    id: 'hot-2',
    title: 'Cappuccino',
    price: 38,
    category: 'hot beverages',
    description: 'Espresso with steamed milk and thick foam',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['dairy']
  },
  {
    id: 'hot-3',
    title: 'Flat White',
    price: 36,
    category: 'hot beverages',
    description: 'Double espresso with velvety steamed milk',
    image: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['dairy']
  },
  {
    id: 'hot-4',
    title: 'Mocha',
    price: 42,
    category: 'hot beverages',
    description: 'Espresso with chocolate and steamed milk, topped with whipped cream',
    image: mochaImage,
    allergens: ['dairy']
  },
  {
    id: 'hot-5',
    title: 'Chai Latte',
    price: 40,
    category: 'hot beverages',
    description: 'Spiced black tea with steamed milk',
    image: 'https://images.pexels.com/photos/3020919/pexels-photo-3020919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: ['dairy']
  },

  // Cold Drinks
  {
    id: 'cold-1',
    title: 'Iced Coffee',
    price: 35,
    category: 'cold drinks',
    description: 'Cold brew coffee served over ice',
    image: icedcoffeImage,
    allergens: []
  },
  {
    id: 'cold-2',
    title: 'Iced Latte',
    price: 42,
    category: 'cold drinks',
    description: 'Espresso with cold milk and ice',
    image: icedLatteImage ,
    allergens: ['dairy']
  },
  {
    id: 'cold-3',
    title: 'Frappuccino',
    price: 48,
    category: 'cold drinks',
    description: 'Blended coffee with ice and cream, topped with whipped cream',
    image: frappuccinoImage ,
    allergens: ['dairy']
  },
  {
    id: 'cold-4',
    title: 'Fresh Orange Juice',
    price: 45,
    category: 'cold drinks',
    description: 'Freshly squeezed orange juice',
    image: 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: []
  },
  {
    id: 'cold-5',
    title: 'Iced Tea',
    price: 32,
    category: 'cold drinks',
    description: 'House-brewed black tea with ice and lemon',
    image: 'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    allergens: []
  }
];