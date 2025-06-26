import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import EmptyState from '@/components/atoms/EmptyState'
import ErrorState from '@/components/atoms/ErrorState'
import ApperIcon from '@/components/ApperIcon'
import { appointmentService } from '@/services/api/appointmentService'
import { businessService } from '@/services/api/businessService'
import { formatDate, formatTime } from '@/services/utils'

const MyBookings = () => {
  const location = useLocation()
  const [appointments, setAppointments] = useState([])
  const [businesses, setBusinesses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [newBooking, setNewBooking] = useState(null)

  useEffect(() => {
    loadAppointments()
    
    // Handle confirmation from booking flow
    if (location.state?.showConfirmation && location.state?.newBooking) {
      setNewBooking(location.state.newBooking)
      setShowConfirmation(true)
    }
  }, [location.state])

  const loadAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      // For demo purposes, we'll get all appointments
      // In a real app, this would be filtered by current user
      const appointmentData = await appointmentService.getAll()
      setAppointments(appointmentData)
      
      // Load business details for each appointment
      const businessIds = [...new Set(appointmentData.map(apt => apt.businessId))]
      const businessData = {}
      
      for (const businessId of businessIds) {
        try {
          const business = await businessService.getById(businessId)
          businessData[businessId] = business
        } catch (err) {
          console.error(`Failed to load business ${businessId}:`, err)
        }
      }
      
      setBusinesses(businessData)
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await appointmentService.cancel(appointmentId)
      setAppointments(prev => 
        prev.map(apt => 
          apt.Id === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      )
      toast.success('Appointment cancelled successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const today = new Date()
    const appointmentDate = new Date(`${apt.date}T${apt.time}:00`)
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today && apt.status !== 'cancelled'
      case 'past':
        return appointmentDate < today || apt.status === 'completed'
      case 'cancelled':
        return apt.status === 'cancelled'
      default:
        return true
    }
  })

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'success',
      completed: 'info',
      cancelled: 'error',
      pending: 'warning'
    }
    return colors[status] || 'default'
  }

  const isUpcoming = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}:00`)
    return appointmentDate >= new Date()
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-full"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your appointments and view booking history</p>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && newBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Check" className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your appointment has been successfully booked.
                  </p>
                  <div className="bg-surface-50 rounded-lg p-4 mb-4 text-left">
                    <p className="text-sm text-gray-600">
                      <strong>Service:</strong> {newBooking.serviceName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {formatDate(newBooking.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Time:</strong> {formatTime(newBooking.time)}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setShowConfirmation(false)}
                    fullWidth
                  >
                    Great!
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: 'All Bookings' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map((filterOption) => (
            <Button
              key={filterOption.value}
              variant={filter === filterOption.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption.value)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <SkeletonLoader key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorState
            message={error}
            onRetry={loadAppointments}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <EmptyState
            icon="Calendar"
            title="No bookings found"
            description={
              filter === 'all' 
                ? "You haven't made any bookings yet. Start by finding a service provider."
                : `No ${filter} bookings found.`
            }
            actionLabel="Find Services"
            onAction={() => window.location.href = '/search'}
          />
        )}

        {/* Appointments List */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredAppointments.map((appointment) => {
              const business = businesses[appointment.businessId]
              const upcoming = isUpcoming(appointment.date, appointment.time)
              
              return (
                <motion.div
                  key={appointment.Id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {business?.name || 'Business'}
                        </h3>
                        <Badge variant={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Service:</strong> {appointment.serviceName}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Date:</strong> {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Time:</strong> {formatTime(appointment.time)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Duration:</strong> {appointment.duration} minutes
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Price:</strong> ${appointment.price}
                          </p>
                          {business && (
                            <p className="text-sm text-gray-600">
                              <strong>Location:</strong> {business.location.area}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="bg-surface-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex flex-col space-y-2">
                        {upcoming && appointment.status === 'confirmed' && (
                          <Button
                            variant="error"
                            size="sm"
                            icon="X"
                            onClick={() => handleCancelAppointment(appointment.Id)}
                          >
                            Cancel
                          </Button>
                        )}
                        
                        {business && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Phone"
                            onClick={() => window.open(`tel:${business.phone}`)}
                          >
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MyBookings