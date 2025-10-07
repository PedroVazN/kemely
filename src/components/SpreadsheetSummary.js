import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet,
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Download,
  Eye,
  Calculator,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SpreadsheetContainer = styled.div`
  background: #2a2a2a;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  border: 2px solid #ffffff;
  margin-bottom: 32px;
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
    background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const SpreadsheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ffffff;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SpreadsheetIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
`;

const HeaderTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const HeaderSubtitle = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  margin: 4px 0 0 0;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)' : 
    'rgba(26, 26, 26, 0.8)'
  };
  color: ${props => props.variant === 'primary' ? 
    '#1a1a1a' : 
    '#ffffff'
  };
  border: 2px solid ${props => props.variant === 'primary' ? 
    'transparent' : 
    '#ffffff'
  };
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
    background: ${props => props.variant === 'primary' ? 
      'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)' : 
      'rgba(255, 255, 255, 0.2)'
    };
    border-color: #f3f4f6;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SummaryCard = styled(motion.div)`
  background: #1a1a1a;
  border: 2px solid #ffffff;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);

  &:hover {
    border-color: #f3f4f6;
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.variant === 'income' ? 
    'rgba(16, 185, 129, 0.1)' : 
    props.variant === 'expense' ? 
    'rgba(239, 68, 68, 0.1)' : 
    'rgba(59, 130, 246, 0.1)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.variant === 'income' ? 
    '#10b981' : 
    props.variant === 'expense' ? 
    '#ef4444' : 
    '#ffffff'
  };
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CardSubtitle = styled.div`
  font-size: 0.875rem;
  color: #a0a0a0;
  margin-bottom: 12px;
`;

const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$positive ? '#10b981' : props.$negative ? '#ef4444' : '#64748b'};
  font-weight: 600;
`;

const TransactionsTable = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  color: #1a1a1a;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #3b82f6;
  align-items: center;
  transition: all 0.3s ease;
  background: #1a1a1a;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left: 3px solid #ffffff;
  }

  &:nth-child(even) {
    background: #2a2a2a;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: ${props => props.bold ? '700' : '500'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
  font-style: italic;
`;

const SpreadsheetSummary = () => {
  const [summaryData, setSummaryData] = useState({
    monthly: {
      income: 0,
      expense: 0,
      balance: 0,
      transactionCount: 0
    },
    weekly: {
      income: 0,
      expense: 0,
      balance: 0,
      transactionCount: 0
    },
    daily: {
      income: 0,
      expense: 0,
      balance: 0,
      transactionCount: 0
    },
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const now = new Date();
      const startOfCurrentMonth = startOfMonth(now);
      const endOfCurrentMonth = endOfMonth(now);
      const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Dados mensais
      const monthlyData = data.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfCurrentMonth && transactionDate <= endOfCurrentMonth;
      });

      const monthlyIncome = monthlyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpense = monthlyData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Dados semanais
      const weeklyData = data.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfCurrentWeek && transactionDate <= endOfCurrentWeek;
      });

      const weeklyIncome = weeklyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const weeklyExpense = weeklyData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Dados diários
      const dailyData = data.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= today;
      });

      const dailyIncome = dailyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const dailyExpense = dailyData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      setSummaryData({
        monthly: {
          income: monthlyIncome,
          expense: monthlyExpense,
          balance: monthlyIncome - monthlyExpense,
          transactionCount: monthlyData.length
        },
        weekly: {
          income: weeklyIncome,
          expense: weeklyExpense,
          balance: weeklyIncome - weeklyExpense,
          transactionCount: weeklyData.length
        },
        daily: {
          income: dailyIncome,
          expense: dailyExpense,
          balance: dailyIncome - dailyExpense,
          transactionCount: dailyData.length
        },
        recentTransactions: data.slice(0, 10)
      });
    } catch (error) {
      console.error('Erro ao buscar dados do resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpreadsheetContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <div style={{ marginTop: '16px', color: '#64748b' }}>Carregando resumo da planilha...</div>
        </div>
      </SpreadsheetContainer>
    );
  }

  return (
    <SpreadsheetContainer>
      <SpreadsheetHeader>
        <HeaderLeft>
          <SpreadsheetIcon>
            <FileSpreadsheet size={28} />
          </SpreadsheetIcon>
          <div>
            <HeaderTitle>📊 Resumo Financeiro Completo</HeaderTitle>
            <HeaderSubtitle>Análise detalhada de receitas e despesas</HeaderSubtitle>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton variant="primary">
            <Download size={16} />
            Exportar
          </ActionButton>
          <ActionButton>
            <Eye size={16} />
            Visualizar
          </ActionButton>
        </HeaderRight>
      </SpreadsheetHeader>

      <SummaryGrid>
        {/* Resumo Mensal */}
        <SummaryCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle>
              <Calendar size={20} />
              Resumo Mensal
            </CardTitle>
            <CardIcon variant="balance">
              <BarChart3 size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>R$ {summaryData.monthly.balance.toFixed(2)}</CardValue>
          <CardSubtitle>Saldo do mês atual</CardSubtitle>
          <CardDetails>
            <DetailItem $positive>
              <Plus size={14} />
              R$ {summaryData.monthly.income.toFixed(2)}
            </DetailItem>
            <DetailItem $negative>
              <Minus size={14} />
              R$ {summaryData.monthly.expense.toFixed(2)}
            </DetailItem>
            <DetailItem>
              {summaryData.monthly.transactionCount} transações
            </DetailItem>
          </CardDetails>
        </SummaryCard>

        {/* Resumo Semanal */}
        <SummaryCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle>
              <Target size={20} />
              Resumo Semanal
            </CardTitle>
            <CardIcon variant="income">
              <TrendingUp size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>R$ {summaryData.weekly.balance.toFixed(2)}</CardValue>
          <CardSubtitle>Saldo da semana atual</CardSubtitle>
          <CardDetails>
            <DetailItem $positive>
              <ArrowUpRight size={14} />
              R$ {summaryData.weekly.income.toFixed(2)}
            </DetailItem>
            <DetailItem $negative>
              <ArrowDownRight size={14} />
              R$ {summaryData.weekly.expense.toFixed(2)}
            </DetailItem>
            <DetailItem>
              {summaryData.weekly.transactionCount} transações
            </DetailItem>
          </CardDetails>
        </SummaryCard>

        {/* Resumo Diário */}
        <SummaryCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardTitle>
              <Zap size={20} />
              Resumo Diário
            </CardTitle>
            <CardIcon variant="expense">
              <Calculator size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>R$ {summaryData.daily.balance.toFixed(2)}</CardValue>
          <CardSubtitle>Saldo de hoje</CardSubtitle>
          <CardDetails>
            <DetailItem $positive>
              <Plus size={14} />
              R$ {summaryData.daily.income.toFixed(2)}
            </DetailItem>
            <DetailItem $negative>
              <Minus size={14} />
              R$ {summaryData.daily.expense.toFixed(2)}
            </DetailItem>
            <DetailItem>
              {summaryData.daily.transactionCount} transações
            </DetailItem>
          </CardDetails>
        </SummaryCard>
      </SummaryGrid>

      {/* Tabela de Transações Recentes */}
      <TransactionsTable>
        <TableHeader>
          <div>Data</div>
          <div>Descrição</div>
          <div>Tipo</div>
          <div>Valor</div>
        </TableHeader>
        {summaryData.recentTransactions.length === 0 ? (
          <EmptyState>Nenhuma transação encontrada</EmptyState>
        ) : (
          summaryData.recentTransactions.map((transaction, index) => (
            <TableRow
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TableCell>
                {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell bold>
                {transaction.description}
              </TableCell>
              <TableCell>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                }}>
                  {transaction.type === 'income' ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </div>
              </TableCell>
              <TableCell bold style={{ 
                color: transaction.type === 'income' ? '#10b981' : '#ef4444'
              }}>
                {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TransactionsTable>
    </SpreadsheetContainer>
  );
};

export default SpreadsheetSummary;
