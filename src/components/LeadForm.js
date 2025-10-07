import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Hash, 
  Thermometer, 
  FileText,
  X,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const FormOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled(motion.div)`
  background: #2a2a2a;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  border: 2px solid #ffffff;
  position: relative;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #ffffff;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #ffffff;
    border-color: #f3f4f6;
    color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    background: white;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    background: white;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    background: white;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid #f1f5f9;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
    }
  ` : `
    background: #f8fafc;
    color: #64748b;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #e2e8f0;
      color: #374151;
    }
  `}
`;

const LeadForm = ({ isOpen, onClose, onLeadAdded }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    pv: '',
    ac: '',
    ab: '',
    status: 'pendente',
    temperatura: 'frio',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.telefone) {
      toast.error('Nome e telefone são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email || null,
          pv: formData.pv || null,
          ac: formData.ac || null,
          ab: formData.ab || null,
          status: formData.status,
          temperatura: formData.temperatura,
          observacoes: formData.observacoes || null
        }])
        .select();

      if (error) throw error;

      toast.success('Lead adicionado com sucesso!');
      onLeadAdded();
      onClose();
      
      // Reset form
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        pv: '',
        ac: '',
        ab: '',
        status: 'pendente',
        temperatura: 'frio',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      toast.error('Erro ao adicionar lead');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <FormContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FormHeader>
          <FormTitle>
            <User size={24} />
            Novo Lead
          </FormTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>
                <User size={16} />
                Nome *
              </Label>
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo do lead"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <Phone size={16} />
                Telefone *
              </Label>
              <Input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>
                <Mail size={16} />
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <Thermometer size={16} />
                Temperatura
              </Label>
              <Select
                name="temperatura"
                value={formData.temperatura}
                onChange={handleChange}
              >
                <option value="frio">❄️ Frio</option>
                <option value="quente">🔥 Quente</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>
                <Hash size={16} />
                PV
              </Label>
              <Input
                type="text"
                name="pv"
                value={formData.pv}
                onChange={handleChange}
                placeholder="PV001"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <Hash size={16} />
                AC
              </Label>
              <Input
                type="text"
                name="ac"
                value={formData.ac}
                onChange={handleChange}
                placeholder="AC001"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>
                <Hash size={16} />
                AB
              </Label>
              <Input
                type="text"
                name="ab"
                value={formData.ab}
                onChange={handleChange}
                placeholder="AB001"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <User size={16} />
                Status
              </Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pendente">⏰ Pendente</option>
                <option value="aprovado">✅ Aprovado</option>
                <option value="rejeitado">❌ Rejeitado</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>
              <FileText size={16} />
              Observações
            </Label>
            <TextArea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações sobre o lead..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={16} />
              {loading ? 'Salvando...' : 'Salvar Lead'}
            </Button>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </FormOverlay>
  );
};

export default LeadForm;
