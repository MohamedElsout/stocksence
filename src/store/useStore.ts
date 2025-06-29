import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  serialNumber: string; // إضافة رقم تسلسلي للمنتج
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: Date;
  barcodeScan?: boolean; // إضافة خيار مسح الباركود
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  nameAr: string;
  rate: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'employee';
  serialNumber?: string;
  createdAt: Date;
  isActive: boolean;
  email?: string; // إضافة الإيميل للتسجيل التلقائي
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  isUsed: boolean;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
}

interface StoreState {
  // Authentication
  currentUser: User | null;
  users: User[];
  serialNumbers: SerialNumber[];
  isAuthenticated: boolean;
  autoLoginWithGoogle: boolean;
  login: (username: string, password: string, serialNumber?: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  addSerialNumber: (serialNumber: string) => void;
  removeSerialNumber: (id: string) => void;
  setAutoLoginWithGoogle: (enabled: boolean) => void;
  clearAllData: () => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'serialNumber'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'saleDate'>) => void;
  
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  
  currencies: Currency[];
  currentCurrency: string;
  setCurrency: (currencyCode: string) => void;
  convertPrice: (price: number, fromCurrency?: string, toCurrency?: string) => number;
  formatPrice: (price: number, currencyCode?: string) => string;
  
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning';
    message: string;
  }>;
  addNotification: (notification: { type: 'success' | 'error' | 'warning'; message: string }) => void;
  removeNotification: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateProductSerial = () => `PRD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

const currencies: Currency[] = [
  {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'Egyptian Pound',
    nameAr: 'الجنيه المصري',
    rate: 1.0
  },
  {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    nameAr: 'الريال السعودي',
    rate: 0.13
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameAr: 'الدولار الأمريكي',
    rate: 0.032
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nameAr: 'اليورو',
    rate: 0.030
  }
];

// دالة للحصول على الإيميل من Google
const getGoogleEmail = async (): Promise<string | null> => {
  try {
    // محاولة الحصول على الإيميل من Google Account API
    if ('google' in window && (window as any).google?.accounts) {
      return new Promise((resolve) => {
        (window as any).google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // يجب إضافة Client ID الحقيقي
          callback: (response: any) => {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            resolve(payload.email);
          }
        });
        (window as any).google.accounts.id.prompt();
      });
    }
    
    // بديل: محاولة الحصول على الإيميل من localStorage أو sessionStorage
    const savedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (savedEmail) return savedEmail;
    
    // بديل آخر: استخدام navigator.credentials إذا كان متاحاً
    if ('credentials' in navigator && navigator.credentials) {
      const credential = await navigator.credentials.get({
        password: true,
        federated: {
          providers: ['https://accounts.google.com']
        }
      } as any);
      
      if (credential && 'id' in credential) {
        return credential.id;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Could not get Google email:', error);
    return null;
  }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Authentication state - مسح البيانات
      currentUser: null,
      users: [],
      serialNumbers: [],
      isAuthenticated: false,
      autoLoginWithGoogle: false,

      login: async (username: string, password: string, serialNumber?: string) => {
        const state = get();
        
        // Find user by username and password
        const user = state.users.find(u => u.username === username && u.password === password && u.isActive);
        if (!user) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password' 
          });
          return false;
        }

        // Check serial number - مطلوب دائماً في تسجيل الدخول
        if (!serialNumber) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'الرقم التسلسلي مطلوب' : 'Serial number is required' 
          });
          return false;
        }

        // Verify that the serial number matches the user's serial number
        if (user.serialNumber !== serialNumber) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'الرقم التسلسلي غير صحيح' : 'Invalid serial number' 
          });
          return false;
        }
        
        set({ currentUser: user, isAuthenticated: true });
        
        // إذا كان التسجيل التلقائي مفعل، احفظ الإيميل
        if (state.autoLoginWithGoogle && user.email) {
          localStorage.setItem('userEmail', user.email);
        }
        
        get().addNotification({ 
          type: 'success', 
          message: state.language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!' 
        });
        return true;
      },

      register: async (username: string, password: string, email?: string) => {
        const state = get();
        
        // Check if username already exists
        if (state.users.find(u => u.username === username)) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'اسم المستخدم موجود بالفعل' : 'Username already exists' 
          });
          return false;
        }
        
        let userEmail: string | undefined = email;
        
        // محاولة الحصول على الإيميل من Google إذا كان التسجيل التلقائي مفعل
        if (state.autoLoginWithGoogle && !userEmail) {
          const googleEmail = await getGoogleEmail();
          if (googleEmail) {
            userEmail = googleEmail;
          }
        }
        
        // Check if this is the first user (admin) - no serial number required
        if (state.users.length === 0) {
          // إنشاء أول مستخدم (أدمن) - بدون رقم تسلسلي
          const adminUser: User = {
            id: generateId(),
            username,
            password,
            role: 'admin',
            createdAt: new Date(),
            isActive: true,
            email: userEmail
          };
          
          set(state => ({
            users: [adminUser],
            currentUser: adminUser,
            isAuthenticated: true
          }));
          
          get().addNotification({ 
            type: 'success', 
            message: state.language === 'ar' ? 'تم إنشاء حساب الأدمن بنجاح!' : 'Admin account created successfully!' 
          });
          return true;
        }
        
        // للمستخدمين الجدد (ليس الأدمن الأول) - إنشاء حساب موظف
        const autoSerialNumber = `USER${Date.now()}`;
        
        const newUser: User = {
          id: generateId(),
          username,
          password,
          role: 'employee', // المستخدمون الجدد يكونون موظفين
          serialNumber: autoSerialNumber,
          createdAt: new Date(),
          isActive: true,
          email: userEmail
        };
        
        // إضافة الرقم التسلسلي التلقائي للقائمة
        const newSerial: SerialNumber = {
          id: generateId(),
          serialNumber: autoSerialNumber,
          isUsed: true,
          createdAt: new Date(),
          usedBy: newUser.id,
          usedAt: new Date()
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
          serialNumbers: [...state.serialNumbers, newSerial]
        }));
        
        get().addNotification({ 
          type: 'success', 
          message: state.language === 'ar' 
            ? `تم إنشاء الحساب بنجاح! رقمك التسلسلي: ${autoSerialNumber}` 
            : `Account created successfully! Your serial number: ${autoSerialNumber}` 
        });
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم تسجيل الخروج بنجاح!' : 'Logged out successfully!' 
        });
      },

      addSerialNumber: (serialNumber: string) => {
        const newSerial: SerialNumber = {
          id: generateId(),
          serialNumber,
          isUsed: false,
          createdAt: new Date()
        };
        
        set(state => ({
          serialNumbers: [...state.serialNumbers, newSerial]
        }));
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم إضافة الرقم التسلسلي بنجاح!' : 'Serial number added successfully!' 
        });
      },

      removeSerialNumber: (id: string) => {
        set(state => ({
          serialNumbers: state.serialNumbers.filter(s => s.id !== id)
        }));
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم حذف الرقم التسلسلي بنجاح!' : 'Serial number removed successfully!' 
        });
      },

      setAutoLoginWithGoogle: (enabled: boolean) => {
        set({ autoLoginWithGoogle: enabled });
      },

      clearAllData: () => {
        set({
          currentUser: null,
          users: [],
          serialNumbers: [],
          isAuthenticated: false,
          products: [],
          sales: []
        });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم مسح جميع البيانات بنجاح!' : 'All data cleared successfully!' 
        });
      },
      
      products: [],
      
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          serialNumber: generateProductSerial(), // إضافة رقم تسلسلي تلقائي
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' 
            ? `تم إضافة المنتج بنجاح! الرقم التسلسلي: ${newProduct.serialNumber}` 
            : `Product added successfully! Serial: ${newProduct.serialNumber}` 
        });
      },
      
      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...productData, updatedAt: new Date() }
              : product
          ),
        }));
        get().addNotification({ type: 'success', message: 'Product updated successfully!' });
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
        get().addNotification({ type: 'success', message: 'Product deleted successfully!' });
      },
      
      sales: [],
      
      addSale: (saleData) => {
        const newSale: Sale = {
          ...saleData,
          id: generateId(),
          saleDate: new Date(),
        };
        
        const product = get().products.find(p => p.id === saleData.productId);
        if (product && product.quantity >= saleData.quantity) {
          get().updateProduct(saleData.productId, { 
            quantity: product.quantity - saleData.quantity 
          });
          
          set((state) => ({
            sales: [...state.sales, newSale],
          }));
          
          const saleMethod = saleData.barcodeScan ? 
            (get().language === 'ar' ? 'بمسح الباركود' : 'via barcode scan') : 
            (get().language === 'ar' ? 'يدوياً' : 'manually');
          
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' 
              ? `تم إتمام البيع بنجاح ${saleMethod}!` 
              : `Sale completed successfully ${saleMethod}!` 
          });
          
          if (product.quantity - saleData.quantity < 5) {
            get().addNotification({ 
              type: 'warning', 
              message: get().language === 'ar'
                ? `تحذير مخزون منخفض: ${product.name} متبقي ${product.quantity - saleData.quantity} قطعة!`
                : `Low stock warning: ${product.name} has ${product.quantity - saleData.quantity} items left!` 
            });
          }
        } else {
          get().addNotification({ 
            type: 'error', 
            message: get().language === 'ar' ? 'المخزون غير كافي!' : 'Insufficient stock available!' 
          });
        }
      },
      
      theme: 'light',
      language: 'en',
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      
      setLanguage: (lang) => {
        set({ language: lang });
        localStorage.setItem('language', lang);
      },
      
      currencies,
      currentCurrency: 'EGP',
      
      setCurrency: (currencyCode) => {
        set({ currentCurrency: currencyCode });
        localStorage.setItem('currency', currencyCode);
      },
      
      convertPrice: (price, fromCurrency = 'EGP', toCurrency) => {
        const state = get();
        const targetCurrency = toCurrency || state.currentCurrency;
        
        if (fromCurrency === targetCurrency) return price;
        
        const fromRate = state.currencies.find(c => c.code === fromCurrency)?.rate || 1;
        const toRate = state.currencies.find(c => c.code === targetCurrency)?.rate || 1;
        
        const egpPrice = price / fromRate;
        return egpPrice * toRate;
      },
      
      formatPrice: (price, currencyCode) => {
        const state = get();
        const currency = state.currencies.find(c => c.code === (currencyCode || state.currentCurrency));
        if (!currency) return price.toFixed(2);
        
        const convertedPrice = state.convertPrice(price, 'EGP', currency.code);
        return `${currency.symbol}${convertedPrice.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`;
      },
      
      notifications: [],
      
      addNotification: (notification) => {
        const id = generateId();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));
        
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: 'stocksence-store',
      partialize: (state) => ({
        products: state.products,
        sales: state.sales,
        theme: state.theme,
        language: state.language,
        currentCurrency: state.currentCurrency,
        users: state.users,
        serialNumbers: state.serialNumbers,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        autoLoginWithGoogle: state.autoLoginWithGoogle,
      }),
    }
  )
);