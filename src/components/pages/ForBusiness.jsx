import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { businessService } from "@/services/api/businessService";
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const ForBusiness = () => {
  const navigate = useNavigate()
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [registrationData, setRegistrationData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    businessType: '',
    address: '',
    city: '',
    description: '',
    services: [{ name: '', duration: '', price: '' }]
  })

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const features = [
    {
      icon: 'Calendar',
      title: 'Online Booking',
      description: 'Let customers book appointments 24/7 with our intuitive booking system'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Management',
      description: 'Manage your business on-the-go with our mobile-friendly dashboard'
    },
    {
      icon: 'Bell',
      title: 'Smart Notifications',
      description: 'Automated reminders and notifications to reduce no-shows'
    },
    {
      icon: 'BarChart3',
      title: 'Analytics Dashboard',
      description: 'Track your business performance with detailed analytics and reports'
    },
    {
      icon: 'Users',
      title: 'Customer Management',
      description: 'Build and maintain customer relationships with our CRM tools'
    },
    {
      icon: 'CreditCard',
      title: 'Payment Processing',
      description: 'Secure payment processing with multiple payment options'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      business: 'Glamour Hair Studio',
      rating: 5,
      text: 'BookEasy has transformed how we manage appointments. Our no-show rate dropped by 60%!'
    },
    {
      name: 'Dr. Michael Chen',
      business: 'Bright Smile Dental',
      rating: 5,
      text: 'The automated reminders and easy booking system have made our practice so much more efficient.'
    },
    {
      name: 'Emily Rodriguez',
      business: 'Zen Spa & Wellness',
      rating: 5,
      text: "We've seen a 40% increase in bookings since switching to BookEasy. Highly recommended!"
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 29,
      features: [
        'Up to 100 bookings/month',
        'Basic calendar management',
        'Email notifications',
        'Customer database',
        'Mobile app access'
      ]
    },
    {
      name: 'Professional',
      price: 59,
      popular: true,
      features: [
        'Unlimited bookings',
        'Advanced calendar features',
        'SMS & email notifications',
        'Analytics dashboard',
        'Payment processing',
        'Custom branding',
        'Multi-staff management'
      ]
    },
    {
      name: 'Enterprise',
      price: 99,
      features: [
        'Everything in Professional',
        'Multi-location support',
        'Advanced reporting',
        'API access',
        'Priority support',
        '24/7 phone support'
      ]
    }
  ]

  const businessTypes = [
    'salon', 'dental', 'spa', 'fitness', 'medical', 'consultancy', 'automotive', 'other'
  ]

  const handleRegistrationChange = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceChange = (index, field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }))
  }

  const addService = () => {
    setRegistrationData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', duration: '', price: '' }]
    }))
  }

  const removeService = (index) => {
    setRegistrationData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const businessData = {
        name: registrationData.businessName,
        ownerName: registrationData.ownerName,
        email: registrationData.email,
        phone: registrationData.phone,
        type: registrationData.businessType,
        description: registrationData.description,
        location: {
          address: registrationData.address,
          city: registrationData.city,
          area: registrationData.city
        },
        services: registrationData.services.filter(s => s.name.trim()),
        images: [`https://picsum.photos/800/600?random=${Date.now()}`],
        workingHours: {
          monday: { start: '09:00', end: '17:00', closed: false },
          tuesday: { start: '09:00', end: '17:00', closed: false },
          wednesday: { start: '09:00', end: '17:00', closed: false },
          thursday: { start: '09:00', end: '17:00', closed: false },
          friday: { start: '09:00', end: '17:00', closed: false },
          saturday: { start: '10:00', end: '16:00', closed: false },
          sunday: { start: '10:00', end: '16:00', closed: true }
        }
      }

      const result = await businessService.create(businessData)
      toast.success('Business registration successful! Welcome to BookEasy!')
      
      // Store business authentication (simplified for demo)
      localStorage.setItem('businessAuth', JSON.stringify({
        businessId: result.Id,
        email: registrationData.email
      }))
      
      navigate('/business/dashboard')
    } catch (error) {
      toast.error('Registration failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simplified login - in real app would use proper authentication
      const businesses = await businessService.getAll()
      const business = businesses.find(b => b.email === loginData.email)
      
      if (business) {
        localStorage.setItem('businessAuth', JSON.stringify({
          businessId: business.Id,
          email: business.email
        }))
        toast.success('Login successful!')
        navigate('/business/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (registrationStep < 3) {
      setRegistrationStep(registrationStep + 1)
    }
  }

  const prevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1)
    }
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
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Grow Your Business with BookEasy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join thousands of businesses using our platform to streamline appointments, 
              increase bookings, and delight customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="xl" 
                icon="UserPlus"
                className="text-lg px-8 py-4"
                onClick={() => setShowRegistration(true)}
              >
                Register Your Business
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                icon="LogIn"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => setShowLogin(true)}
              >
                Business Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Register Your Business - Step {registrationStep} of 3
              </h2>
              <button
                onClick={() => setShowRegistration(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="flex mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1">
                  <div className={`h-2 rounded-full ${
                    step <= registrationStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                  <p className={`text-sm mt-2 ${
                    step <= registrationStep ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Business Details' : 'Services'}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleRegistrationSubmit}>
              {registrationStep === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Business Name"
                    value={registrationData.businessName}
                    onChange={(e) => handleRegistrationChange('businessName', e.target.value)}
                    required
                    icon="Building"
                  />
                  <Input
                    label="Owner Name"
                    value={registrationData.ownerName}
                    onChange={(e) => handleRegistrationChange('ownerName', e.target.value)}
                    required
                    icon="User"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => handleRegistrationChange('email', e.target.value)}
                    required
                    icon="Mail"
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={registrationData.password}
                    onChange={(e) => handleRegistrationChange('password', e.target.value)}
                    required
                    icon="Lock"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => handleRegistrationChange('phone', e.target.value)}
                    required
                    icon="Phone"
                  />
                </div>
              )}

              {registrationStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={registrationData.businessType}
                      onChange={(e) => handleRegistrationChange('businessType', e.target.value)}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Address"
                    value={registrationData.address}
                    onChange={(e) => handleRegistrationChange('address', e.target.value)}
                    required
                    icon="MapPin"
                  />
                  <Input
                    label="City"
                    value={registrationData.city}
                    onChange={(e) => handleRegistrationChange('city', e.target.value)}
                    required
                    icon="MapPin"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={registrationData.description}
                      onChange={(e) => handleRegistrationChange('description', e.target.value)}
                      rows={4}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Tell customers about your business..."
                    />
                  </div>
                </div>
              )}

              {registrationStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Services</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon="Plus"
                      onClick={addService}
                    >
                      Add Service
                    </Button>
                  </div>
                  
                  {registrationData.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        {registrationData.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          label="Service Name"
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          required
                        />
                        <Input
                          label="Duration (mins)"
                          type="number"
                          value={service.duration}
                          onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                          required
                        />
                        <Input
                          label="Price ($)"
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={registrationStep === 1}
                >
                  Previous
                </Button>
                
                {registrationStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={loading}
                    icon="Check"
                  >
                    Register Business
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Business Login</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
                icon="Mail"
              />
              <Input
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
                icon="Lock"
              />
              
              <Button
                type="submit"
                fullWidth
                loading={loading}
                icon="LogIn"
                className="mt-6"
              >
                Sign In
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLogin(false)
                    setShowRegistration(true)
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to manage and grow your business.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Business Owners
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about their experience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-surface-50 p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <ApperIcon key={i} name="Star" className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`bg-white p-8 rounded-2xl shadow-sm relative ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                  </div>
                  <p className="text-gray-600">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <ApperIcon name="Check" className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  size="lg"
                  onClick={() => setShowRegistration(true)}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of businesses already using BookEasy to streamline their operations and grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="xl"
                icon="ArrowRight"
                className="text-lg px-8 py-4"
                onClick={() => setShowRegistration(true)}
              >
                Start Your Free Trial
              </Button>
              <Button 
                variant="outline"
                size="xl"
                icon="Phone"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default ForBusiness