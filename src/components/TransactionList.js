import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Edit, DollarSign, TrendingUp, TrendingDown, Search, Filter, RefreshCw, CheckCircle, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

const ListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

const TransactionItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => {
    if (props.$isPaid) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)';
    if (props.$isIncome) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)';
    if (props.$isDebtor) return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)';
    return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)';
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  opacity: ${props => props.$isPaid ? 0.8 : 1};
  border: ${props => props.$isPaid ? '2px dashed rgba(16, 185, 129, 0.5)' : 'none'};

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
    background: ${props => {
      if (props.$isPaid) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(34, 197, 94, 0.3) 100%)';
      if (props.$isIncome) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)';
      if (props.$isDebtor) return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)';
      return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)';
    }};
    transform: translateY(-4px) translateX(4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    border-left: 4px solid ${props => {
      if (props.$isPaid) return '#10b981';
      if (props.$isIncome) return '#10b981';
      if (props.$isDebtor) return '#f59e0b';
      return '#ef4444';
    }};
    
    &::before {
      width: 100%;
    }
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionDescription = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const TransactionDetails = styled.div`
  font-size: 12px;
  color: #a0a0a0;
  display: flex;
  gap: 10px;
`;

const TransactionAmount = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${props => {
    if (props.$isIncome) return '#10b981';
    if (props.$isDebtor) return '#f59e0b';
    return '#ef4444';
  }};
  display: flex;
  align-items: center;
  gap: 5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid #ffffff;
  color: #ffffff;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => {
      if (props.$danger) return '#ef4444';
      if (props.$success) return '#10b981';
      if (props.$info) return '#3b82f6';
      return '#ffffff';
    }};
    border-color: ${props => {
      if (props.$danger) return '#dc2626';
      if (props.$success) return '#059669';
      if (props.$info) return '#2563eb';
      return '#f3f4f6';
    }};
    color: ${props => {
      if (props.$danger || props.$success || props.$info) return '#ffffff';
      return '#1a1a1a';
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
  font-style: italic;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);

  &:hover {
    background: linear-gradient(135deg, #357ABD 0%, #2E6BA8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(74, 144, 226, 0.4);
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

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.$active ? '#4A90E2' : '#E6F3FF'};
  background: ${props => props.$active ? '#4A90E2' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4A90E2'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4A90E2;
    background: #4A90E2;
    color: white;
  }
`;

const TransactionList = ({ onTransactionDeleted, filters = {} }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem('transactionFilter') || 'all';
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      applyFilters();
    } else {
      fetchTransactions();
    }
  }, [filters]);

  const fetchTransactions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactions(true);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    localStorage.setItem('transactionFilter', newFilter);
  };

  const applyFilters = async () => {
    try {
      let query = supabase.from('transactions').select('*');
      
      if (filters.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }
      if (filters.amountMin) {
        query = query.gte('amount', parseFloat(filters.amountMin));
      }
      if (filters.amountMax) {
        query = query.lte('amount', parseFloat(filters.amountMax));
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro ao excluir transação');
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm('Marcar esta despesa como paga?')) return;

    // Função para obter a data local no formato YYYY-MM-DD
    const getLocalDateString = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const paidDate = getLocalDateString();

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          paid: true, 
          paid_date: paidDate 
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => 
          t.id === id 
            ? { ...t, paid: true, paid_date: paidDate }
            : t
        )
      );
      
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      alert('Erro ao marcar como pago');
    }
  };

  const handleGenerateNewTransaction = async (transaction) => {
    if (!window.confirm('Gerar uma nova transação baseada nesta despesa?')) return;

    // Função para obter a data local no formato YYYY-MM-DD
    const getLocalDateString = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    try {
      const newTransaction = {
        description: `${transaction.description} (Gerada)`,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: getLocalDateString(),
        parent_transaction_id: transaction.id
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) throw error;

      // Atualizar a lista local
      setTransactions(prev => [data[0], ...prev]);
      
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
      
      alert('Nova transação gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar nova transação:', error);
      alert('Erro ao gerar nova transação');
    }
  };

  const handleUnmarkAsPaid = async (id) => {
    if (!window.confirm('Desmarcar esta despesa como paga?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          paid: false, 
          paid_date: null 
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => 
          t.id === id 
            ? { ...t, paid: false, paid_date: null }
            : t
        )
      );
      
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      console.error('Erro ao desmarcar como pago:', error);
      alert('Erro ao desmarcar como pago');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense' && !transaction.paid;
    if (filter === 'paid') return transaction.type === 'expense' && transaction.paid;
    if (filter === 'debtor') return transaction.type === 'debtor';
    return true;
  });

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div>
      <FilterContainer>
        <FilterButtons>
          <FilterButton 
            $active={filter === 'all'} 
            onClick={() => handleFilterChange('all')}
          >
            Todas
          </FilterButton>
          <FilterButton 
            $active={filter === 'income'} 
            onClick={() => handleFilterChange('income')}
          >
            Receitas
          </FilterButton>
          <FilterButton 
            $active={filter === 'expense'} 
            onClick={() => handleFilterChange('expense')}
          >
            Despesas
          </FilterButton>
          <FilterButton 
            $active={filter === 'paid'} 
            onClick={() => handleFilterChange('paid')}
          >
            Pagas
          </FilterButton>
          <FilterButton 
            $active={filter === 'debtor'} 
            onClick={() => handleFilterChange('debtor')}
          >
            Devedores
          </FilterButton>
        </FilterButtons>
        
        <RefreshButton 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw 
            size={14} 
            style={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none' 
            }} 
          />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </RefreshButton>
      </FilterContainer>

      <ListContainer>
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <EmptyState>
                Nenhuma transação encontrada
              </EmptyState>
            </motion.div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <TransactionItem 
                key={transaction.id} 
                $isIncome={transaction.type === 'income'}
                $isDebtor={transaction.type === 'debtor'}
                $isPaid={transaction.paid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <TransactionInfo>
                  <TransactionDescription>
                    {transaction.description}
                  </TransactionDescription>
                  <TransactionDetails>
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    {transaction.paid && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          ✓ Pago
                        </span>
                      </>
                    )}
                  </TransactionDetails>
                </TransactionInfo>
                <TransactionAmount 
                  $isIncome={transaction.type === 'income'}
                  $isDebtor={transaction.type === 'debtor'}
                >
                  {transaction.type === 'income' ? (
                    <TrendingUp size={16} />
                  ) : transaction.type === 'debtor' ? (
                    <DollarSign size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {formatCurrency(transaction.amount)}
                </TransactionAmount>
                <ActionButtons>
                  {transaction.type === 'expense' && !transaction.paid && filter !== 'paid' && (
                    <>
                      <ActionButton 
                        onClick={() => handleMarkAsPaid(transaction.id)} 
                        $success
                        title="Marcar como pago"
                      >
                        <CheckCircle size={16} />
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleGenerateNewTransaction(transaction)} 
                        $info
                        title="Gerar nova transação"
                      >
                        <Copy size={16} />
                      </ActionButton>
                    </>
                  )}
                  {transaction.type === 'expense' && transaction.paid && filter === 'paid' && (
                    <ActionButton 
                      onClick={() => handleUnmarkAsPaid(transaction.id)} 
                      $danger
                      title="Desmarcar como pago"
                    >
                      <X size={16} />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => handleDelete(transaction.id)} $danger>
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionButtons>
              </TransactionItem>
            ))
          )}
        </AnimatePresence>
      </ListContainer>
    </div>
  );
};

export default TransactionList;
