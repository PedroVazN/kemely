import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
    min-height: 100vh;
    color: #ffffff;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  }

  /* Animações globais */
  * {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Efeitos de hover globais */
  button:hover, 
  .hoverable:hover {
    transform: translateY(-2px);
  }

  /* Animações de entrada */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  /* Classes de animação */
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-fadeInLeft {
    animation: fadeInLeft 0.6s ease-out;
  }

  .animate-fadeInRight {
    animation: fadeInRight 0.6s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  animation: fadeInUp 0.8s ease-out;
`;

export const Card = styled.div`
  background: #2a2a2a;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  border: 2px solid #3b82f6;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(59, 130, 246, 0.5);
    border-color: #60a5fa;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(29, 78, 216, 0.02) 100%);
    pointer-events: none;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: 1px solid #3b82f6;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(59, 130, 246, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #60a5fa;

    &::before {
      left: 100%;
    }

    &::after {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 18px 24px;
  border: 2px solid #404040;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: #1a1a1a;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 
      0 0 0 4px rgba(59, 130, 246, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    background: #2a2a2a;
  }

  &::placeholder {
    color: #a0a0a0;
    transition: color 0.3s ease;
  }

  &:focus::placeholder {
    color: #d0d0d0;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 18px 24px;
  border: 2px solid #404040;
  border-radius: 16px;
  font-size: 14px;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 
      0 0 0 4px rgba(59, 130, 246, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    background: #2a2a2a;
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  position: relative;
  animation: fadeInUp 1s ease-out;
  text-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);

  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 2px;
    animation: scaleIn 0.8s ease-out 0.5s both;
  }

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
`;

export const Subtitle = styled.h2`
  color: #ffffff;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 32px;
  position: relative;
  padding-left: 24px;
  animation: fadeInLeft 0.8s ease-out;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 32px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 3px;
    animation: scaleIn 0.6s ease-out 0.3s both;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 20px;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 1px;
    animation: pulse 1.5s infinite;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  animation: fadeInLeft 0.6s ease-out;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  display: block;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 20px;
    height: 2px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 1px;
    animation: scaleIn 0.4s ease-out 0.3s both;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.variant === 'success' ? 'rgba(39, 174, 96, 0.1)' : 
                        props.variant === 'danger' ? 'rgba(231, 76, 60, 0.1)' : 
                        'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.variant === 'success' ? '#27ae60' : 
                    props.variant === 'danger' ? '#e74c3c' : 
                    '#667eea'};
  border: 1px solid ${props => props.variant === 'success' ? 'rgba(39, 174, 96, 0.2)' : 
                          props.variant === 'danger' ? 'rgba(231, 76, 60, 0.2)' : 
                          'rgba(102, 126, 234, 0.2)'};
`;

export const SearchInput = styled(Input)`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.2);
  padding-left: 45px;
  position: relative;

  &::before {
    content: '🔍';
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }
`;
