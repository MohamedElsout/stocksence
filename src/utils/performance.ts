// Performance monitoring and optimization
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  
  // قياس أداء العمليات
  static measureOperation<T>(name: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    const duration = end - start;
    
    this.recordMetric(name, duration);
    
    if (duration > 1000) { // أكثر من ثانية
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  // قياس أداء العمليات غير المتزامنة
  static async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    const duration = end - start;
    
    this.recordMetric(name, duration);
    
    if (duration > 2000) { // أكثر من ثانيتين
      console.warn(`Slow async operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  // تسجيل المقاييس
  private static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // الاحتفاظ بآخر 100 قياس فقط
    if (values.length > 100) {
      values.shift();
    }
  }
  
  // الحصول على إحصائيات الأداء
  static getPerformanceStats(name: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    
    return {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }
  
  // مراقبة استخدام الذاكرة
  static monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
      
      console.log('Memory Usage:', usage);
      
      if (usage.used / usage.limit > 0.8) {
        console.warn('High memory usage detected:', usage);
      }
    }
  }
  
  // تحسين الأداء
  static optimizePerformance(): void {
    // تنظيف البيانات المؤقتة
    this.clearOldMetrics();
    
    // تحسين LocalStorage
    this.optimizeLocalStorage();
    
    // مراقبة الذاكرة
    this.monitorMemoryUsage();
  }
  
  private static clearOldMetrics(): void {
    // مسح المقاييس القديمة
    this.metrics.clear();
  }
  
  private static optimizeLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      let totalSize = 0;
      
      keys.forEach(key => {
        totalSize += localStorage.getItem(key)?.length || 0;
      });
      
      // إذا كان الحجم أكبر من 5MB
      if (totalSize > 5 * 1024 * 1024) {
        console.warn('LocalStorage size is large:', totalSize / 1024 / 1024, 'MB');
        
        // مسح البيانات القديمة
        const oldLogs = ['error_logs', 'security_logs'];
        oldLogs.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('LocalStorage optimization failed:', error);
    }
  }
}

// تشغيل مراقبة الأداء كل 5 دقائق
setInterval(() => {
  PerformanceMonitor.optimizePerformance();
}, 5 * 60 * 1000);