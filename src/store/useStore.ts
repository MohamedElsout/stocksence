import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  serialNumber: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  companyId?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: Date;
  barcodeScan?: boolean;
  soldBy?: string;
  companyId?: string;
}

export interface DeletedSale extends Sale {
  deletedAt: Date;
  deletedBy?: string;
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
  companyId: string;
  createdAt: Date;
  isActive: boolean;
  email?: string;
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  isUsed: boolean;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
  companyId: string;
}

interface StoreState {
  // Authentication
  currentUser: User | null;
  users: User[];
  serialNumbers: SerialNumber[];
  isAuthenticated: boolean;
  autoLoginWithGoogle: boolean;
  currentCompanyId: string | null;
  login: (username: string, password: string, companyId?: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  addSerialNumber: (serialNumber: string) => void;
  removeSerialNumber: (id: string) => void;
  setAutoLoginWithGoogle: (enabled: boolean) => void;
  clearAllData: () => void;
  clearSalesHistory: () => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'serialNumber' | 'createdBy' | 'companyId'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  sales: Sale[];
  deletedSales: DeletedSale[]; // سلة القمامة للمبيعات
  addSale: (sale: Omit<Sale, 'id' | 'saleDate' | 'soldBy' | 'companyId'>) => void;
  deleteSale: (id: string) => void; // حذف مبيعة وإرسالها لسلة القمامة
  restoreSale: (id: string) => void; // استعادة مبيعة من سلة القمامة
  permanentlyDeleteSale: (id: string) => void; // حذف نهائي من سلة القمامة
  emptyTrash: () => void; // إفراغ سلة القمامة نهائياً
  cleanupOldDeletedSales: () => void; // 🗑️ تنظيف المبيعات القديمة (أكثر من 30 يوم)
  
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
const generateCompanyId = () => `COMP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// دالة لإنشاء رقم تسلسلي للمنتج (6-16 رقم)
const generateProductSerial = () => {
  const min = 100000; // 6 أرقام
  const max = 9999999999999999; // 16 رقم
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

// دالة لإنشاء رقم تسلسلي بسيط من 6 أرقام للمستخدمين
const generateSimpleSerial = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🗓️ دالة للتحقق من عمر المبيعة المحذوفة (30 يوم)
const isOlderThan30Days = (deletedAt: Date): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(deletedAt) < thirtyDaysAgo;
};

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
      serialNumbers: [],
      isAuthenticated: false,
      autoLoginWithGoogle: false,
      currentCompanyId: null,

      login: async (username: string, password: string, companyId?: string) => {
        const state = get();
        
        // 🧹 تنظيف المبيعات القديمة عند تسجيل الدخول
        get().cleanupOldDeletedSales();
        
        // Test account - رقم الشركة 0000
        if (username === 'test' && password === 'test') {
          const testUser: User = {
            id: 'test-user',
            username: 'test',
            password: 'test',
            role: 'admin',
            companyId: '0000', // ✅ رقم الشركة 0000 للحساب التجريبي
            createdAt: new Date(),
            isActive: true,
            email: 'test@example.com'
          };
          
          set({ 
            currentUser: testUser, 
            isAuthenticated: true,
            currentCompanyId: '0000' // ✅ تعيين رقم الشركة 0000
          });
          
          get().addNotification({ 
            type: 'success', 
            message: state.language === 'ar' ? 'تم تسجيل الدخول بالحساب التجريبي! رقم الشركة: 0000' : 'Logged in with test account! Company ID: 0000' 
          });
          return true;
        }
        
        // Find user by username and password
        const user = state.users.find(u => u.username === username && u.password === password && u.isActive);
        if (!user) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password' 
          });
          return false;
        }

        // Check company ID
        if (!companyId) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'رقم الشركة مطلوب' : 'Company ID is required' 
          });
          return false;
        }

        // Verify that the company ID matches the user's company ID
        if (user.companyId !== companyId) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' ? 'رقم الشركة غير صحيح' : 'Invalid company ID' 
          });
          return false;
        }
        
        set({ 
          currentUser: user, 
          isAuthenticated: true,
          currentCompanyId: user.companyId
        });
        
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
        
        // إنشاء شركة جديدة لكل مستخدم جديد
        const companyId = generateCompanyId();
        
        // كل مستخدم جديد يصبح أدمن لشركته الخاصة
        const newUser: User = {
          id: generateId(),
          username,
          password,
          role: 'admin',
          companyId,
          createdAt: new Date(),
          isActive: true,
          email
        };
        
        // إنشاء رقم تسلسلي تلقائي للمستخدم الجديد
        const autoSerialNumber = generateSimpleSerial();
        const newSerial: SerialNumber = {
          id: generateId(),
          serialNumber: autoSerialNumber,
          isUsed: true,
          createdAt: new Date(),
          usedBy: newUser.id,
          usedAt: new Date(),
          companyId
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
          currentCompanyId: companyId,
          serialNumbers: [...state.serialNumbers, newSerial]
        }));
        
        get().addNotification({ 
          type: 'success', 
          message: state.language === 'ar' 
            ? `تم إنشاء حساب الأدمن بنجاح! رقم الشركة: ${companyId}` 
            : `Admin account created successfully! Company ID: ${companyId}` 
        });
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, currentCompanyId: null });
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم تسجيل الخروج بنجاح!' : 'Logged out successfully!' 
        });
      },

      addSerialNumber: (serialNumber: string) => {
        const state = get();
        
        if (!/^\d{6}$/.test(serialNumber)) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' 
              ? 'الرقم التسلسلي يجب أن يكون 6 أرقام فقط' 
              : 'Serial number must be exactly 6 digits' 
          });
          return;
        }
        
        if (state.serialNumbers.find(s => s.serialNumber === serialNumber && s.companyId === state.currentCompanyId)) {
          get().addNotification({ 
            type: 'error', 
            message: state.language === 'ar' 
              ? 'هذا الرقم التسلسلي موجود بالفعل' 
              : 'This serial number already exists' 
          });
          return;
        }
        
        const newSerial: SerialNumber = {
          id: generateId(),
          serialNumber,
          isUsed: false,
          createdAt: new Date(),
          companyId: state.currentCompanyId || ''
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
          sales: [],
          deletedSales: [],
          currentCompanyId: null
        });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم مسح جميع البيانات بنجاح!' : 'All data cleared successfully!' 
        });
      },

      // 🔥 دالة مسح هيستوري المبيعات نهائياً
      clearSalesHistory: () => {
        // مسح جميع المبيعات نهائياً
        set({ sales: [] });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? '🗑️ تم مسح هيستوري المبيعات نهائياً!' : '🗑️ Sales history permanently cleared!' 
        });
      },
      
      products: [],
      
      addProduct: (productData) => {
        const state = get();
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          serialNumber: generateProductSerial(),
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: state.currentUser?.id,
          companyId: state.currentCompanyId || ''
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
            product.id === id && product.companyId === state.currentCompanyId
              ? { ...product, ...productData, updatedAt: new Date() }
              : product
          ),
        }));
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم تحديث المنتج بنجاح!' : 'Product updated successfully!' 
        });
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => 
            !(product.id === id && product.companyId === state.currentCompanyId)
          ),
        }));
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!' 
        });
      },
      
      sales: [],
      deletedSales: [], // سلة القمامة للمبيعات
      
      addSale: (saleData) => {
        const state = get();
        
        // 🧹 تنظيف المبيعات القديمة عند إضافة مبيعة جديدة
        get().cleanupOldDeletedSales();
        
        const newSale: Sale = {
          ...saleData,
          id: generateId(),
          saleDate: new Date(),
          soldBy: state.currentUser?.id,
          companyId: state.currentCompanyId || ''
        };
        
        const product = get().products.find(p => p.id === saleData.productId && p.companyId === state.currentCompanyId);
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

      // 🗑️ حذف مبيعة وإرسالها لسلة القمامة
      deleteSale: (id: string) => {
        const state = get();
        console.log('Attempting to delete sale with ID:', id);
        console.log('Current sales:', state.sales);
        console.log('Current company ID:', state.currentCompanyId);
        
        const sale = state.sales.find(s => s.id === id);
        console.log('Found sale:', sale);
        
        if (sale) {
          const deletedSale: DeletedSale = {
            ...sale,
            deletedAt: new Date(),
            deletedBy: state.currentUser?.id
          };
          
          set(state => ({
            sales: state.sales.filter(s => s.id !== id),
            deletedSales: [...state.deletedSales, deletedSale]
          }));
          
          console.log('Sale moved to trash successfully');
          
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' 
              ? '🗑️ تم نقل المبيعة إلى سلة القمامة!' 
              : '🗑️ Sale moved to trash!' 
          });
        } else {
          console.log('Sale not found for deletion');
          get().addNotification({ 
            type: 'error', 
            message: get().language === 'ar' 
              ? 'لم يتم العثور على المبيعة' 
              : 'Sale not found' 
          });
        }
      },

      // ♻️ استعادة مبيعة من سلة القمامة
      restoreSale: (id: string) => {
        const state = get();
        const deletedSale = state.deletedSales.find(s => s.id === id && s.companyId === state.currentCompanyId);
        
        if (deletedSale) {
          const { deletedAt, deletedBy, ...restoredSale } = deletedSale;
          
          set(state => ({
            deletedSales: state.deletedSales.filter(s => s.id !== id),
            sales: [...state.sales, restoredSale]
          }));
          
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' 
              ? '♻️ تم استعادة المبيعة من سلة القمامة!' 
              : '♻️ Sale restored from trash!' 
          });
        }
      },

      // 🔥 حذف نهائي من سلة القمامة
      permanentlyDeleteSale: (id: string) => {
        set(state => ({
          deletedSales: state.deletedSales.filter(s => s.id !== id)
        }));
        
        get().addNotification({ 
          type: 'warning', 
          message: get().language === 'ar' 
            ? '🔥 تم حذف المبيعة نهائياً!' 
            : '🔥 Sale permanently deleted!' 
        });
      },

      // 🗑️ إفراغ سلة القمامة نهائياً
      emptyTrash: () => {
        const state = get();
        const trashCount = state.deletedSales.filter(s => s.companyId === state.currentCompanyId).length;
        
        set(state => ({
          deletedSales: state.deletedSales.filter(s => s.companyId !== state.currentCompanyId)
        }));
        
        get().addNotification({ 
          type: 'warning', 
          message: get().language === 'ar' 
            ? `🗑️ تم إفراغ سلة القمامة! حُذف ${trashCount} عنصر نهائياً` 
            : `🗑️ Trash emptied! ${trashCount} items permanently deleted` 
        });
      },

      // 🧹 تنظيف المبيعات القديمة (أكثر من 30 يوم) تلقائياً
      cleanupOldDeletedSales: () => {
        const state = get();
        const oldSales = state.deletedSales.filter(sale => isOlderThan30Days(sale.deletedAt));
        
        if (oldSales.length > 0) {
          set(state => ({
            deletedSales: state.deletedSales.filter(sale => !isOlderThan30Days(sale.deletedAt))
          }));
          
          console.log(`🧹 Auto-cleanup: Removed ${oldSales.length} sales older than 30 days`);
          
          // إشعار للمستخدم (اختياري - يمكن إزالته إذا كان مزعجاً)
          if (oldSales.length > 0) {
            get().addNotification({ 
              type: 'info', 
              message: get().language === 'ar' 
                ? `🧹 تم حذف ${oldSales.length} مبيعة قديمة تلقائياً (أكثر من 30 يوم)` 
                : `🧹 Auto-deleted ${oldSales.length} old sales (older than 30 days)` 
            });
          }
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
        deletedSales: state.deletedSales, // حفظ سلة القمامة
        theme: state.theme,
        language: state.language,
        currentCurrency: state.currentCurrency,
        users: state.users,
        serialNumbers: state.serialNumbers,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        autoLoginWithGoogle: state.autoLoginWithGoogle,
        currentCompanyId: state.currentCompanyId,
      }),
    }
  )
);