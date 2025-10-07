import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, DollarSign, User, Package, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { insertData } from '../lib/database-setup';

const FormContainer = styled(motion.div)`
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

const FormContent = styled.div`
  background: #2a2a2a;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 2px solid #ffffff;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
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
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  background: #1a1a1a;
  border: 1px solid #ffffff;
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    color: #1a1a1a;
    transform: scale(1.05);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 2px solid #404040;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: #666;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 2px solid #404040;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 2px solid #404040;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
    color: #1a1a1a;
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);

    &:hover {
      background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(255, 255, 255, 0.4);
    }
  ` : `
    background: transparent;
    color: #a0a0a0;
    border: 1px solid #404040;

    &:hover {
      background: #404040;
      color: #ffffff;
    }
  `}
`;

const CommissionForm = ({ isOpen, onClose, onCommissionAdded }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    produto: '',
    valor: '',
    comissao: '',
    data_venda: '',
    status: 'pendente',
    observacoes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValorChange = (e) => {
    const valor = e.target.value;
    setFormData(prev => ({
      ...prev,
      valor: valor,
      comissao: valor ? (parseFloat(valor) * 0.05).toFixed(2) : '' // 5% de comissão
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToInsert = {
        ...formData,
        valor: parseFloat(formData.valor),
        comissao: parseFloat(formData.comissao)
      };
      
      await insertData('comissoes', dataToInsert);
      
      toast.success('Comissão criada com sucesso!');
      onCommissionAdded();
      onClose();
      
      // Reset form
      setFormData({
        cliente: '',
        produto: '',
        valor: '',
        comissao: '',
        data_venda: '',
        status: 'pendente',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao criar comissão:', error);
      toast.error('Erro ao criar comissão');
    }
  };

  if (!isOpen) return null;

  return (
    <FormContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <FormContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FormHeader>
          <FormTitle>
            <DollarSign size={24} />
            Nova Comissão
          </FormTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <User size={16} style={{ marginRight: '8px' }} />
              Cliente
            </Label>
            <Input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              placeholder="Nome do cliente"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Package size={16} style={{ marginRight: '8px' }} />
              Produto
            </Label>
            <Input
              type="text"
              name="produto"
              value={formData.produto}
              onChange={handleChange}
              placeholder="Nome do produto vendido"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <DollarSign size={16} style={{ marginRight: '8px' }} />
              Valor da Venda (R$)
            </Label>
            <Input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleValorChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <DollarSign size={16} style={{ marginRight: '8px' }} />
              Comissão (R$)
            </Label>
            <Input
              type="number"
              name="comissao"
              value={formData.comissao}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Calendar size={16} style={{ marginRight: '8px' }} />
              Data da Venda
            </Label>
            <Input
              type="date"
              name="data_venda"
              value={formData.data_venda}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <TextArea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações sobre a venda..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Criar Comissão
            </Button>
          </ButtonGroup>
        </form>
      </FormContent>
    </FormContainer>
  );
};

export default CommissionForm;
