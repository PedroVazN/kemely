import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
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
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
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
    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'rgba(139, 92, 246, 0.3)' 
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

const EditWeeklyPlanModal = ({ isOpen, onClose, onPlanUpdated, editingItem }) => {
  const [formData, setFormData] = useState({
    activity: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    property_address: '',
    status: 'scheduled',
    priority: 'medium',
    notes: '',
    estimated_duration: '',
    goal_name: '',
    target_value: '',
    progress: 0,
    task_name: '',
    category: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        activity: editingItem.activity || '',
        client_name: editingItem.client_name || '',
        client_phone: editingItem.client_phone || '',
        client_email: editingItem.client_email || '',
        property_address: editingItem.property_address || '',
        status: editingItem.status || 'scheduled',
        priority: editingItem.priority || 'medium',
        notes: editingItem.notes || '',
        estimated_duration: editingItem.estimated_duration || '',
        goal_name: editingItem.goal_name || '',
        target_value: editingItem.target_value || '',
        progress: editingItem.progress || 0,
        task_name: editingItem.task_name || '',
        category: editingItem.category || '',
        deadline: editingItem.deadline || ''
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
        target_value: formData.target_value ? parseFloat(formData.target_value) : null,
        progress: formData.progress ? parseInt(formData.progress) : 0,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null
      };

      const tableMap = {
        plan: 'weekly_plans',
        goal: 'weekly_goals',
        task: 'weekly_tasks'
      };

      await updateData(tableMap[editingItem.type], editingItem.id, dataToUpdate);
      setMessage('Planejamento atualizado com sucesso!');
      
      setTimeout(() => {
        onPlanUpdated();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      setMessage('Erro ao atualizar planejamento');
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
          <ModalTitle>Editar Planejamento</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {editingItem.type === 'plan' && (
            <>
              <FormGroup>
                <Label>Atividade</Label>
                <Input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  placeholder="Ex: Apresentação de proposta, Visita técnica..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Nome do Cliente</Label>
                <Input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Nome completo do cliente"
                />
              </FormGroup>
              <FormGroup>
                <Label>Telefone</Label>
                <Input
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </FormGroup>
              <FormGroup>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  placeholder="cliente@email.com"
                />
              </FormGroup>
              <FormGroup>
                <Label>Endereço do Imóvel</Label>
                <Input
                  type="text"
                  name="property_address"
                  value={formData.property_address}
                  onChange={handleChange}
                  placeholder="Endereço completo do imóvel"
                />
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="scheduled">Agendado</option>
                  <option value="completed">Concluído</option>
                  <option value="pending">Pendente</option>
                  <option value="cancelled">Cancelado</option>
                </Select>
              </FormGroup>
            </>
          )}

          {editingItem.type === 'goal' && (
            <>
              <FormGroup>
                <Label>Nome da Meta</Label>
                <Input
                  type="text"
                  name="goal_name"
                  value={formData.goal_name}
                  onChange={handleChange}
                  placeholder="Ex: Vender 3 imóveis esta semana"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Valor Alvo (R$)</Label>
                <Input
                  type="number"
                  name="target_value"
                  value={formData.target_value}
                  onChange={handleChange}
                  placeholder="500000"
                  min="0"
                  step="0.01"
                />
              </FormGroup>
              <FormGroup>
                <Label>Progresso Atual (%)</Label>
                <Input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </FormGroup>
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
                  <option value="completed">Concluída</option>
                </Select>
              </FormGroup>
            </>
          )}

          {editingItem.type === 'task' && (
            <>
              <FormGroup>
                <Label>Nome da Tarefa</Label>
                <Input
                  type="text"
                  name="task_name"
                  value={formData.task_name}
                  onChange={handleChange}
                  placeholder="Ex: Ligar para cliente, Enviar proposta..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Categoria</Label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  <option value="prospecting">Prospecção</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="documentation">Documentação</option>
                  <option value="marketing">Marketing</option>
                  <option value="administrative">Administrativo</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Prioridade</Label>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </Select>
              </FormGroup>
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
                  <option value="completed">Concluída</option>
                </Select>
              </FormGroup>
            </>
          )}

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

export default EditWeeklyPlanModal;
