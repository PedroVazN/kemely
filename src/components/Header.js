import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Menu,
  X,
  BarChart3,
  FileSpreadsheet,
  Calculator,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Dumbbell,
  Cross,
  Users,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/formatters';

// Animações
const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HeaderContainer = styled.header`
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  min-height: 60px;
  
  @media (max-width: 1024px) {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    min-height: 50px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    gap: 8px;
  }

  &:hover {
    transform: translateX(2px);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const QuickStats = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 1200px) {
    gap: 12px;
  }
  
  @media (max-width: 1024px) {
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'income': return 'rgba(16, 185, 129, 0.2)';
      case 'expense': return 'rgba(239, 68, 68, 0.2)';
      case 'debtor': return 'rgba(245, 158, 11, 0.2)';
      case 'balance': return 'rgba(255, 255, 255, 0.15)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: ${props => {
      switch(props.variant) {
        case 'income': return 'rgba(16, 185, 129, 0.4)';
        case 'expense': return 'rgba(239, 68, 68, 0.4)';
        case 'debtor': return 'rgba(245, 158, 11, 0.4)';
        case 'balance': return 'rgba(255, 255, 255, 0.25)';
        default: return 'rgba(255, 255, 255, 0.2)';
      }
    }};
  }
`;

const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => {
    switch(props.variant) {
      case 'income': return '#10b981';
      case 'expense': return '#ef4444';
      case 'debtor': return '#f59e0b';
      case 'balance': return '#ffffff';
      default: return '#ffffff';
    }
  }};
  letter-spacing: 0.3px;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.variant === 'primary' ? 
    '#000000 !important' : 
    '#ffffff'
  } !important;
  border: 1px solid ${props => props.variant === 'primary' ? 
    'transparent' : 
    'rgba(255, 255, 255, 0.15)'
  };
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.variant === 'primary' ? 
    '0 2px 8px rgba(0, 0, 0, 0.2)' : 
    'none'
  };
  white-space: nowrap;
  letter-spacing: 0.3px;
  
  @media (max-width: 1200px) {
    padding: 8px 16px;
    font-size: 0.8rem;
    gap: 4px;
  }
  
  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.75rem;
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.7rem;
    gap: 2px;
    
    .button-text {
      display: none;
    }
  }

  &:hover {
    background: ${props => props.variant === 'primary' ? 
      'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)' : 
      'rgba(255, 255, 255, 0.1)'
    };
    color: ${props => props.variant === 'primary' ? '#000000' : '#ffffff'} !important;
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' ? 
      '0 4px 12px rgba(0, 0, 0, 0.3)' : 
      '0 2px 8px rgba(0, 0, 0, 0.2)'
    };
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.$active ? 
    'rgba(255, 255, 255, 0.1)' : 
    'transparent'
  };
  border: 1px solid ${props => props.$active ? 
    'rgba(255, 255, 255, 0.2)' : 
    'transparent'
  };
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.$active ? '500' : '400'};
  font-size: 0.85rem;
  color: ${props => props.$active ? 
    '#ffffff' : 
    'rgba(255, 255, 255, 0.6)'
  };
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const MobileNavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MobileNavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  color: #3b82f6;
`;

const Header = ({ onAddTransaction, onShowFilters, onExport, onShowCharts, activeTab, onTabChange }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalDebtor: 0,
    balance: 0,
    transactionCount: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      if (error) throw error;

      const income = data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = data
        .filter(t => t.type === 'expense' && !t.paid)
        .reduce((sum, t) => sum + t.amount, 0);

      const debtor = data
        .filter(t => t.type === 'debtor')
        .reduce((sum, t) => sum + t.amount, 0);

      setSummary({
        totalIncome: income,
        totalExpense: expense,
        totalDebtor: debtor,
        balance: income - expense,
        transactionCount: data.length
      });
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchSummary(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileSpreadsheet },
    { id: 'transactions', label: 'Transações', icon: Calculator },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'checklist', label: 'Checklist', icon: Calendar },
    { id: 'metrics', label: 'Métricas', icon: Target },
    { id: 'devotional', label: 'Devocional', icon: Cross },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'commissions', label: 'Comissões', icon: DollarSign }
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* Top Bar */}
        <TopBar>
          <Logo onClick={() => onTabChange('home')}>
            Kemely Alves
          </Logo>

          <QuickStats>
            <StatItem
              variant="income"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight size={16} color="#10b981" />
              <div>
                <StatValue variant="income">{formatCurrency(summary.totalIncome)}</StatValue>
                <StatLabel>Receitas</StatLabel>
              </div>
            </StatItem>

            <StatItem
              variant="expense"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownRight size={16} color="#ef4444" />
              <div>
                <StatValue variant="expense">{formatCurrency(summary.totalExpense)}</StatValue>
                <StatLabel>Despesas</StatLabel>
              </div>
            </StatItem>

            <StatItem
              variant="debtor"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target size={16} color="#f59e0b" />
              <div>
                <StatValue variant="debtor">{formatCurrency(summary.totalDebtor)}</StatValue>
                <StatLabel>Devedores</StatLabel>
              </div>
            </StatItem>

            <StatItem
              variant="balance"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target size={16} color="#3b82f6" />
              <div>
                <StatValue variant="balance">{formatCurrency(summary.balance)}</StatValue>
                <StatLabel>Saldo</StatLabel>
              </div>
            </StatItem>
          </QuickStats>

          <ActionButtons>
            <ActionButton
              variant="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTransaction}
            >
              <Calculator size={16} />
              <span className="button-text">Nova Transação</span>
            </ActionButton>

            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw 
                size={16} 
                style={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none' 
                }} 
              />
              <span className="button-text">
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </span>
            </ActionButton>

            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowFilters}
            >
              <Filter size={16} />
              <span className="button-text">Filtros</span>
            </ActionButton>

            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
            >
              <FileSpreadsheet size={16} />
              <span className="button-text">Exportar</span>
            </ActionButton>


            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </MobileMenuButton>
          </ActionButtons>
        </TopBar>

        {/* Navigation Bar */}
        <NavigationBar>
          <NavItems>
            {navItems.map((item, index) => (
              <NavItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => onTabChange(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon size={18} />
                {item.label}
              </NavItem>
            ))}
          </NavItems>
        </NavigationBar>
      </HeaderContent>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <MobileMenuHeader>
              <Logo onClick={() => {
                onTabChange('home');
                setMobileMenuOpen(false);
              }}>Kemely Alves</Logo>
              <MobileMenuButton onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </MobileMenuButton>
            </MobileMenuHeader>

            <MobileNavItems>
              {navItems.map((item, index) => (
                <MobileNavItem
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon size={20} />
                  {item.label}
                </MobileNavItem>
              ))}
            </MobileNavItems>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
