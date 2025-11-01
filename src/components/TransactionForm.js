import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { Button, Input, Select, Label, Flex } from '../styles/GlobalStyles';

// Animações
const shimmer = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const rotate = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const fadeInUp = `
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

const FormCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.8) 0%, 
      rgba(255, 255, 255, 0.4) 50%, 
      rgba(255, 255, 255, 0.8) 100%);
    border-radius: 24px 24px 0 0;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 28px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out 0.8s both;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  animation: fadeInUp 0.4s ease-out;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  animation: fadeInUp 0.4s ease-out;
`;

const TransactionForm = ({ onTransactionAdded }) => {
  // Função para obter a data local no formato YYYY-MM-DD
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: getLocalDateString()
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Casa', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
    debtor: ['Empréstimo Pessoal', 'Empréstimo Comercial', 'Pagamento Pendente', 'Cobrança', 'Outros']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          ...formData,
          amount: parseFloat(formData.amount),
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setMessage('Transação adicionada com sucesso!');
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: getLocalDateString()
      });
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      setMessage('Erro ao adicionar transação: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <h3 style={{ 
        color: '#ffffff', 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '24px',
        textAlign: 'center',
        position: 'relative',
        animation: 'fadeInUp 0.8s ease-out 0.4s both',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}>
        💳 Nova Transação
      </h3>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Descrição</Label>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Compra no supermercado"
            required
          />
        </div>

        <div>
          <Label>Valor (R$)</Label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <Label>Tipo</Label>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
            <option value="debtor">Devedor</option>
          </Select>
        </div>

        <div>
          <Label>Categoria</Label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories[formData.type] && categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Data</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar Transação'}
          </Button>
        </ButtonGroup>

        {message && (
          message.includes('sucesso') ? 
            <SuccessMessage>{message}</SuccessMessage> : 
            <ErrorMessage>{message}</ErrorMessage>
        )}
      </Form>
    </FormCard>
  );
};

export default TransactionForm;
