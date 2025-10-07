import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  PieChart,
  Zap,
  Minus,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchData } from '../lib/database-setup';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardContainer = styled.div`
  padding: 32px 0;
  animation: fadeInUp 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 20px 0;
  }
  
  @media (max-width: 480px) {
    padding: 15px 0;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const MainCard = styled(motion.div)`
  background: #2a2a2a;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(59, 130, 246, 0.1);
  border: 1px solid #404040;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 20px 20px 0 0;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
`;

const MainValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const SubValue = styled.div`
  font-size: 1rem;
  color: #a0a0a0;
  margin-bottom: 16px;
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

const RecentTransactions = styled.div`
  margin-top: 24px;
`;

const TransactionItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #3b82f6;
  background: #2a2a2a;
  margin: 8px 0;
  border-radius: 8px;
  padding: 16px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-left: 3px solid #3b82f6;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TransactionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.isIncome ? 
    'rgba(16, 185, 129, 0.1)' : 
    'rgba(239, 68, 68, 0.1)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isIncome ? 
    '#10b981' : 
    '#ef4444'
  };
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionDescription = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

const TransactionAmount = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${props => props.isIncome ? '#10b981' : '#ef4444'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
  font-style: italic;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyBalance: 0,
    weeklyIncome: 0,
    weeklyExpense: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const startOfCurrentMonth = startOfMonth(now);
      const endOfCurrentMonth = endOfMonth(now);
      const startOfWeek = subDays(now, 7);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfCurrentMonth.toISOString().split('T')[0])
        .lte('date', endOfCurrentMonth.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      // Dados mensais
      const monthlyIncome = data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpense = data
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Dados semanais
      const weeklyData = data.filter(t => 
        new Date(t.date) >= startOfWeek
      );

      const weeklyIncome = weeklyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const weeklyExpense = weeklyData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Transações recentes
      const recentTransactions = data.slice(0, 5);

      setDashboardData({
        monthlyIncome,
        monthlyExpense,
        monthlyBalance: monthlyIncome - monthlyExpense,
        weeklyIncome,
        weeklyExpense,
        recentTransactions
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <div style={{ marginTop: '16px', color: '#64748b' }}>Carregando dashboard...</div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardGrid>
        {/* Resumo Mensal */}
        <MainCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
            <CardIcon variant="balance">
              <FileSpreadsheet size={24} />
            </CardIcon>
          </CardHeader>
          
          <MainValue>R$ {dashboardData.monthlyBalance.toFixed(2)}</MainValue>
          <SubValue>
            {dashboardData.monthlyBalance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
          </SubValue>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Receitas</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                R$ {dashboardData.monthlyIncome.toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Despesas</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>
                R$ {dashboardData.monthlyExpense.toFixed(2)}
              </div>
            </div>
          </div>
        </MainCard>

        {/* Resumo Semanal */}
        <MainCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle>Última Semana</CardTitle>
            <CardIcon variant="income">
              <BarChart3 size={24} />
            </CardIcon>
          </CardHeader>
          
          <MainValue>R$ {(dashboardData.weeklyIncome - dashboardData.weeklyExpense).toFixed(2)}</MainValue>
          <SubValue>Saldo da semana</SubValue>
          
          <TrendIndicator $positive={dashboardData.weeklyIncome > dashboardData.weeklyExpense}>
            {dashboardData.weeklyIncome > dashboardData.weeklyExpense ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {dashboardData.weeklyIncome > dashboardData.weeklyExpense ? 'Crescimento' : 'Redução'}
          </TrendIndicator>
        </MainCard>

        {/* Transações Recentes */}
        <MainCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardIcon variant="expense">
              <Calculator size={24} />
            </CardIcon>
          </CardHeader>
          
          <RecentTransactions>
            {dashboardData.recentTransactions.length === 0 ? (
              <EmptyState>Nenhuma transação encontrada</EmptyState>
            ) : (
              dashboardData.recentTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TransactionInfo>
                    <TransactionIcon isIncome={transaction.type === 'income'}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </TransactionIcon>
                    <TransactionDetails>
                      <TransactionDescription>
                        {transaction.description}
                      </TransactionDescription>
                      <TransactionDate>
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </TransactionDate>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount isIncome={transaction.type === 'income'}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                  </TransactionAmount>
                </TransactionItem>
              ))
            )}
          </RecentTransactions>
        </MainCard>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
