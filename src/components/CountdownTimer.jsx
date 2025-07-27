import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date (7 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px] text-center shadow-lg"
      >
        <span className="text-xl md:text-2xl font-bold text-white block">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm text-gray-300 mt-2 font-medium">
        {label}
      </span>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-400/30 rounded-2xl p-6 md:p-8 backdrop-blur-md"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          🚀 Launch Special: 50% Off!
        </h3>
        <p className="text-gray-300 text-sm md:text-base">
          Early bird pricing ends in:
        </p>
      </div>
      
      <div className="flex justify-center gap-3 md:gap-4 mb-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      
      <div className="text-center">
        <p className="text-green-400 font-semibold text-sm md:text-base mb-3">
          Pro Plan: $4.50/month (was $9/month)
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-sm md:text-base"
        >
          Claim 50% Off Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CountdownTimer; 