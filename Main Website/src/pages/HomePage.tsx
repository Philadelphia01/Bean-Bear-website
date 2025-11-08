import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Award, Truck } from 'lucide-react';
const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      >
        <div className="absolute inset-0 bg-dark bg-opacity-70"></div>
        <div className="container relative z-10 px-6 py-24 mx-auto text-center">
          <h2 className="text-primary uppercase tracking-wider mb-2 fade-in">SINCE 2025</h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-serif slide-up">
            Experience the Finest<br />
            <span className="text-primary">Coffee Collection</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-300 slide-up">
            Indulge in a world of premium coffee beans meticulously sourced from the 
            world's finest coffee regions and expertly roasted to perfection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
            <Link to="/menu" className="btn btn-primary">
              Explore Our Collection
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Why Choose <span className="text-primary">Bear&Bean</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              We're dedicated to bringing you the finest coffee experience through quality, 
              craftsmanship, and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Beans</h3>
              <p className="text-gray-400">
                We source only the highest quality beans from sustainable farms around the world.
              </p>
            </div>

            <div className="bg-dark p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Roasting</h3>
              <p className="text-gray-400">
                Our master roasters bring out the unique flavor profile of each bean variety.
              </p>
            </div>

            <div className="bg-dark p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-gray-400">
                Fresh coffee delivered to your doorstep in Cape Town and surrounding areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20 bg-dark">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Our <span className="text-primary">Menu Highlights</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              A taste of what we offer at Bear&Bean
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card">
              <img 
                src="/images/capuu.jpeg" 
                alt="Cappuccino" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/donuts.png';
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Cappuccino</h3>
                <p className="text-gray-400 mb-4">
                  Espresso with steamed milk and thick foam
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">R 38</span>
                </div>
              </div>
            </div>

            <div className="card">
              <img 
                src="/images/egg benedictt.jpeg" 
                alt="Eggs Benedict" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/donuts.png';
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Eggs Benedict</h3>
                <p className="text-gray-400 mb-4">
                  Poached eggs on English muffin with hollandaise
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">R 95</span>
                </div>
              </div>
            </div>

            <div className="card">
              <img 
                src="/images/butter cros.jpeg" 
                alt="Butter Croissant" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/donuts.png';
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Butter Croissant</h3>
                <p className="text-gray-400 mb-4">
                  Freshly baked flaky butter croissant
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">R 35</span>
                </div>
              </div>
            </div>

            <div className="card">
              <img 
                src="/images/icedcoffe.jpeg" 
                alt="Iced Coffee" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/donuts.png';
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Iced Coffee</h3>
                <p className="text-gray-400 mb-4">
                  Cold brew coffee served over ice
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">R 35</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="btn btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary bg-opacity-10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Ready to Experience the <span className="text-primary">Perfect Cup?</span>
            </h2>
            <p className="text-lg mb-8 text-gray-300">
              Visit our coffee shop in Cape Town or order online for delivery. We're ready to serve you the finest coffee experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/download-app" className="btn btn-primary">
                Order Now
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Find Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;