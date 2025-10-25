import React, { useState } from 'react'
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Bell, 
  Settings, 
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  FileText,
  Star,
  Package,
  LogOut
} from 'lucide-react'

const ServiceProviderDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')

  // Sample data for service provider
  const stats = [
    { label: 'Active Projects', value: '8', change: '+1', icon: Package, color: 'blue' },
    { label: 'Monthly Revenue', value: '$12,480', change: '+18%', icon: DollarSign, color: 'green' },
    { label: 'Client Messages', value: '16', change: '+3', icon: MessageSquare, color: 'purple' },
    { label: 'Avg. Rating', value: '4.8/5', change: '+0.2', icon: Star, color: 'yellow' }
  ]

  const activeProjects = [
    { name: 'E-commerce Platform', client: 'Retail Corp', deadline: '2024-02-15', budget: '$8,000', progress: 60 },
    { name: 'Mobile App UI/UX', client: 'Startup Tech', deadline: '2024-02-28', budget: '$4,500', progress: 30 },
    { name: 'API Integration', client: 'Finance LLC', deadline: '2024-02-10', budget: '$3,200', progress: 85 }
  ]

  const recentInquiries = [
    { project: 'Website Redesign', client: 'Local Business', budget: '$2,500', time: '2 hours ago' },
    { project: 'CRM Development', client: 'Enterprise Co', budget: '$15,000', time: '5 hours ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ProviderPro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                  alt="Profile"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-gray-600 mt-2">Manage your services and grow your business.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{user.rating}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{user.totalProjects} projects</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Create Proposal
                </button>
              </div>
              
              <div className="space-y-4">
                {activeProjects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">Client: {project.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{project.budget}</p>
                        <p className="text-sm text-gray-500">Due: {project.deadline}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Update Progress
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                        Message Client
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">New Inquiries</h2>
              <div className="space-y-4">
                {recentInquiries.map((inquiry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{inquiry.project}</h3>
                    <p className="text-sm text-gray-600 mb-2">Client: {inquiry.client}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-600">{inquiry.budget}</span>
                      <div className="flex space-x-2">
                        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                          Accept
                        </button>
                        <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
                          Decline
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{inquiry.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-semibold text-gray-900">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-semibold text-gray-900">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="font-semibold text-gray-900">65%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Proposals</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Messages</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Earnings</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <Settings className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceProviderDashboard