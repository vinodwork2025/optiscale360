import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, CheckIcon, StarIcon, ShieldCheckIcon, RocketLaunchIcon, CogIcon, ChartBarIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, TabletIcon } from '@heroicons/react/24/outline';

const PayWhatYouValueLanding = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Next-Gen AI-Ready Websites",
          "description": "AI-optimized websites with pay-what-you-value pricing",
          "provider": {
            "@type": "Organization",
            "name": "Optiscale360",
            "url": "https://optiscale360.com"
          },
          "offers": {
            "@type": "Offer",
            "name": "Pay What You Value Website",
            "description": "Zero upfront cost, you decide the price after experiencing results",
            "priceSpecification": {
              "@type": "PaymentChargeSpecification",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        })}
      </script>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/api/placeholder/32/32" 
                alt="Optiscale360 Logo" 
                className="w-8 h-8"
                // Replace with actual logo: Optiscale360_logo.svg
              />
              <span className="text-xl font-bold text-gray-900">Optiscale360</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Reviews</a>
            </nav>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={`space-y-8 transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Next-Gen AI-Ready Websites – 
                  <span className="text-blue-600"> Pay What You Value</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Launch your future-proof website with no upfront costs. Zero risk. 
                  You decide the price only after experiencing real results.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Get My Free Next-Gen Website
                    <ChevronRightIcon className="inline w-5 h-5 ml-2" />
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors">
                    See How It Works
                  </button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>Zero upfront cost</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>AI-optimized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>Mobile-first</span>
                  </div>
                </div>
              </div>

              <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {/* Device Mockup Illustration */}
                <div className="relative max-w-md mx-auto">
                  {/* Desktop */}
                  <div className="bg-gray-800 rounded-t-lg p-2 transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded p-4 shadow-inner">
                      <div className="flex space-x-1 mb-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-blue-600 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile */}
                  <div className="absolute -bottom-4 -right-8 bg-gray-800 rounded-2xl p-1 transform -rotate-12 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded-xl p-2 w-16 h-24">
                      <div className="h-1 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-blue-600 rounded w-full"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="absolute -top-4 -left-8 bg-gray-800 rounded-lg p-1 transform rotate-12 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded p-2 w-20 h-16">
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded w-full"></div>
                        <div className="h-1 bg-blue-600 rounded w-4/5"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 left-1/4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                  <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="absolute top-1/2 -right-4 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="absolute -bottom-8 left-1/3 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-bounce delay-300">
                  <CogIcon className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section id="benefits" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our AI-Ready Websites?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of web development with zero risk and maximum value
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <RocketLaunchIcon className="w-8 h-8" />,
                  title: "Lightning-Fast, Mobile-First Design",
                  description: "Optimized for speed and mobile performance from day one"
                },
                {
                  icon: <CogIcon className="w-8 h-8" />,
                  title: "AI & SEO Optimized",
                  description: "Built with AI integration and SEO best practices for maximum visibility"
                },
                {
                  icon: <ChartBarIcon className="w-8 h-8" />,
                  title: "Conversion-Focused Layouts",
                  description: "Designed to turn visitors into customers with proven conversion tactics"
                },
                {
                  icon: <ShieldCheckIcon className="w-8 h-8" />,
                  title: "Zero Risk, 100% Trust-Based",
                  description: "No upfront payment required – pay only when you see the value"
                }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-blue-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple, transparent, and completely risk-free
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-blue-200 transform -translate-y-1/2"></div>
              <div className="hidden md:block absolute top-1/2 right-0 w-1/3 h-0.5 bg-blue-200 transform -translate-y-1/2 translate-x-1/3"></div>

              {[
                {
                  step: "01",
                  title: "We Design & Launch Your AI-Ready Site",
                  description: "Our experts create your modern, AI-optimized website tailored to your business goals."
                },
                {
                  step: "02",
                  title: "You Experience Growth & Results",
                  description: "Watch as your site drives traffic, generates leads, and grows your business."
                },
                {
                  step: "03",
                  title: "You Pay What You Believe It's Worth",
                  description: "After experiencing the value, you decide what our work is worth to your business."
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className={`text-center relative z-10 transform transition-all duration-700 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600">
                See what our clients say about our AI-ready websites
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { number: "500+", label: "Businesses Optimized" },
                { number: "85%", label: "Average Efficiency Increase" },
                { number: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center transform transition-all duration-500 ${isVisible.testimonials ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "CEO, TechStart Inc.",
                  content: "The pay-what-you-value approach gave us confidence to try their service. The results exceeded our expectations!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Marketing Director",
                  content: "Our website traffic increased by 300% in just 8 weeks. The AI optimization really works.",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  role: "Founder, GrowthCo",
                  content: "Finally, a web agency that puts results before payment. Highly recommended!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 p-6 rounded-xl transform transition-all duration-500 hover:shadow-lg ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk-Free Guarantee Banner */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`transform transition-all duration-700 ${isVisible.guarantee ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                100% Risk-Free Guarantee
              </h3>
              <p className="text-xl text-gray-600">
                Zero upfront cost. Zero risk. 100% Value-Driven. 
                You only pay if you're completely satisfied with the results.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`space-y-8 transform transition-all duration-700 ${isVisible['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-5xl font-bold text-gray-900">
                Ready for Your Future-Proof Website?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join hundreds of businesses who've transformed their online presence 
                with our risk-free approach.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get My Free Next-Gen Website
                  <ChevronRightIcon className="inline w-6 h-6 ml-2" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-lg text-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors">
                  See Demo Designs
                </button>
              </div>

              {/* Final Illustration */}
              <div className="mt-12">
                <div className="relative max-w-xs mx-auto">
                  {/* Handshake/Partnership Illustration */}
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Success indicators */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="Optiscale360 Logo" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">Optiscale360</span>
              </div>
              <p className="text-gray-400 mb-4">
                Creating AI-ready websites that drive real business results.
              </p>
              <div className="flex space-x-4">
                {/* Social media links would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Website Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SEO Optimization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance Scaling</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>hello@optiscale360.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Optiscale360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PayWhatYouValueLanding;