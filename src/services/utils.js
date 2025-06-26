export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const generateTimeSlots = (startTime = '09:00', endTime = '18:00', interval = 30) => {
  const slots = []
  const start = new Date(`1970-01-01T${startTime}:00`)
  const end = new Date(`1970-01-01T${endTime}:00`)
  
  while (start < end) {
    slots.push(start.toTimeString().slice(0, 5))
    start.setMinutes(start.getMinutes() + interval)
  }
  
  return slots
}