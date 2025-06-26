import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ServiceCard from '@/components/molecules/ServiceCard'
import BookingCalendar from '@/components/organisms/BookingCalendar'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import ApperIcon from '@/components/ApperIcon'
import { businessService } from '@/services/api/businessService'
import { appointmentService } from '@/services/api/appointmentService'
import { formatDate, formatTime } from '@/services/utils'

const BookingFlow = () => {
  const { businessId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadBusiness()
  }, [businessId])

  useEffect(() => {
    // Check if service was pre-selected from business profile
    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService)
      setStep(2)
    }
  }, [location.state])

  const loadBusiness = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await businessService.getById(businessId)
      setBusiness(data)
    } catch (err) {
      setError(err.message || 'Failed to load business')
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime)
    setStep(3)
  }

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDateTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const appointment = {
        businessId: parseInt(businessId, 10),
        customerId: `customer_${Date.now()}`, // Generate unique customer ID
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        serviceId: selectedService.Id,
        serviceName: selectedService.name,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: customerInfo.notes
      }

      const result = await appointmentService.create(appointment)
      
      toast.success('Booking confirmed successfully!')
      
      // Navigate to bookings page or confirmation
      navigate('/bookings', { 
        state: { 
          newBooking: result,
          showConfirmation: true 
        } 
      })
    } catch (err) {
      toast.error(err.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const goToStep = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader count={3} className="h-24 mb-4" />
          </div>
          <div>
            <SkeletonLoader className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={error}
          onRetry={loadBusiness}
        />
      </div>
    )
  }

  if (!business) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-full"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate(`/business/${businessId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Back to {business.name}
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Complete your booking in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { step: 1, label: 'Choose Service' },
            { step: 2, label: 'Select Time' },
            { step: 3, label: 'Your Details' }
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <button
                onClick={() => goToStep(item.step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= item.step
                    ? 'bg-primary text-white'
                    : 'bg-surface-200 text-gray-500'
                } ${step > item.step ? 'cursor-pointer hover:bg-primary/90' : ''}`}
              >
                {step > item.step ? <ApperIcon name="Check" className="w-5 h-5" /> : item.step}
              </button>
              <span className={`ml-2 font-medium ${step >= item.step ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-4 ${step > item.step ? 'bg-primary' : 'bg-surface-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Choose Service */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Choose a Service</h2>
                  <div className="space-y-4">
                    {business.services.map((service) => (
                      <ServiceCard
                        key={service.Id}
                        service={service}
                        onSelect={handleServiceSelect}
                        selected={selectedService?.Id === service.Id}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Date & Time */}
              {step === 2 && selectedService && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <BookingCalendar
                    businessId={businessId}
                    selectedService={selectedService}
                    onDateTimeSelect={handleDateTimeSelect}
                  />
                </motion.div>
              )}

              {/* Step 3: Customer Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none"
                        placeholder="Any special requests or information..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmitBooking}
                      loading={submitting}
                      disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                      className="flex-1"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {/* Business Info */}
              <div className="mb-4 pb-4 border-b border-surface-200">
                <h4 className="font-medium text-gray-900">{business.name}</h4>
                <p className="text-sm text-gray-600">{business.location.area}, {business.location.city}</p>
              </div>

              {/* Selected Service */}
              {selectedService && (
                <div className="mb-4 pb-4 border-b border-surface-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Service</span>
                    <button
                      onClick={() => goToStep(1)}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{selectedService.name}</p>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>{selectedService.duration} minutes</span>
                    <span className="font-semibold text-primary">${selectedService.price}</span>
                  </div>
                </div>
              )}

              {/* Selected Date & Time */}
              {selectedDateTime && (
                <div className="mb-4 pb-4 border-b border-surface-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Date & Time</span>
                    <button
                      onClick={() => goToStep(2)}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedDateTime.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(selectedDateTime.time)}
                  </p>
                </div>
              )}

              {/* Customer Info */}
              {step === 3 && customerInfo.name && (
                <div className="mb-4 pb-4 border-b border-surface-200">
                  <span className="font-medium text-gray-900">Customer</span>
                  <p className="text-sm text-gray-600">{customerInfo.name}</p>
                  <p className="text-sm text-gray-600">{customerInfo.email}</p>
                  <p className="text-sm text-gray-600">{customerInfo.phone}</p>
                </div>
              )}

              {/* Total */}
              {selectedService && (
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${selectedService.price}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BookingFlow