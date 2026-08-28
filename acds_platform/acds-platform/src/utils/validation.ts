/**
 * Data validation utilities
 */

export class Validator {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  static isPositiveNumber(value: number): boolean {
    return this.isValidNumber(value) && value > 0;
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return this.isValidNumber(value) && value >= min && value <= max;
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }

  static validateDataset(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    if (data.length === 0) {
      errors.push('Dataset cannot be empty');
      return { valid: false, errors };
    }

    if (data.length < 10) {
      errors.push('Dataset should contain at least 10 records for meaningful analysis');
    }

    // Check for consistent structure
    const firstRowKeys = Object.keys(data[0] || {});
    if (firstRowKeys.length === 0) {
      errors.push('Dataset rows must contain at least one field');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
