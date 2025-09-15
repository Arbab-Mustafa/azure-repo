'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { BarChart3, LineChart, PieChart, RefreshCw } from 'lucide-react'
import { generateRandomData } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DataVisualizationProps {
  onInteraction: (type: string) => void
}

export default function DataVisualization({ onInteraction }: DataVisualizationProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'doughnut'>('line')
  const [data, setData] = useState(generateRandomData(12))
  const [isRefreshing, setIsRefreshing] = useState(false)

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const refreshData = () => {
    setIsRefreshing(true)
    onInteraction('data-refresh')
    setTimeout(() => {
      setData(generateRandomData(12))
      setIsRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(value => 
        Math.max(0, value + Math.floor(Math.random() * 21) - 10)
      ))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'User Engagement',
        data: data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: chartType === 'doughnut' 
          ? [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 101, 101, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(6, 182, 212, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(14, 165, 233, 0.8)',
              'rgba(99, 102, 241, 0.8)',
            ]
          : 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        fill: chartType === 'line',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - Real-time Data`,
      },
    },
    scales: chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        max: 100,
      },
    } : undefined,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  }

  const chartTypes = [
    { type: 'line' as const, icon: LineChart, label: 'Line Chart' },
    { type: 'bar' as const, icon: BarChart3, label: 'Bar Chart' },
    { type: 'doughnut' as const, icon: PieChart, label: 'Doughnut Chart' },
  ]

  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Data Visualization</h3>
        <motion.button
          onClick={refreshData}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </motion.button>
      </div>

      {/* Chart Type Selector */}
      <div className="flex justify-center space-x-2 mb-6">
        {chartTypes.map(({ type, icon: Icon, label }) => (
          <motion.button
            key={type}
            onClick={() => {
              setChartType(type)
              onInteraction('chart-type-change')
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              chartType === type
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Chart Container */}
      <motion.div 
        className="h-96 relative"
        key={chartType}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {chartType === 'line' && <Line data={chartData} options={options} />}
        {chartType === 'bar' && <Bar data={chartData} options={options} />}
        {chartType === 'doughnut' && <Doughnut data={chartData} options={options} />}
      </motion.div>

      {/* Data Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-blue-50 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-blue-600">
            {Math.max(...data)}
          </div>
          <div className="text-sm text-blue-500">Peak Value</div>
        </motion.div>
        
        <motion.div 
          className="bg-green-50 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-green-600">
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </div>
          <div className="text-sm text-green-500">Average</div>
        </motion.div>
        
        <motion.div 
          className="bg-purple-50 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-purple-600">
            {Math.min(...data)}
          </div>
          <div className="text-sm text-purple-500">Min Value</div>
        </motion.div>
        
        <motion.div 
          className="bg-orange-50 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-orange-500">Total</div>
        </motion.div>
      </div>
    </motion.div>
  )
}
