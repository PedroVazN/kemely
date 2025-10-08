import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
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
  max-width: 500px;
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
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
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
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  option {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #f59e0b;
`;

const CheckboxLabel = styled.label`
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
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
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'rgba(245, 158, 11, 0.3)' 
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

const EditFitnessModal = ({ isOpen, onClose, onFitnessUpdated, editingItem }) => {
  const [formData, setFormData] = useState({
    exercise: '',
    duration: '',
    completed: true,
    meal_type: '',
    calories: '',
    healthy: true,
    amount: '',
    time: '',
    bedtime: '',
    wake_time: '',
    hours: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        exercise: editingItem.exercise || '',
        duration: editingItem.duration || '',
        completed: editingItem.completed !== undefined ? editingItem.completed : true,
        meal_type: editingItem.meal_type || '',
        calories: editingItem.calories || '',
        healthy: editingItem.healthy !== undefined ? editingItem.healthy : true,
        amount: editingItem.amount || '',
        time: editingItem.time || '',
        bedtime: editingItem.bedtime || '',
        wake_time: editingItem.wake_time || '',
        hours: editingItem.hours || '',
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
        duration: formData.duration ? parseInt(formData.duration) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
        amount: formData.amount ? parseInt(formData.amount) : null,
        hours: formData.hours ? parseFloat(formData.hours) : null
      };

      const tableMap = {
        workout: 'fitness_workouts',
        meal: 'fitness_meals',
        water: 'fitness_water',
        sleep: 'fitness_sleep'
      };

      await updateData(tableMap[editingItem.type], editingItem.id, dataToUpdate);
      setMessage('Registro atualizado com sucesso!');
      
      setTimeout(() => {
        onFitnessUpdated();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      setMessage('Erro ao atualizar registro');
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
          <ModalTitle>Editar Registro</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {editingItem.type === 'workout' && (
            <>
              <FormGroup>
                <Label>Exercício</Label>
                <Input
                  type="text"
                  name="exercise"
                  value={formData.exercise}
                  onChange={handleChange}
                  placeholder="Ex: Musculação, Corrida, Yoga..."
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
                  placeholder="60"
                  min="1"
                  required
                />
              </FormGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                />
                <CheckboxLabel>Treino concluído</CheckboxLabel>
              </CheckboxGroup>
            </>
          )}

          {editingItem.type === 'meal' && (
            <>
              <FormGroup>
                <Label>Tipo de Refeição</Label>
                <Select
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Café da manhã">Café da manhã</option>
                  <option value="Lanche da manhã">Lanche da manhã</option>
                  <option value="Almoço">Almoço</option>
                  <option value="Lanche da tarde">Lanche da tarde</option>
                  <option value="Jantar">Jantar</option>
                  <option value="Ceia">Ceia</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Calorias</Label>
                <Input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="500"
                  min="1"
                  required
                />
              </FormGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="healthy"
                  checked={formData.healthy}
                  onChange={handleChange}
                />
                <CheckboxLabel>Refeição saudável</CheckboxLabel>
              </CheckboxGroup>
            </>
          )}

          {editingItem.type === 'water' && (
            <>
              <FormGroup>
                <Label>Quantidade (ml)</Label>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="250"
                  min="1"
                  required
                />
              </FormGroup>
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
            </>
          )}

          {editingItem.type === 'sleep' && (
            <>
              <FormGroup>
                <Label>Horário de Dormir</Label>
                <Input
                  type="time"
                  name="bedtime"
                  value={formData.bedtime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Horário de Acordar</Label>
                <Input
                  type="time"
                  name="wake_time"
                  value={formData.wake_time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Duração (horas)</Label>
                <Input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="8.5"
                  min="0"
                  step="0.5"
                  required
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Observações (opcional)</Label>
            <Input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Adicione observações..."
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
                  <CheckCircle size={16} />
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

export default EditFitnessModal;
