
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            About StressAPI
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Learn more about our mission and the team behind StressAPI
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At StressAPI, we're dedicated to helping developers build robust, scalable FastAPI applications. 
              Our mission is to provide intuitive, powerful tools that simplify the complexities of load testing 
              and performance optimization.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We believe that performance testing should be accessible to everyone - from solo developers to 
              enterprise teams. That's why we've created a tool that's both powerful and user-friendly.
            </p>
          </div>

          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              StressAPI was born out of necessity. As FastAPI developers ourselves, we struggled to find 
              a specialized testing tool that understood the unique characteristics of FastAPI applications. 
              Instead of waiting for someone else to build it, we decided to create it ourselves.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              What started as an internal tool has grown into a platform trusted by thousands of developers 
              worldwide. Today, we're proud to be the go-to solution for FastAPI performance testing.
            </p>
          </div>
        </div>

        <div className="mt-16 animate-on-scroll">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Meet the Team</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & Lead Developer",
                bio: "FastAPI enthusiast with 10+ years of backend development experience",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                name: "Sarah Chen",
                role: "Performance Engineering Lead",
                bio: "Specializes in distributed systems and performance optimization",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                name: "Miguel Rodriguez",
                role: "Frontend Developer",
                bio: "Creates elegant, intuitive interfaces with React and TailwindCSS",
                avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-blue-500"
                />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
