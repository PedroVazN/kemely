import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
`;

const SummaryCard = styled.div`
  background: #2a2a2a;
  color: #ffffff;
  padding: 32px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  border: 2px solid #ffffff;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)'};
    border-radius: 20px 20px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.gradient || 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(29, 78, 216, 0.02) 100%)'};
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(59, 130, 246, 0.5);
    border-color: #60a5fa;
  }
`;

const SummaryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  color: #ffffff;
  animation: pulse 2s infinite;
`;

const SummaryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const SummaryValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #ffffff;
  animation: scaleIn 0.6s ease-out;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const SummarySubtitle = styled.div`
  font-size: 0.875rem;
  color: #a0a0a0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartContainer = styled.div`
  background: rgba(26, 26, 26, 0.8);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

const FinancialSummary = ({ onDataChange }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [onDataChange]);

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      if (error) throw error;

      const income = data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = data
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      setSummary({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        transactionCount: data.length
      });
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando resumo financeiro...</div>;
  }

  return (
    <div>
      <SummaryGrid>
        <SummaryCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
          <SummaryIcon>
            <TrendingUp size={48} />
          </SummaryIcon>
          <SummaryTitle>Total de Receitas</SummaryTitle>
          <SummaryValue>R$ {summary.totalIncome.toFixed(2)}</SummaryValue>
          <SummarySubtitle>Entradas</SummarySubtitle>
        </SummaryCard>

        <SummaryCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
          <SummaryIcon>
            <TrendingDown size={48} />
          </SummaryIcon>
          <SummaryTitle>Total de Despesas</SummaryTitle>
          <SummaryValue>R$ {summary.totalExpense.toFixed(2)}</SummaryValue>
          <SummarySubtitle>Saídas</SummarySubtitle>
        </SummaryCard>

        <SummaryCard gradient={summary.balance >= 0 ? 
          "linear-gradient(135deg, #10b981 0%, #059669 100%)" : 
          "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        }>
          <SummaryIcon>
            <Wallet size={48} />
          </SummaryIcon>
          <SummaryTitle>Saldo Atual</SummaryTitle>
          <SummaryValue>R$ {summary.balance.toFixed(2)}</SummaryValue>
          <SummarySubtitle>
            {summary.balance >= 0 ? 'Positivo' : 'Negativo'}
          </SummarySubtitle>
        </SummaryCard>

        <SummaryCard gradient="linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)">
          <SummaryIcon>
            <DollarSign size={48} />
          </SummaryIcon>
          <SummaryTitle>Total de Transações</SummaryTitle>
          <SummaryValue>{summary.transactionCount}</SummaryValue>
          <SummarySubtitle>Registros</SummarySubtitle>
        </SummaryCard>
      </SummaryGrid>
    </div>
  );
};

export default FinancialSummary;
