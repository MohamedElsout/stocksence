import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
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
  login: (username: string, password: string, serialNumber?: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, serialNumber?: string) => Promise<boolean>;
  addSerialNumber: (serialNumber: string) => void;
  removeSerialNumber: (id: string) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
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

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Authentication state
      currentUser: null,
      users: [],
      serialNumbers: [
        {
          id: '1',
          serialNumber: 'ADMIN001',
          isUsed: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          serialNumber: 'EMP001',
          isUsed: false,
          createdAt: new Date(),
        },
        {
          id: '3',
          serialNumber: 'EMP002',
          isUsed: false,
          createdAt: new Date(),
        }
      ],
      isAuthenticated: false,

      login: async (username: string, password: string, serialNumber?: string) => {
        const state = get();
        
        // Check if this is the first user (admin)
        if (state.users.length === 0) {
          if (!serialNumber) {
            get().addNotification({ type: 'error', message: 'Serial number is required for first admin registration' });
            return false;
          }
          
          const serial = state.serialNumbers.find(s => s.serialNumber === serialNumber && !s.isUsed);
          if (!serial) {
            get().addNotification({ type: 'error', message: 'Invalid or used serial number' });
            return false;
          }
          
          // Create first admin user
          const adminUser: User = {
            id: generateId(),
            username,
            password,
            role: 'admin',
            serialNumber,
            createdAt: new Date(),
            isActive: true
          };
          
          // Mark serial as used
          set(state => ({
            users: [adminUser],
            currentUser: adminUser,
            isAuthenticated: true,
            serialNumbers: state.serialNumbers.map(s => 
              s.id === serial.id 
                ? { ...s, isUsed: true, usedBy: adminUser.id, usedAt: new Date() }
                : s
            )
          }));
          
          get().addNotification({ 
            type: 'success', 
            message: state.language === 'ar' ? 'تم إنشاء حساب الأدمن بنجاح!' : 'Admin account created successfully!' 
          });
          return true;
        }
        
        // Regular login
        const user = state.users.find(u => u.username === username && u.password === password && u.isActive);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          get().addNotification({ 
            type: 'success', 
            message: state.language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!' 
          });
          return true;
        }
        
        get().addNotification({ 
          type: 'error', 
          message: state.language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password' 
        });
        return false;
      },

      register: async (username: string, password: string, serialNumber?: string) => {
        const state = get();
        
        // Check if username already exists
        if (state.users.find(u => u.username === username)) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'اسم المستخدم موجود بالفعل' : 'Username already exists' 
          });
          return false;
        }
        
        if (!serialNumber) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'الرقم التسلسلي مطلوب' : 'Serial number is required' 
          });
          return false;
        }
        
        const serial = state.serialNumbers.find(s => s.serialNumber === serialNumber && !s.isUsed);
        if (!serial) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'الرقم التسلسلي غير صحيح أو مستخدم بالفعل' : 'Invalid or used serial number' 
          });
          return false;
        }
        
        // Determine role based on serial number
        const role: 'admin' | 'employee' = serialNumber.includes('ADMIN') ? 'admin' : 'employee';
        
        const newUser: User = {
          id: generateId(),
          username,
          password,
          role,
          serialNumber,
          createdAt: new Date(),
          isActive: true
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
          serialNumbers: state.serialNumbers.map(s => 
            s.id === serial.id 
              ? { ...s, isUsed: true, usedBy: newUser.id, usedAt: new Date() }
              : s
          )
        }));
        
        get().addNotification({ 
          type: 'success', 
          message: state.language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!' 
        });
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
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
      
      products: [
        {
          id: '1',
          name: 'MacBook Pro 16"',
          description: 'Apple MacBook Pro with M2 Max chip, 32GB RAM, 1TB SSD',
          quantity: 15,
          price: 78000,
          category: 'Electronics',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Herman Miller Aeron Chair',
          description: 'Ergonomic office chair with lumbar support',
          quantity: 8,
          price: 43500,
          category: 'Furniture',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '3',
          name: 'iPhone 15 Pro Max',
          description: 'Latest iPhone with titanium design, 256GB storage',
          quantity: 25,
          price: 37500,
          category: 'Electronics',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
        },
        {
          id: '4',
          name: 'Logitech MX Master 3S',
          description: 'Wireless mouse with precision tracking',
          quantity: 4,
          price: 3120,
          category: 'Electronics',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12'),
        },
        {
          id: '5',
          name: 'Standing Desk',
          description: 'Height adjustable electric standing desk',
          quantity: 12,
          price: 18750,
          category: 'Furniture',
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-18'),
        },
        {
          id: '6',
          name: 'Dell UltraSharp 4K Monitor',
          description: '27-inch 4K USB-C monitor with color accuracy',
          quantity: 18,
          price: 20300,
          category: 'Electronics',
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
        },
        {
          id: '7',
          name: 'Mechanical Keyboard',
          description: 'RGB backlit mechanical keyboard with blue switches',
          quantity: 2,
          price: 4680,
          category: 'Electronics',
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
        },
        {
          id: '8',
          name: 'Office Bookshelf',
          description: '5-tier wooden bookshelf for office organization',
          quantity: 6,
          price: 9375,
          category: 'Furniture',
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-16'),
        }
      ],
      
      sales: [
        {
          id: 's1',
          productId: '1',
          productName: 'MacBook Pro 16"',
          quantity: 2,
          price: 78000,
          totalAmount: 156000,
          saleDate: new Date('2024-01-25'),
        },
        {
          id: 's2',
          productId: '3',
          productName: 'iPhone 15 Pro Max',
          quantity: 5,
          price: 37500,
          totalAmount: 187500,
          saleDate: new Date('2024-01-24'),
        },
        {
          id: 's3',
          productId: '6',
          productName: 'Dell UltraSharp 4K Monitor',
          quantity: 3,
          price: 20300,
          totalAmount: 60900,
          saleDate: new Date('2024-01-23'),
        },
        {
          id: 's4',
          productId: '2',
          productName: 'Herman Miller Aeron Chair',
          quantity: 1,
          price: 43500,
          totalAmount: 43500,
          saleDate: new Date('2024-01-22'),
        },
        {
          id: 's5',
          productId: '5',
          productName: 'Standing Desk',
          quantity: 2,
          price: 18750,
          totalAmount: 37500,
          saleDate: new Date('2024-01-21'),
        }
      ],
      
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        get().addNotification({ type: 'success', message: 'Product added successfully!' });
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
          
          get().addNotification({ type: 'success', message: 'Sale completed successfully!' });
          
          if (product.quantity - saleData.quantity < 5) {
            get().addNotification({ 
              type: 'warning', 
              message: `Low stock warning: ${product.name} has ${product.quantity - saleData.quantity} items left!` 
            });
          }
        } else {
          get().addNotification({ type: 'error', message: 'Insufficient stock available!' });
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
      }),
    }
  )
);