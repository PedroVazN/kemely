import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Menu,
  X,
  BarChart3,
  Settings,
  FileSpreadsheet,
  Calculator,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const HeaderContainer = styled.header`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #404040;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  min-height: 60px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  &:hover {
    color: #3b82f6;
    text-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
  }
`;

const QuickStats = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.variant === 'income' ? 
    'rgba(16, 185, 129, 0.2)' : 
    props.variant === 'expense' ? 
    'rgba(239, 68, 68, 0.2)' : 
    'rgba(59, 130, 246, 0.2)'
  };
  border: 2px solid ${props => props.variant === 'income' ? 
    'rgba(16, 185, 129, 0.5)' : 
    props.variant === 'expense' ? 
    'rgba(239, 68, 68, 0.5)' : 
    'rgba(59, 130, 246, 0.5)'
  };
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);

  &:hover {
    background: ${props => props.variant === 'income' ? 
      'rgba(16, 185, 129, 0.3)' : 
      props.variant === 'expense' ? 
      'rgba(239, 68, 68, 0.3)' : 
      'rgba(59, 130, 246, 0.3)'
    };
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8);
    border-color: ${props => props.variant === 'income' ? 
      '#10b981' : 
      props.variant === 'expense' ? 
      '#ef4444' : 
      '#3b82f6'
    };
  }
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.variant === 'income' ? 
    '#10b981' : 
    props.variant === 'expense' ? 
    '#ef4444' : 
    '#3b82f6'
  };
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #a0a0a0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
    'transparent'
  };
  color: ${props => props.variant === 'primary' ? 
    '#ffffff !important' : 
    '#3b82f6'
  } !important;
  border: 1px solid ${props => props.variant === 'primary' ? 
    'transparent' : 
    '#3b82f6'
  };
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.variant === 'primary' ? 
    '0 4px 16px rgba(59, 130, 246, 0.3)' : 
    'none'
  };

  &:hover {
    background: ${props => props.variant === 'primary' ? 
      'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : 
      '#3b82f6'
    };
    color: #ffffff !important;
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' ? 
      '0 8px 32px rgba(59, 130, 246, 0.4)' : 
      '0 4px 16px rgba(59, 130, 246, 0.3)'
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
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #404040;
`;

const NavItems = styled.div`
  display: ${props => props.$isCorretoraMode ? 'none' : 'flex'};
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
    'transparent'
  };
  border: 1px solid ${props => props.$active ? 
    'transparent' : 
    'transparent'
  };
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.$active ? 
    '#ffffff' : 
    '#a0a0a0'
  };
  box-shadow: ${props => props.$active ? 
    '0 4px 16px rgba(59, 130, 246, 0.3)' : 
    'none'
  };

  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : 
      'rgba(59, 130, 246, 0.1)'
    };
    color: ${props => props.$active ? 
      '#ffffff' : 
      '#3b82f6'
    };
    transform: translateY(-2px);
    box-shadow: ${props => props.$active ? 
      '0 8px 32px rgba(59, 130, 246, 0.4)' : 
      '0 4px 16px rgba(59, 130, 246, 0.2)'
    };
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

const Header = ({ onAddTransaction, onShowFilters, onExport, onShowCharts, activeTab, onTabChange, onToggleMode, isCorretoraMode }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

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
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileSpreadsheet },
    { id: 'transactions', label: 'Transações', icon: Calculator },
    { id: 'charts', label: 'Gráficos', icon: PieChart },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 }
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* Top Bar */}
        <TopBar>
          <Logo>
            {isCorretoraMode ? 'Kemely Corretora' : 'Kemely Financeiro'}
          </Logo>
          <ActionButton
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMode}
            style={{ marginLeft: '16px' }}
          >
            {isCorretoraMode ? '💰' : '🏢'}
            {isCorretoraMode ? 'Financeiro' : 'Corretora'}
          </ActionButton>

          <QuickStats>
            <StatItem
              variant="income"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight size={20} color="#10b981" />
              <div>
                <StatValue variant="income">R$ {summary.totalIncome.toFixed(2)}</StatValue>
                <StatLabel>Receitas</StatLabel>
              </div>
            </StatItem>

            <StatItem
              variant="expense"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownRight size={20} color="#ef4444" />
              <div>
                <StatValue variant="expense">R$ {summary.totalExpense.toFixed(2)}</StatValue>
                <StatLabel>Despesas</StatLabel>
              </div>
            </StatItem>

            <StatItem
              variant="balance"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target size={20} color="#3b82f6" />
              <div>
                <StatValue variant="balance">R$ {summary.balance.toFixed(2)}</StatValue>
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
              Nova Transação
            </ActionButton>

            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowFilters}
            >
              <Filter size={16} />
              Filtros
            </ActionButton>

            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
            >
              <FileSpreadsheet size={16} />
              Exportar
            </ActionButton>

            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </MobileMenuButton>
          </ActionButtons>
        </TopBar>

        {/* Navigation Bar */}
        <NavigationBar>
          <NavItems $isCorretoraMode={isCorretoraMode}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              fontWeight: '500'
            }}>
              {summary.transactionCount} transações
            </div>
            <Settings size={18} color="#64748b" style={{ cursor: 'pointer' }} />
          </div>
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
              <Logo>Kemely Financeiro</Logo>
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
