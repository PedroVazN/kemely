import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Animações suaves e elegantes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1a1a1a 75%, #0a0a0a 100%);
    min-height: 100vh;
    color: #ffffff;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    font-weight: 300;
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar elegante */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Seleção de texto */
  ::selection {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  /* Transições globais suaves */
  button,
  a,
  input,
  select,
  textarea {
    transition: all 0.3s ease;
  }

  /* Remove animações excessivas por padrão */
  * {
    animation-duration: 0.4s !important;
  }

  /* Classes de animação */
  .animate-fadeIn {
    animation: ${fadeIn} 0.6s ease-out;
  }

  .animate-fadeInUp {
    animation: ${fadeInUp} 0.6s ease-out;
  }

  .animate-fadeInLeft {
    animation: ${fadeInLeft} 0.6s ease-out;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  min-height: 100vh;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-weight: 300;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 
      0 0 0 3px rgba(255, 255, 255, 0.05),
      0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 300;
  }

  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  font-weight: 300;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 
      0 0 0 3px rgba(255, 255, 255, 0.05),
      0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
    padding: 12px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 16px;
  letter-spacing: -1px;
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;

  span {
    font-weight: 600;
    background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.h2`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 24px;
  position: relative;
  animation: ${fadeInLeft} 0.8s ease-out;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  animation: ${fadeInLeft} 0.6s ease-out;
`;

export const Label = styled.label`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  display: block;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: rgba(255, 255, 255, 0.8);
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  background: ${props => 
    props.variant === 'success' ? 'rgba(16, 185, 129, 0.15)' : 
    props.variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 
    props.variant === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => 
    props.variant === 'success' ? '#10b981' : 
    props.variant === 'danger' ? '#ef4444' : 
    props.variant === 'warning' ? '#f59e0b' :
    '#ffffff'};
  border: 1px solid ${props => 
    props.variant === 'success' ? 'rgba(16, 185, 129, 0.3)' : 
    props.variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 
    props.variant === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const SearchInput = styled(Input)`
  padding-left: 45px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3e%3c/path%3e%3c/svg%3e");
  background-position: 12px center;
  background-repeat: no-repeat;
  background-size: 20px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-weight: 300;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 
      0 0 0 3px rgba(255, 255, 255, 0.05),
      0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 300;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;
