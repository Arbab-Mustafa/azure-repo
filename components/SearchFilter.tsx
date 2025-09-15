'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, User, MapPin, Calendar, Star } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  location: string
  joinDate: string
  rating: number
  avatar: string
}

interface SearchFilterProps {
  onInteraction: (type: string) => void
}

export default function SearchFilter({ onInteraction }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  const users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', location: 'New York', joinDate: '2023-01-15', rating: 4.8, avatar: '👩‍💻' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', location: 'San Francisco', joinDate: '2023-02-20', rating: 4.6, avatar: '👨‍🎨' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager', location: 'Chicago', joinDate: '2023-01-10', rating: 4.9, avatar: '👨‍💼' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Developer', location: 'Seattle', joinDate: '2023-03-05', rating: 4.7, avatar: '👩‍💻' },
    { id: 5, name: 'Edward Norton', email: 'edward@example.com', role: 'QA Engineer', location: 'Boston', joinDate: '2023-02-15', rating: 4.5, avatar: '👨‍🔬' },
    { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', role: 'Designer', location: 'Los Angeles', joinDate: '2023-01-25', rating: 4.8, avatar: '👩‍🎨' },
    { id: 7, name: 'George Lucas', email: 'george@example.com', role: 'Manager', location: 'Austin', joinDate: '2023-02-28', rating: 4.4, avatar: '👨‍💼' },
    { id: 8, name: 'Helen Keller', email: 'helen@example.com', role: 'Developer', location: 'Miami', joinDate: '2023-03-10', rating: 4.9, avatar: '👩‍💻' },
  ]

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesLocation = !locationFilter || user.location === locationFilter
      
      return matchesSearch && matchesRole && matchesLocation
    })

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'role':
          return a.role.localeCompare(b.role)
        case 'location':
          return a.location.localeCompare(b.location)
        case 'joinDate':
          return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, roleFilter, locationFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setRoleFilter('')
    setLocationFilter('')
    setSortBy('name')
    onInteraction('clear-filters')
  }

  const uniqueRoles = [...new Set(users.map(user => user.role))]
  const uniqueLocations = [...new Set(users.map(user => user.location))]

  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Search & Filter Users</h3>
        <motion.button
          onClick={() => {
            setShowFilters(!showFilters)
            onInteraction('toggle-filters')
          }}
          className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            onInteraction('search')
          }}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <motion.button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                onInteraction('filter-role')
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                onInteraction('filter-location')
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                onInteraction('sort-change')
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="location">Sort by Location</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <motion.button
              onClick={clearFilters}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* User List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              layout
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{user.avatar}</div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{user.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      <User className="w-3 h-3" />
                      <span>{user.role}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <motion.div 
            className="text-center py-8 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No users found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
