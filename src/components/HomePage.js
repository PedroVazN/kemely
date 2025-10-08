import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Clock,
  Quote,
  Sparkles,
  Crown,
  Gem,
  Star,
  Heart,
  Shield,
  Zap
} from 'lucide-react';

// Animações elegantes em preto e branco
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const drift = keyframes`
  0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  25% { transform: translateX(50px) translateY(-30px) rotate(90deg); }
  50% { transform: translateX(0px) translateY(-60px) rotate(180deg); }
  75% { transform: translateX(-50px) translateY(-30px) rotate(270deg); }
  100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
`;

const wave = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 50px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Container principal
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #111111 25%, #1a1a1a 50%, #111111 75%, #000000 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
    animation: ${drift} 20s ease-in-out infinite;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1400px;
  width: 100%;
  padding: 40px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TimeDisplay = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const TimeText = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DateText = styled.div`
  font-size: 1.1rem;
  color: #cccccc;
  font-weight: 500;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 20px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ffffff, transparent);
    border-radius: 2px;
  }
  
  @media (max-width: 1024px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #cccccc;
  margin: 0 0 40px 0;
  line-height: 1.6;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CorretoraCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
    border-radius: 25px 25px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    animation: ${rotate} 20s linear infinite;
    pointer-events: none;
  }
`;

const CorretoraImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  margin: 0 auto 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: #ffffff;
  }
  
  &::after {
    content: '👩‍💼';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    z-index: 2;
  }
`;

const CorretoraName = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  animation: ${pulse} 4s ease-in-out infinite;
`;

const CorretoraTitle = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  margin: 0 0 30px 0;
  font-weight: 300;
`;

const QuoteSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 30px;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
  }
`;

const QuoteIcon = styled.div`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 20px;
  opacity: 0.7;
  animation: ${wave} 3s ease-in-out infinite;
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  color: #ffffff;
  text-align: center;
  line-height: 1.6;
  margin: 0 0 15px 0;
  font-style: italic;
  font-weight: 300;
`;

const QuoteAuthor = styled.p`
  font-size: 1rem;
  color: #cccccc;
  text-align: center;
  margin: 0;
  font-weight: 500;
`;

const EnterButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #000000;
  border: none;
  border-radius: 50px;
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  margin-top: 40px;
  
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
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(255, 255, 255, 0.1);
  font-size: 2rem;
  animation: ${drift} 15s ease-in-out infinite;
  
  &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 20%; right: 15%; animation-delay: 2s; }
  &:nth-child(3) { bottom: 30%; left: 20%; animation-delay: 4s; }
  &:nth-child(4) { bottom: 20%; right: 10%; animation-delay: 6s; }
  &:nth-child(5) { top: 50%; left: 5%; animation-delay: 8s; }
  &:nth-child(6) { top: 60%; right: 5%; animation-delay: 10s; }
`;

const HomePage = ({ onEnter }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState({
    text: "Não se turbe o vosso coração; credes em Deus, crede também em mim.",
    author: "João 14:1"
  });

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Definir frase bíblica
  useEffect(() => {
    setQuote({
      text: "Não se turbe o vosso coração; credes em Deus, crede também em mim.",
      author: "João 14:1"
    });
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <HomeContainer>
      <FloatingElements>
        <FloatingIcon>
          <Crown />
        </FloatingIcon>
        <FloatingIcon>
          <Gem />
        </FloatingIcon>
        <FloatingIcon>
          <Star />
        </FloatingIcon>
        <FloatingIcon>
          <Heart />
        </FloatingIcon>
        <FloatingIcon>
          <Shield />
        </FloatingIcon>
        <FloatingIcon>
          <Zap />
        </FloatingIcon>
      </FloatingElements>

      <MainContent>
        <LeftSection>
          <TimeDisplay
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <TimeText>{formatTime(currentTime)}</TimeText>
            <DateText>{formatDate(currentTime)}</DateText>
          </TimeDisplay>

          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Bem-vindo de volta
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Transformando sonhos em realidade através de investimentos inteligentes
          </Subtitle>

          <EnterButton
            onClick={onEnter}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={20} />
            Acessar Sistema
          </EnterButton>
        </LeftSection>

        <RightSection>
          <CorretoraCard
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <CorretoraImage />
            <CorretoraName>Corretora Kemely Alves</CorretoraName>
            <CorretoraTitle>Especialista em Investimentos</CorretoraTitle>
            
            <QuoteSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <QuoteIcon>
                <Quote />
              </QuoteIcon>
              <QuoteText>"{quote.text}"</QuoteText>
              <QuoteAuthor>— {quote.author}</QuoteAuthor>
            </QuoteSection>
          </CorretoraCard>
        </RightSection>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePage;