// Advanced validation utilities
export class ValidationManager {
  // التحقق من صحة بيانات المنتج
  static validateProduct(product: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters long');
    }
    
    if (product.name && product.name.length > 100) {
      errors.push('Product name must not exceed 100 characters');
    }
    
    if (!product.category || product.category.trim().length < 2) {
      errors.push('Category must be at least 2 characters long');
    }
    
    if (typeof product.quantity !== 'number' || product.quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
    
    if (typeof product.price !== 'number' || product.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (product.price > 1000000) {
      errors.push('Price cannot exceed 1,000,000');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // التحقق من صحة بيانات المبيعة
  static validateSale(sale: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!sale.productId) {
      errors.push('Product ID is required');
    }
    
    if (!sale.productName || sale.productName.trim().length < 1) {
      errors.push('Product name is required');
    }
    
    if (typeof sale.quantity !== 'number' || sale.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }
    
    if (typeof sale.price !== 'number' || sale.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (typeof sale.totalAmount !== 'number' || sale.totalAmount <= 0) {
      errors.push('Total amount must be a positive number');
    }
    
    // التحقق من صحة الحساب
    if (Math.abs(sale.totalAmount - (sale.quantity * sale.price)) > 0.01) {
      errors.push('Total amount calculation is incorrect');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // التحقق من صحة بيانات المستخدم
  static validateUser(user: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!user.username || user.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (user.username && user.username.length > 50) {
      errors.push('Username must not exceed 50 characters');
    }
    
    if (user.username && !/^[a-zA-Z0-9_]+$/.test(user.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
    
    if (!user.password || user.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('Invalid email format');
    }
    
    if (!user.role || !['admin', 'employee'].includes(user.role)) {
      errors.push('Invalid user role');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // تنظيف وتطهير البيانات
  static sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return data.trim().replace(/[<>]/g, '');
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        sanitized[key] = this.sanitizeData(data[key]);
      }
      return sanitized;
    }
    
    return data;
  }
}