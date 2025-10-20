import english from '../components/images/english.jpeg'
import blueberryMuffinImage from '../components/images/blueberry.jpeg'
import icedcoffeImage from '../components/images/icedcoffe.jpeg';
import frappuccinoImage from '../components/images/frapper.jpeg';
import mochaImage from '../components/images/mocha.jpeg';
import icedLatteImage from '../components/images/iced latte.jpeg';
import eggbenedictImage from '../components/images/egg ben.jpeg';
import avoSandwichImage from '../components/images/avo sandwitch.jpeg';
import baconBagelImage from '../components/images/bacon bagel.jpeg';
import berryOatsBowlImage from '../components/images/berry oats bowl.jpeg';
import greekYogurtBowlImage from '../components/images/greek yogurt bowl.jpeg';
import sourdoughBasilPestoImage from '../components/images/sourdough basil pesto.jpeg';
import butterCroissantImage from '../components/images/butter cros.jpeg';
import chocolateCakeImage from '../components/images/chocolaate cake.jpeg';
import cinnamonBunsImage from '../components/images/cinammon buns.jpeg';
import chocolateCookiesImage from '../components/images/chocolate cokies.jpeg';
import biscorfSwirlImage from '../components/images/biscorf swirl.jpeg';
import berryCreamCheeseDanishImage from '../components/images/berry cream cheese danish.jpeg';
import darkChocCheeseCakeImage from '../components/images/dark choc cheese cake.jpeg';
import expressoImage from '../components/images/expresso.jpeg';
import capuuImage from '../components/images/capuu.jpeg';
import chaiLatteImage from '../components/images/chai latte.jpeg';
import hotChocImage from '../components/images/hot choc.jpeg';
import greenTeaImage from '../components/images/green tea.jpeg';
import orangeJuiceImage from '../components/images/orange juice.jpeg';
import berryFrappeeImage from '../components/images/berry frappee.jpeg';
import caramelMochaImage from '../components/images/caramel mocha.jpeg';
import icedMatchaLatteImage from '../components/images/iced matcha latte.jpg';
import matchaLatteImage from '../components/images/matcha latte.jpeg';
import berryPancakeImage from '../components/images/berry pancakes.jpeg';

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
    image: eggbenedictImage,
    allergens: ['eggs', 'gluten', 'dairy']
  },
  {
    id: 'breakfast-3',
    title: 'Avocado Toast',
    price: 85,
    category: 'breakfast',
    description: 'Smashed avocado on sourdough toast with poached eggs and microgreens',
    image: avoSandwichImage,
    allergens: ['eggs', 'gluten']
  },
  {
    id: 'breakfast-4',
    title: 'Buttermilk Pancakes',
    price: 75,
    category: 'breakfast',
    description: 'Stack of fluffy pancakes served with maple syrup and fresh berries',
    image: berryPancakeImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'breakfast-5',
    title: 'Sourdough Basil Pesto Sandwich',
    price: 88,
    category: 'breakfast',
    description: 'Toasted sourdough with basil pesto, mozzarella, and fresh tomatoes',
    image: sourdoughBasilPestoImage,
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'breakfast-6',
    title: 'Berry Oats Bowl',
    price: 65,
    category: 'breakfast',
    description: 'Overnight oats with mixed berries, honey, and Greek yogurt',
    image: berryOatsBowlImage,
    allergens: ['dairy']
  },
  {
    id: 'breakfast-7',
    title: 'Bacon Bagel',
    price: 78,
    category: 'breakfast',
    description: 'Toasted bagel with crispy bacon, cream cheese, and avocado',
    image: baconBagelImage,
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'breakfast-8',
    title: 'Greek Yogurt Bowl',
    price: 62,
    category: 'breakfast',
    description: 'Greek yogurt with granola, honey, and seasonal fruits',
    image: greekYogurtBowlImage,
    allergens: ['dairy']
  },

  // Pastries
  {
    id: 'pastry-1',
    title: 'Butter Croissant',
    price: 35,
    category: 'pastries',
    description: 'Freshly baked flaky butter croissant',
    image: butterCroissantImage,
    allergens: ['gluten', 'dairy']
  },
  {
    id: 'pastry-2',
    title: 'Pain au Chocolat',
    price: 40,
    category: 'pastries',
    description: 'Chocolate-filled buttery pastry',
    image: chocolateCakeImage,
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
    image: cinnamonBunsImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'pastry-5',
    title: 'Chocolate Cookies',
    price: 28,
    category: 'pastries',
    description: 'Freshly baked chocolate chip cookies, crispy on the outside, soft inside',
    image: chocolateCookiesImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'pastry-6',
    title: 'Biscorf Swirl',
    price: 45,
    category: 'pastries',
    description: 'Swirled pastry with cinnamon and spice filling',
    image: biscorfSwirlImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'pastry-7',
    title: 'Berry Cream Cheese Danish',
    price: 48,
    category: 'pastries',
    description: 'Flaky pastry filled with cream cheese and mixed berries',
    image: berryCreamCheeseDanishImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    id: 'pastry-8',
    title: 'Dark Chocolate Cheesecake',
    price: 55,
    category: 'pastries',
    description: 'Rich dark chocolate cheesecake with oreo crust',
    image: darkChocCheeseCakeImage,
    allergens: ['gluten', 'dairy', 'eggs']
  },

  // Hot Beverages
  {
    id: 'hot-1',
    title: 'Espresso',
    price: 25,
    category: 'hot beverages',
    description: 'Single shot of our signature espresso blend',
    image: expressoImage,
    allergens: []
  },
  {
    id: 'hot-2',
    title: 'Cappuccino',
    price: 38,
    category: 'hot beverages',
    description: 'Espresso with steamed milk and thick foam',
    image: capuuImage,
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
    image: chaiLatteImage,
    allergens: ['dairy']
  },
  {
    id: 'hot-6',
    title: 'Hot Chocolate',
    price: 35,
    category: 'hot beverages',
    description: 'Rich and creamy hot chocolate made with premium cocoa',
    image: hotChocImage,
    allergens: ['dairy']
  },
  {
    id: 'hot-7',
    title: 'Green Tea',
    price: 28,
    category: 'hot beverages',
    description: 'Premium green tea served hot with natural antioxidants',
    image: greenTeaImage,
    allergens: []
  },
  {
    id: 'hot-8',
    title: 'Matcha Latte',
    price: 45,
    category: 'hot beverages',
    description: 'Premium matcha powder whisked with steamed milk',
    image: matchaLatteImage,
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
    image: icedLatteImage,
    allergens: ['dairy']
  },
  {
    id: 'cold-3',
    title: 'Frappuccino',
    price: 48,
    category: 'cold drinks',
    description: 'Blended coffee with ice and cream, topped with whipped cream',
    image: frappuccinoImage,
    allergens: ['dairy']
  },
  {
    id: 'cold-4',
    title: 'Fresh Orange Juice',
    price: 45,
    category: 'cold drinks',
    description: 'Freshly squeezed orange juice',
    image: orangeJuiceImage,
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
  },
  {
    id: 'cold-6',
    title: 'Iced Matcha Latte',
    price: 50,
    category: 'cold drinks',
    description: 'Premium matcha powder whisked with cold milk and ice',
    image: icedMatchaLatteImage,
    allergens: ['dairy']
  },
  {
    id: 'cold-7',
    title: 'Caramel Mocha',
    price: 52,
    category: 'cold drinks',
    description: 'Iced mocha with caramel syrup and whipped cream',
    image: caramelMochaImage,
    allergens: ['dairy']
  },
  {
    id: 'cold-8',
    title: 'Berry Frappee',
    price: 55,
    category: 'cold drinks',
    description: 'Blended mixed berries with ice and cream',
    image: berryFrappeeImage,
    allergens: ['dairy']
  }
];