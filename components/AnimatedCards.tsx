'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Activity, Award, Eye, MousePointer } from 'lucide-react'

interface AnimatedCardsProps {
  onInteraction: (type: string) => void
}

export default function AnimatedCards({ onInteraction }: AnimatedCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const cards = [
    {
      id: 1,
      title: 'Performance',
      value: '98.5%',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'from-green-400 to-blue-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Active Users',
      value: '12.4K',
      change: '+15.2%',
      icon: Users,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 3,
      title: 'Engagement',
      value: '87.2%',
      change: '+8.1%',
      icon: Activity,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 4,
      title: 'Success Rate',
      value: '94.7%',
      change: '+3.5%',
      icon: Award,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ]

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Animated Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`${card.bgColor} p-6 rounded-2xl border border-gray-100 cursor-pointer relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            onHoverStart={() => {
              setHoveredCard(card.id)
              onInteraction('card-hover')
            }}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => onInteraction('card-click')}
          >
            {/* Background gradient overlay */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0`}
              animate={{ opacity: hoveredCard === card.id ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`p-3 rounded-lg bg-white shadow-sm`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </motion.div>
                
                <motion.div
                  className="flex items-center space-x-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  <MousePointer className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <h4 className="text-sm font-medium text-gray-600">{card.title}</h4>
                <div className="flex items-end justify-between">
                  <motion.span
                    className="text-3xl font-bold text-gray-800"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {card.value}
                  </motion.span>
                  <motion.span
                    className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {card.change}
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Animated progress bar */}
              <motion.div
                className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${parseFloat(card.value)}%` }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Interactive pulse animation */}
      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <motion.div
            className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full"
            animate={{ 
              scale: [1, 2, 1],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
