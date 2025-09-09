'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  CheckIcon, 
  StarIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon, 
  CogIcon, 
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  ArrowRightIcon,
  PlayIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

// Components
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center mb-6">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 mb-6 text-lg italic">
        "{testimonial.content}"
      </blockquote>
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div className="ml-4">
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-gray-600">{testimonial.role}</div>
          <div className="text-sm text-blue-600">{testimonial.company}</div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-6">
        <feature.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Sample data
  const features = [
    {
      icon: RocketLaunchIcon,
      title: "Lightning-Fast Performance",
      description: "AI-optimized websites that load in under 2 seconds with 98+ PageSpeed scores globally."
    },
    {
      icon: CogIcon,
      title: "Advanced AI Integration", 
      description: "Built-in chatbots, content generation, and intelligent user experience optimization."
    },
    {
      icon: ChartBarIcon,
      title: "Conversion-Optimized",
      description: "Data-driven designs that increase conversions by 300%+ with A/B tested elements."
    },
    {
      icon: ShieldCheckIcon,
      title: "Enterprise Security",
      description: "Bank-level security with SSL, WAF protection, and compliance with global standards."
    },
    {
      icon: GlobeAltIcon,
      title: "Global Scalability",
      description: "Multi-CDN architecture ensuring fast loading times across India, USA, Europe, and Asia."
    },
    {
      icon: UserGroupIcon,
      title: "24/7 Expert Support",
      description: "Dedicated account managers and technical support team available around the clock."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      company: "TechVenture India",
      content: "Optiscale360 transformed our digital presence completely. Their AI-ready website increased our leads by 400% in just 3 months. The pay-what-you-value model showed their confidence in delivering results."
    },
    {
      name: "Sarah Martinez", 
      role: "VP of Marketing",
      company: "GlobalTech Solutions",
      content: "Working with Optiscale360 was like having a world-class agency at startup prices. Their technical expertise and business understanding is unmatched. Best ROI we've ever achieved."
    },
    {
      name: "Michael Chen",
      role: "Director of Operations", 
      company: "ScaleUp Dynamics",
      content: "The AI features they built into our website have automated 70% of our customer inquiries. Their team's professionalism and delivery speed exceeded Silicon Valley standards."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "We analyze your business, competitors, and target audience to create a winning digital strategy."
    },
    {
      step: "02", 
      title: "AI-Powered Design & Development",
      description: "Our team builds your custom website using cutting-edge AI tools and frameworks for maximum performance."
    },
    {
      step: "03",
      title: "Launch & Optimization",
      description: "We launch your website and continuously optimize it for better performance and conversions."
    },
    {
      step: "04",
      title: "Pay What It's Worth",
      description: "After seeing the results and value delivered, you decide what our work is worth to your business."
    }
  ];

  const stats = [
    { number: 500, suffix: "+", label: "Websites Delivered", description: "Across 25+ countries" },
    { number: 98, suffix: "%", label: "Client Satisfaction", description: "World-class service" },
    { number: 300, suffix: "%", label: "Avg. Conversion Increase", description: "Data-driven results" },
    { number: 24, suffix: "/7", label: "Expert Support", description: "Always available" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Optiscale360</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Services</a>
              <a href="#portfolio" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Portfolio</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <TrophyIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-700 font-medium">World-Class Digital Agency</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Next-Gen AI-Ready Websites —{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pay What You Value
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Partner with India's premier digital agency trusted by Fortune 500 companies worldwide. 
                We build AI-powered websites that drive real business results. Zero upfront investment — 
                you only pay what you believe our work is worth after seeing the impact.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <span>Get Your Free AI-Ready Website</span>
                  <ArrowRightIcon className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  <PlayIcon className="w-6 h-6" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">No upfront cost</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">AI-optimized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Global expertise</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main mockup container */}
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 min-h-[400px]">
                    {/* Browser chrome */}
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    
                    {/* Content mockup */}
                    <div className="space-y-4">
                      <div className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="h-20 bg-blue-50 rounded-lg border border-blue-200"></div>
                        <div className="h-20 bg-purple-50 rounded-lg border border-purple-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <RocketLaunchIcon className="w-8 h-8" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <ChartBarIcon className="w-7 h-7" />
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <CogIcon className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Companies Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startups to Fortune 500 companies, businesses trust Optiscale360 
              to deliver world-class digital experiences that drive real results.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              World-Class Digital Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our award-winning team combines Silicon Valley innovation with Indian technical excellence 
              to deliver AI-powered websites that exceed global standards and drive measurable business growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our Proven Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach refined through 500+ successful projects, 
              combining global best practices with innovative methodologies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent transform translate-x-1/2 z-0"></div>
                )}

                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't take our word for it. Here's what industry leaders and successful entrepreneurs 
              say about working with Optiscale360.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Risk-Free Guarantee */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <ShieldCheckIcon className="w-24 h-24 text-blue-600 mx-auto" />
            <h2 className="text-5xl font-bold text-gray-900">
              100% Risk-Free Guarantee
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We're so confident in our ability to deliver exceptional results that we work on a 
              "pay what you value" basis. You only invest after experiencing the transformation and 
              seeing the measurable impact on your business.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
              <div className="text-2xl font-bold text-blue-600 mb-2">Zero Upfront Investment</div>
              <div className="text-gray-600">Pay only when you see the value</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the ranks of successful businesses that have partnered with Optiscale360. 
              Let's create something extraordinary together — with zero risk and maximum impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center space-x-3 shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                <span>Get Your Free AI-Ready Website</span>
                <ArrowRightIcon className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl font-semibold text-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                Schedule Strategy Call
              </motion.button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-8">
              <a href="mailto:hello@optiscale360.com" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
                <span>hello@optiscale360.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <PhoneIcon className="w-5 h-5" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <span className="text-2xl font-bold">Optiscale360</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                India's premier digital agency delivering world-class AI-ready websites 
                and digital experiences that drive real business growth.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">L</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">T</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">I</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Website Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Digital Strategy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance Optimization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SEO & Marketing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Optiscale360. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;