import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Check, Clock, Prayer, Bible, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateData } from '../lib/database-setup';

const ModalContainer = styled(motion.div)`
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

const ModalContent = styled.div`
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  animation: fadeInUp 0.8s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const Select = styled.select`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  option {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.variant === 'primary' 
    ? '#1a1a1a' 
    : '#ffffff'};
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'rgba(255, 215, 0, 0.3)' 
    : 'rgba(255, 255, 255, 0.2)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditDevotionalModal = ({ isOpen, onClose, onPlanUpdated, editingItem }) => {
  const [formData, setFormData] = useState({
    time: '',
    fast_type: '',
    duration: '',
    purpose: '',
    theme: '',
    book_chapter: '',
    verses: '',
    activity: '',
    status: 'pending',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        time: editingItem.time || '',
        fast_type: editingItem.fast_type || '',
        duration: editingItem.duration || '',
        purpose: editingItem.purpose || '',
        theme: editingItem.theme || '',
        book_chapter: editingItem.book_chapter || '',
        verses: editingItem.verses || '',
        activity: editingItem.activity || '',
        status: editingItem.status || 'pending',
        notes: editingItem.notes || ''
      });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');

      const dataToUpdate = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null
      };

      const tableMap = {
        fasting: 'devotional_fasting',
        prayer: 'devotional_prayer',
        bible: 'devotional_bible_study',
        worship: 'devotional_worship'
      };

      await updateData(tableMap[editingItem.type], editingItem.id, dataToUpdate);
      setMessage('Planejamento devocional atualizado com sucesso!');
      
      setTimeout(() => {
        onPlanUpdated();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      setMessage('Erro ao atualizar planejamento devocional');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !editingItem) return null;

  return (
    <ModalContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <ModalHeader>
          <ModalTitle>Editar Planejamento Devocional</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {editingItem.type === 'fasting' && (
            <>
              <FormGroup>
                <Label>Tipo de Jejum</Label>
                <Select
                  name="fast_type"
                  value={formData.fast_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="completo">Jejum Completo</option>
                  <option value="parcial">Jejum Parcial</option>
                  <option value="daniel">Jejum de Daniel</option>
                  <option value="liquido">Jejum Líquido</option>
                  <option value="tecnologico">Jejum Tecnológico</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Duração (horas)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 12, 24, 48"
                  min="1"
                  max="168"
                />
              </FormGroup>
              <FormGroup>
                <Label>Propósito do Jejum</Label>
                <TextArea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Descreva o propósito espiritual do jejum..."
                />
              </FormGroup>
            </>
          )}

          {editingItem.type === 'prayer' && (
            <>
              <FormGroup>
                <Label>Horário</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Tema da Oração</Label>
                <Input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="Ex: Gratidão, Intercessão, Adoração..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 15, 30, 60"
                  min="1"
                  max="480"
                />
              </FormGroup>
            </>
          )}

          {editingItem.type === 'bible' && (
            <>
              <FormGroup>
                <Label>Tema do Estudo</Label>
                <Input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="Ex: Fé, Esperança, Amor, Perdão..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Livro e Capítulo</Label>
                <Input
                  type="text"
                  name="book_chapter"
                  value={formData.book_chapter}
                  onChange={handleChange}
                  placeholder="Ex: João 3, Salmos 23, Romanos 8"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Versículos</Label>
                <Input
                  type="text"
                  name="verses"
                  value={formData.verses}
                  onChange={handleChange}
                  placeholder="Ex: 1-17, 16-21, 1-10"
                />
              </FormGroup>
            </>
          )}

          {editingItem.type === 'worship' && (
            <>
              <FormGroup>
                <Label>Horário</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Atividade de Adoração</Label>
                <Select
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="musica">Música e Cânticos</option>
                  <option value="meditacao">Meditação</option>
                  <option value="gratidao">Momento de Gratidão</option>
                  <option value="testemunho">Testemunho</option>
                  <option value="leitura">Leitura Devocional</option>
                  <option value="silencioso">Adoração Silenciosa</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 20, 30, 45"
                  min="1"
                  max="180"
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Status</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <TextArea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Adicione observações importantes..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Atualizando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Atualizar
                </>
              )}
            </Button>
          </ButtonGroup>

          {message && (
            <div style={{
              color: message.includes('sucesso') ? '#10b981' : '#ef4444',
              fontSize: '14px',
              marginTop: '16px',
              padding: '12px 16px',
              background: message.includes('sucesso') 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.includes('sucesso') 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '12px',
              animation: 'fadeInUp 0.4s ease-out'
            }}>
              {message}
            </div>
          )}
        </Form>
      </ModalContent>
    </ModalContainer>
  );
};

export default EditDevotionalModal;
