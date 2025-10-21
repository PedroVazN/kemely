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
  Users,
  Activity,
  Target,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  PieChart,
  Zap,
  Minus,
  Plus,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchData } from '../lib/database-setup';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';

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

const float = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const pulse = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
`;

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
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
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 28px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 16px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
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
  background: ${props => {
    switch(props.variant) {
      case 'income': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'expense': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'debtor': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'balance': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default: return 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch(props.variant) {
      case 'income':
      case 'expense':
      case 'debtor':
      case 'balance': return '#ffffff';
      default: return '#1a1a1a';
    }
  }};
  box-shadow: 0 4px 14px 0 rgba(255, 255, 255, 0.3);
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
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(42, 42, 42, 0.3);
  margin: 12px 0;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent);
    transition: width 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    
    &::before {
      width: 100%;
    }
  }

  &:last-child {
    border-bottom: none;
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
  background: ${props => props.$isIncome ? 
    'rgba(16, 185, 129, 0.1)' : 
    'rgba(239, 68, 68, 0.1)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isIncome ? 
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
  color: ${props => props.$isIncome ? '#10b981' : '#ef4444'};
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
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 0 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);

  &:hover {
    background: linear-gradient(135deg, #357ABD 0%, #2E6BA8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyDebtor: 0,
    monthlyBalance: 0,
    weeklyIncome: 0,
    weeklyExpense: 0,
    weeklyDebtor: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
        .filter(t => t.type === 'expense' && !t.paid)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyDebtor = data
        .filter(t => t.type === 'debtor')
        .reduce((sum, t) => sum + t.amount, 0);

      // Dados semanais
      const weeklyData = data.filter(t => 
        new Date(t.date) >= startOfWeek
      );

      const weeklyIncome = weeklyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const weeklyExpense = weeklyData
        .filter(t => t.type === 'expense' && !t.paid)
        .reduce((sum, t) => sum + t.amount, 0);

      const weeklyDebtor = weeklyData
        .filter(t => t.type === 'debtor')
        .reduce((sum, t) => sum + t.amount, 0);

      // Transações recentes
      const recentTransactions = data.slice(0, 5);

      setDashboardData({
        monthlyIncome,
        monthlyExpense,
        monthlyDebtor,
        monthlyBalance: monthlyIncome - monthlyExpense,
        weeklyIncome,
        weeklyExpense,
        weeklyDebtor,
        recentTransactions
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
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
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <RefreshButton 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw 
            size={16} 
            style={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none' 
            }} 
          />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </RefreshButton>
      </DashboardHeader>
      
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
          
          <MainValue>{formatCurrency(dashboardData.monthlyBalance)}</MainValue>
          <SubValue>
            {dashboardData.monthlyBalance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
          </SubValue>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Receitas</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                {formatCurrency(dashboardData.monthlyIncome)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Despesas</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>
                {formatCurrency(dashboardData.monthlyExpense)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Pessoas Devendo</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' }}>
                {formatCurrency(dashboardData.monthlyDebtor)}
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
          
          <MainValue>{formatCurrency(dashboardData.weeklyIncome - dashboardData.weeklyExpense)}</MainValue>
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

        {/* Pessoas Devendo */}
        <MainCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <CardHeader>
            <CardTitle>Pessoas Devendo</CardTitle>
            <CardIcon variant="debtor">
              <Users size={24} />
            </CardIcon>
          </CardHeader>
          
          <MainValue style={{ color: '#f59e0b' }}>{formatCurrency(dashboardData.monthlyDebtor)}</MainValue>
          <SubValue>Valor total em débito</SubValue>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Esta Semana</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b' }}>
                {formatCurrency(dashboardData.weeklyDebtor)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b' }}>
                {dashboardData.monthlyDebtor > 0 ? 'Pendente' : 'Quitado'}
              </div>
            </div>
          </div>
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
                    <TransactionIcon $isIncome={transaction.type === 'income'}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} />
                      ) : transaction.type === 'debtor' ? (
                        <Users size={20} />
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
                  <TransactionAmount $isIncome={transaction.type === 'income'}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'debtor' ? '👥' : '-'}{formatCurrency(transaction.amount).replace('R$', '').trim()}
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
