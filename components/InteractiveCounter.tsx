'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, RotateCcw, Zap } from 'lucide-react'

interface InteractiveCounterProps {
  onInteraction: (type: string) => void
}

export default function InteractiveCounter({ onInteraction }: InteractiveCounterProps) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoIncrement, setAutoIncrement] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoIncrement) {
      interval = setInterval(() => {
        setCount(prev => prev + 1)
        onInteraction('auto-increment')
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [autoIncrement, onInteraction])

  const handleIncrement = () => {
    setCount(prev => prev + 1)
    setIsAnimating(true)
    onInteraction('increment')
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleDecrement = () => {
    setCount(prev => prev - 1)
    setIsAnimating(true)
    onInteraction('decrement')
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleReset = () => {
    setCount(0)
    setAutoIncrement(false)
    onInteraction('reset')
  }

  const toggleAutoIncrement = () => {
    setAutoIncrement(prev => !prev)
    onInteraction('toggle-auto')
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Interactive Counter
      </h3>
      
      <div className="text-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            className={`text-6xl font-bold ${
              count > 0 ? 'text-green-500' : count < 0 ? 'text-red-500' : 'text-gray-500'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isAnimating ? 1.2 : 1, 
              opacity: 1,
              rotate: isAnimating ? [0, 10, -10, 0] : 0
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          onClick={handleDecrement}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Minus className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={handleReset}
          className="bg-gray-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={handleIncrement}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="text-center">
        <motion.button
          onClick={toggleAutoIncrement}
          className={`flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            autoIncrement 
              ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className={`w-4 h-4 ${autoIncrement ? 'animate-pulse' : ''}`} />
          <span>{autoIncrement ? 'Stop Auto' : 'Start Auto'}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
