// Security utilities for enhanced protection
import CryptoJS from 'crypto-js';

// Encryption key - في التطبيق الحقيقي يجب أن يكون من متغيرات البيئة
const ENCRYPTION_KEY = 'StockSence_2024_SecureKey_!@#$%^&*()';

export class SecurityManager {
  // تشفير البيانات الحساسة
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  // فك تشفير البيانات
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  // تشفير كلمات المرور
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString();
  }

  // التحقق من كلمة المرور
  static verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  // إنشاء رمز مميز آمن
  static generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  // التحقق من صحة البريد الإلكتروني
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // التحقق من قوة كلمة المرور
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain special characters');
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  // تنظيف البيانات من XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // التحقق من صحة الرقم التسلسلي
  static validateSerialNumber(serial: string): boolean {
    return /^\d{6,16}$/.test(serial);
  }

  // إنشاء معرف شركة آمن
  static generateSecureCompanyId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `COMP_${timestamp}_${random}`.toUpperCase();
  }

  // التحقق من الجلسة
  static validateSession(sessionData: any): boolean {
    if (!sessionData || !sessionData.timestamp) return false;
    
    const now = Date.now();
    const sessionAge = now - sessionData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة
    
    return sessionAge < maxAge;
  }

  // تسجيل الأنشطة الأمنية
  static logSecurityEvent(event: string, details: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Security Event:', logEntry);
    
    // في التطبيق الحقيقي، يجب إرسال هذا إلى خادم التسجيل
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push(logEntry);
    
    // الاحتفاظ بآخر 100 سجل فقط
    if (securityLogs.length > 100) {
      securityLogs.splice(0, securityLogs.length - 100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  }
}

// Rate Limiting للحماية من الهجمات
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();
  
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // إزالة المحاولات القديمة
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      SecurityManager.logSecurityEvent('RATE_LIMIT_EXCEEDED', { key, attempts: validAttempts.length });
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  static resetRateLimit(key: string) {
    this.attempts.delete(key);
  }
}

// مدير النسخ الاحتياطية
export class BackupManager {
  static createBackup(data: any): string {
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data: SecurityManager.encrypt(JSON.stringify(data)),
      checksum: CryptoJS.SHA256(JSON.stringify(data)).toString()
    };
    
    return JSON.stringify(backup);
  }
  
  static restoreBackup(backupString: string): any {
    try {
      const backup = JSON.parse(backupString);
      const decryptedData = SecurityManager.decrypt(backup.data);
      const parsedData = JSON.parse(decryptedData);
      
      // التحقق من سلامة البيانات
      const checksum = CryptoJS.SHA256(JSON.stringify(parsedData)).toString();
      if (checksum !== backup.checksum) {
        throw new Error('Backup data integrity check failed');
      }
      
      return parsedData;
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }
}