export const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    light: '#ecf0f1',
    dark: '#2c3e50',
    white: '#ffffff',
    gray: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    danger: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    warning: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    info: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.05)',
    medium: '0 8px 25px rgba(0, 0, 0, 0.1)',
    large: '0 20px 40px rgba(0, 0, 0, 0.15)',
    card: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    round: '50%'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  },
  animations: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export default theme;
