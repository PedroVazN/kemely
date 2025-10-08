import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  X,
  Trash2
} from 'lucide-react';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  animation: fadeInUp 0.8s ease-out;
  
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
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  margin-bottom: 32px;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Message = styled.p`
  font-size: 1.125rem;
  color: #e0e0e0;
  text-align: center;
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-weight: 400;
`;

const ItemName = styled.span`
  font-weight: 700;
  color: #ffffff;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const Warning = styled.p`
  font-size: 0.875rem;
  color: #cccccc;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const Button = styled(motion.button)`
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  ${props => props.variant === 'danger' ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #ffffff;
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
  `}
`;

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemName, 
  itemType = 'item',
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>
            <AlertTriangle size={20} />
            {title}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Content>
          <IconContainer>
            <Trash2 size={32} color="#dc2626" />
          </IconContainer>
          
          <Message>
            Tem certeza que deseja excluir <ItemName>{itemName}</ItemName>?
          </Message>
          
          <Warning>
            Esta ação não pode ser desfeita. O {itemType} será removido permanentemente.
          </Warning>
        </Content>

        <ButtonGroup>
          <Button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <Trash2 size={16} />
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;
