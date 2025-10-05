import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Clock,
  Quote,
  Sparkles
} from 'lucide-react';

// Animações
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
`;


const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const drift = keyframes`
  0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  25% { transform: translateX(100px) translateY(-50px) rotate(90deg); }
  50% { transform: translateX(0px) translateY(-100px) rotate(180deg); }
  75% { transform: translateX(-100px) translateY(-50px) rotate(270deg); }
  100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
`;

const wave = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-40px) scale(1.2); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(245, 158, 11, 0.3); }
`;

// Container principal
const HomeContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`;

// Efeitos de fundo
const BackgroundEffects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingShape = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  animation: ${drift} 12s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
  
  &:nth-child(1) {
    width: 400px;
    height: 400px;
    top: 10%;
    left: 5%;
    animation: ${drift} 15s ease-in-out infinite;
    animation-delay: 0s;
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 60px rgba(59, 130, 246, 0.2);
  }
  
  &:nth-child(2) {
    width: 300px;
    height: 300px;
    top: 40%;
    right: 5%;
    animation: ${wave} 10s ease-in-out infinite;
    animation-delay: 2s;
    background: rgba(245, 158, 11, 0.06);
    border-color: rgba(245, 158, 11, 0.2);
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.2);
  }
  
  &:nth-child(3) {
    width: 250px;
    height: 250px;
    bottom: 10%;
    left: 10%;
    animation: ${float} 8s ease-in-out infinite;
    animation-delay: 4s;
    background: rgba(16, 185, 129, 0.05);
    border-color: rgba(16, 185, 129, 0.2);
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
  }
  
  &:nth-child(4) {
    width: 180px;
    height: 180px;
    top: 20%;
    right: 30%;
    animation: ${pulse} 6s ease-in-out infinite;
    animation-delay: 1s;
    background: rgba(139, 69, 19, 0.04);
    border-color: rgba(139, 69, 19, 0.2);
    box-shadow: 0 0 30px rgba(139, 69, 19, 0.2);
  }
  
  &:nth-child(5) {
    width: 120px;
    height: 120px;
    bottom: 30%;
    right: 20%;
    animation: ${rotate} 20s linear infinite;
    animation-delay: 3s;
    background: rgba(239, 68, 68, 0.03);
    border-color: rgba(239, 68, 68, 0.2);
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.2);
  }
`;

const GradientOrb = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(245, 158, 11, 0.05) 30%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 6s ease-in-out infinite;
  box-shadow: 0 0 100px rgba(59, 130, 246, 0.1);
`;

// Conteúdo principal
const MainContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: left;
  max-width: 1400px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 30px;
  padding: 40px;
  align-items: center;
`;

const WelcomeSection = styled(motion.div)`
  grid-column: 1 / -1;
  grid-row: 1;
  text-align: center;
  margin-bottom: 0;
`;

const TimeDisplay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 500;
`;

const TimeText = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  margin-bottom: 15px;
  letter-spacing: 3px;
`;

const DateText = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  text-transform: capitalize;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  text-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
  letter-spacing: 2px;
  animation: ${pulse} 4s ease-in-out infinite;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px 0;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

// Card da corretora
const CorretoraCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(30px);
  border: 3px solid rgba(59, 130, 246, 0.4);
  border-radius: 32px;
  padding: 40px;
  margin: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  grid-column: 2;
  grid-row: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
    opacity: 0.7;
    transition: opacity 0.4s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(59, 130, 246, 0.8);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);

    &::before {
      opacity: 1;
    }
  }
`;

const CorretoraImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.8),
    0 0 0 3px rgba(59, 130, 246, 0.5),
    inset 0 0 0 2px rgba(255, 255, 255, 0.1);
  position: relative;
  border: 3px solid rgba(59, 130, 246, 0.6);
  overflow: hidden;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(245, 158, 11, 0.3), rgba(16, 185, 129, 0.3));
    z-index: -1;
  }
`;

const CorretoraName = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
`;

const CorretoraTitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 2;
  margin: 0 0 10px 0;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

// Frase motivacional
const QuoteSection = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(30px);
  border: 3px solid rgba(245, 158, 11, 0.4);
  border-radius: 32px;
  padding: 40px;
  margin: 0;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  grid-column: 1;
  grid-row: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(245, 158, 11, 0.8);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
  }
`;

const QuoteIcon = styled.div`
  font-size: 2.5rem;
  color: rgba(245, 158, 11, 0.8);
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
`;

const QuoteText = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
  margin: 0 0 15px 0;
  line-height: 1.7;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  font-weight: 500;
`;

const QuoteAuthor = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
`;


// Botão principal
const EnterButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(29, 78, 216, 0.2) 100%);
  backdrop-filter: blur(30px);
  color: white;
  border: 3px solid rgba(59, 130, 246, 0.5);
  border-radius: 20px;
  padding: 20px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 auto;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.4s ease;
  grid-column: 1 / -1;
  grid-row: 3;
  animation: ${glow} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
    transition: left 0.8s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(29, 78, 216, 0.4) 100%);
    border-color: rgba(59, 130, 246, 0.8);
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const HomePage = ({ onEnterApp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState({
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier"
  });

  // Atualizar horário
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Buscar frase motivacional
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        setQuote({
          text: data.content,
          author: data.author
        });
      } catch (error) {
        console.error('Erro ao buscar frase:', error);
        // Manter frase padrão em caso de erro
      }
    };

    fetchQuote();
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
      <BackgroundEffects>
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        <GradientOrb />
      </BackgroundEffects>

      <MainContent>
        <WelcomeSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TimeDisplay
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Clock size={24} />
            <TimeText>{formatTime(currentTime)}</TimeText>
          </TimeDisplay>
          
          <DateText>{formatDate(currentTime)}</DateText>
          
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
             Kemely Corretora
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Transformando sonhos em realidade
          </Subtitle>
        </WelcomeSection>

        <CorretoraCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <CorretoraImage>
            <img 
              src="/kemelu.jpg" 
              alt="Kemely" 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.2))',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: 'white'
            }}>
              
            </div>
          </CorretoraImage>
          <CorretoraName>Kemely</CorretoraName>
          <CorretoraTitle>Corretora de imóveis</CorretoraTitle>
        </CorretoraCard>

        <QuoteSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <QuoteIcon>
            <Quote size={40} />
          </QuoteIcon>
          <QuoteText>"{quote.text}"</QuoteText>
          <QuoteAuthor>— {quote.author}</QuoteAuthor>
        </QuoteSection>


        <EnterButton
          onClick={onEnterApp}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            boxShadow: [
              "0 8px 32px rgba(0, 0, 0, 0.6)",
              "0 12px 40px rgba(59, 130, 246, 0.3)",
              "0 8px 32px rgba(0, 0, 0, 0.6)"
            ]
          }}
          transition={{ 
            delay: 1.2, 
            duration: 0.8,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          whileHover={{ 
            scale: 1.08, 
            y: -8,
            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={24} />
          Entrar na Planilha
          <ArrowRight size={24} />
        </EnterButton>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePage;
