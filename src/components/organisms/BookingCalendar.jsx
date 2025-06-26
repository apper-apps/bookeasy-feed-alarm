import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns'
import Button from '@/components/atoms/Button'
import TimeSlot from '@/components/molecules/TimeSlot'
import ApperIcon from '@/components/ApperIcon'
import { appointmentService } from '@/services/api/appointmentService'

const BookingCalendar = ({ 
  businessId, 
  selectedService,
  onDateTimeSelect,
  className = ''
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()))

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  useEffect(() => {
    if (businessId && selectedDate) {
      loadAvailableSlots()
    }
  }, [businessId, selectedDate])

  const loadAvailableSlots = async () => {
    setLoading(true)
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      const slots = await appointmentService.getAvailableSlots(businessId, dateString)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to load available slots:', error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    onDateTimeSelect({
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: time,
      dateTime: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`)
    })
  }

  const navigateWeek = (direction) => {
    const newWeek = addDays(currentWeek, direction * 7)
    setCurrentWeek(newWeek)
  }

  const isDateDisabled = (date) => {
    return isBefore(date, new Date()) && !isToday(date)
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Date & Time
      </h3>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          icon="ChevronLeft"
          onClick={() => navigateWeek(-1)}
        />
        <h4 className="font-medium text-gray-700">
          {format(currentWeek, 'MMMM yyyy')}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          icon="ChevronRight"
          onClick={() => navigateWeek(1)}
        />
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate)
          const isDisabled = isDateDisabled(date)
          const isCurrentDay = isToday(date)

          return (
            <motion.button
              key={index}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => !isDisabled && handleDateSelect(date)}
              disabled={isDisabled}
              className={`
                p-3 text-center rounded-lg transition-all duration-200
                ${isSelected
                  ? 'bg-primary text-white shadow-md'
                  : isCurrentDay
                    ? 'bg-primary/10 text-primary border border-primary'
                    : isDisabled
                      ? 'bg-surface-100 text-surface-400 cursor-not-allowed'
                      : 'bg-surface-50 text-gray-700 hover:bg-primary/5 hover:text-primary'
                }
              `}
            >
              <div className="text-xs font-medium mb-1">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-semibold">
                {format(date, 'd')}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Time Selection */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Available Times</h4>
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading available times...</span>
            </motion.div>
          ) : availableSlots.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
            >
              {availableSlots.map((slot) => (
                <TimeSlot
                  key={slot.time}
                  time={slot.time}
                  available={slot.available}
                  selected={selectedTime === slot.time}
                  onSelect={handleTimeSelect}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-gray-500"
            >
              <ApperIcon name="CalendarX" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No available times for this date</p>
              <p className="text-sm">Please select a different date</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookingCalendar