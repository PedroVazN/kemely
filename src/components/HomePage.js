import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Sparkles,
  Heart,
  Star
} from 'lucide-react';

// Animações suaves e elegantes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const subtleGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
`;

// Container principal com gradiente sofisticado
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #0a0a0a 0%, 
    #1a1a1a 25%,
    #0f0f0f 50%,
    #1a1a1a 75%,
    #0a0a0a 100%
  );
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Efeito de luz ambiente sutil */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 50%
    );
    animation: ${gentleFloat} 20s ease-in-out infinite;
  }
  
  /* Grid pattern sutil */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.3;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1400px;
  width: 100%;
  padding: 60px;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 60px;
    padding: 40px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 40px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  animation: ${slideUp} 1.2s ease-out;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: ${slideUp} 1.4s ease-out;
`;

const TimeDisplay = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px 36px;
  margin-bottom: 40px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: ${shimmer} 3s infinite;
  }
`;

const TimeText = styled.div`
  font-size: 3rem;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 2px;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const DateText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: capitalize;
`;

const TitleWrapper = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 300;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -2px;
  
  span {
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 1024px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 50px 0;
  line-height: 1.6;
  font-weight: 300;
  max-width: 500px;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 40px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  padding: 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-5px);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
  }
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const ProfileImageWrapper = styled.div`
  width: 180px;
  height: 180px;
  margin: 0 auto 32px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
    animation: ${subtleGlow} 3s ease-in-out infinite;
    z-index: -1;
  }
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  background-image: url('/images/kemely-alves.jpg');
  background-size: cover;
  background-position: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 15px 50px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '👩‍💼';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    display: ${props => props.$hasImage ? 'none' : 'block'};
  }
`;

const ProfileName = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
  
  span {
    font-weight: 600;
  }
`;

const ProfileRole = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 40px 0;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const QuoteSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 80px;
    color: rgba(255, 255, 255, 0.05);
    font-family: Georgia, serif;
    line-height: 1;
  }
`;

const QuoteText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 1.8;
  margin: 0 0 16px 0;
  font-style: italic;
  font-weight: 300;
  position: relative;
  z-index: 1;
`;

const QuoteAuthor = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const EnterButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  border: none;
  border-radius: 50px;
  padding: 20px 48px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 16px 36px;
    font-size: 1rem;
  }
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(255, 255, 255, 0.15);
  
  &:nth-child(1) { 
    top: 15%; 
    left: 10%; 
    animation: ${gentleFloat} 8s ease-in-out infinite;
  }
  &:nth-child(2) { 
    top: 25%; 
    right: 15%; 
    animation: ${gentleFloat} 10s ease-in-out infinite 2s;
  }
  &:nth-child(3) { 
    bottom: 25%; 
    left: 15%; 
    animation: ${gentleFloat} 12s ease-in-out infinite 4s;
  }
  &:nth-child(4) { 
    bottom: 15%; 
    right: 10%; 
    animation: ${gentleFloat} 9s ease-in-out infinite 6s;
  }
`;

const HomePage = ({ onEnterApp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    img.src = '/images/kemely-alves.jpg';
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
      <DecorativeElements>
        <FloatingIcon>
          <Sparkles size={32} />
        </FloatingIcon>
        <FloatingIcon>
          <Heart size={28} />
        </FloatingIcon>
        <FloatingIcon>
          <Star size={30} />
        </FloatingIcon>
        <FloatingIcon>
          <Sparkles size={26} />
        </FloatingIcon>
      </DecorativeElements>

      <MainContent>
        <LeftSection>
          <TimeDisplay
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <TimeText>{formatTime(currentTime)}</TimeText>
            <DateText>{formatDate(currentTime)}</DateText>
          </TimeDisplay>

          <TitleWrapper>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Bem-vinda,
              <br />
              <span>Kemely</span>
            </Title>
          </TitleWrapper>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Sua plataforma completa de gestão e planejamento pessoal.
          </Subtitle>

          <EnterButton
            onClick={onEnterApp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Acessar Sistema
            <ArrowRight size={20} />
          </EnterButton>
        </LeftSection>

        <RightSection>
          <ProfileCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <ProfileImageWrapper>
              <ProfileImage $hasImage={imageLoaded} />
            </ProfileImageWrapper>
            
            <ProfileName>
              <span>Kemely Alves</span>
            </ProfileName>
            <ProfileRole>Corretora de Imóveis</ProfileRole>
            
            <QuoteSection
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              <QuoteText>
                Não se turbe o vosso coração; credes em Deus, crede também em mim.
              </QuoteText>
              <QuoteAuthor>— João 14:1</QuoteAuthor>
            </QuoteSection>
          </ProfileCard>
        </RightSection>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePage;
