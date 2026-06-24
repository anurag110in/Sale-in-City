import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, Store, Users, Bell, Calendar, MapPin, Search, Star, 
  CheckCircle, Plus, Trash2, Settings, LogOut, Copy, Download, 
  AlertCircle, Filter, ArrowLeft, Check, ChevronRight, Code, BookOpen, 
  RefreshCw, Play, Clock, Phone, Send, ShieldAlert, Heart, Share2, 
  Map, MessageSquare, Info, ChevronDown
} from "lucide-react";
import { androidCodebase, AndroidFile } from "./androidCodebase";
import {
  seedDatabaseIfEmpty,
  subscribeToShops,
  subscribeToSales,
  subscribeToNotifications,
  saveShop,
  saveSale,
  deleteSale,
  saveNotification,
  saveReview
} from "./firebaseSync";

// Constants
const CITIES = [
  "Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad",
  "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad",
  "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh",
  "Solapur", "Hubli-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurugram", "Noida", "Kochi",
  "Dehradun", "Shimla", "Jammu", "Thiruvananthapuram", "Panaji", "Mangaluru", "Udaipur", "Jamshedpur"
];
const CATEGORIES = ["Grocery", "Clothing", "Restaurant", "Electronics", "Bakery"];

interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

const COUNTRIES: CountryCode[] = [
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "India" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "SG", dialCode: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷", name: "France" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "LK", dialCode: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "NP", dialCode: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "BD", dialCode: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "PK", dialCode: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "NZ", dialCode: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "QA", dialCode: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "KW", dialCode: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "MY", dialCode: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "ID", dialCode: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "TH", dialCode: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "VN", dialCode: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "CH", dialCode: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "NL", dialCode: "+31", flag: "🇳🇱", name: "Netherlands" }
];

interface IndianPresetLocation {
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
}

const INDIAN_PRESET_LOCATIONS: IndianPresetLocation[] = [
  { name: "Koramangala 4th Block", city: "Bengaluru", address: "80 Feet Road, Near Maharaja Signal, Koramangala, Bengaluru, Karnataka 560034", lat: 12.9344, lng: 77.6244 },
  { name: "Indiranagar 100ft Rd", city: "Bengaluru", address: "100 Feet Rd, Hal 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038", lat: 12.9718, lng: 77.6411 },
  { name: "Bandra West, Mumbai", city: "Mumbai", address: "Plot 104, SV Road, Bandra West, Mumbai, Maharashtra 400050", lat: 19.0620, lng: 72.8340 },
  { name: "Nariman Point, Mumbai", city: "Mumbai", address: "Free Press Journal Marg, Nariman Point, Mumbai, Maharashtra 400021", lat: 18.9268, lng: 72.8228 },
  { name: "Connaught Place, Delhi", city: "Delhi", address: "Outer Circle, Block G, Connaught Place, New Delhi, Delhi 110001", lat: 28.6304, lng: 77.2177 },
  { name: "Chandni Chowk, Delhi", city: "Delhi", address: "Shop 4, Chandni Chowk Road, New Delhi, Delhi 110006", lat: 28.6562, lng: 77.2300 },
  { name: "Kothrud, Pune", city: "Pune", address: "Karve Road, Near Ideal Colony, Kothrud, Pune, Maharashtra 411038", lat: 18.5074, lng: 73.8077 },
  { name: "Hinjewadi Phase 1, Pune", city: "Pune", address: "Rajiv Gandhi Infotech Park, Hinjewadi, Pune, Maharashtra 411057", lat: 18.5913, lng: 73.7389 },
  { name: "Banjara Hills, Hyderabad", city: "Hyderabad", address: "Road No 12, Banjara Hills, Hyderabad, Telangana 500034", lat: 17.4156, lng: 78.4347 },
  { name: "Gachibowli, Hyderabad", city: "Hyderabad", address: "DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032", lat: 17.4447, lng: 78.3498 },
  { name: "T. Nagar, Chennai", city: "Chennai", address: "Pondy Bazaar, Thyagaraya Nagar, Chennai, Tamil Nadu 600017", lat: 13.0418, lng: 80.2337 },
  { name: "Adyar, Chennai", city: "Chennai", address: "Sardar Patel Road, Near IIT Main Gate, Adyar, Chennai, Tamil Nadu 600020", lat: 13.0064, lng: 80.2471 },
  { name: "Park Street, Kolkata", city: "Kolkata", address: "Mother Teresa Sarani, Park Street, Kolkata, West Bengal 700016", lat: 22.5473, lng: 88.3525 },
  { name: "Salt Lake Sector V, Kolkata", city: "Kolkata", address: "Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091", lat: 22.5735, lng: 88.4331 },
  { name: "C.G. Road, Ahmedabad", city: "Ahmedabad", address: "Chimanlal Girdharlal Rd, Navrangpura, Ahmedabad, Gujarat 380009", lat: 23.0258, lng: 72.5594 }
];

// Initial Mock Data
interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  reviewsCount: number;
  reviews: {
    id: string;
    customerName: string;
    score: number;
    comment: string;
    isRealPromo: boolean;
    timestamp: string;
  }[];
}

interface Sale {
  id: string;
  shopId: string;
  shopName: string;
  city: string;
  discount: number;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ScheduledNotification {
  id: string;
  shopName: string;
  city: string;
  discount: number;
  startDate: string;
  triggerTime: string; // 7 days prior
}

interface OwnerNotification {
  id: string;
  type: "INTERESTED" | "NOTIFY_ME";
  customerName: string;
  saleId: string;
  saleName: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_SHOPS: Shop[] = [
  {
    id: "shop_1",
    name: "Royal Heritage Silks",
    category: "Clothing",
    address: "12, Gandhi Irwin Road, Egmore, Chennai, Tamil Nadu 600008",
    city: "Chennai",
    lat: 13.079,
    lng: 80.259,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewsCount: 3,
    reviews: [
      { id: "rev_1", customerName: "Priya S.", score: 5, comment: "Authentic 40% off on Kanchipuram sarees! Checked at counter. Saved ₹3,000!", isRealPromo: true, timestamp: "2026-06-20" },
      { id: "rev_2", customerName: "Anand K.", score: 4, comment: "Decent festive discounts, stock is moving very fast though.", isRealPromo: true, timestamp: "2026-06-18" },
      { id: "rev_3", customerName: "Ritu M.", score: 2, comment: "Some designs were marked up before the sale, inspect carefully.", isRealPromo: false, timestamp: "2026-06-15" }
    ]
  },
  {
    id: "shop_2",
    name: "Organic Mandi Bazar",
    category: "Grocery",
    address: "Plot 104, SV Road, Bandra West, Mumbai, Maharashtra 400050",
    city: "Mumbai",
    lat: 19.062,
    lng: 72.834,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 2,
    reviews: [
      { id: "rev_4", customerName: "Rohan G.", score: 5, comment: "Excellent price drop on organic Alphonso mangoes!", isRealPromo: true, timestamp: "2026-06-22" },
      { id: "rev_5", customerName: "Sneha V.", score: 5, comment: "Genuine farm-fresh grocery deals in Bandra.", isRealPromo: true, timestamp: "2026-06-21" }
    ]
  },
  {
    id: "shop_3",
    name: "Filter Kaapi Club",
    category: "Restaurant",
    address: "80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    city: "Bengaluru",
    lat: 12.934,
    lng: 77.624,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    rating: 4.2,
    reviewsCount: 2,
    reviews: [
      { id: "rev_6", customerName: "Deepak P.", score: 4, comment: "Solid buy-1-get-1 Filter Coffee deal. Genuine offer.", isRealPromo: true, timestamp: "2026-06-19" },
      { id: "rev_7", customerName: "Nisha W.", score: 2, comment: "They added a service tax which wasn't clearly mentioned.", isRealPromo: false, timestamp: "2026-06-14" }
    ]
  },
  {
    id: "shop_4",
    name: "Babu Lal Sweets & Bakery",
    category: "Bakery",
    address: "Shop 4, Chandni Chowk Road, New Delhi, Delhi 110006",
    city: "Delhi",
    lat: 28.656,
    lng: 77.230,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 1,
    reviews: [
      { id: "rev_8", customerName: "Amit A.", score: 5, comment: "Flat 50% off on standard sweets after 8 PM! Fresh stock.", isRealPromo: true, timestamp: "2026-06-21" }
    ]
  }
];

const INITIAL_SALES: Sale[] = [
  {
    id: "sale_1",
    shopId: "shop_1",
    shopName: "Royal Heritage Silks",
    city: "Chennai",
    discount: 40,
    description: "Grand Festive Clearance Sale! All premium silk sarees, ethnic wear, and kurtas at flat 40% off.",
    startDate: "2026-07-05",
    endDate: "2026-07-15",
    isActive: true
  },
  {
    id: "sale_2",
    shopId: "shop_2",
    shopName: "Organic Mandi Bazar",
    city: "Mumbai",
    discount: 25,
    description: "Fresh Organic Produce & Spice Carnival! Grab 25% off on local spices, premium basmati rice, and organic fruits.",
    startDate: "2026-07-01",
    endDate: "2026-07-07",
    isActive: true
  },
  {
    id: "sale_3",
    shopId: "shop_3",
    shopName: "Filter Kaapi Club",
    city: "Bengaluru",
    discount: 15,
    description: "Morning South Indian breakfast platter discount - 15% off any combo of Idli/Vada + piping hot Filter Kaapi.",
    startDate: "2026-06-25",
    endDate: "2026-06-30",
    isActive: true
  },
  {
    id: "sale_expired_1",
    shopId: "shop_3",
    shopName: "Filter Kaapi Club",
    city: "Bengaluru",
    discount: 20,
    description: "Weekend Idli Bash - Flat 20% off on all breakfast assortments.",
    startDate: "2026-06-10",
    endDate: "2026-06-15",
    isActive: true
  },
  {
    id: "sale_expired_2",
    shopId: "shop_1",
    shopName: "Royal Heritage Silks",
    city: "Chennai",
    discount: 30,
    description: "Summer Breeze Ethnic Collection Discount.",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    isActive: true
  },
  {
    id: "sale_expired_3",
    shopId: "shop_2",
    shopName: "Organic Mandi Bazar",
    city: "Mumbai",
    discount: 10,
    description: "Early Monsoon Grocery Bonanza.",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    isActive: false
  }
];

export default function App() {
  // Global States
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [notificationsQueue, setNotificationsQueue] = useState<ScheduledNotification[]>([]);
  const [triggeredNotifications, setTriggeredNotifications] = useState<string[]>([]);
  const [recentNotificationText, setRecentNotificationText] = useState<string | null>(null);

  // Applet Tab Viewers: "simulator" | "codebase" | "readme"
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"simulator" | "codebase" | "readme">("simulator");

  // Code Explorer State
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // Default to Module build.gradle
  const [searchCodeQuery, setSearchCodeQuery] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Mobile App Simulation States
  const [userRole, setUserRole] = useState<"CUSTOMER" | "SHOP_OWNER">("CUSTOMER");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loginRole, setLoginRole] = useState<"CUSTOMER" | "SHOP_OWNER">("CUSTOMER");

  // Session profile details (if logged in)
  const [customerName, setCustomerName] = useState("Anurag Agarwal");
  const [customerCity, setCustomerCity] = useState("Bengaluru");

  const [shopOwnerName, setShopOwnerName] = useState("Rajesh Kumar");
  const [ownerBusinessName, setOwnerBusinessName] = useState("Rajesh Electronics");
  const [ownerCategory, setOwnerCategory] = useState("Electronics");
  const [ownerAddress, setOwnerAddress] = useState("12, MG Road, Ashok Nagar, Bengaluru, Karnataka 560001");
  const [ownerCity, setOwnerCity] = useState("Bengaluru");
  const [ownerLat, setOwnerLat] = useState(12.9716);
  const [ownerLng, setOwnerLng] = useState(77.5946);
  const [ownerImages, setOwnerImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80"
  ]);

  // Google Location mapping picker states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMappingRole, setLocationMappingRole] = useState<"CUSTOMER" | "SHOP_OWNER" | null>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [tempLat, setTempLat] = useState(12.9716);
  const [tempLng, setTempLng] = useState(77.5946);
  const [tempAddress, setTempAddress] = useState("12, MG Road, Ashok Nagar, Bengaluru, Karnataka 560001");
  const [tempCity, setTempCity] = useState("Bengaluru");
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Customer feed filter states
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  
  // Track "Interested" and "Notify me personally" for sales
  const [interestedSaleIds, setInterestedSaleIds] = useState<string[]>([]);
  const [notifyMeSaleIds, setNotifyMeSaleIds] = useState<string[]>([]);

  // Owner Notifications state
  const [ownerNotifications, setOwnerNotifications] = useState<OwnerNotification[]>([
    {
      id: "o_notif_1",
      type: "INTERESTED",
      customerName: "Ananya Sharma",
      saleId: "sale_1",
      saleName: "Royal Heritage Silks (30% OFF)",
      timestamp: "2026-06-22 15:30",
      read: false
    },
    {
      id: "o_notif_2",
      type: "NOTIFY_ME",
      customerName: "Vikram Malhotra",
      saleId: "sale_expired_1",
      saleName: "Filter Kaapi Club (20% OFF)",
      timestamp: "2026-06-23 09:12",
      read: false
    }
  ]);

  const handleToggleInterested = (sale: Sale) => {
    const isCurrentlyInterested = interestedSaleIds.includes(sale.id);
    if (!isCurrentlyInterested) {
      setInterestedSaleIds(prev => [...prev, sale.id]);
      
      const newNotif: OwnerNotification = {
        id: `o_notif_${Date.now()}`,
        type: "INTERESTED",
        customerName: customerName || "Anurag Agarwal",
        saleId: sale.id,
        saleName: `${sale.shopName} (${sale.discount}% OFF)`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      
      setOwnerNotifications(prev => [newNotif, ...prev]);
      saveNotification(newNotif);
      setRecentNotificationText(`🔔 [Owner Alert] ${customerName || "Anurag Agarwal"} is Interested in your "${sale.discount}% OFF" sale!`);
    } else {
      setInterestedSaleIds(prev => prev.filter(id => id !== sale.id));
    }
  };

  const handleToggleNotifyMe = (sale: Sale) => {
    const isCurrentlyNotified = notifyMeSaleIds.includes(sale.id);
    if (!isCurrentlyNotified) {
      setNotifyMeSaleIds(prev => [...prev, sale.id]);
      
      const newNotif: OwnerNotification = {
        id: `o_notif_${Date.now()}`,
        type: "NOTIFY_ME",
        customerName: customerName || "Anurag Agarwal",
        saleId: sale.id,
        saleName: `${sale.shopName} (${sale.discount}% OFF)`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      
      setOwnerNotifications(prev => [newNotif, ...prev]);
      saveNotification(newNotif);
      setRecentNotificationText(`🔔 [Owner Alert] ${customerName || "Anurag Agarwal"} requested Personal Notification for your next "${sale.shopName}" sale!`);
    } else {
      setNotifyMeSaleIds(prev => prev.filter(id => id !== sale.id));
    }
  };

  // Helper functions to get totals
  const getSaleInterestedCount = (saleId: string) => {
    const baseCounts: { [key: string]: number } = {
      "sale_1": 42,
      "sale_2": 19,
      "sale_3": 64,
      "sale_expired_1": 15,
      "sale_expired_2": 28,
      "sale_expired_3": 8
    };
    const base = baseCounts[saleId] || 0;
    const isSelf = interestedSaleIds.includes(saleId) ? 1 : 0;
    const others = ownerNotifications.filter(
      n => n.saleId === saleId && n.type === "INTERESTED" && n.customerName !== (customerName || "Anurag Agarwal")
    ).length;
    return base + isSelf + others;
  };

  const getSaleNotifyCount = (saleId: string) => {
    const baseCounts: { [key: string]: number } = {
      "sale_1": 12,
      "sale_2": 5,
      "sale_3": 23,
      "sale_expired_1": 4,
      "sale_expired_2": 11,
      "sale_expired_3": 3
    };
    const base = baseCounts[saleId] || 0;
    const isSelf = notifyMeSaleIds.includes(saleId) ? 1 : 0;
    const others = ownerNotifications.filter(
      n => n.saleId === saleId && n.type === "NOTIFY_ME" && n.customerName !== (customerName || "Anurag Agarwal")
    ).length;
    return base + isSelf + others;
  };
  const [saleStatusTab, setSaleStatusTab] = useState<"ACTIVE" | "CLOSED">("ACTIVE");

  // Review submission state
  const [ratingScore, setRatingScore] = useState(5);
  const [isRealSaleSelected, setIsRealSaleSelected] = useState(true);
  const [commentText, setCommentText] = useState("");

  // Seller CRUD actions state
  const [newSaleDiscount, setNewSaleDiscount] = useState(20);
  const [newSaleDescription, setNewSaleDescription] = useState("");
  const [newSaleStartDate, setNewSaleStartDate] = useState("2026-07-10");
  const [newSaleEndDate, setNewSaleEndDate] = useState("2026-07-20");
  const [newSaleDateError, setNewSaleDateError] = useState<string | null>(null);

  // Registration modal steps
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Load and subscribe to Firebase Firestore data
  useEffect(() => {
    // 1. One-time seeding of initial data if empty
    seedDatabaseIfEmpty(INITIAL_SHOPS, INITIAL_SALES);

    // 2. Real-time subscriptions
    const unsubShops = subscribeToShops((updatedShops) => {
      if (updatedShops.length > 0) {
        setShops(updatedShops);
      }
    });

    const unsubSales = subscribeToSales((updatedSales) => {
      if (updatedSales.length > 0) {
        setSales(updatedSales);
      }
    });

    const unsubNotifications = subscribeToNotifications((updatedNotifications) => {
      if (updatedNotifications.length > 0) {
        setOwnerNotifications(updatedNotifications);
      }
    });

    return () => {
      unsubShops();
      unsubSales();
      unsubNotifications();
    };
  }, []);

  // Setup initial automated notification scheduling for pre-seeded events
  useEffect(() => {
    const queue: ScheduledNotification[] = [];
    sales.forEach(sale => {
      if (!sale.startDate || typeof sale.startDate !== "string") return;
      const parts = sale.startDate.split("-");
      if (parts.length < 3) return;
      
      const yr = parseInt(parts[0], 10);
      const mo = parseInt(parts[1], 10) - 1;
      const dy = parseInt(parts[2], 10);
      
      if (isNaN(yr) || isNaN(mo) || isNaN(dy)) return;
      
      const start = new Date(yr, mo, dy);
      if (isNaN(start.getTime())) return;
      
      const trigger = new Date(start.getTime() - (7 * 24 * 60 * 60 * 1000));
      if (isNaN(trigger.getTime())) return;
      
      try {
        queue.push({
          id: `sched_${sale.id}`,
          shopName: sale.shopName,
          city: sale.city,
          discount: sale.discount,
          startDate: sale.startDate,
          triggerTime: trigger.toISOString().split("T")[0]
        });
      } catch (err) {
        console.error("Failed to parse trigger ISO date", err);
      }
    });
    setNotificationsQueue(queue);
  }, [sales]);

  // Code Copy utility
  const handleCopyCode = (text: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(text).catch(err => {
        console.error("Failed to copy code: ", err);
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      console.error("Fallback copy failed: ", err);
    }
  };

  // Triggering the scheduled 7 days notification
  const handleSimulateNotificationTrigger = (notif: ScheduledNotification) => {
    if (triggeredNotifications.includes(notif.id)) return;
    
    // Add to triggered state
    setTriggeredNotifications(prev => [...prev, notif.id]);
    
    // Slide down notification banner
    setRecentNotificationText(`Heads up! ${notif.shopName} in ${notif.city} is offering ${notif.discount}% off starting ${notif.startDate}.`);
    
    // Play alert feedback sound (simulated or console log)
    console.log("FCM push received: " + notif.shopName);
  };

  // Quick Dismiss Notification
  const handleDismissNotification = () => {
    setRecentNotificationText(null);
  };

  // OTP Login mock
  const handleSendOtp = () => {
    if (!currentPhone || currentPhone.length < 8) {
      setAuthError("Please enter a valid phone number (at least 8 digits)");
      return;
    }
    setAuthError(null);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp !== "123456") {
      setAuthError("Invalid verification code! Enter '123456' for the simulator.");
      return;
    }
    setAuthError(null);

    // Check if user is registered
    if (loginRole === "CUSTOMER") {
      // Customer auto register
      setIsLoggedIn(true);
      setUserRole("CUSTOMER");
    } else {
      // If shop owner, let's open register form or load existing mock
      setShowRegisterForm(true);
    }
  };

  const handleCompleteRegistration = () => {
    setIsLoggedIn(true);
    setUserRole(loginRole);
    setShowRegisterForm(false);
    
    if (loginRole === "SHOP_OWNER") {
      // Add a custom shop in state
      const newShopId = `shop_owner_custom`;
      const newShop: Shop = {
        id: newShopId,
        name: ownerBusinessName,
        category: ownerCategory,
        address: ownerAddress,
        city: ownerCity,
        lat: ownerLat,
        lng: ownerLng,
        image: ownerImages[0] || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
        rating: 5.0,
        reviewsCount: 0,
        reviews: []
      };
      setShops(prev => [newShop, ...prev.filter(s => s.id !== newShopId)]);
      saveShop(newShop);
    }
  };

  // Find closest city name based on lat, lng
  const getClosestCity = (lat: number, lng: number): string => {
    const cityCoords: { [key: string]: { lat: number; lng: number } } = {
      "Mumbai": { lat: 19.076, lng: 72.877 },
      "Delhi": { lat: 28.613, lng: 77.209 },
      "Bengaluru": { lat: 12.971, lng: 77.594 },
      "Pune": { lat: 18.520, lng: 73.856 },
      "Hyderabad": { lat: 17.385, lng: 78.486 },
      "Chennai": { lat: 13.082, lng: 80.270 },
      "Kolkata": { lat: 22.572, lng: 88.363 },
      "Ahmedabad": { lat: 23.022, lng: 72.571 }
    };

    let minDistance = Infinity;
    let closestCity = "Bengaluru";

    Object.entries(cityCoords).forEach(([name, coords]) => {
      const d = (lat - coords.lat) * (lat - coords.lat) + (lng - coords.lng) * (lng - coords.lng);
      if (d < minDistance) {
        minDistance = d;
        closestCity = name;
      }
    });

    return closestCity;
  };

  // Google Location real GPS detection
  const handleDetectMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setTempLat(lat);
        setTempLng(lng);
        setGpsLoading(false);

        // Map to closest Indian city
        const mappedCity = getClosestCity(lat, lng);
        setTempCity(mappedCity);
        setTempAddress(`Plot ${Math.floor(Math.random() * 500) + 1}, Sector-A, near main market, ${mappedCity}, India`);
      },
      (error) => {
        setGpsLoading(false);
        setGpsError(error.message || "Failed to retrieve your position. Falling back to default.");
        // Fallback to Bengaluru
        setTempLat(12.9716);
        setTempLng(77.5946);
        setTempCity("Bengaluru");
        setTempAddress("12, MG Road, Ashok Nagar, Bengaluru, Karnataka 560001");
      },
      { timeout: 8000 }
    );
  };

  // Map click handler to select a custom pin on the simulated canvas
  const handleMapCanvasClick = (clickXPercentage: number, clickYPercentage: number) => {
    const baseCityCoords: { [key: string]: { lat: number; lng: number } } = {
      "Mumbai": { lat: 19.076, lng: 72.877 },
      "Delhi": { lat: 28.613, lng: 77.209 },
      "Bengaluru": { lat: 12.971, lng: 77.594 },
      "Pune": { lat: 18.520, lng: 73.856 },
      "Hyderabad": { lat: 17.385, lng: 78.486 },
      "Chennai": { lat: 13.082, lng: 80.270 },
      "Kolkata": { lat: 22.572, lng: 88.363 },
      "Ahmedabad": { lat: 23.022, lng: 72.571 }
    };

    const currentBase = baseCityCoords[tempCity] || baseCityCoords["Bengaluru"];
    const latNoise = (50 - clickYPercentage) * 0.0012;
    const lngNoise = (clickXPercentage - 50) * 0.0012;
    
    const finalLat = parseFloat((currentBase.lat + latNoise).toFixed(4));
    const finalLng = parseFloat((currentBase.lng + lngNoise).toFixed(4));

    setTempLat(finalLat);
    setTempLng(finalLng);
    setTempAddress(`Shop ${Math.floor(clickXPercentage * 3)}, Near landmark block, ${tempCity}, India`);
  };

  // Confirm and save selected location
  const handleConfirmMappedLocation = () => {
    if (locationMappingRole === "CUSTOMER") {
      setSelectedCity(tempCity);
      setCustomerCity(tempCity);
    } else if (locationMappingRole === "SHOP_OWNER") {
      setOwnerLat(tempLat);
      setOwnerLng(tempLng);
      setOwnerAddress(tempAddress);
      setOwnerCity(tempCity);
    }
    setShowLocationModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOtpSent(false);
    setEnteredOtp("");
    setSelectedShopId(null);
  };

  // Add Sale Event CRUD
  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleDescription) return;

    // Determine current simulated date of today
    const todayStr = (() => {
      const d = new Date();
      const offset = d.getTimezoneOffset();
      const localDate = new Date(d.getTime() - (offset * 60 * 1000));
      const isoLocal = localDate.toISOString().split("T")[0];
      if (isoLocal.startsWith("2026")) return isoLocal;
      return "2026-06-23";
    })();

    if (newSaleStartDate < todayStr) {
      setNewSaleDateError(`Sale start date (${newSaleStartDate}) cannot be before the current date (${todayStr}).`);
      return;
    }

    if (newSaleEndDate < newSaleStartDate) {
      setNewSaleDateError(`Sale end date (${newSaleEndDate}) cannot be before the start date (${newSaleStartDate}).`);
      return;
    }

    setNewSaleDateError(null);

    const currentShopName = userRole === "SHOP_OWNER" ? ownerBusinessName : "Rajesh Electronics";
    const currentShopId = userRole === "SHOP_OWNER" ? "shop_owner_custom" : "shop_1";
    const currentCity = userRole === "SHOP_OWNER" ? ownerCity : "Bengaluru";

    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      shopId: currentShopId,
      shopName: currentShopName,
      city: currentCity,
      discount: newSaleDiscount,
      description: newSaleDescription,
      startDate: newSaleStartDate,
      endDate: newSaleEndDate,
      isActive: true
    };

    setSales(prev => [newSale, ...prev]);
    saveSale(newSale);
    setNewSaleDescription("");
    setNewSaleDiscount(20);

    // Schedule notification instantly in simulation
    const parts = newSaleStartDate.split("-");
    const start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const trigger = new Date(start.getTime() - (7 * 24 * 60 * 60 * 1000));

    const newNotif: ScheduledNotification = {
      id: `sched_${newSale.id}`,
      shopName: currentShopName,
      city: currentCity,
      discount: newSaleDiscount,
      startDate: newSaleStartDate,
      triggerTime: trigger.toISOString().split("T")[0]
    };

    setNotificationsQueue(prev => [newNotif, ...prev]);
  };

  // Set Rating feedback
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopId) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      customerName: customerName || "Anurag A.",
      score: ratingScore,
      comment: commentText,
      isRealPromo: isRealSaleSelected,
      timestamp: new Date().toISOString().split("T")[0]
    };

    const currentShop = shops.find(s => s.id === selectedShopId);
    if (currentShop) {
      saveReview(selectedShopId, newReview, currentShop.reviews);
    }

    setShops(prevShops => {
      return prevShops.map(shop => {
        if (shop.id === selectedShopId) {
          const updatedReviews = [newReview, ...shop.reviews];
          const totalScore = updatedReviews.reduce((sum, r) => sum + r.score, 0);
          return {
            ...shop,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: parseFloat((totalScore / updatedReviews.length).toFixed(1))
          };
        }
        return shop;
      });
    });

    setCommentText("");
    setRatingScore(5);
    setIsRealSaleSelected(true);
  };

  // Get current shop rating or data
  const currentSelectedShop = shops.find(s => s.id === selectedShopId);

  // Filter sales list for feeds
  const filteredSales = sales.filter(sale => {
    const shop = shops.find(s => s.id === sale.shopId);
    if (sale.city !== selectedCity) return false;
    
    // Determine current simulated date of the system to ensure robust behavior
    const todayStr = (() => {
      const realToday = new Date().toISOString().split("T")[0];
      if (realToday.startsWith("2026")) return realToday;
      return "2026-06-23";
    })();
    
    const isOver = !sale.isActive || sale.endDate < todayStr;
    
    if (saleStatusTab === "ACTIVE" && isOver) return false;
    if (saleStatusTab === "CLOSED" && !isOver) return false;
    
    const matchesSearch = sale.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sale.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || (shop && shop.category === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Code Explorer Search
  const filteredFiles = androidCodebase.filter(file => 
    file.name.toLowerCase().includes(searchCodeQuery.toLowerCase()) ||
    file.path.toLowerCase().includes(searchCodeQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Dynamic Simulated Android Push Notification Toast */}
      <AnimatePresence>
        {recentNotificationText && (
          <motion.div 
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-800 border-2 border-orange-500 rounded-2xl shadow-2xl overflow-hidden p-4 flex items-start gap-3 backdrop-blur-md">
              <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500">LocalDeals Push</span>
                  <span className="text-xs text-slate-400">Just now</span>
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {recentNotificationText}
                </p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={handleDismissNotification}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => {
                      const foundSale = sales.find(s => recentNotificationText.includes(s.shopName));
                      if (foundSale) {
                        setSelectedCity(foundSale.city);
                        setSelectedShopId(foundSale.shopId);
                      }
                      handleDismissNotification();
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    View Sale details
                  </button>
                </div>
              </div>
              <button 
                onClick={handleDismissNotification}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Header */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-600/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              LocalDeals Android Workspace
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Play Store Ready
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Jetpack Compose UI • Dagger Hilt • Clean Architecture • Firebase Auth & Cloud Firestore
            </p>
          </div>
        </div>

        {/* Global Action Selector Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setActiveWorkspaceTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspaceTab === "simulator"
                ? "bg-orange-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Interactive Emulator
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("codebase")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspaceTab === "codebase"
                ? "bg-orange-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4" />
            Android Code Studio
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("readme")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspaceTab === "readme"
                ? "bg-orange-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Integration Setup
          </button>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">

        {/* ==================== WORKSPACE TAB 1: INTERACTIVE EMULATOR ==================== */}
        {activeWorkspaceTab === "simulator" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left controller sidebar: Background Scheduler & Admin Actions */}
            <div className="w-full lg:w-96 bg-slate-950 border-r border-slate-800 overflow-y-auto p-5 flex flex-col gap-6 scrollbar-thin">
              <div>
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  WorkManager Background Scheduler
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates 7-day-prior notification limits from the Firebase store dynamically. Test delivery in foreground or background!
                </p>
              </div>

              {/* Scheduled Notifications Queue */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-300">Scheduled Worker Queue</span>
                  <span className="text-xxs px-2 py-0.5 bg-orange-600/15 text-orange-400 rounded-full font-mono">
                    {notificationsQueue.filter(n => !triggeredNotifications.includes(n.id)).length} pending
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto scrollbar-thin">
                  {notificationsQueue.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No sales events currently registered. Create a Sale Event to populate.
                    </div>
                  ) : (
                    notificationsQueue.map(notif => {
                      const isTriggered = triggeredNotifications.includes(notif.id);
                      return (
                        <div 
                          key={notif.id}
                          className={`p-3 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                            isTriggered 
                              ? "bg-slate-800/40 border-slate-800 opacity-60" 
                              : "bg-slate-800 border-slate-700 hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="truncate text-slate-200">{notif.shopName} ({notif.city})</span>
                            <span className="text-orange-400 font-bold">{notif.discount}% Off</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Starts: {notif.startDate}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              Alert: Start Date - 7 Days
                            </span>
                            {!isTriggered ? (
                              <button
                                onClick={() => handleSimulateNotificationTrigger(notif)}
                                className="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                Trigger FCM
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                <Check className="w-3.5 h-3.5" /> Sent
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Play Store Configuration Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-300">Play Console Testing Checklist</h3>
                
                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-200">Phone Verification (SMS Auth)</span>
                      <span className="text-slate-400 text-xxs">Enable Phone OTP in Firebase Authentication settings tab.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-200">Google Maps Keys Injector</span>
                      <span className="text-slate-400 text-xxs">Create API Keys with Maps SDK for Android enabled in GCP console.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-200">FCM Push Credentials</span>
                      <span className="text-slate-400 text-xxs">Install Firebase messaging SDK. Deliver city-targeted push payloads across India.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Switch Roles Button */}
              <div className="mt-auto">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="text-xs text-slate-400 font-medium">Currently testing:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setUserRole("CUSTOMER");
                        if (!isLoggedIn) {
                          setLoginRole("CUSTOMER");
                        }
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        userRole === "CUSTOMER"
                          ? "bg-orange-600 text-white shadow"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Customer Side
                    </button>
                    <button
                      onClick={() => {
                        setUserRole("SHOP_OWNER");
                        if (!isLoggedIn) {
                          setLoginRole("SHOP_OWNER");
                        }
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        userRole === "SHOP_OWNER"
                          ? "bg-orange-600 text-white shadow"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      Shop Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Container: Dynamic Mobile Frame Emulator */}
            <div className="flex-1 bg-slate-900 flex items-center justify-center p-4 overflow-y-auto scrollbar-thin">
              <div className="relative w-[360px] h-[740px] bg-slate-950 rounded-[48px] shadow-2xl border-8 border-slate-800 flex flex-col overflow-hidden">
                
                {/* Simulated Android Device Features (Notch, Camera, Speaker) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-slate-800 h-5 w-32 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div>
                  <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
                </div>

                {/* Simulated Android Status Bar */}
                <div className="bg-slate-950 h-8 pt-2 px-6 flex items-center justify-between text-white text-xxs font-mono shrink-0 select-none">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-orange-500 rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* Simulated Device Frame Screen App Body */}
                <div className="flex-1 bg-slate-50 text-slate-900 flex flex-col overflow-hidden relative">
                  
                  {/* IF NOT LOGGED IN SHOW PHONE OTP AUTHENTICATION SCREEN */}
                  {!isLoggedIn ? (
                    <div className="flex-1 flex flex-col p-6 bg-white overflow-y-auto scrollbar-thin">
                      <div className="text-center mt-10 mb-6">
                        <div className="bg-orange-100 text-orange-600 p-4 rounded-3xl inline-block mb-3">
                          <Store className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">LocalDeals</h3>
                        <p className="text-xs text-slate-500 mt-1">Connecting shops with neighbors</p>
                      </div>

                      {/* Login Role Toggle Slider inside device */}
                      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                          onClick={() => {
                            setLoginRole("CUSTOMER");
                            setAuthError(null);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            loginRole === "CUSTOMER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Customer
                        </button>
                        <button
                          onClick={() => {
                            setLoginRole("SHOP_OWNER");
                            setAuthError(null);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            loginRole === "SHOP_OWNER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Shop Owner
                        </button>
                      </div>

                      {authError && (
                        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xxs font-bold mb-4 flex items-start gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{authError}</span>
                        </div>
                      )}

                      {!otpSent ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                            <div className="flex gap-2">
                              <div className="relative shrink-0 w-28">
                                <select
                                  value={selectedCountryCode}
                                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer font-semibold text-slate-800"
                                >
                                  {COUNTRIES.map((country) => (
                                    <option key={`${country.code}-${country.dialCode}`} value={country.dialCode}>
                                      {country.flag} {country.dialCode} ({country.code})
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                              </div>
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={currentPhone}
                                onChange={(e) => setCurrentPhone(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                              />
                            </div>
                          </div>

                          <button
                            onClick={handleSendOtp}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 mt-2"
                          >
                            <Phone className="w-4 h-4" />
                            Send OTP Code
                          </button>
                          
                          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 p-3 rounded-xl mt-4">
                            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 leading-normal">
                              Phone login is verified securely on Android with SMS OTP. Tap <strong>Send OTP</strong> to generate code.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-bold text-slate-700 block">Verification Code</label>
                              <button onClick={() => setOtpSent(false)} className="text-xxs font-semibold text-orange-600 hover:underline">Change Number</button>
                            </div>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Enter 123456"
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <p className="text-xxs text-slate-400 mt-1.5 text-center">
                              Enter the test simulator OTP: <strong className="text-slate-600 font-mono">123456</strong>
                            </p>
                          </div>

                          <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                          >
                            Verify & Register
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // IF LOGGED IN SHOW ACTIVE ROLE SPECIFIC SCREEN
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                      
                      {/* ================= SIMULATOR: CUSTOMER VIEWFLOW ================= */}
                      {userRole === "CUSTOMER" ? (
                        <div className="flex-1 flex flex-col overflow-hidden">
                          
                          {/* APP HEADER */}
                          <div className="bg-white border-b border-slate-100 px-3.5 py-3 shrink-0 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Your Location</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                <span className="text-xs font-black text-slate-800 truncate max-w-[100px]">{selectedCity}</span>
                                <button 
                                  onClick={() => {
                                    setTempCity(selectedCity);
                                    setLocationMappingRole("CUSTOMER");
                                    setShowLocationModal(true);
                                  }}
                                  className="text-[9px] text-orange-600 font-black ml-1 px-1.5 py-0.5 bg-orange-50 border border-orange-100 rounded-full hover:bg-orange-100 flex items-center gap-0.5 transition-all"
                                >
                                  <Map className="w-2.5 h-2.5" />
                                  Map
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xxs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3 h-3 text-slate-400" />
                                {customerName}
                              </span>
                              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* SEARCH AND CATEGORIES FILTERS */}
                          <div className="bg-white border-b border-slate-100 p-3 shrink-0 flex flex-col gap-2.5">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search active deals, shops..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            {/* Category Pill Buttons */}
                            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                              <button
                                onClick={() => setActiveCategory("All")}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                                  activeCategory === "All"
                                    ? "bg-orange-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                All
                              </button>
                              {Array.from(new Set([...CATEGORIES, ...shops.map(s => s.category).filter(Boolean)])).map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setActiveCategory(cat)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                                    activeCategory === cat
                                      ? "bg-orange-600 text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* CUSTOMER HOME FEED PANEL */}
                          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
                            <div>
                              {/* Segmented control for Sale Status Tabs */}
                              <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
                                <button
                                  onClick={() => setSaleStatusTab("ACTIVE")}
                                  className={`flex-1 py-1.5 rounded-lg text-xxs font-bold text-center transition-all ${
                                    saleStatusTab === "ACTIVE"
                                      ? "bg-white text-slate-900 shadow-sm"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  🔥 Live & Upcoming Deals
                                </button>
                                <button
                                  onClick={() => setSaleStatusTab("CLOSED")}
                                  className={`flex-1 py-1.5 rounded-lg text-xxs font-bold text-center transition-all ${
                                    saleStatusTab === "CLOSED"
                                      ? "bg-white text-slate-900 shadow-sm"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  ⏳ Closed & Past Deals
                                </button>
                              </div>

                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>
                                  {saleStatusTab === "ACTIVE" ? "Active Promo Events" : "Closed / Past Promotions"} in {selectedCity}
                                </span>
                                <span className="text-[10px] font-normal text-slate-400 lowercase font-mono">
                                  ({filteredSales.length} found)
                                </span>
                              </h4>
                              {filteredSales.length === 0 ? (
                                <div className="text-center bg-white border border-slate-100 rounded-2xl py-12 px-4 flex flex-col items-center justify-center">
                                  <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                  <p className="text-xs font-semibold text-slate-700">
                                    No {saleStatusTab === "ACTIVE" ? "active" : "past"} promotions matches
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1">Try toggling cities, categories or typing a search query.</p>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {filteredSales.map(sale => {
                                    const shop = shops.find(s => s.id === sale.shopId);
                                    
                                    // Calculate timeline
                                    const todayStr = (() => {
                                      const realToday = new Date().toISOString().split("T")[0];
                                      if (realToday.startsWith("2026")) return realToday;
                                      return "2026-06-23";
                                    })();
                                    const isUpcoming = todayStr < sale.startDate;
                                    const isLive = todayStr >= sale.startDate && todayStr <= sale.endDate && sale.isActive;
                                    const isOver = !sale.isActive || todayStr > sale.endDate;

                                    const isInterested = interestedSaleIds.includes(sale.id);
                                    const isNotified = notifyMeSaleIds.includes(sale.id);

                                    return (
                                      <div
                                        key={sale.id}
                                        onClick={() => setSelectedShopId(sale.shopId)}
                                        className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition-all overflow-hidden cursor-pointer flex flex-col"
                                      >
                                        <div className="h-28 w-full bg-slate-200 relative overflow-hidden">
                                          <img
                                            src={shop?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"}
                                            alt={sale.shopName}
                                            className="w-full h-full object-cover"
                                          />
                                          {/* Discount Overlay */}
                                          <div className="absolute top-2.5 left-2.5 bg-orange-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-0.5">
                                            {sale.discount}% OFF
                                          </div>

                                          {/* Time Phase Status Badge */}
                                          <div className="absolute top-2.5 right-2.5">
                                            {isUpcoming && (
                                              <span className="bg-blue-600/95 backdrop-blur-sm text-white font-bold text-[9px] uppercase px-2 py-1 rounded-md shadow-sm">
                                                ⏳ Starts {sale.startDate}
                                              </span>
                                            )}
                                            {isLive && (
                                              <span className="bg-emerald-600/95 backdrop-blur-sm text-white font-bold text-[9px] uppercase px-2 py-1 rounded-md shadow-sm animate-pulse">
                                                🟢 Live Now
                                              </span>
                                            )}
                                            {isOver && (
                                              <span className="bg-slate-700/95 backdrop-blur-sm text-white font-bold text-[9px] uppercase px-2 py-1 rounded-md shadow-sm">
                                                ❌ Closed
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="p-3">
                                          <div className="flex items-start justify-between">
                                            <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{sale.shopName}</h5>
                                            <div className="flex items-center gap-0.5 text-orange-500 text-xs font-bold shrink-0">
                                              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                                              <span>{shop?.rating || "N/A"}</span>
                                            </div>
                                          </div>
                                          <p className="text-xxs text-slate-500 font-semibold mt-0.5">{shop?.category}</p>
                                          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{sale.description}</p>
                                          
                                          {/* Customer Interaction Action Bar */}
                                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                                            <div className="flex items-center justify-between">
                                              <div className="text-[10px] text-slate-400 font-medium font-mono flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1">
                                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                  Period: {sale.startDate} to {sale.endDate}
                                                </span>
                                              </div>
                                              <span className="text-orange-600 font-bold hover:underline text-[10px] flex items-center gap-0.5">
                                                Rate sale <ChevronRight className="w-3 h-3" />
                                              </span>
                                            </div>

                                            {/* Count of interested customers */}
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-100/60 rounded-xl p-2 mt-0.5">
                                              <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                              <span>
                                                <strong className="text-slate-700 font-extrabold">{getSaleInterestedCount(sale.id)}</strong> customers marked this as interested
                                              </span>
                                            </div>
                                            
                                            <div className="flex justify-end gap-2 mt-1">
                                              {(!isOver) ? (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleInterested(sale);
                                                  }}
                                                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                                                    isInterested
                                                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                      : "bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                                                  }`}
                                                >
                                                  <Star className={`w-3.5 h-3.5 ${isInterested ? "fill-current text-white" : "text-amber-500"}`} />
                                                  <span>{isInterested ? "Interested ⭐ (Added)" : "I'm Interested"}</span>
                                                </button>
                                              ) : (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleNotifyMe(sale);
                                                  }}
                                                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                                                    isNotified
                                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                      : "bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                                                  }`}
                                                >
                                                  <Bell className={`w-3.5 h-3.5 ${isNotified ? "fill-current text-white animate-bounce" : "text-emerald-600"}`} />
                                                  <span>{isNotified ? "Notifying Me 🔔" : "Notify me personally"}</span>
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      ) : (
                        // ================= SIMULATOR: SHOP OWNER VIEWFLOW =================
                        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                          
                          {/* SELLER APP HEADER */}
                          <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-orange-600" />
                              <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                                {ownerBusinessName || "Miller Electronics"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setLoginRole("SHOP_OWNER");
                                  setShowRegisterForm(true);
                                }}
                                title="Edit Shop Profile & Category"
                                className="text-slate-400 hover:text-orange-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleLogout} 
                                title="Log Out"
                                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
                            
                            {/* Analytics overview box */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-100">Average Sale Rating</span>
                                <h4 className="text-2xl font-black mt-1">
                                  {shops.find(s => s.id === "shop_owner_custom")?.rating || "4.8"}{" "}
                                  <span className="text-sm font-normal text-orange-100">/ 5.0</span>
                                </h4>
                                <p className="text-xxs text-orange-100 mt-1">Verified on Real-or-Fake Promotions</p>
                              </div>
                              <div className="bg-white/10 p-3 rounded-2xl">
                                <Star className="w-8 h-8 fill-current text-amber-300" />
                              </div>
                            </div>

                            {/* Live Customer Engagement Feed / Notifications */}
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  <Bell className="w-4 h-4 text-orange-600" />
                                  Customer Engagement Alerts
                                </h4>
                                {ownerNotifications.filter(n => !n.read).length > 0 && (
                                  <span className="bg-orange-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full animate-bounce">
                                    {ownerNotifications.filter(n => !n.read).length} NEW
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto scrollbar-thin">
                                {ownerNotifications.length === 0 ? (
                                  <p className="text-xxs text-slate-400 py-4 text-center">No customer actions yet. Try marking items as "Interested" on the Customer Side!</p>
                                ) : (
                                  ownerNotifications.map(notif => (
                                    <div 
                                      key={notif.id} 
                                      className={`p-2.5 rounded-xl border transition-all text-xxs flex flex-col gap-1 ${
                                        notif.read ? "bg-slate-50 border-slate-100" : "bg-orange-50/40 border-orange-100 font-medium"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 flex items-center gap-1">
                                          {notif.type === "INTERESTED" ? (
                                            <span className="text-amber-500 font-extrabold text-[10px] flex items-center gap-0.5">
                                              <Star className="w-3 h-3 fill-current text-amber-400" /> INTEREST
                                            </span>
                                          ) : (
                                            <span className="text-emerald-600 font-extrabold text-[10px] flex items-center gap-0.5">
                                              <Bell className="w-3 h-3 text-emerald-500 fill-current" /> NOTIFY REQUEST
                                            </span>
                                          )}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-mono">{notif.timestamp}</span>
                                      </div>
                                      <p className="text-slate-600 leading-snug">
                                        Customer <span className="font-bold text-slate-900">{notif.customerName}</span> marked <span className="font-semibold text-slate-800">"{notif.saleName}"</span>.
                                      </p>
                                      
                                      {!notif.read && (
                                        <div className="flex justify-end mt-1">
                                          <button
                                            onClick={() => {
                                              setOwnerNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                            }}
                                            className="text-[9px] font-bold text-orange-600 hover:underline"
                                          >
                                            Mark read
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                              {ownerNotifications.length > 0 && (
                                <button
                                  onClick={() => {
                                    setOwnerNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold text-right mt-2 w-full transition-colors"
                                >
                                  Mark all as read
                                </button>
                              )}
                            </div>

                            {/* Create Sale Event form */}
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Plus className="w-4 h-4 text-orange-600" />
                                Launch New Sale Event
                              </h4>

                              <form onSubmit={handleCreateSale} className="flex flex-col gap-3">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="text-xxs font-bold text-slate-500">Discount Percentage</label>
                                    <span className="text-xs font-black text-orange-600">{newSaleDiscount}% Off</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="5"
                                    max="90"
                                    step="5"
                                    value={newSaleDiscount}
                                    onChange={(e) => setNewSaleDiscount(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                  />
                                </div>

                                <div>
                                  <label className="text-xxs font-bold text-slate-500 block mb-1">Sale Description</label>
                                  <textarea
                                    required
                                    rows={2}
                                    placeholder="Describe your sale. E.g., Black Friday early bird pricing on all devices."
                                    value={newSaleDescription}
                                    onChange={(e) => setNewSaleDescription(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xxs font-bold text-slate-500 block mb-1">Start Date</label>
                                    <input
                                      type="date"
                                      value={newSaleStartDate}
                                      onChange={(e) => {
                                        setNewSaleStartDate(e.target.value);
                                        setNewSaleDateError(null);
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xxs font-bold text-slate-500 block mb-1">End Date</label>
                                    <input
                                      type="date"
                                      value={newSaleEndDate}
                                      onChange={(e) => {
                                        setNewSaleEndDate(e.target.value);
                                        setNewSaleDateError(null);
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {newSaleDateError && (
                                  <div className="text-xxs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl p-2.5 flex items-start gap-1">
                                    <span>⚠️</span>
                                    <span>{newSaleDateError}</span>
                                  </div>
                                )}

                                <button
                                  type="submit"
                                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-1"
                                >
                                  Deploy & Notify City
                                </button>
                              </form>
                            </div>

                            {/* List of Sales managed by shop owner */}
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                                Registered Sales Dashboard
                              </h4>
                              
                              <div className="flex flex-col gap-2.5">
                                {sales.filter(s => s.shopId === (userRole === "SHOP_OWNER" ? "shop_owner_custom" : "shop_1")).map(sale => (
                                  <div key={sale.id} className="border border-slate-100 p-3 rounded-xl flex flex-col gap-2 text-xs bg-slate-50">
                                    <div className="flex items-start justify-between">
                                      <div className="min-w-0 pr-2">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-bold text-slate-900">{sale.discount}% OFF</span>
                                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold uppercase tracking-wider scale-90">Active</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1 truncate">{sale.description}</p>
                                      </div>
                                      <button 
                                        onClick={() => {
                                          setSales(prev => prev.filter(s => s.id !== sale.id));
                                          deleteSale(sale.id);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1.5 transition-colors shrink-0"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Real-time Customer Count Metrics */}
                                    <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100/60 font-mono text-[9px]">
                                      <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                                        <Star className="w-3 h-3 fill-current text-amber-500" />
                                        {getSaleInterestedCount(sale.id)} Interested
                                      </span>
                                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                        <Bell className="w-3 h-3 text-emerald-600 fill-current animate-pulse" />
                                        {getSaleNotifyCount(sale.id)} Notify Me
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* SIMULATED SLIDE-UP DETAIL BOTTOM SHEET FOR CUSTOMER SHOP VIEW */}
                      <AnimatePresence>
                        {selectedShopId && currentSelectedShop && (
                          <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="absolute inset-0 bg-white z-50 flex flex-col"
                          >
                            {/* Slide up header banner */}
                            <div className="relative h-44 w-full bg-slate-100 shrink-0">
                              <img 
                                src={currentSelectedShop.image} 
                                alt={currentSelectedShop.name} 
                                className="w-full h-full object-cover"
                              />
                              <button 
                                onClick={() => setSelectedShopId(null)}
                                className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xxs font-bold">
                                {currentSelectedShop.category}
                              </div>
                            </div>

                            {/* Detail Sheet Scrollable Body */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin text-xs">
                              <div>
                                <h3 className="text-base font-black text-slate-900">{currentSelectedShop.name}</h3>
                                <p className="text-xxs text-slate-400 font-mono mt-0.5">GPS: {currentSelectedShop.lat.toFixed(3)}, {currentSelectedShop.lng.toFixed(3)}</p>
                                
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-md">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span>{currentSelectedShop.rating}</span>
                                  </div>
                                  <span className="text-slate-400">({currentSelectedShop.reviewsCount} verified reviews)</span>
                                </div>
                              </div>

                              {/* PROMOTIONS & OFFERS SECTION IN DETAIL SHEET */}
                              <div className="border-t border-slate-100 pt-3">
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 font-sans">
                                  <Calendar className="w-4 h-4 text-orange-600" />
                                  Available & Past Deals
                                </h4>
                                
                                <div className="flex flex-col gap-3">
                                  {sales.filter(s => s.shopId === currentSelectedShop.id).length === 0 ? (
                                    <p className="text-xxs text-slate-400 py-2">No promotions listed yet for this shop.</p>
                                  ) : (
                                    sales.filter(s => s.shopId === currentSelectedShop.id).map(shopSale => {
                                      // Calculate timeline
                                      const todayStr = (() => {
                                        const realToday = new Date().toISOString().split("T")[0];
                                        if (realToday.startsWith("2026")) return realToday;
                                        return "2026-06-23";
                                      })();
                                      const isUpcoming = todayStr < shopSale.startDate;
                                      const isLive = todayStr >= shopSale.startDate && todayStr <= shopSale.endDate && shopSale.isActive;
                                      const isOver = !shopSale.isActive || todayStr > shopSale.endDate;

                                      const isInterested = interestedSaleIds.includes(shopSale.id);
                                      const isNotified = notifyMeSaleIds.includes(shopSale.id);

                                      return (
                                        <div key={shopSale.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 flex flex-col gap-2">
                                          <div className="flex items-center justify-between">
                                            <div className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                                              {shopSale.discount}% OFF
                                            </div>
                                            
                                            <div>
                                              {isUpcoming && (
                                                <span className="bg-blue-100 text-blue-700 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase">
                                                  ⏳ Upcoming
                                                </span>
                                              )}
                                              {isLive && (
                                                <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase animate-pulse">
                                                  🟢 Live Now
                                                </span>
                                              )}
                                              {isOver && (
                                                <span className="bg-slate-200 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase">
                                                  ❌ Closed
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <p className="text-xxs text-slate-700 leading-relaxed font-medium">
                                            {shopSale.description}
                                          </p>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-1 flex flex-col">
                                            <span>Start Date: {shopSale.startDate}</span>
                                            {/* Count of interested customers */}
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-100/60 rounded-xl p-2 mt-1.5 mb-1">
                                              <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                              <span>
                                                <strong className="text-slate-700 font-extrabold">{getSaleInterestedCount(shopSale.id)}</strong> customers marked this as interested
                                              </span>
                                            </div>
                                            <span>End Date: {shopSale.endDate}</span>
                                          </div>

                                          {/* Action button inside Detail Sheet */}
                                          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                                            {!isOver ? (
                                              <button
                                                onClick={() => {
                                                  handleToggleInterested(shopSale);
                                                }}
                                                className={`w-full py-1.5 px-3 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                                  isInterested
                                                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                <Star className={`w-3.5 h-3.5 ${isInterested ? "fill-current text-white" : "text-amber-500"}`} />
                                                <span>{isInterested ? "Interested ⭐ (Added)" : "I'm Interested"}</span>
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  handleToggleNotifyMe(shopSale);
                                                }}
                                                className={`w-full py-1.5 px-3 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                                  isNotified
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                <Bell className={`w-3.5 h-3.5 ${isNotified ? "fill-current text-white animate-bounce" : "text-emerald-600"}`} />
                                                <span>{isNotified ? "Notifying Me 🔔" : "Notify me personally"}</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>

                              <div className="border-t border-slate-100 pt-3">
                                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-orange-600" />
                                  Address Location
                                </h4>
                                <p className="text-slate-600 text-xxs leading-relaxed">{currentSelectedShop.address}</p>
                              </div>

                              {/* SIMULATED GOOGLE MAPS PIN INTERACTIVE CANVAS DISPLAY */}
                              <div>
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1">
                                  <Map className="w-4 h-4 text-orange-600" />
                                  Simulated Google Maps Pin
                                </h4>
                                
                                <div className="relative h-28 bg-blue-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                  {/* Map grid lines simulation */}
                                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                                  {/* Simulated roads and parks */}
                                  <div className="absolute top-8 left-0 right-0 h-4 bg-white/80 rotate-2"></div>
                                  <div className="absolute top-0 bottom-0 left-16 w-4 bg-white/80 -rotate-3"></div>
                                  <div className="absolute top-2 right-4 w-12 h-10 bg-emerald-100 rounded-full opacity-70"></div>
                                  
                                  {/* Interactive shop pin and pulsing aura */}
                                  <div className="relative flex flex-col items-center">
                                    <span className="absolute -top-6 bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                                      {currentSelectedShop.name}
                                    </span>
                                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-orange-400 opacity-75"></span>
                                    <MapPin className="relative w-7 h-7 text-orange-600 drop-shadow-md" />
                                  </div>
                                </div>
                              </div>

                              {/* Rate Promos reviews feedback loop inside detail sheet */}
                              <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-4 h-4 text-orange-600 animate-pulse" />
                                    Submit &quot;Real or Fake&quot; Feedback
                                  </h4>
                                  <p className="text-[10px] text-slate-500 leading-normal mb-3">
                                    Is this discount promotion authentic or deceptive mark-ups? Share feedback.
                                  </p>

                                  <form onSubmit={handleAddReview} className="flex flex-col gap-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xxs font-bold text-slate-500">Star Rating:</span>
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRatingScore(star)}
                                            className="p-0.5"
                                          >
                                            <Star className={`w-4 h-4 ${star <= ratingScore ? "text-amber-500 fill-current" : "text-slate-300"}`} />
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                      <label className="text-xxs font-bold text-slate-500">Authentic Offer?</label>
                                      <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-1 font-semibold text-[11px] text-emerald-600">
                                          <input
                                            type="radio"
                                            checked={isRealSaleSelected}
                                            onChange={() => setIsRealSaleSelected(true)}
                                            className="accent-emerald-600"
                                          />
                                          Real Sale
                                        </label>
                                        <label className="flex items-center gap-1 font-semibold text-[11px] text-red-600">
                                          <input
                                            type="radio"
                                            checked={!isRealSaleSelected}
                                            onChange={() => setIsRealSaleSelected(false)}
                                            className="accent-red-600"
                                          />
                                          Suspicious
                                        </label>
                                      </div>
                                    </div>

                                    <input
                                      type="text"
                                      placeholder="Leave a helpful comment for neighbors..."
                                      value={commentText}
                                      onChange={(e) => setCommentText(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xxs focus:outline-none"
                                    />

                                    <button
                                      type="submit"
                                      className="w-full bg-orange-600 hover:bg-orange-500 text-white py-1.5 rounded-lg text-xxs font-bold transition-all"
                                    >
                                      Submit Community Review
                                    </button>
                                  </form>
                                </div>

                                {/* Community reviews list inside emulator */}
                                <div>
                                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4 text-slate-500" />
                                    Community Reviews ({currentSelectedShop.reviews.length})
                                  </h4>
                                  
                                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                                    {currentSelectedShop.reviews.length === 0 ? (
                                      <p className="text-[10px] text-slate-400 text-center py-4">No community reviews yet. Submit one above!</p>
                                    ) : (
                                      currentSelectedShop.reviews.map(rev => (
                                        <div key={rev.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col gap-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">{rev.customerName}</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                                              rev.isRealPromo ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                            }`}>
                                              {rev.isRealPromo ? "REAL PROMO" : "SUSPICIOUS"}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-600">{rev.comment}</p>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  )}

                </div>

                {/* Simulated Android Home Button navigation pillar */}
                <div className="bg-slate-950 h-5 flex items-center justify-center shrink-0 border-t border-slate-900">
                  <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
                </div>

              </div>
            </div>

            {/* Simulated Registration/GPS Form Modal inside Workspace Frame */}
            <AnimatePresence>
              {showRegisterForm && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 flex flex-col gap-4 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-white flex items-center gap-1.5">
                        <Store className="w-5 h-5 text-orange-500" />
                        Complete Shop Profile Registration
                      </h3>
                      <button onClick={() => setShowRegisterForm(false)} className="text-slate-400 hover:text-white">&times;</button>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <div>
                        <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          value={shopOwnerName}
                          onChange={(e) => setShopOwnerName(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Store / Business Name</label>
                        <input
                          type="text"
                          value={ownerBusinessName}
                          onChange={(e) => setOwnerBusinessName(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Business Category</label>
                          <select
                            value={CATEGORIES.includes(ownerCategory) ? ownerCategory : "CUSTOM"}
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected === "CUSTOM") {
                                setOwnerCategory("");
                              } else {
                                setOwnerCategory(selected);
                              }
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 focus:outline-none text-white text-xs font-semibold"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="CUSTOM">➕ Custom Category...</option>
                          </select>

                          {(!CATEGORIES.includes(ownerCategory) || ownerCategory === "") && (
                            <input
                              type="text"
                              value={ownerCategory}
                              onChange={(e) => setOwnerCategory(e.target.value)}
                              placeholder="E.g., Hardware, Pharmacy"
                              className="mt-2 w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 text-xs font-medium placeholder-slate-500"
                            />
                          )}
                        </div>
                        <div>
                          <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Target City</label>
                          <select
                            value={CITIES.includes(ownerCity) ? ownerCity : "CUSTOM"}
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected === "CUSTOM") {
                                setOwnerCity("");
                              } else {
                                setOwnerCity(selected);
                              }
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 focus:outline-none text-white text-xs font-semibold"
                          >
                            {CITIES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                            <option value="CUSTOM">➕ Custom Indian City...</option>
                          </select>

                          {(!CITIES.includes(ownerCity) || ownerCity === "") && (
                            <input
                              type="text"
                              value={ownerCity}
                              onChange={(e) => setOwnerCity(e.target.value)}
                              placeholder="Enter Custom Indian City Name"
                              className="mt-2 w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 text-xs font-medium placeholder-slate-500"
                            />
                          )}
                        </div>
                      </div>

                       <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xxs uppercase font-bold text-slate-400 block">Store GPS Coordinates</label>
                          <button
                            type="button"
                            onClick={() => {
                              setTempLat(ownerLat);
                              setTempLng(ownerLng);
                              setTempAddress(ownerAddress);
                              setTempCity(ownerCity);
                              setLocationMappingRole("SHOP_OWNER");
                              setShowLocationModal(true);
                            }}
                            className="text-[10px] text-orange-400 font-bold hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 border border-orange-500/20 rounded-full"
                          >
                            <Map className="w-3 h-3 text-orange-500" />
                            Map Location
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xxs font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-500">Latitude</span>
                            <input
                              type="number"
                              step="0.001"
                              value={ownerLat}
                              onChange={(e) => setOwnerLat(parseFloat(e.target.value))}
                              className="bg-slate-850 border border-slate-700 text-white rounded-lg p-2"
                              placeholder="Lat"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-500">Longitude</span>
                            <input
                              type="number"
                              step="0.001"
                              value={ownerLng}
                              onChange={(e) => setOwnerLng(parseFloat(e.target.value))}
                              className="bg-slate-850 border border-slate-700 text-white rounded-lg p-2"
                              placeholder="Lng"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Updates the Jetpack Compose Google Maps Marker SDK module in real-time.</p>
                      </div>

                      <div>
                        <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Store Address</label>
                        <input
                          type="text"
                          value={ownerAddress}
                          onChange={(e) => setOwnerAddress(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-2 border-t border-slate-800 pt-4">
                      <button
                        onClick={() => setShowRegisterForm(false)}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCompleteRegistration}
                        className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-orange-600/10"
                      >
                        Save & Sign In
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Google Location Mapping Picker Modal */}
            <AnimatePresence>
              {showLocationModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 flex flex-col gap-4 shadow-2xl relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500">
                          <Map className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-sm">Google Location Linker</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {locationMappingRole === "CUSTOMER" ? "Link customer neighborhood feed" : "Map shop GPS coordinates"}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowLocationModal(false)}
                        className="text-slate-400 hover:text-white text-lg p-1.5 hover:bg-slate-800 rounded-full transition-colors"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Geolocation Live Detector Option */}
                    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-2xl gap-3">
                      <div className="flex-1">
                        <span className="text-[11px] font-black text-white block">🛰️ Browser Geolocation Service</span>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                          Read your active latitude & longitude from the device GPS sensor directly.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={gpsLoading}
                        onClick={handleDetectMyLocation}
                        className={`px-3 py-2 ${
                          gpsLoading ? "bg-slate-800 text-slate-500 animate-pulse" : "bg-orange-600 hover:bg-orange-500 text-white"
                        } font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5`}
                      >
                        {gpsLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Detecting...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5" />
                            Locate Me
                          </>
                        )}
                      </button>
                    </div>

                    {gpsError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 flex items-start gap-2 text-xxs text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{gpsError}</span>
                      </div>
                    )}

                    {/* Search landmark in India */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xxs uppercase font-bold text-slate-400">Search Landmarks & Indian Neighborhoods</label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="E.g., Bandra Mumbai, Chandni Chowk Delhi, Koramangala..."
                          value={mapSearchQuery}
                          onChange={(e) => setMapSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Autocomplete Suggestion Results */}
                      {mapSearchQuery.length > 0 && (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl max-h-32 overflow-y-auto p-1.5 flex flex-col gap-1 z-10 scrollbar-thin">
                          {INDIAN_PRESET_LOCATIONS.filter(preset => 
                            preset.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
                            preset.city.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
                            preset.address.toLowerCase().includes(mapSearchQuery.toLowerCase())
                          ).map(preset => (
                            <button
                              type="button"
                              key={preset.name}
                              onClick={() => {
                                setTempLat(preset.lat);
                                setTempLng(preset.lng);
                                setTempAddress(preset.address);
                                setTempCity(preset.city);
                                setMapSearchQuery("");
                              }}
                              className="w-full text-left p-2 hover:bg-slate-900 rounded-lg text-xs flex flex-col gap-0.5 transition-colors"
                            >
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-orange-500" />
                                {preset.name}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate pl-4.5">{preset.address}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Pick Cities Select */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-xxs uppercase font-bold text-slate-400 block mb-1">Target City</label>
                        <select
                          value={CITIES.includes(tempCity) ? tempCity : "CUSTOM"}
                          onChange={(e) => {
                            const newCity = e.target.value;
                            if (newCity === "CUSTOM") {
                              setTempCity("");
                            } else {
                              setTempCity(newCity);
                              const centers: { [key: string]: { lat: number; lng: number } } = {
                                "Mumbai": { lat: 19.076, lng: 72.877 },
                                "Delhi": { lat: 28.613, lng: 77.209 },
                                "Bengaluru": { lat: 12.971, lng: 77.594 },
                                "Pune": { lat: 18.520, lng: 73.856 },
                                "Hyderabad": { lat: 17.385, lng: 78.486 },
                                "Chennai": { lat: 13.082, lng: 80.270 },
                                "Kolkata": { lat: 22.572, lng: 88.363 },
                                "Ahmedabad": { lat: 23.022, lng: 72.571 }
                              };
                              if (centers[newCity]) {
                                setTempLat(centers[newCity].lat);
                                setTempLng(centers[newCity].lng);
                                setTempAddress(`Market Area, ${newCity}, India`);
                              }
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-orange-500 font-semibold"
                        >
                          {CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="CUSTOM">➕ Custom Indian City...</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xxs uppercase font-bold text-slate-400 mb-1">Coordinates</label>
                        <span className="font-mono text-[10px] bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 block select-all">
                          {tempLat.toFixed(4)}, {tempLng.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {(!CITIES.includes(tempCity) || tempCity === "") && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xxs uppercase font-bold text-slate-400">Custom City Name</label>
                        <input
                          type="text"
                          value={tempCity}
                          onChange={(e) => setTempCity(e.target.value)}
                          placeholder="Type city name (e.g., Jaipur, Kochi, Ambala...)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-medium placeholder-slate-600"
                        />
                      </div>
                    )}

                    {/* Interactive Map Canvas of India */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xxs uppercase font-bold text-slate-400">Simulated Google Map (Tap to pin)</label>
                        <span className="text-[9px] text-slate-500">Panning around {tempCity}</span>
                      </div>

                      <div 
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                          const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                          handleMapCanvasClick(clickX, clickY);
                        }}
                        className="relative h-44 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner cursor-crosshair flex items-center justify-center select-none group"
                      >
                        {/* Map Grid and terrain */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.1)_0%,transparent_70%)]"></div>
                        
                        {/* Simulated roads & natural features on dark canvas */}
                        <div className="absolute w-[1px] top-0 bottom-0 left-1/3 bg-slate-800"></div>
                        <div className="absolute w-[1px] top-0 bottom-0 left-2/3 bg-slate-800"></div>
                        <div className="absolute h-[1px] left-0 right-0 top-1/4 bg-slate-800"></div>
                        <div className="absolute h-[1px] left-0 right-0 top-3/4 bg-slate-800"></div>
                        
                        {/* Water body simulation */}
                        <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-950/40 rounded-full blur-xl"></div>
                        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-emerald-950/30 rounded-full blur-xl"></div>

                        {/* Interactive marker at center */}
                        <div className="relative flex flex-col items-center">
                          <span className="absolute -top-7 bg-orange-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-lg shadow-md whitespace-nowrap z-10 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            GPS Pin Linked
                          </span>
                          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-orange-500 opacity-30"></span>
                          <div className="bg-orange-500 p-2 rounded-full shadow-lg shadow-orange-500/40">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* Info text */}
                        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-2.5 py-1.5 rounded-lg text-[9px] text-slate-400 text-center">
                          Tap any coordinate to drag the Google Maps live marker there.
                        </div>
                      </div>
                    </div>

                    {/* Address Field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xxs uppercase font-bold text-slate-400">Linked Landmark Address</label>
                      <textarea
                        rows={2}
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 mt-1">
                      <button
                        type="button"
                        onClick={() => setShowLocationModal(false)}
                        className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmMappedLocation}
                        className="py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-orange-600/10"
                      >
                        Confirm Linked GPS
                      </button>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* ==================== WORKSPACE TAB 2: CODEBASE EXPLORER IDE ==================== */}
        {activeWorkspaceTab === "codebase" && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* File navigator tree column */}
            <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search file names..."
                    value={searchCodeQuery}
                    onChange={(e) => setSearchCodeQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              {/* Package hierarchy file list */}
              <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 scrollbar-thin">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">com.localdeals.app</span>
                
                {filteredFiles.map((file, idx) => {
                  const globalIndex = androidCodebase.findIndex(f => f.path === file.path);
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIndex(globalIndex)}
                      className={`flex items-start gap-2 px-2.5 py-2 rounded-lg text-xs transition-all text-left ${
                        selectedFileIndex === globalIndex
                          ? "bg-orange-600 text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <Code className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-semibold block truncate text-slate-100">{file.name}</span>
                        <span className={`text-[10px] font-mono block ${
                          selectedFileIndex === globalIndex ? "text-orange-200" : "text-slate-500"
                        } truncate`}>{file.path}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Code Editor Pane */}
            <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 bg-slate-900 border border-slate-800 text-orange-400 rounded-md font-bold">
                    {androidCodebase[selectedFileIndex].language.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    {androidCodebase[selectedFileIndex].path}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(androidCodebase[selectedFileIndex].content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-200 border border-slate-800 transition-all"
                  >
                    {copyFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        Copied File!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code viewer viewport */}
              <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed bg-slate-950/60 scrollbar-thin">
                <pre className="text-slate-300 select-all font-mono whitespace-pre">{androidCodebase[selectedFileIndex].content}</pre>
              </div>
            </div>

          </div>
        )}

        {/* ==================== WORKSPACE TAB 3: INTEGRATION SETUP GUIDE ==================== */}
        {activeWorkspaceTab === "readme" && (
          <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 scrollbar-thin">
            <div className="max-w-3xl mx-auto flex flex-col gap-6 text-slate-300">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                  Firebase &amp; Android Studio Integration Guide
                </h2>
                <p className="text-slate-400 mt-1">
                  How to take the generated codebase files, build your Android project, connect Firebase Auth SMS OTP, and enable push notifications.
                </p>
              </div>

              {/* Steps Layout */}
              <div className="flex flex-col gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4">
                  <div className="bg-orange-500/10 text-orange-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Create Project in Android Studio</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Launch Android Studio, click <strong>New Project</strong> and select <strong>Empty Activity</strong> (Jetpack Compose). Use package name <strong className="font-mono text-slate-200">com.localdeals.app</strong>. Copy the Gradle files and Kotlin directories into your project structure.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4">
                  <div className="bg-orange-500/10 text-orange-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Setup Firebase Auth OTP &amp; Firestore</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Go to Firebase Console, select Authentication, enable the **Phone Sign-In Provider**. Register your debug SHA-1 fingerprint (generated from your local terminal with <code className="bg-slate-950 px-1.5 py-0.5 rounded text-orange-400 font-mono">./gradlew signingReport</code>). Enable Cloud Firestore and paste the provided database rules from the Code Explorer.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4">
                  <div className="bg-orange-500/10 text-orange-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Download google-services.json</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Download the <code className="bg-slate-950 px-1.5 py-0.5 text-slate-200 rounded font-mono">google-services.json</code> configuration file from project settings and place it in your <code className="bg-slate-950 px-1.5 py-0.5 text-slate-200 rounded font-mono">app/</code> folder. Firebase integrates automatically with the Gradle settings compiled.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4">
                  <div className="bg-orange-500/10 text-orange-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Configure Google Maps SDK Pinning</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Retrieve an API key for Android from Google Cloud console. Set the key in your local <code className="bg-slate-950 px-1.5 py-0.5 text-slate-200 rounded font-mono">local.properties</code> as <code className="bg-slate-950 px-1.5 py-0.5 text-slate-200 rounded font-mono">MAPS_API_KEY=your_key</code>. The AndroidManifest.xml uses placeholder variables to securely compile and prevent credential leakage.
                    </p>
                  </div>
                </div>

              </div>

              {/* Firestore Security Rules Highlight */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mt-4 flex flex-col gap-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-orange-500" />
                  Firestore Security Rules (Mandatory)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  These security rules isolate Shop Owner writes, safeguard ratings from customer hijacking, and allow general readable directory listings:
                </p>
                <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 text-slate-400 max-h-52">
                  {androidCodebase.find(f => f.name === "firestore.rules")?.content}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Main Workspace Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-3.5 px-6 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>Designed with Android Clean Architecture, Jetpack Compose, Dagger Hilt &amp; Firebase</span>
        <div className="flex gap-4">
          <span className="font-medium text-slate-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> All compilation files ready
          </span>
        </div>
      </footer>

    </div>
  );
}
