'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ClipboardList,
  BarChart3,
  BookOpen,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronRight,
  Activity,
  ShieldCheck,
  Search,
  Building2,
  Clock,
  Heart,
  Star
} from 'lucide-react'
import PWAInstallButton from '@/components/PWAInstallButton'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    category: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Footfall', href: '/admin/footfall', icon: Activity },
    ]
  },
  {
    category: 'MANAGEMENT',
    items: [
      { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
      { name: 'Business Enquiries', href: '/admin/business-enquiries', icon: Building2 },
    ]
  },
  {
    category: 'CONTENT',
    items: [
      { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
      { name: 'Comments', href: '/admin/blogs/comments', icon: MessageSquare },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ]
  },
  {
    category: 'SYSTEM',
    items: [
      { name: 'Email Queue', href: '/admin/email-queue', icon: Clock },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [blogActivity, setBlogActivity] = useState([])
  const [enquiryUnreadCount, setEnquiryUnreadCount] = useState(0)
  const [blogUnreadCount, setBlogUnreadCount] = useState(0)
  const [showEnquiryDropdown, setShowEnquiryDropdown] = useState(false)
  const [showBlogDropdown, setShowBlogDropdown] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-notifications.php`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEnquiries(data.data.enquiries.recent);
        setBlogActivity(data.data.blog_activity.recent);
        setEnquiryUnreadCount(data.data.enquiries.count);
        setBlogUnreadCount(data.data.blog_activity.comment_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        } else {
          setIsLoading(false)
        }
      } else {
        setIsAuthenticated(true)
        setIsLoading(false)
        try {
          const stored = localStorage.getItem('adminUser')
          setAdminUser(stored ? JSON.parse(stored) : null)
        } catch { setAdminUser(null) }
        fetchNotifications();

        // Poll for new notifications every minute
        const interval = setInterval(fetchNotifications, 60000);

        // Listen for internal events to refresh counts instantly
        window.addEventListener('enquiryStatusUpdated', fetchNotifications);

        return () => {
          clearInterval(interval);
          window.removeEventListener('enquiryStatusUpdated', fetchNotifications);
        };
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // If we are on the login page, don't show the sidebar/header layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans admin-root">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - fixed on all screens, slides in/out on mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#0F172A] shadow-2xl lg:shadow-none
        transform transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800/40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 relative overflow-hidden shrink-0">
          <Link href="/admin" className="relative flex items-start flex-col">
            <img
              src="/assets/logo.svg"
              alt="Speedy Laundry"
              className="h-10 lg:h-12 w-auto brightness-0 invert"
            />
            <span
              className="text-md text-primary select-none whitespace-nowrap"
              style={{ fontFamily: 'Pacifico, cursive' }}
            >
              Admin Console
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide space-y-6 pb-8 pt-4">
          {navigation.map((section, idx) => (
            <div key={idx}>
              <div className="px-4 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-50">
                {section.category}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/admin/settings' && pathname.startsWith('/admin/settings')) || (item.href === '/admin/reviews' && pathname.startsWith('/admin/reviews')) || (item.href === '/admin/email-queue' && pathname.startsWith('/admin/email-queue'))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm
                        ${isActive
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/40 bg-[#0A0F1E]/50 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {(adminUser?.username || 'AD').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-300 truncate tracking-wide">{adminUser?.username || 'Administrator'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper - offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen ml-0 lg:ml-64">
        {/* Top Header */}
        <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100/50 rounded-2xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Page title removed from here as per USER request for minimal UI */}
          </div>

          <div className="flex items-center gap-3">
            {/* Action Group */}
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              
              {/* Enquiry Notifications */}
              <div className="relative group/notif">
                <button
                  onClick={() => {
                    const isOpen = !showEnquiryDropdown;
                    setShowEnquiryDropdown(isOpen)
                    setShowBlogDropdown(false)
                    if (isOpen) setEnquiryUnreadCount(0)
                  }}
                  className={`p-2.5 transition-all relative rounded-xl ${showEnquiryDropdown ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}
                >
                  <Bell className="w-5 h-5" />
                  {enquiryUnreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                      {enquiryUnreadCount > 10 ? '10+' : enquiryUnreadCount}
                    </span>
                  )}
                </button>

                {/* Enquiry Dropdown */}
                {showEnquiryDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowEnquiryDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col max-h-[450px]">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-3 h-3 text-primary" />
                            Enquiries
                          </h3>
                          <Link href="/admin/enquiries" onClick={() => setShowEnquiryDropdown(false)} className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                        </div>

                        <div className="overflow-y-auto scrollbar-hide">
                          {enquiries.length > 0 ? (
                            enquiries.map((notif) => (
                              <Link
                                key={notif.id}
                                href={`/admin/enquiries/${notif.id}`}
                                onClick={() => setShowEnquiryDropdown(false)}
                                className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.service === 'business-quote' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-primary'}`}>
                                  {notif.service === 'business-quote' ? <Building2 size={16} /> : <MessageSquare size={16} />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{notif.full_name}</p>
                                  <p className="text-[10px] text-slate-500 truncate mb-1">
                                    {notif.service === 'business-quote' ? 'New Business Quote Request' : 'New Contact Enquiry'}
                                  </p>
                                  <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(notif.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="p-8 text-center bg-white">
                              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell className="w-5 h-5 text-slate-300" />
                              </div>
                              <p className="text-xs text-slate-400 font-medium tracking-tight">No new enquiries</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Blog Activity Notifications */}
              <div className="relative group/blog">
                <button
                  onClick={() => {
                    const isOpen = !showBlogDropdown;
                    setShowBlogDropdown(isOpen)
                    setShowEnquiryDropdown(false)
                    if (isOpen) setBlogUnreadCount(0)
                  }}
                  className={`p-2.5 transition-all relative rounded-xl ${showBlogDropdown ? 'bg-pink-50 text-pink-600' : 'text-slate-400 hover:text-pink-600'}`}
                >
                  <Heart className="w-5 h-5" />
                  {blogUnreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                      {blogUnreadCount > 10 ? '10+' : blogUnreadCount}
                    </span>
                  )}
                </button>

                {/* Blog Dropdown */}
                {showBlogDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowBlogDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col max-h-[450px]">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-3 h-3 text-pink-500" />
                            Blog Activity
                          </h3>
                          <Link href="/admin/blogs" onClick={() => setShowBlogDropdown(false)} className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                        </div>

                        <div className="overflow-y-auto bg-white scrollbar-hide">
                          {blogActivity.length > 0 ? (
                            blogActivity.map((activity, idx) => (
                              <Link
                                key={idx}
                                href="/admin/blogs/comments"
                                onClick={() => setShowBlogDropdown(false)}
                                className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activity.type === 'like' ? 'bg-pink-50 text-pink-500' : 'bg-green-100 text-green-600'}`}>
                                  {activity.type === 'like' ? <Heart className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {activity.type === 'like' ? 'New Like' : (activity.name || 'New Comment')}
                                  </p>
                                  <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">
                                    {activity.type === 'like' ? `Liked "${activity.blog_title}"` : `Commented on "${activity.blog_title}"`}
                                  </p>
                                  {activity.type === 'comment' && (
                                    <p className="text-[10px] text-slate-400 italic mb-1 line-clamp-1">"{activity.content}"</p>
                                  )}
                                  <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(activity.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="p-8 text-center bg-white">
                              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star className="w-5 h-5 text-slate-300" />
                              </div>
                              <p className="text-xs text-slate-400 font-medium tracking-tight">No new blog activity</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <PWAInstallButton />
              <Link href="/admin/settings" className="p-2.5 text-slate-400 hover:text-slate-800 transition-all" title="Settings">
                <Settings className="w-5 h-5" />
              </Link>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden lg:block" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none mb-1 truncate max-w-[140px]">{adminUser?.username || 'Admin'}</p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminUser?.username || 'Admin')}&background=0F172A&color=fff&size=64`} alt={adminUser?.username || 'User'} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
          <div className="p-6 lg:p-12 max-w-[1400px] mx-auto min-h-full">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
