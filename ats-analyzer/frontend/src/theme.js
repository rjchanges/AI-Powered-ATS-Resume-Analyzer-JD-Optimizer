import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#3b82f6',      // modern vibrant blue
    primaryHover: '#2563eb', // darker blue on hover
    background: '#0f172a',   // slate 900
    surface: '#1e293b',      // slate 800
    text: '#f8fafc',         // slate 50
    textDim: '#cbd5e1',      // slate 300
    error: '#ef4444',        // red 500
    success: '#10b981',      // emerald 500
    successBg: 'rgba(16, 185, 129, 0.1)',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    border: '#334155'        // slate 700
  },
  fonts: {
    body: "'Outfit', 'Inter', sans-serif",
  },
  borderRadius: '12px',
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)'
  },
  transitions: {
    default: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${theme.fonts.body};
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  button {
    font-family: ${theme.fonts.body};
  }

  /* Custom Scrollbar for a premium feel */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${theme.colors.background}; 
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border}; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.textDim}; 
  }
`;
