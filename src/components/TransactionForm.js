import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { Button, Input, Select, Card, Label, Flex } from '../styles/GlobalStyles';

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
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Casa', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros']
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
        date: new Date().toISOString().split('T')[0]
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
    <Card>
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
            {categories[formData.type].map(cat => (
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
    </Card>
  );
};

export default TransactionForm;
