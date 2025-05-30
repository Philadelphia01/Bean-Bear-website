export const orders = [
  {
    id: 'ord-1001',
    customer: 'John Smith',
    items: [
      { id: 'hot-2', title: 'Cappuccino', price: 38, quantity: 2 },
      { id: 'pastry-1', title: 'Butter Croissant', price: 35, quantity: 1 }
    ],
    total: 111,
    status: 'completed',
    date: '2025-05-28T09:15:00',
    address: '123 Main St, Cape Town'
  },
  {
    id: 'ord-1002',
    customer: 'Sarah Johnson',
    items: [
      { id: 'breakfast-1', title: 'Full English Breakfast', price: 125, quantity: 1 },
      { id: 'hot-3', title: 'Flat White', price: 36, quantity: 1 }
    ],
    total: 161,
    status: 'preparing',
    date: '2025-05-30T10:30:00',
    address: '456 Park Ave, Cape Town'
  },
  {
    id: 'ord-1003',
    customer: 'Michael Brown',
    items: [
      { id: 'cold-3', title: 'Frappuccino', price: 48, quantity: 2 },
      { id: 'pastry-2', title: 'Pain au Chocolat', price: 40, quantity: 2 }
    ],
    total: 176,
    status: 'pending',
    date: '2025-05-30T11:45:00',
    address: '789 Beach Rd, Cape Town'
  },
  {
    id: 'ord-1004',
    customer: 'Emily Davis',
    items: [
      { id: 'breakfast-3', title: 'Avocado Toast', price: 85, quantity: 1 },
      { id: 'hot-5', title: 'Chai Latte', price: 40, quantity: 1 },
      { id: 'cold-4', title: 'Fresh Orange Juice', price: 45, quantity: 1 }
    ],
    total: 170,
    status: 'delivered',
    date: '2025-05-29T08:20:00',
    address: '101 Mountain View, Cape Town'
  },
  {
    id: 'ord-1005',
    customer: 'David Wilson',
    items: [
      { id: 'breakfast-4', title: 'Buttermilk Pancakes', price: 75, quantity: 2 },
      { id: 'cold-1', title: 'Iced Coffee', price: 35, quantity: 2 }
    ],
    total: 220,
    status: 'cancelled',
    date: '2025-05-29T12:10:00',
    address: '202 Harbor St, Cape Town'
  }
];