import { delay } from "@/services/utils";
import businessData from "@/services/mockData/businesses.json";

let businesses = [...businessData]

export const businessService = {
  async getAll() {
    await delay(300)
    return [...businesses]
  },

  async getById(id) {
    await delay(200)
    const business = businesses.find(b => b.Id === parseInt(id, 10))
    if (!business) {
      throw new Error('Business not found')
    }
    return { ...business }
  },

  async searchBusinesses(query, location, category) {
    await delay(400)
    let filtered = [...businesses]

    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm) ||
        b.description.toLowerCase().includes(searchTerm) ||
        b.services.some(s => s.name.toLowerCase().includes(searchTerm))
      )
    }

    if (location) {
      const locationTerm = location.toLowerCase()
      filtered = filtered.filter(b => 
        b.location.city.toLowerCase().includes(locationTerm) ||
        b.location.area.toLowerCase().includes(locationTerm)
      )
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(b => b.type === category)
    }

    return filtered
  },

  async getFeaturedBusinesses() {
    await delay(250)
    return businesses.filter(b => b.featured).slice(0, 6)
  },

  async getBusinessesByCategory(category) {
    await delay(300)
    return businesses.filter(b => b.type === category)
  },

async create(business) {
    await delay(500)
    const newBusiness = {
      ...business,
      Id: Math.max(...businesses.map(b => b.Id), 0) + 1,
      rating: 0,
      reviewCount: 0,
      featured: false,
      email: business.email || '',
      phone: business.phone || '',
      ownerName: business.ownerName || '',
      createdAt: new Date().toISOString(),
      services: business.services || []
    }
    businesses.push(newBusiness)
    return { ...newBusiness }
  },

  async update(id, data) {
    await delay(400)
    const index = businesses.findIndex(b => b.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Business not found')
    }
    
    const updatedBusiness = { ...businesses[index], ...data }
    // Prevent Id modification
    updatedBusiness.Id = businesses[index].Id
    businesses[index] = updatedBusiness
    return { ...updatedBusiness }
  },

  async delete(id) {
    await delay(300)
    const index = businesses.findIndex(b => b.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Business not found')
    }
    
    businesses.splice(index, 1)
    return { success: true }
  },

  async authenticate(email, password) {
    await delay(300)
    const business = businesses.find(b => b.email === email)
    if (!business) {
      throw new Error('Business not found')
    }
    
    // In a real app, would verify password hash
    return {
      businessId: business.Id,
      email: business.email,
      name: business.name
    }
  },

  async updateServices(businessId, services) {
    await delay(400)
    const index = businesses.findIndex(b => b.Id === parseInt(businessId, 10))
    if (index === -1) {
      throw new Error('Business not found')
    }
    
businesses[index].services = services
    return { ...businesses[index] }
  }
}