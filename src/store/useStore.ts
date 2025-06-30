import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SecurityManager, RateLimiter } from '../utils/security';
import { ValidationManager } from '../utils/validation';
import { ErrorHandler } from '../utils/errorHandler';
import { PerformanceMonitor } from '../utils/performance';

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
  isActive?: boolean;
  lastModifiedBy?: string;
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
  isVerified?: boolean;
  verificationCode?: string;
}

export interface DeletedSale extends Sale {
  deletedAt: Date;
  deletedBy?: string;
  deletionReason?: string;
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
  googleId?: string;
  picture?: string;
  isGoogleUser?: boolean;
  lastLoginAt?: Date;
  loginAttempts?: number;
  isLocked?: boolean;
  lockedUntil?: Date;
  sessionToken?: string;
  permissions?: string[];
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  isUsed: boolean;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
  companyId: string;
  isActive?: boolean;
  expiresAt?: Date;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email?: boolean;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface StoreState {
  // Authentication & Security
  currentUser: User | null;
  users: User[];
  serialNumbers: SerialNumber[];
  isAuthenticated: boolean;
  autoLoginWithGoogle: boolean;
  currentCompanyId: string | null;
  sessionExpiry: Date | null;
  auditLogs: AuditLog[];
  
  // Authentication Methods
  login: (username: string, password: string, companyId?: string) => Promise<boolean>;
  loginWithGoogle: (googleUser: GoogleUser) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  
  // Security Methods
  validateSession: () => boolean;
  refreshSession: () => void;
  lockUser: (userId: string, reason: string) => void;
  unlockUser: (userId: string) => void;
  addAuditLog: (action: string, entityType: string, entityId: string, oldData?: any, newData?: any) => void;
  
  // Serial Number Management
  addSerialNumber: (serialNumber: string) => void;
  removeSerialNumber: (id: string) => void;
  setAutoLoginWithGoogle: (enabled: boolean) => void;
  
  // Data Management
  clearAllData: () => void;
  clearSalesHistory: () => void;
  exportSecureBackup: () => string;
  importSecureBackup: (backupData: string) => boolean;
  
  // Product Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'serialNumber' | 'createdBy' | 'companyId'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Sales Management
  sales: Sale[];
  deletedSales: DeletedSale[];
  addSale: (sale: Omit<Sale, 'id' | 'saleDate' | 'soldBy' | 'companyId'>) => void;
  deleteSale: (id: string, reason?: string) => void;
  restoreSale: (id: string) => void;
  permanentlyDeleteSale: (id: string) => void;
  emptyTrash: () => void;
  cleanupOldDeletedSales: () => void;
  verifySale: (id: string) => void;
  
  // UI & Settings
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  
  // Currency Management
  currencies: Currency[];
  currentCurrency: string;
  setCurrency: (currencyCode: string) => void;
  convertPrice: (price: number, fromCurrency?: string, toCurrency?: string) => number;
  formatPrice: (price: number, currencyCode?: string) => string;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning';
    message: string;
  }>;
  addNotification: (notification: { type: 'success' | 'error' | 'warning'; message: string }) => void;
  removeNotification: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

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
      sessionExpiry: null,
      auditLogs: [],

      // Enhanced login with security features
      login: async (username: string, password: string, companyId?: string) => {
        return PerformanceMonitor.measureAsyncOperation('login', async () => {
          try {
            const state = get();
            
            // Rate limiting check
            const rateLimitKey = `login_${username}`;
            if (!RateLimiter.checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' 
                  ? 'تم تجاوز عدد محاولات تسجيل الدخول. حاول مرة أخرى بعد 15 دقيقة' 
                  : 'Too many login attempts. Try again in 15 minutes' 
              });
              SecurityManager.logSecurityEvent('LOGIN_RATE_LIMIT_EXCEEDED', { username });
              return false;
            }
            
            // 🧹 تنظيف المبيعات القديمة عند تسجيل الدخول
            get().cleanupOldDeletedSales();
            
            // Test account - رقم الشركة 0000
            if (username === 'test' && password === 'test') {
              const testUser: User = {
                id: 'test-user',
                username: 'test',
                password: SecurityManager.hashPassword('test'),
                role: 'admin',
                companyId: '0000',
                createdAt: new Date(),
                isActive: true,
                email: 'test@example.com',
                lastLoginAt: new Date(),
                sessionToken: SecurityManager.generateSecureToken(),
                permissions: ['all']
              };
              
              const sessionExpiry = new Date();
              sessionExpiry.setHours(sessionExpiry.getHours() + 24);
              
              set({ 
                currentUser: testUser, 
                isAuthenticated: true,
                currentCompanyId: '0000',
                sessionExpiry
              });
              
              SecurityManager.logSecurityEvent('LOGIN_SUCCESS', { username: 'test', method: 'password' });
              RateLimiter.resetRateLimit(rateLimitKey);
              
              get().addAuditLog('LOGIN', 'USER', testUser.id);
              get().addNotification({ 
                type: 'success', 
                message: state.language === 'ar' ? 'تم تسجيل الدخول بالحساب التجريبي! رقم الشركة: 0000' : 'Logged in with test account! Company ID: 0000' 
              });
              return true;
            }
            
            // Find user by username
            const user = state.users.find(u => u.username === username && u.isActive);
            if (!user) {
              SecurityManager.logSecurityEvent('LOGIN_FAILED', { username, reason: 'user_not_found' });
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password' 
              });
              return false;
            }
            
            // Check if user is locked
            if (user.isLocked && user.lockedUntil && new Date() < user.lockedUntil) {
              SecurityManager.logSecurityEvent('LOGIN_BLOCKED', { username, reason: 'account_locked' });
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' ? 'الحساب مقفل مؤقتاً' : 'Account is temporarily locked' 
              });
              return false;
            }
            
            // Verify password
            if (!SecurityManager.verifyPassword(password, user.password)) {
              // Increment login attempts
              const updatedUser = {
                ...user,
                loginAttempts: (user.loginAttempts || 0) + 1
              };
              
              // Lock account after 5 failed attempts
              if (updatedUser.loginAttempts >= 5) {
                const lockedUntil = new Date();
                lockedUntil.setMinutes(lockedUntil.getMinutes() + 30);
                updatedUser.isLocked = true;
                updatedUser.lockedUntil = lockedUntil;
              }
              
              set(state => ({
                users: state.users.map(u => u.id === user.id ? updatedUser : u)
              }));
              
              SecurityManager.logSecurityEvent('LOGIN_FAILED', { username, reason: 'invalid_password', attempts: updatedUser.loginAttempts });
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
              SecurityManager.logSecurityEvent('LOGIN_FAILED', { username, reason: 'invalid_company_id' });
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' ? 'رقم الشركة غير صحيح' : 'Invalid company ID' 
              });
              return false;
            }
            
            // Successful login - reset attempts and update user
            const sessionToken = SecurityManager.generateSecureToken();
            const sessionExpiry = new Date();
            sessionExpiry.setHours(sessionExpiry.getHours() + 24);
            
            const updatedUser = {
              ...user,
              lastLoginAt: new Date(),
              loginAttempts: 0,
              isLocked: false,
              lockedUntil: undefined,
              sessionToken
            };
            
            set(state => ({
              users: state.users.map(u => u.id === user.id ? updatedUser : u),
              currentUser: updatedUser, 
              isAuthenticated: true,
              currentCompanyId: user.companyId,
              sessionExpiry
            }));
            
            SecurityManager.logSecurityEvent('LOGIN_SUCCESS', { username, method: 'password' });
            RateLimiter.resetRateLimit(rateLimitKey);
            
            get().addAuditLog('LOGIN', 'USER', user.id);
            get().addNotification({ 
              type: 'success', 
              message: state.language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!' 
            });
            return true;
            
          } catch (error) {
            ErrorHandler.handleError(error, 'Authentication');
            return false;
          }
        });
      },

      // Enhanced Google login
      loginWithGoogle: async (googleUser: GoogleUser) => {
        return PerformanceMonitor.measureAsyncOperation('googleLogin', async () => {
          try {
            const state = get();
            
            // 🧹 تنظيف المبيعات القديمة عند تسجيل الدخول
            get().cleanupOldDeletedSales();
            
            // Check if user already exists with this Google ID
            let existingUser = state.users.find(u => u.googleId === googleUser.id && u.isActive);
            
            if (existingUser) {
              const sessionToken = SecurityManager.generateSecureToken();
              const sessionExpiry = new Date();
              sessionExpiry.setHours(sessionExpiry.getHours() + 24);
              
              const updatedUser = {
                ...existingUser,
                lastLoginAt: new Date(),
                sessionToken
              };
              
              set(state => ({
                users: state.users.map(u => u.id === existingUser!.id ? updatedUser : u),
                currentUser: updatedUser, 
                isAuthenticated: true,
                currentCompanyId: existingUser!.companyId,
                sessionExpiry
              }));
              
              SecurityManager.logSecurityEvent('LOGIN_SUCCESS', { method: 'google', googleId: googleUser.id });
              get().addAuditLog('LOGIN', 'USER', existingUser.id);
              return true;
            }
            
            // Check if user exists with same email
            existingUser = state.users.find(u => u.email === googleUser.email && u.isActive);
            
            if (existingUser) {
              const sessionToken = SecurityManager.generateSecureToken();
              const sessionExpiry = new Date();
              sessionExpiry.setHours(sessionExpiry.getHours() + 24);
              
              const updatedUser = {
                ...existingUser,
                googleId: googleUser.id,
                picture: googleUser.picture,
                isGoogleUser: true,
                lastLoginAt: new Date(),
                sessionToken
              };
              
              set(state => ({
                users: state.users.map(u => u.id === existingUser!.id ? updatedUser : u),
                currentUser: updatedUser,
                isAuthenticated: true,
                currentCompanyId: updatedUser.companyId,
                sessionExpiry
              }));
              
              SecurityManager.logSecurityEvent('GOOGLE_ACCOUNT_LINKED', { userId: existingUser.id, googleId: googleUser.id });
              get().addAuditLog('GOOGLE_LINK', 'USER', existingUser.id);
              return true;
            }
            
            // Create new user with Google account
            const companyId = SecurityManager.generateSecureCompanyId();
            const sessionToken = SecurityManager.generateSecureToken();
            const sessionExpiry = new Date();
            sessionExpiry.setHours(sessionExpiry.getHours() + 24);
            
            const newUser: User = {
              id: generateId(),
              username: SecurityManager.sanitizeInput(googleUser.name.replace(/\s+/g, '').toLowerCase() + '_' + generateId().substring(0, 4)),
              password: SecurityManager.hashPassword(SecurityManager.generateSecureToken()),
              role: 'admin',
              companyId,
              createdAt: new Date(),
              isActive: true,
              email: googleUser.email,
              googleId: googleUser.id,
              picture: googleUser.picture,
              isGoogleUser: true,
              lastLoginAt: new Date(),
              sessionToken,
              permissions: ['all']
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
              companyId,
              isActive: true
            };
            
            set(state => ({
              users: [...state.users, newUser],
              currentUser: newUser,
              isAuthenticated: true,
              currentCompanyId: companyId,
              sessionExpiry,
              serialNumbers: [...state.serialNumbers, newSerial]
            }));
            
            SecurityManager.logSecurityEvent('USER_REGISTERED', { method: 'google', userId: newUser.id, companyId });
            get().addAuditLog('REGISTER', 'USER', newUser.id);
            
            return true;
          } catch (error) {
            ErrorHandler.handleError(error, 'Google Authentication');
            return false;
          }
        });
      },

      // Enhanced logout
      logout: () => {
        const state = get();
        if (state.currentUser) {
          SecurityManager.logSecurityEvent('LOGOUT', { userId: state.currentUser.id });
          get().addAuditLog('LOGOUT', 'USER', state.currentUser.id);
        }
        
        set({ 
          currentUser: null, 
          isAuthenticated: false, 
          currentCompanyId: null,
          sessionExpiry: null
        });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم تسجيل الخروج بنجاح!' : 'Logged out successfully!' 
        });
      },

      // Enhanced registration
      register: async (username: string, password: string, email?: string) => {
        return PerformanceMonitor.measureAsyncOperation('register', async () => {
          try {
            const state = get();
            
            // Validate input data
            const userData = { username, password, email, role: 'admin' as const };
            const validation = ValidationManager.validateUser(userData);
            
            if (!validation.isValid) {
              get().addNotification({ 
                type: 'error', 
                message: validation.errors[0] 
              });
              return false;
            }
            
            // Sanitize input
            const sanitizedUsername = SecurityManager.sanitizeInput(username);
            const sanitizedEmail = email ? SecurityManager.sanitizeInput(email) : undefined;
            
            // Check if username already exists
            if (state.users.find(u => u.username === sanitizedUsername)) {
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' ? 'اسم المستخدم موجود بالفعل' : 'Username already exists' 
              });
              return false;
            }
            
            // Check email if provided
            if (sanitizedEmail && state.users.find(u => u.email === sanitizedEmail)) {
              get().addNotification({ 
                type: 'error', 
                message: state.language === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists' 
              });
              return false;
            }
            
            // إنشاء شركة جديدة لكل مستخدم جديد
            const companyId = SecurityManager.generateSecureCompanyId();
            const sessionToken = SecurityManager.generateSecureToken();
            const sessionExpiry = new Date();
            sessionExpiry.setHours(sessionExpiry.getHours() + 24);
            
            // كل مستخدم جديد يصبح أدمن لشركته الخاصة
            const newUser: User = {
              id: generateId(),
              username: sanitizedUsername,
              password: SecurityManager.hashPassword(password),
              role: 'admin',
              companyId,
              createdAt: new Date(),
              isActive: true,
              email: sanitizedEmail,
              lastLoginAt: new Date(),
              sessionToken,
              permissions: ['all']
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
              companyId,
              isActive: true
            };
            
            set(state => ({
              users: [...state.users, newUser],
              currentUser: newUser,
              isAuthenticated: true,
              currentCompanyId: companyId,
              sessionExpiry,
              serialNumbers: [...state.serialNumbers, newSerial]
            }));
            
            SecurityManager.logSecurityEvent('USER_REGISTERED', { userId: newUser.id, companyId });
            get().addAuditLog('REGISTER', 'USER', newUser.id);
            
            get().addNotification({ 
              type: 'success', 
              message: state.language === 'ar' 
                ? `تم إنشاء حساب الأدمن بنجاح! رقم الشركة: ${companyId}` 
                : `Admin account created successfully! Company ID: ${companyId}` 
            });
            return true;
          } catch (error) {
            ErrorHandler.handleError(error, 'Registration');
            return false;
          }
        });
      },

      // Session validation
      validateSession: () => {
        const state = get();
        if (!state.isAuthenticated || !state.currentUser || !state.sessionExpiry) {
          return false;
        }
        
        if (new Date() > state.sessionExpiry) {
          get().logout();
          get().addNotification({ 
            type: 'warning', 
            message: state.language === 'ar' ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى' : 'Session expired. Please login again' 
          });
          return false;
        }
        
        return true;
      },

      // Refresh session
      refreshSession: () => {
        const state = get();
        if (state.isAuthenticated && state.currentUser) {
          const sessionExpiry = new Date();
          sessionExpiry.setHours(sessionExpiry.getHours() + 24);
          set({ sessionExpiry });
        }
      },

      // Lock user account
      lockUser: (userId: string, reason: string) => {
        const lockedUntil = new Date();
        lockedUntil.setHours(lockedUntil.getHours() + 24);
        
        set(state => ({
          users: state.users.map(u => 
            u.id === userId 
              ? { ...u, isLocked: true, lockedUntil }
              : u
          )
        }));
        
        SecurityManager.logSecurityEvent('USER_LOCKED', { userId, reason });
        get().addAuditLog('LOCK_USER', 'USER', userId, null, { reason });
      },

      // Unlock user account
      unlockUser: (userId: string) => {
        set(state => ({
          users: state.users.map(u => 
            u.id === userId 
              ? { ...u, isLocked: false, lockedUntil: undefined, loginAttempts: 0 }
              : u
          )
        }));
        
        SecurityManager.logSecurityEvent('USER_UNLOCKED', { userId });
        get().addAuditLog('UNLOCK_USER', 'USER', userId);
      },

      // Add audit log
      addAuditLog: (action: string, entityType: string, entityId: string, oldData?: any, newData?: any) => {
        const state = get();
        const auditLog: AuditLog = {
          id: generateId(),
          userId: state.currentUser?.id || 'system',
          action,
          entityType,
          entityId,
          oldData,
          newData,
          timestamp: new Date(),
          userAgent: navigator.userAgent
        };
        
        set(state => ({
          auditLogs: [...state.auditLogs, auditLog].slice(-1000) // Keep last 1000 logs
        }));
      },

      // Enhanced serial number management
      addSerialNumber: (serialNumber: string) => {
        try {
          const state = get();
          
          if (!SecurityManager.validateSerialNumber(serialNumber)) {
            get().addNotification({ 
              type: 'error', 
              message: state.language === 'ar' 
                ? 'الرقم التسلسلي يجب أن يكون من 6-16 رقم' 
                : 'Serial number must be 6-16 digits' 
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
            companyId: state.currentCompanyId || '',
            isActive: true
          };
          
          set(state => ({
            serialNumbers: [...state.serialNumbers, newSerial]
          }));
          
          get().addAuditLog('CREATE', 'SERIAL_NUMBER', newSerial.id, null, newSerial);
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' ? 'تم إضافة الرقم التسلسلي بنجاح!' : 'Serial number added successfully!' 
          });
        } catch (error) {
          ErrorHandler.handleError(error, 'Serial Number Management');
        }
      },

      removeSerialNumber: (id: string) => {
        try {
          const state = get();
          const serial = state.serialNumbers.find(s => s.id === id);
          
          set(state => ({
            serialNumbers: state.serialNumbers.filter(s => s.id !== id)
          }));
          
          get().addAuditLog('DELETE', 'SERIAL_NUMBER', id, serial);
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' ? 'تم حذف الرقم التسلسلي بنجاح!' : 'Serial number removed successfully!' 
          });
        } catch (error) {
          ErrorHandler.handleError(error, 'Serial Number Management');
        }
      },

      setAutoLoginWithGoogle: (enabled: boolean) => {
        set({ autoLoginWithGoogle: enabled });
      },

      // Enhanced data management
      clearAllData: () => {
        const state = get();
        SecurityManager.logSecurityEvent('DATA_CLEARED', { userId: state.currentUser?.id });
        
        set({
          currentUser: null,
          users: [],
          serialNumbers: [],
          isAuthenticated: false,
          products: [],
          sales: [],
          deletedSales: [],
          currentCompanyId: null,
          sessionExpiry: null,
          auditLogs: []
        });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? 'تم مسح جميع البيانات بنجاح!' : 'All data cleared successfully!' 
        });
      },

      clearSalesHistory: () => {
        const state = get();
        get().addAuditLog('CLEAR', 'SALES_HISTORY', 'all', { count: state.sales.length });
        
        set({ sales: [] });
        
        get().addNotification({ 
          type: 'success', 
          message: get().language === 'ar' ? '🗑️ تم مسح هيستوري المبيعات نهائياً!' : '🗑️ Sales history permanently cleared!' 
        });
      },

      // Secure backup and restore
      exportSecureBackup: () => {
        try {
          const state = get();
          const backupData = {
            products: state.products.filter(p => p.companyId === state.currentCompanyId),
            sales: state.sales.filter(s => s.companyId === state.currentCompanyId),
            deletedSales: state.deletedSales.filter(s => s.companyId === state.currentCompanyId),
            serialNumbers: state.serialNumbers.filter(s => s.companyId === state.currentCompanyId),
            settings: {
              theme: state.theme,
              language: state.language,
              currency: state.currentCurrency
            }
          };
          
          const secureBackup = JSON.stringify({
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            companyId: state.currentCompanyId,
            data: SecurityManager.encrypt(JSON.stringify(backupData)),
            checksum: SecurityManager.hashPassword(JSON.stringify(backupData))
          });
          
          get().addAuditLog('EXPORT', 'BACKUP', 'system');
          return secureBackup;
        } catch (error) {
          ErrorHandler.handleError(error, 'Backup Export');
          return '';
        }
      },

      importSecureBackup: (backupString: string) => {
        try {
          const backup = JSON.parse(backupString);
          const decryptedData = SecurityManager.decrypt(backup.data);
          const backupData = JSON.parse(decryptedData);
          
          // Verify checksum
          const expectedChecksum = SecurityManager.hashPassword(JSON.stringify(backupData));
          if (backup.checksum !== expectedChecksum) {
            throw new Error('Backup integrity check failed');
          }
          
          // Validate data
          if (backupData.products) {
            backupData.products.forEach((product: any) => {
              const validation = ValidationManager.validateProduct(product);
              if (!validation.isValid) {
                throw new Error(`Invalid product data: ${validation.errors[0]}`);
              }
            });
          }
          
          // Import data
          set(state => ({
            products: [...state.products.filter(p => p.companyId !== state.currentCompanyId), ...backupData.products],
            sales: [...state.sales.filter(s => s.companyId !== state.currentCompanyId), ...backupData.sales],
            deletedSales: [...state.deletedSales.filter(s => s.companyId !== state.currentCompanyId), ...backupData.deletedSales],
            serialNumbers: [...state.serialNumbers.filter(s => s.companyId !== state.currentCompanyId), ...backupData.serialNumbers]
          }));
          
          get().addAuditLog('IMPORT', 'BACKUP', 'system');
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' ? 'تم استيراد النسخة الاحتياطية بنجاح!' : 'Backup imported successfully!' 
          });
          
          return true;
        } catch (error) {
          ErrorHandler.handleError(error, 'Backup Import');
          get().addNotification({ 
            type: 'error', 
            message: get().language === 'ar' ? 'فشل في استيراد النسخة الاحتياطية' : 'Failed to import backup' 
          });
          return false;
        }
      },
      
      products: [],
      
      // Enhanced product management
      addProduct: (productData) => {
        return PerformanceMonitor.measureOperation('addProduct', () => {
          try {
            const state = get();
            
            // Validate product data
            const validation = ValidationManager.validateProduct(productData);
            if (!validation.isValid) {
              get().addNotification({ 
                type: 'error', 
                message: validation.errors[0] 
              });
              return;
            }
            
            // Sanitize data
            const sanitizedData = ValidationManager.sanitizeData(productData);
            
            const newProduct: Product = {
              ...sanitizedData,
              id: generateId(),
              serialNumber: generateProductSerial(),
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: state.currentUser?.id,
              companyId: state.currentCompanyId || '',
              isActive: true
            };
            
            set((state) => ({
              products: [...state.products, newProduct],
            }));
            
            get().addAuditLog('CREATE', 'PRODUCT', newProduct.id, null, newProduct);
            get().addNotification({ 
              type: 'success', 
              message: get().language === 'ar' 
                ? `تم إضافة المنتج بنجاح! الرقم التسلسلي: ${newProduct.serialNumber}` 
                : `Product added successfully! Serial: ${newProduct.serialNumber}` 
            });
          } catch (error) {
            ErrorHandler.handleError(error, 'Product Management');
          }
        });
      },
      
      updateProduct: (id, productData) => {
        return PerformanceMonitor.measureOperation('updateProduct', () => {
          try {
            const state = get();
            const oldProduct = state.products.find(p => p.id === id && p.companyId === state.currentCompanyId);
            
            if (!oldProduct) {
              get().addNotification({ 
                type: 'error', 
                message: get().language === 'ar' ? 'المنتج غير موجود' : 'Product not found' 
              });
              return;
            }
            
            // Validate updated data
            const updatedData = { ...oldProduct, ...productData };
            const validation = ValidationManager.validateProduct(updatedData);
            if (!validation.isValid) {
              get().addNotification({ 
                type: 'error', 
                message: validation.errors[0] 
              });
              return;
            }
            
            // Sanitize data
            const sanitizedData = ValidationManager.sanitizeData(productData);
            
            set((state) => ({
              products: state.products.map((product) =>
                product.id === id && product.companyId === state.currentCompanyId
                  ? { 
                      ...product, 
                      ...sanitizedData, 
                      updatedAt: new Date(),
                      lastModifiedBy: state.currentUser?.id
                    }
                  : product
              ),
            }));
            
            get().addAuditLog('UPDATE', 'PRODUCT', id, oldProduct, { ...oldProduct, ...sanitizedData });
            get().addNotification({ 
              type: 'success', 
              message: get().language === 'ar' ? 'تم تحديث المنتج بنجاح!' : 'Product updated successfully!' 
            });
          } catch (error) {
            ErrorHandler.handleError(error, 'Product Management');
          }
        });
      },
      
      deleteProduct: (id) => {
        try {
          const state = get();
          const product = state.products.find(p => p.id === id && p.companyId === state.currentCompanyId);
          
          set((state) => ({
            products: state.products.filter((product) => 
              !(product.id === id && product.companyId === state.currentCompanyId)
            ),
          }));
          
          get().addAuditLog('DELETE', 'PRODUCT', id, product);
          get().addNotification({ 
            type: 'success', 
            message: get().language === 'ar' ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!' 
          });
        } catch (error) {
          ErrorHandler.handleError(error, 'Product Management');
        }
      },
      
      sales: [],
      deletedSales: [],
      
      // Enhanced sales management
      addSale: (saleData) => {
        return PerformanceMonitor.measureOperation('addSale', () => {
          try {
            const state = get();
            
            // 🧹 تنظيف المبيعات القديمة عند إضافة مبيعة جديدة
            get().cleanupOldDeletedSales();
            
            // Validate sale data
            const validation = ValidationManager.validateSale(saleData);
            if (!validation.isValid) {
              get().addNotification({ 
                type: 'error', 
                message: validation.errors[0] 
              });
              return;
            }
            
            const verificationCode = SecurityManager.generateSecureToken().substring(0, 8);
            const newSale: Sale = {
              ...saleData,
              id: generateId(),
              saleDate: new Date(),
              soldBy: state.currentUser?.id,
              companyId: state.currentCompanyId || '',
              isVerified: true,
              verificationCode
            };
            
            const product = get().products.find(p => p.id === saleData.productId && p.companyId === state.currentCompanyId);
            if (product && product.quantity >= saleData.quantity) {
              get().updateProduct(saleData.productId, { 
                quantity: product.quantity - saleData.quantity 
              });
              
              set((state) => ({
                sales: [...state.sales, newSale],
              }));
              
              get().addAuditLog('CREATE', 'SALE', newSale.id, null, newSale);
              
              const saleMethod = saleData.barcodeScan ? 
                (get().language === 'ar' ? 'بمسح الباركود' : 'via barcode scan') : 
                (get().language === 'ar' ? 'يدوياً' : 'manually');
              
              get().addNotification({ 
                type: 'success', 
                message: get().language === 'ar' 
                  ? `تم إتمام البيع بنجاح ${saleMethod}! رمز التحقق: ${verificationCode}` 
                  : `Sale completed successfully ${saleMethod}! Verification: ${verificationCode}` 
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
          } catch (error) {
            ErrorHandler.handleError(error, 'Sales Management');
          }
        });
      },

      // Enhanced sale deletion with reason
      deleteSale: (id: string, reason?: string) => {
        try {
          const state = get();
          const sale = state.sales.find(s => s.id === id);
          
          if (sale) {
            const deletedSale: DeletedSale = {
              ...sale,
              deletedAt: new Date(),
              deletedBy: state.currentUser?.id,
              deletionReason: reason || 'No reason provided'
            };
            
            set(state => ({
              sales: state.sales.filter(s => s.id !== id),
              deletedSales: [...state.deletedSales, deletedSale]
            }));
            
            get().addAuditLog('DELETE', 'SALE', id, sale, { reason });
            get().addNotification({ 
              type: 'success', 
              message: get().language === 'ar' 
                ? '🗑️ تم نقل المبيعة إلى سلة القمامة!' 
                : '🗑️ Sale moved to trash!' 
            });
          } else {
            get().addNotification({ 
              type: 'error', 
              message: get().language === 'ar' 
                ? 'لم يتم العثور على المبيعة' 
                : 'Sale not found' 
            });
          }
        } catch (error) {
          ErrorHandler.handleError(error, 'Sales Management');
        }
      },

      restoreSale: (id: string) => {
        try {
          const state = get();
          const deletedSale = state.deletedSales.find(s => s.id === id && s.companyId === state.currentCompanyId);
          
          if (deletedSale) {
            const { deletedAt, deletedBy, deletionReason, ...restoredSale } = deletedSale;
            
            set(state => ({
              deletedSales: state.deletedSales.filter(s => s.id !== id),
              sales: [...state.sales, restoredSale]
            }));
            
            get().addAuditLog('RESTORE', 'SALE', id, deletedSale, restoredSale);
            get().addNotification({ 
              type: 'success', 
              message: get().language === 'ar' 
                ? '♻️ تم استعادة المبيعة من سلة القمامة!' 
                : '♻️ Sale restored from trash!' 
            });
          }
        } catch (error) {
          ErrorHandler.handleError(error, 'Sales Management');
        }
      },

      permanentlyDeleteSale: (id: string) => {
        try {
          const state = get();
          const deletedSale = state.deletedSales.find(s => s.id === id);
          
          set(state => ({
            deletedSales: state.deletedSales.filter(s => s.id !== id)
          }));
          
          get().addAuditLog('PERMANENT_DELETE', 'SALE', id, deletedSale);
          get().addNotification({ 
            type: 'warning', 
            message: get().language === 'ar' 
              ? '🔥 تم حذف المبيعة نهائياً!' 
              : '🔥 Sale permanently deleted!' 
          });
        } catch (error) {
          ErrorHandler.handleError(error, 'Sales Management');
        }
      },

      emptyTrash: () => {
        try {
          const state = get();
          const trashCount = state.deletedSales.filter(s => s.companyId === state.currentCompanyId).length;
          
          set(state => ({
            deletedSales: state.deletedSales.filter(s => s.companyId !== state.currentCompanyId)
          }));
          
          get().addAuditLog('EMPTY_TRASH', 'SALES', 'all', { count: trashCount });
          get().addNotification({ 
            type: 'warning', 
            message: get().language === 'ar' 
              ? `🗑️ تم إفراغ سلة القمامة! حُذف ${trashCount} عنصر نهائياً` 
              : `🗑️ Trash emptied! ${trashCount} items permanently deleted` 
          });
        } catch (error) {
          ErrorHandler.handleError(error, 'Sales Management');
        }
      },

      cleanupOldDeletedSales: () => {
        try {
          const state = get();
          const oldSales = state.deletedSales.filter(sale => isOlderThan30Days(sale.deletedAt));
          
          if (oldSales.length > 0) {
            set(state => ({
              deletedSales: state.deletedSales.filter(sale => !isOlderThan30Days(sale.deletedAt))
            }));
            
            get().addAuditLog('AUTO_CLEANUP', 'SALES', 'old_deleted', { count: oldSales.length });
            console.log(`🧹 Auto-cleanup: Removed ${oldSales.length} sales older than 30 days`);
          }
        } catch (error) {
          ErrorHandler.handleError(error, 'Auto Cleanup');
        }
      },

      // Verify sale integrity
      verifySale: (id: string) => {
        try {
          const state = get();
          const sale = state.sales.find(s => s.id === id && s.companyId === state.currentCompanyId);
          
          if (sale) {
            const updatedSale = { ...sale, isVerified: true };
            
            set(state => ({
              sales: state.sales.map(s => s.id === id ? updatedSale : s)
            }));
            
            get().addAuditLog('VERIFY', 'SALE', id);
            get().addNotification({ 
              type: 'success', 
              message: get().language === 'ar' ? 'تم التحقق من المبيعة بنجاح!' : 'Sale verified successfully!' 
            });
          }
        } catch (error) {
          ErrorHandler.handleError(error, 'Sales Verification');
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
        deletedSales: state.deletedSales,
        theme: state.theme,
        language: state.language,
        currentCurrency: state.currentCurrency,
        users: state.users,
        serialNumbers: state.serialNumbers,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        autoLoginWithGoogle: state.autoLoginWithGoogle,
        currentCompanyId: state.currentCompanyId,
        sessionExpiry: state.sessionExpiry,
        auditLogs: state.auditLogs,
      }),
    }
  )
);

// Session validation middleware
setInterval(() => {
  const store = useStore.getState();
  if (store.isAuthenticated) {
    store.validateSession();
  }
}, 60000); // Check every minute

// Performance monitoring
setInterval(() => {
  PerformanceMonitor.optimizePerformance();
}, 5 * 60 * 1000); // Every 5 minutes