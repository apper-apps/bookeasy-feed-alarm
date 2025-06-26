import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { businessService } from '@/services/api/businessService'

function BusinessDashboard() {
  const navigate = useNavigate()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [services, setServices] = useState([])
  const [showAddService, setShowAddService] = useState(false)
  const [editingService, setEditingService] = useState(null)
  
  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        const auth = localStorage.getItem('businessAuth')
        if (!auth) {
          navigate('/for-business')
          return
        }

        const { businessId } = JSON.parse(auth)
        const businessData = await businessService.getById(businessId)
        setBusiness(businessData)
        setServices(businessData.services || [])
      } catch (error) {
        toast.error('Failed to load business data')
        navigate('/for-business')
      } finally {
        setLoading(false)
      }
    }

    loadBusinessData()
  }, [navigate])

  const handleAddService = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedServices = [...services, {
        ...newService,
        id: Date.now().toString()
      }]
      
      await businessService.update(business.Id, { services: updatedServices })
      setServices(updatedServices)
      setNewService({ name: '', duration: '', price: '', description: '' })
      setShowAddService(false)
      toast.success('Service added successfully!')
    } catch (error) {
      toast.error('Failed to add service')
    } finally {
      setLoading(false)
    }
  }

  const handleEditService = async (serviceId, updatedData) => {
    setLoading(true)

    try {
      const updatedServices = services.map(service =>
        service.id === serviceId ? { ...service, ...updatedData } : service
      )
      
      await businessService.update(business.Id, { services: updatedServices })
      setServices(updatedServices)
      setEditingService(null)
      toast.success('Service updated successfully!')
    } catch (error) {
      toast.error('Failed to update service')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setLoading(true)

    try {
      const updatedServices = services.filter(service => service.id !== serviceId)
      await businessService.update(business.Id, { services: updatedServices })
      setServices(updatedServices)
      toast.success('Service deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete service')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('businessAuth')
    navigate('/for-business')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ApperIcon name="Loader2" className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your business data.</p>
          <Button onClick={() => navigate('/for-business')}>
            Return to Business Portal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
              <p className="text-gray-600 mt-1">Business Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon="Eye"
                onClick={() => navigate(`/business/${business.Id}`)}
              >
                View Public Profile
              </Button>
              <Button
                variant="ghost"
                icon="LogOut"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'BarChart3' },
              { id: 'services', label: 'Services', icon: 'List' },
              { id: 'bookings', label: 'Bookings', icon: 'Calendar' },
              { id: 'settings', label: 'Settings', icon: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">142</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-success/10 p-3 rounded-lg">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$3,420</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <ApperIcon name="Star" className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{business.rating || '4.8'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
              <Button
                icon="Plus"
                onClick={() => setShowAddService(true)}
              >
                Add Service
              </Button>
            </div>

            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.id || service.name} className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          <ApperIcon name="Clock" className="w-4 h-4 inline mr-1" />
                          {service.duration} mins
                        </span>
                        <span className="text-sm text-gray-500">
                          <ApperIcon name="DollarSign" className="w-4 h-4 inline mr-1" />
                          ${service.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => setEditingService(service)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {services.length === 0 && (
                <div className="text-center py-12">
                  <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                  <p className="text-gray-600 mb-4">Add your first service to get started.</p>
                  <Button icon="Plus" onClick={() => setShowAddService(true)}>
                    Add Service
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <ApperIcon name="Calendar" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Management</h3>
            <p className="text-gray-600">Booking management features coming soon!</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <ApperIcon name="Settings" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Business Settings</h3>
            <p className="text-gray-600">Settings panel coming soon!</p>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Service</h2>
              <button
                onClick={() => setShowAddService(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <Input
                label="Service Name"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
              <Input
                label="Price ($)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Describe your service..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowAddService(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon="Plus"
                >
                  Add Service
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handleEditService(editingService.id, editingService)
            }} className="space-y-4">
              <Input
                label="Service Name"
                value={editingService.name}
                onChange={(e) => setEditingService(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={editingService.duration}
                onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
              <Input
                label="Price ($)"
                type="number"
                value={editingService.price}
                onChange={(e) => setEditingService(prev => ({ ...prev, price: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Describe your service..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon="Save"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default BusinessDashboard