// Comprehensive error handling system
export class ErrorHandler {
  private static errorLog: any[] = [];
  
  // معالج الأخطاء العام
  static handleError(error: any, context: string = 'Unknown'): void {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      context,
      message: error.message || 'Unknown error',
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };
    
    this.errorLog.push(errorInfo);
    console.error(`[${context}] Error:`, errorInfo);
    
    // إرسال الخطأ إلى خدمة التسجيل (في التطبيق الحقيقي)
    this.logToService(errorInfo);
    
    // عرض رسالة خطأ للمستخدم
    this.showUserFriendlyError(error, context);
  }
  
  // معالج أخطاء العمليات غير المتزامنة
  static async handleAsyncError<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
      return fallback;
    }
  }
  
  // معالج أخطاء الشبكة
  static handleNetworkError(error: any): void {
    if (!navigator.onLine) {
      this.showUserMessage('No internet connection. Please check your network.', 'warning');
    } else {
      this.handleError(error, 'Network');
    }
  }
  
  // إنشاء معرف فريد للخطأ
  private static generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // الحصول على معرف المستخدم الحالي
  private static getCurrentUserId(): string | null {
    try {
      const store = JSON.parse(localStorage.getItem('stocksence-store') || '{}');
      return store.state?.currentUser?.id || null;
    } catch {
      return null;
    }
  }
  
  // تسجيل الخطأ في الخدمة
  private static logToService(errorInfo: any): void {
    // في التطبيق الحقيقي، يتم إرسال الأخطاء إلى خادم التسجيل
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errors.push(errorInfo);
    
    // الاحتفاظ بآخر 50 خطأ فقط
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('error_logs', JSON.stringify(errors));
  }
  
  // عرض رسالة خطأ ودية للمستخدم
  private static showUserFriendlyError(error: any, context: string): void {
    let message = 'An unexpected error occurred. Please try again.';
    
    if (context === 'Authentication') {
      message = 'Login failed. Please check your credentials.';
    } else if (context === 'Network') {
      message = 'Network error. Please check your connection.';
    } else if (context === 'Validation') {
      message = 'Invalid data provided. Please check your input.';
    }
    
    this.showUserMessage(message, 'error');
  }
  
  // عرض رسالة للمستخدم
  private static showUserMessage(message: string, type: 'error' | 'warning' | 'info'): void {
    // إرسال الرسالة إلى نظام الإشعارات
    const event = new CustomEvent('showNotification', {
      detail: { type, message }
    });
    window.dispatchEvent(event);
  }
  
  // الحصول على سجل الأخطاء
  static getErrorLog(): any[] {
    return [...this.errorLog];
  }
  
  // مسح سجل الأخطاء
  static clearErrorLog(): void {
    this.errorLog = [];
    localStorage.removeItem('error_logs');
  }
}

// معالج الأخطاء العام للتطبيق
window.addEventListener('error', (event) => {
  ErrorHandler.handleError(event.error, 'Global');
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.handleError(event.reason, 'Promise Rejection');
});