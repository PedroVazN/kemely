import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { supabase } from '../lib/supabase';
import { Subtitle } from '../styles/GlobalStyles';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

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

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const ChartCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  min-height: 400px;
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
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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

const ChartTitle = styled.h3`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
`;

const ChartIcon = styled.div`
  color: #ffffff;
  display: flex;
  align-items: center;
`;

const CustomTooltip = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #7f8c8d;
  font-style: italic;
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];

const Charts = () => {
  const [chartData, setChartData] = useState({
    categoryData: [],
    monthlyData: [],
    trendData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // Dados por categoria
      const categoryMap = {};
      data.forEach(transaction => {
        if (transaction.type === 'expense') {
          categoryMap[transaction.category] = (categoryMap[transaction.category] || 0) + transaction.amount;
        }
      });

      const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }));

      // Dados mensais
      const monthlyMap = {};
      data.forEach(transaction => {
        const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short' });
        if (!monthlyMap[month]) {
          monthlyMap[month] = { income: 0, expense: 0 };
        }
        monthlyMap[month][transaction.type] += transaction.amount;
      });

      const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        receitas: parseFloat(data.income.toFixed(2)),
        despesas: parseFloat(data.expense.toFixed(2))
      }));

      // Dados de tendência (últimos 7 dias)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayData = data.filter(t => 
          new Date(t.date).toDateString() === date.toDateString()
        );
        
        const income = dayData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = dayData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        last7Days.push({
          day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          receitas: parseFloat(income.toFixed(2)),
          despesas: parseFloat(expense.toFixed(2))
        });
      }

      setChartData({
        categoryData,
        monthlyData,
        trendData: last7Days
      });
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ChartsContainer>
        <ChartCard>
          <EmptyState>Carregando gráficos...</EmptyState>
        </ChartCard>
      </ChartsContainer>
    );
  }

  return (
    <ChartsContainer>
      {/* Gráfico de Pizza - Gastos por Categoria */}
      <ChartCard>
        <ChartHeader>
          <ChartIcon>
            <PieChartIcon size={24} />
          </ChartIcon>
          <ChartTitle>Gastos por Categoria</ChartTitle>
        </ChartHeader>
        {chartData.categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <CustomTooltip>
                        <p>{`${payload[0].name}: R$ ${payload[0].value.toFixed(2)}`}</p>
                      </CustomTooltip>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>Nenhum dado de gastos disponível</EmptyState>
        )}
      </ChartCard>

      {/* Gráfico de Barras - Receitas vs Despesas Mensais */}
      <ChartCard>
        <ChartHeader>
          <ChartIcon>
            <BarChart3 size={24} />
          </ChartIcon>
          <ChartTitle>Receitas vs Despesas</ChartTitle>
        </ChartHeader>
        {chartData.monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis dataKey="month" stroke="#667eea" />
              <YAxis stroke="#667eea" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <CustomTooltip>
                        <p style={{ margin: 0, fontWeight: '600' }}>{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ margin: '4px 0', color: entry.color }}>
                            {`${entry.name}: R$ ${entry.value.toFixed(2)}`}
                          </p>
                        ))}
                      </CustomTooltip>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="receitas" fill="#27ae60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" fill="#e74c3c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>Nenhum dado mensal disponível</EmptyState>
        )}
      </ChartCard>

      {/* Gráfico de Linha - Tendência dos Últimos 7 Dias */}
      <ChartCard>
        <ChartHeader>
          <ChartIcon>
            <TrendingUp size={24} />
          </ChartIcon>
          <ChartTitle>Tendência (7 dias)</ChartTitle>
        </ChartHeader>
        {chartData.trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis dataKey="day" stroke="#667eea" />
              <YAxis stroke="#667eea" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <CustomTooltip>
                        <p style={{ margin: 0, fontWeight: '600' }}>{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ margin: '4px 0', color: entry.color }}>
                            {`${entry.name}: R$ ${entry.value.toFixed(2)}`}
                          </p>
                        ))}
                      </CustomTooltip>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="receitas" 
                stroke="#27ae60" 
                strokeWidth={3}
                dot={{ fill: '#27ae60', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                stroke="#e74c3c" 
                strokeWidth={3}
                dot={{ fill: '#e74c3c', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>Nenhum dado de tendência disponível</EmptyState>
        )}
      </ChartCard>
    </ChartsContainer>
  );
};

export default Charts;
