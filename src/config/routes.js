import BusinessDashboard from "@/components/pages/BusinessDashboard";
import React from "react";
import ForBusiness from "@/components/pages/ForBusiness";
import BookingFlow from "@/components/pages/BookingFlow";
import Home from "@/components/pages/Home";
import Search from "@/components/pages/Search";
import MyBookings from "@/components/pages/MyBookings";
import BusinessProfile from "@/components/pages/BusinessProfile";

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
  },
  businessDashboard: {
    id: 'businessDashboard',
    label: 'Business Dashboard',
    path: '/business/dashboard',
    icon: 'BarChart3',
    component: BusinessDashboard,
    hidden: true
  }
}

export const routeArray = Object.values(routes)