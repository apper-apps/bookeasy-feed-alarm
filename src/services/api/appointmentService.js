import { delay } from '../utils'
import appointmentData from '../mockData/appointments.json'

let appointments = [...appointmentData]

export const appointmentService = {
  async getAll() {
    await delay(300)
    return [...appointments]
  },

  async getById(id) {
    await delay(200)
    const appointment = appointments.find(a => a.Id === parseInt(id, 10))
    if (!appointment) {
      throw new Error('Appointment not found')
    }
    return { ...appointment }
  },

  async getByCustomerId(customerId) {
    await delay(300)
    return appointments.filter(a => a.customerId === customerId)
  },

  async getByBusinessId(businessId) {
    await delay(300)
    return appointments.filter(a => a.businessId === parseInt(businessId, 10))
  },

  async getAvailableSlots(businessId, date) {
    await delay(400)
    // Mock available time slots for a given business and date
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ]

    // Filter out booked slots
    const bookedSlots = appointments
      .filter(a => 
        a.businessId === parseInt(businessId, 10) && 
        a.date === date && 
        a.status !== 'cancelled'
      )
      .map(a => a.time)

    return baseSlots
      .filter(slot => !bookedSlots.includes(slot))
      .map(time => ({
        time,
        available: true,
        duration: 60 // Default duration in minutes
      }))
  },

  async create(appointment) {
    await delay(500)
    const newAppointment = {
      ...appointment,
      Id: Math.max(...appointments.map(a => a.Id)) + 1,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    appointments.push(newAppointment)
    return { ...newAppointment }
  },

  async update(id, data) {
    await delay(400)
    const index = appointments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    const updatedAppointment = { ...appointments[index], ...data }
    delete updatedAppointment.Id // Prevent Id modification
    appointments[index] = updatedAppointment
    return { ...updatedAppointment }
  },

  async cancel(id) {
    await delay(300)
    const index = appointments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    appointments[index].status = 'cancelled'
    return { ...appointments[index] }
  },

  async delete(id) {
    await delay(300)
    const index = appointments.findIndex(a => a.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    appointments.splice(index, 1)
    return { success: true }
  }
}

export default appointmentService