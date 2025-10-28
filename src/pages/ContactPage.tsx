import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="pt-4 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-dark-light">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-4 font-serif">Visit Us</h1>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            Stop by our store or reach out to us with any questions.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-dark-light p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-primary font-serif">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center mr-4">
                    <MapPin className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Our Location</h3>
                    <p className="text-gray-400">Braamfontein, Johannesburg, South Africa</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Phone Number</h3>
                    <p className="text-gray-400">+27 21 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email Address</h3>
                    <p className="text-gray-400">info@bear&bean.co.za</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center mr-4">
                    <Clock className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Opening Hours</h3>
                    <p className="text-gray-400">Monday - Friday: 7:00 AM - 7:00 PM</p>
                    <p className="text-gray-400">Saturday - Sunday: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-dark-light p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-primary font-serif">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="input"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="input"
                      placeholder="Let us know how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-dark-light">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8 font-serif">Find Us</h2>
          <div className="bg-dark p-2 rounded-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.6506987081855!2d28.036615160974204!3d-26.193308280575838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950d0027fd21af%3A0x7cdeb2348dfa459a!2sCoffee%20Emporium!5e1!3m2!1sen!2sza!4v1748602103038!5m2!1sen!2sza" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bear&Bean Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;