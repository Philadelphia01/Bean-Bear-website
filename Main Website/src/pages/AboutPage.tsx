import React from 'react';
import { Coffee, Globe, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-dark-light">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-4 font-serif">Our Story</h1>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Founded in 2025, Bear&Bean brings you the finest coffee beans
            from around the world.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Coffee shop interior" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary font-serif">
                Crafting Perfect Coffee Since 2025
              </h2>
              <p className="text-gray-300 mb-6">
                At Bear&Bean, we believe that exceptional coffee begins with
                exceptional beans. Our journey started with a simple passion: to source the
                finest coffee beans from around the world and roast them to perfection,
                bringing out their unique flavors and aromas.
              </p>
              <p className="text-gray-300 mb-6">
                Today, we continue that tradition with an unwavering commitment to quality
                and sustainability. Every bean we source is ethically traded, supporting farmers
                and communities while preserving the environment for future generations of
                coffee lovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-light">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary mb-4">20+</div>
              <p className="text-xl">Years of Excellence</p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary mb-4">15</div>
              <p className="text-xl">Origin Countries</p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-bold text-primary mb-4">100K+</div>
              <p className="text-xl">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-serif">What Sets Us Apart</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Our commitment to quality and craftsmanship is evident in every cup we serve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Coffee className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Artisan Roasting</h3>
              <p className="text-gray-400">
                Small-batch roasted for peak flavor
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Selection</h3>
              <p className="text-gray-400">
                Sourced from premium growing regions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Award Winning</h3>
              <p className="text-gray-400">
                Recognized for exceptional quality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-16 bg-dark-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-dark rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1566304/pexels-photo-1566304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Master Barista" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">James Wilson</h3>
                <p className="text-primary mb-4">Master Barista</p>
                <p className="text-gray-400">
                  With over 15 years of experience, James leads our team of skilled baristas.
                </p>
              </div>
            </div>
            
            <div className="bg-dark rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3205568/pexels-photo-3205568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Head Chef" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Maria Rodriguez</h3>
                <p className="text-primary mb-4">Head Chef</p>
                <p className="text-gray-400">
                  Maria crafts our delicious menu items with passion and creativity.
                </p>
              </div>
            </div>
            
            <div className="bg-dark rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Master Roaster" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">David Ndlovu</h3>
                <p className="text-primary mb-4">Master Roaster</p>
                <p className="text-gray-400">
                  David ensures every batch of beans is roasted to perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutPage;