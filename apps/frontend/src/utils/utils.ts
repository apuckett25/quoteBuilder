// lib/utils.ts

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format a date string to a readable datetime format
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number | null | undefined, decimals = 1): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%';
  }
  
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number | null | undefined, decimals = 0): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value));
};

/**
 * Get status badge configuration
 */
export const getStatusConfig = (status: number | null | undefined) => {
  const statusMap: { [key: number]: { label: string; color: string } } = {
    0: { label: 'Draft', color: 'gray' },
    1: { label: 'Pending', color: 'yellow' },
    2: { label: 'Sent', color: 'blue' },
    3: { label: 'Accepted', color: 'green' },
    4: { label: 'Rejected', color: 'red' },
  };

  return statusMap[status ?? 0] || { label: 'Unknown', color: 'gray' };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string | null | undefined, maxLength = 50): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Calculate markup percentage from cost and billable
 */
export const calculateMarkupPercentage = (cost: number, billable: number): number => {
  if (cost === 0) return 0;
  return ((billable - cost) / cost) * 100;
};

/**
 * Calculate total hours from employees, hours per week, and weeks
 */
export const calculateTotalHours = (
  numEmployees: number, 
  hoursPerWeek: number, 
  weeks: number
): number => {
  return numEmployees * hoursPerWeek * weeks;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Safe string comparison (case insensitive)
 */
export const safeIncludes = (source: string | null | undefined, search: string): boolean => {
  if (!source || !search) return false;
  return source.toLowerCase().includes(search.toLowerCase());
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Convert snake_case to Title Case
 */
export const snakeToTitle = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};