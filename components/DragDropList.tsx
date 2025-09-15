'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { GripVertical, Plus, Trash2, Star } from 'lucide-react'

interface Task {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

interface DragDropListProps {
  onInteraction: (type: string) => void
}

export default function DragDropList({ onInteraction }: DragDropListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'Design user interface', priority: 'high', completed: false },
    { id: '2', content: 'Implement authentication', priority: 'medium', completed: true },
    { id: '3', content: 'Set up database', priority: 'high', completed: false },
    { id: '4', content: 'Write unit tests', priority: 'low', completed: false },
    { id: '5', content: 'Deploy to production', priority: 'medium', completed: false },
  ])
  const [newTask, setNewTask] = useState('')

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
    onInteraction('drag-drop')
  }

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask,
        priority: 'medium',
        completed: false
      }
      setTasks([...tasks, task])
      setNewTask('')
      onInteraction('add-task')
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    onInteraction('delete-task')
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    onInteraction('toggle-complete')
  }

  const changePriority = (id: string, priority: Task['priority']) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ))
    onInteraction('change-priority')
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Drag & Drop Task List</h3>
      
      {/* Add new task */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <motion.button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </motion.button>
      </div>

      {/* Task list */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-3 min-h-[200px] p-4 rounded-lg transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white p-4 rounded-lg shadow border transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg rotate-2' : 'shadow-sm'
                      } ${task.completed ? 'opacity-60' : ''}`}
                      layout
                    >
                      <div className="flex items-center space-x-3">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                        </div>
                        
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.content}
                          </p>
                        </div>
                        
                        <select
                          value={task.priority}
                          onChange={(e) => changePriority(task.id, e.target.value as Task['priority'])}
                          className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        
                        <motion.button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {tasks.length === 0 && (
                <motion.div 
                  className="text-center py-8 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No tasks yet. Add one above!</p>
                </motion.div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-blue-500">Total Tasks</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {tasks.filter(task => task.completed).length}
          </div>
          <div className="text-sm text-green-500">Completed</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-orange-600">
            {tasks.filter(task => !task.completed).length}
          </div>
          <div className="text-sm text-orange-500">Pending</div>
        </div>
      </div>
    </motion.div>
  )
}
