import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingBagIcon, PlusIcon, History } from 'lucide-react';

const OrderPage: React.FC = () => {
  const { cartItems, total } = useCart();

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-light rounded-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <ShoppingBagIcon className="w-16 h-16 text-primary mr-4" />
                <div className="text-left">
                  <h1 className="text-3xl font-bold font-serif">Your Order</h1>
                  <p className="text-gray-400">Review your items and checkout</p>
                </div>
                <Link
                  to="/order-history"
                  className="ml-4 p-2 text-primary hover:text-primary-dark transition-colors"
                  title="View Order History"
                >
                  <History className="w-8 h-8" />
                </Link>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">You don't have any orders</h2>
                <p className="text-gray-400 mb-8">
                  Your cart is empty. Add some delicious items from our menu to get started!
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center px-6 py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-8">
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-dark p-4 rounded-lg flex items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-1">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold">R {item.price.toFixed(2)}</span>
                          <span className="text-gray-400">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark-lighter pt-6 mb-8">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee</span>
                    <span>R 25.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-dark-lighter">
                    <span>Total</span>
                    <span className="text-primary">R {(total + 25).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    to="/menu"
                    className="flex-1 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center"
                  >
                    Add More Items
                  </Link>
                  <Link
                    to="/checkout"
                    className="flex-1 py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;