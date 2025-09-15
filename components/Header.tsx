'use client'

import { motion } from 'framer-motion'
import { Activity, Clock, MousePointer } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface HeaderProps {
  userStats: {
    clicks: number
    interactions: number
    timeSpent: number
  }
}

export default function Header({ userStats }: HeaderProps) {
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">DynamicApp</h2>
        </motion.div>

        <div className="flex items-center space-x-6">
          <motion.div 
            className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <MousePointer className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {userStats.clicks} clicks
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {userStats.interactions} interactions
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              {formatTime(userStats.timeSpent)}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
