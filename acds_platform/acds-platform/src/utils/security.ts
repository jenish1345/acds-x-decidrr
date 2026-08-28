/**
 * Security utilities for data sanitization and protection
 */

export class Security {
  /**
   * Sanitize HTML to prevent XSS attacks
   */
  static sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Escape special characters in strings
   */
  static escapeString(str: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, char => map[char]);
  }

  /**
   * Generate secure random string
   */
  static generateRandomString(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash string using SHA-256
   */
  static async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate and sanitize file uploads
   */
  static validateFile(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
    }

    return { valid: true };
  }

  /**
   * Check if content contains potential security threats
   */
  static containsThreat(content: string): boolean {
    const threats = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers
      /<iframe/i,
      /eval\(/i
    ];

    return threats.some(pattern => pattern.test(content));
  }
}
