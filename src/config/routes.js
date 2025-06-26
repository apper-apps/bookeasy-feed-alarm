import Home from '@/components/pages/Home'
import Search from '@/components/pages/Search'
import BusinessProfile from '@/components/pages/BusinessProfile'
import BookingFlow from '@/components/pages/BookingFlow'
import MyBookings from '@/components/pages/MyBookings'
import ForBusiness from '@/components/pages/ForBusiness'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  businessProfile: {
    id: 'businessProfile',
    label: 'Business Profile',
    path: '/business/:id',
    icon: 'Building2',
    component: BusinessProfile,
    hidden: true
  },
  bookingFlow: {
    id: 'bookingFlow',
    label: 'Book Appointment',
    path: '/book/:businessId',
    icon: 'Calendar',
    component: BookingFlow,
    hidden: true
  },
  myBookings: {
    id: 'myBookings',
    label: 'My Bookings',
    path: '/bookings',
    icon: 'CalendarCheck',
    component: MyBookings
  },
  forBusiness: {
    id: 'forBusiness',
    label: 'For Business',
    path: '/for-business',
    icon: 'Building',
    component: ForBusiness
  }
}

export const routeArray = Object.values(routes)