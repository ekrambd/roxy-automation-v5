import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, LogOut, Menu, X, Check, ShoppingBag, ShoppingCart, ClipboardList, Package, LayoutDashboard, User, Code, Truck, CreditCard, Tag, Boxes, Store, Globe, Layout, Layers, Bell, Coins, Send, Sparkles, Eye, Bookmark, Camera, HeartHandshake, Zap, Mail,
  ChevronDown, FolderTree
} from 'lucide-react';
import { dbService, subscribeToOrders } from '../lib/dbService';
import { ApiClient } from '../services/apiClient';
import { BookOrder, ActiveTab, Product, Customer } from '../types';
import DashboardOverview from './DashboardOverview';
import ProfileSettings from './ProfileSettings';
import { lazy, Suspense } from 'react';
const OrderManager = lazy(() => import('./OrderManager'));
const ProductManager = lazy(() => import('./ProductManager'));
const CustomerManager = lazy(() => import('./CustomerManager'));
const CouponManager = lazy(() => import('./CouponManager'));
const ContactMessagesManager = lazy(() => import('./ContactMessagesManager'));
const StockInventoryManager = lazy(() => import('./StockInventoryManager'));
const CategoryManager = lazy(() => import('./CategoryManager'));
const BrandManager = lazy(() => import('./BrandManager'));
const LandingPageManager = lazy(() => import('./LandingPageManager'));
const PixelSettingsManager = lazy(() => import('./PixelSettingsManager'));
const CourierSettingsManager = lazy(() => import('./CourierSettingsManager'));
const PaymentSettingsManager = lazy(() => import('./PaymentSettingsManager'));
const DeliverySettingsManager = lazy(() => import('./DeliverySettingsManager'));
const AboutUsManager = lazy(() => import('./AboutUsManager'));
const FlashSaleManager = lazy(() => import('./FlashSaleManager'));
const HighlightSpotlightManager = lazy(() => import('./HighlightSpotlightManager'));
import { TabContentSkeleton } from './LoadingSkeleton';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  adminEmail: string;
  onLogout: () => void;
}

export default function AdminDashboard({ adminEmail, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // App States
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewsOverview, setViewsOverview] = useState<{ websiteViews: number; landingViews: number; totalProductViews: number }>({ websiteViews: 0, landingViews: 0, totalProductViews: 0 });
  const [loading, setLoading] = useState(true);

  // New order toast state
  const [newOrderToast, setNewOrderToast] = useState<BookOrder | null>(null);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio not available
    }
  }, []);

  // Load initial data then subscribe to real-time orders
  useEffect(() => {
    async function loadInitial() {
      try {
        const [orderList, prodList, custList, settings] = await Promise.all([
          dbService.getBookOrders(),
          dbService.getProducts(),
          dbService.getCustomers(),
          dbService.getEcomSettings()
        ]);
        
        // Update Favicon based on settings
        if (settings.storeLogo) {
          let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = settings.storeLogo;
        }

        // Seed known IDs from initial fetch (no toast for these)
        orderList.forEach(o => knownOrderIds.current.add(o.id));
        setOrders(orderList);
        setProducts(prodList);
        setCustomers(custList);

        // Run auto-sync of Steadfast courier status in the background
        setTimeout(async () => {
          try {
            const inTransit = orderList.filter(o => o.steadfastTrackingCode && o.status !== 'Delivered' && o.status !== 'Cancelled');
            if (inTransit.length > 0) {
              const settings = await dbService.getEcomSettings();
              const earnRate = settings.pointsEarnRate || 10;
              
              for (const order of inTransit) {
                try {
                  const result = await ApiClient.getSteadfastStatus(order.steadfastTrackingCode!);
                  const normalized = result.status.toLowerCase();
                  const newStatus = normalized === 'delivered'
                    ? 'Delivered'
                    : normalized.includes('cancelled')
                      ? 'Cancelled'
                      : order.status;

                  if (newStatus !== order.status) {
                    await dbService.updateBookOrder({ 
                      ...order, 
                      status: newStatus, 
                      steadfastStatus: result.status 
                    });

                    if (settings.pointsEnabled) {
                      const earnedPoints = Math.floor(((order.price || 0) * earnRate) / 100);
                      if (earnedPoints > 0) {
                        const customer = custList.find(c => c.id === order.phone || c.phone === order.phone);
                        if (customer) {
                          let newPoints = customer.points || 0;
                          if (newStatus === 'Delivered') {
                            newPoints += earnedPoints;
                          }
                          await dbService.saveCustomer({
                            ...customer,
                            points: newPoints
                          });
                        }
                      }
                    }
                  }
                } catch (singleErr) {
                  console.warn('Auto steadfast sync failed for order:', order.id, singleErr);
                }
              }
            }
          } catch (syncErr) {
            console.error('Error running steadfast auto-sync:', syncErr);
          }
        }, 1500);
        dbService.getGlobalViews().then(setViewsOverview).catch(() => {});
        document.title = 'E-commerce Admin | Watch Store';
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
    loadInitial();

    const handleSettingsUpdate = async () => {
      try {
        const settings = await dbService.getEcomSettings();
        if (settings.storeName) {
          document.title = `E-commerce Admin | ${settings.storeName}`;
        }
        dbService.getGlobalViews().then(setViewsOverview).catch(() => {});
        if (settings.storeLogo) {
          let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = settings.storeLogo;
        }
      } catch (e) {}
    };

    window.addEventListener('ecom-settings-updated', handleSettingsUpdate);

    // Real-time Firestore listener for orders
    const unsubOrders = subscribeToOrders((liveOrders) => {
      if (isFirstLoad.current) return; // skip during initial load
      setOrders(liveOrders);

      // Detect brand-new orders
      liveOrders.forEach(o => {
        if (!knownOrderIds.current.has(o.id)) {
          knownOrderIds.current.add(o.id);
          // Show toast for the newest order
          setNewOrderToast(o);
          playNotificationSound();
          // Auto-dismiss after 6 seconds
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(() => setNewOrderToast(null), 6000);
        }
      });
    });

    const handleSync = () => {
      dbService.getProducts().then(setProducts);
      dbService.getCustomers().then(setCustomers);
    };
    window.addEventListener('ecom-products-updated', handleSync);

    return () => {
      unsubOrders();
      window.removeEventListener('ecom-products-updated', handleSync);
      window.removeEventListener('ecom-settings-updated', handleSettingsUpdate);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [playNotificationSound]);

  // Handlers for products
  const handleAddProduct = async (product: Product) => {
    const added = await dbService.addProduct(product);
    setProducts(prev => [added, ...prev.filter(p => p.id !== added.id)]);
  };

  const handleUpdateProduct = async (product: Product) => {
    const updated = await dbService.updateProduct(product);
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = async (id: string) => {
    await dbService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Handlers for book order management
  const handleAddOrder = async (order: BookOrder) => {
    const added = await dbService.addBookOrder(order);
    setOrders(prev => [added, ...prev.filter(o => o.id !== added.id)]);
    const updatedCust = await dbService.getCustomers();
    setCustomers(updatedCust);
  };

  const handleUpdateOrder = async (order: BookOrder) => {
    const oldOrder = orders.find(o => o.id === order.id);
    const wasDelivered = oldOrder?.status === 'Delivered';
    const isNowDelivered = order.status === 'Delivered';

    const updated = await dbService.updateBookOrder(order);

    try {
      const settings = await dbService.getEcomSettings();
      if (settings.pointsEnabled) {
        const earnRate = settings.pointsEarnRate || 10;
        const earnedPoints = Math.floor(((order.price || 0) * earnRate) / 100);
        
        if (earnedPoints > 0) {
          const cleanPhone = order.phone.trim();
          const customersList = await dbService.getCustomers();
          const customer = customersList.find(c => c.id === cleanPhone || c.phone === cleanPhone);

          if (customer) {
            let newPoints = customer.points || 0;
            if (isNowDelivered && !wasDelivered) {
              newPoints += earnedPoints;
            } else if (wasDelivered && !isNowDelivered) {
              newPoints = Math.max(0, newPoints - earnedPoints);
            }

            if (newPoints !== (customer.points || 0)) {
              await dbService.saveCustomer({
                ...customer,
                points: newPoints
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('Error updating customer points:', err);
    }

    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    const updatedCust = await dbService.getCustomers();
    setCustomers(updatedCust);
  };

  const handleDeleteOrder = async (id: string) => {
    await dbService.deleteBookOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    const updatedCust = await dbService.getCustomers();
    setCustomers(updatedCust);
  };

  interface SidebarMenuItem {
    id: ActiveTab | 'logout';
    label: string;
    icon: any;
    isLogout?: boolean;
    badge?: string;
  }

  interface SidebarGroup {
    id: string;
    title: string;
    items: SidebarMenuItem[];
  }

  const sidebarGroups: SidebarGroup[] = [
    {
      id: 'group_core',
      title: 'Dashboard & Products',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventory', icon: Boxes },
        { id: 'products', label: 'Product', icon: Package },
      ]
    },
    {
      id: 'group_sales',
      title: 'Orders & Customers',
      items: [
        { id: 'orders', label: 'Order', icon: ShoppingBag, badge: orders.length > 0 ? `${orders.length}` : undefined },
        { id: 'customers', label: 'Customer', icon: Users },
        { id: 'contact_messages', label: 'Messages', icon: Mail },
      ]
    },
    {
      id: 'group_taxonomy',
      title: 'Categories & Brands',
      items: [
        { id: 'category_management', label: 'Category', icon: Layers },
        { id: 'subcategory_management', label: 'Sub Category', icon: FolderTree },
        { id: 'brand_management', label: 'Brand', icon: Bookmark },
      ]
    },
    {
      id: 'group_marketing',
      title: 'Promotions & Campaigns',
      items: [
        { id: 'coupons', label: 'Coupon', icon: Tag },
        { id: 'flash_sale', label: 'Flash Sale', icon: Zap },
        { id: 'highlight_spotlight', label: 'Highlight', icon: Sparkles },
        { id: 'landing_setup', label: 'Landing', icon: Globe },
        { id: 'about_settings', label: 'About Us', icon: HeartHandshake },
      ]
    },
    {
      id: 'group_logistics',
      title: 'Logistics & Payments',
      items: [
        { id: 'courier_settings', label: 'Courier', icon: Send },
        { id: 'delivery_settings', label: 'Delivery Method', icon: Truck },
        { id: 'payment_settings', label: 'Payment', icon: CreditCard },
      ]
    },
    {
      id: 'group_settings',
      title: 'Settings & System',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'pixel_settings', label: 'GTM', icon: Code },
        { id: 'logout', label: 'Logout', icon: LogOut, isLogout: true },
      ]
    }
  ];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    group_core: true,
    group_sales: true,
    group_taxonomy: true,
    group_marketing: true,
    group_logistics: true,
    group_settings: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Keep active tab's parent group expanded
  useEffect(() => {
    const parentGroup = sidebarGroups.find(g => g.items.some(i => i.id === activeTab));
    if (parentGroup && expandedGroups[parentGroup.id] === false) {
      setExpandedGroups(prev => ({ ...prev, [parentGroup.id]: true }));
    }
  }, [activeTab]);

  const renderSidebarNav = (isMobile = false) => (
    <div className="space-y-2.5">
      {sidebarGroups.map((group) => {
        const isExpanded = expandedGroups[group.id] !== false;
        const hasActiveItem = group.items.some(i => i.id === activeTab);

        return (
          <div key={group.id} className="rounded-xl transition-all">
            {/* Collapsible Group Header Button */}
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all select-none cursor-pointer group"
            >
              <span className={`truncate ${hasActiveItem ? 'text-teal-400 font-extrabold' : ''}`}>
                {group.title}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 shrink-0 ${
                  isExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {/* Collapsible Submenu */}
            {isExpanded && (
              <div className="space-y-0.5 mt-1 ml-1.5 pl-1.5 border-l border-slate-800 animate-fadeIn">
                {group.items.map((item) => {
                  if (item.isLogout) {
                    return (
                      <button
                        key="item-logout"
                        type="button"
                        onClick={() => {
                          if (isMobile) setSidebarOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer"
                      >
                        <div className="flex items-center min-w-0">
                          <LogOut className="h-3.5 w-3.5 mr-2 shrink-0 text-rose-400" />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as ActiveTab);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center min-w-0">
                        <Icon className={`h-3.5 w-3.5 mr-2 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-teal-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="admin-scope min-h-screen bg-slate-50 flex font-sans text-slate-800">

      {/* ===== New Order Toast Notification ===== */}
      <AnimatePresence>
        {newOrderToast && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-[9999] w-80 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-700 overflow-hidden"
          >
            {/* Progress bar */}
            <motion.div
              className="h-1 bg-teal-400"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-teal-500/20 rounded-xl shrink-0 mt-0.5">
                <Bell className="h-5 w-5 text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-400 mb-0.5">🎉 New Order Received!</p>
                <p className="text-sm font-bold text-white truncate">{newOrderToast.customerName || 'Unknown Customer'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{newOrderToast.id} · Tk.{(newOrderToast.total ?? 0).toLocaleString()}</p>
                <button
                  onClick={() => { setActiveTab('orders'); setNewOrderToast(null); }}
                  className="mt-2 text-[11px] font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
                >
                  View Order →
                </button>
              </div>
              <button
                onClick={() => setNewOrderToast(null)}
                className="text-slate-500 hover:text-white cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex lg:flex-col lg:w-56 bg-slate-900 text-slate-400 border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        {/* Title / Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800 space-x-2.5 text-white">
          <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold leading-tight text-white truncate">E-commerce Admin</h1>
            <span className="text-[10px] text-teal-400 block font-medium truncate">Control Panel</span>
          </div>
        </div>

        {/* Grouped Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {renderSidebarNav(false)}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center px-3 py-2 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 h-full"
            >
              <div className="absolute top-3.5 right-3">
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="h-16 flex items-center px-4 border-b border-slate-800 space-x-2.5 text-white">
                <ShoppingBag className="h-6 w-6 text-teal-400 shrink-0" />
                <div className="min-w-0 pr-6">
                  <h1 className="text-xs font-bold leading-tight truncate">E-commerce Admin</h1>
                  <span className="text-[10px] text-teal-400 block truncate">Control Panel</span>
                </div>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {renderSidebarNav(true)}
              </nav>

              <div className="p-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={onLogout}
                  className="w-full inline-flex items-center justify-center px-3 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Core Body Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
              title="Open the menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg">
              {sidebarGroups.flatMap(g => g.items).find(m => m.id === activeTab)?.label || 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">

          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-1 overflow-y-auto w-full max-w-full px-4 py-5 sm:px-6 sm:py-6">
          {loading ? (
            <TabContentSkeleton />
          ) : (
            <Suspense fallback={<TabContentSkeleton />}>
              <div className="min-h-full">
                {activeTab === 'dashboard' && (
                  <DashboardOverview 
                    products={products}
                    orders={orders}
                    customers={customers}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}
                {activeTab === 'products' && (
                  <ProductManager 
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}
                {activeTab === 'orders' && (
                  <OrderManager 
                    orders={orders}
                    products={products}
                    onAddOrder={handleAddOrder}
                    onUpdateOrder={handleUpdateOrder}
                    onDeleteOrder={handleDeleteOrder}
                  />
                )}
                {activeTab === 'inventory' && (
                  <StockInventoryManager />
                )}
                {activeTab === 'customers' && (
                  <CustomerManager 
                    customers={customers}
                  />
                )}
                {activeTab === 'coupons' && (
                  <CouponManager />
                )}
                {activeTab === 'contact_messages' && (
                  <ContactMessagesManager />
                )}
                {(activeTab === 'category_management' || activeTab === 'subcategory_management') && (
                  <CategoryManager />
                )}
                {activeTab === 'brand_management' && (
                  <BrandManager />
                )}
                {activeTab === 'flash_sale' && (
                  <FlashSaleManager 
                    products={products}
                  />
                )}
                {activeTab === 'highlight_spotlight' && (
                  <HighlightSpotlightManager 
                    products={products}
                  />
                )}
                {activeTab === 'about_settings' && (
                  <AboutUsManager />
                )}
                {activeTab === 'landing_setup' && (
                  <LandingPageManager />
                )}
                {activeTab === 'payment_settings' && (
                  <PaymentSettingsManager />
                )}
                {activeTab === 'delivery_settings' && (
                  <DeliverySettingsManager />
                )}
                {activeTab === 'pixel_settings' && (
                  <PixelSettingsManager />
                )}
                {activeTab === 'courier_settings' && (
                  <CourierSettingsManager />
                )}
                {activeTab === 'profile' && (
                  <ProfileSettings 
                    adminEmail={adminEmail}
                  />
                )}
              </div>
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
