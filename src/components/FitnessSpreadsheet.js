import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Dumbbell,
  Calendar,
  Users,
  Target,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Download,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Droplets,
  Apple,
  Activity,
  Zap,
  AlertCircle,
  Trophy,
  Flame,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatNumber } from '../utils/formatters';
import { fetchData, insertData, updateData, deleteData } from '../lib/database-setup';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

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

const FitnessContainer = styled.div`
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
    padding: 24px;
    border-radius: 20px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
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

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);
  animation: ${float} 6s ease-in-out infinite;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const HeaderSubtitle = styled.p`
  font-size: 1rem;
  color: #cccccc;
  margin: 0;
  font-weight: 300;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #cccccc;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => {
    switch(props.variant) {
      case 'gym': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'food': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'water': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'sleep': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 14px 0 rgba(255, 255, 255, 0.3);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const StatSubtitle = styled.div`
  font-size: 0.875rem;
  color: #cccccc;
  font-weight: 500;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(26, 26, 26, 0.3);
  padding: 8px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#cccccc'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const TableContainer = styled.div`
  background: rgba(42, 42, 42, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
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

const TableHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 24px;
  display: grid;
  grid-template-columns: ${props => props.columns};
  gap: 16px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: ${props => props.columns};
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(42, 42, 42, 0.3);
  position: relative;
  overflow: hidden;

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
    
    &::before {
      width: 100%;
    }
  }

  &:nth-child(even) {
    background: rgba(26, 26, 26, 0.3);
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

  svg {
    color: inherit;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch(props.status) {
      case 'completed': return 'rgba(16, 185, 129, 0.1)';
      case 'partial': return 'rgba(245, 158, 11, 0.1)';
      case 'missed': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'completed': return '#10b981';
      case 'partial': return '#f59e0b';
      case 'missed': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'completed': return 'rgba(16, 185, 129, 0.2)';
      case 'partial': return 'rgba(245, 158, 11, 0.2)';
      case 'missed': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
`;

const ActionBtn = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }

  svg {
    color: inherit;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #cccccc;
  font-size: 1rem;
`;

const FitnessSpreadsheet = ({ onFormOpen, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('workouts');
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [water, setWater] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [workoutsData, mealsData, waterData, sleepData] = await Promise.all([
        supabase.from('fitness_workouts').select('*').order('date', { ascending: false }),
        supabase.from('fitness_meals').select('*').order('date', { ascending: false }),
        supabase.from('fitness_water').select('*').order('date', { ascending: false }),
        supabase.from('fitness_sleep').select('*').order('date', { ascending: false })
      ]);

      if (workoutsData.error) throw workoutsData.error;
      if (mealsData.error) throw mealsData.error;
      if (waterData.error) throw waterData.error;
      if (sleepData.error) throw sleepData.error;

      setWorkouts(workoutsData.data || []);
      setMeals(mealsData.data || []);
      setWater(waterData.data || []);
      setSleep(sleepData.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    onFormOpen();
  };

  const handleEdit = (item, type) => {
    onEdit({ ...item, type });
  };

  const handleDelete = (item, type) => {
    onDelete(item, type);
  };


  const getStats = () => {
    // Função para obter a data local no formato YYYY-MM-DD
    const getLocalDateString = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = getLocalDateString();
    const thisWeek = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= thisWeek && workoutDate <= weekEnd;
    });

    const thisWeekMeals = meals.filter(m => {
      const mealDate = new Date(m.date);
      return mealDate >= thisWeek && mealDate <= weekEnd;
    });

    const todayWater = water.filter(w => w.date === today);
    const totalWater = todayWater.reduce((sum, w) => sum + w.amount, 0);

    const thisWeekSleep = sleep.filter(s => {
      const sleepDate = new Date(s.date);
      return sleepDate >= thisWeek && sleepDate <= weekEnd;
    });
    const avgSleep = thisWeekSleep.length > 0 
      ? thisWeekSleep.reduce((sum, s) => sum + s.hours, 0) / thisWeekSleep.length 
      : 0;

    return {
      workouts: thisWeekWorkouts.length,
      meals: thisWeekMeals.length,
      water: totalWater,
      sleep: formatNumber(avgSleep, 1)
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <FitnessContainer>
        <LoadingSpinner />
      </FitnessContainer>
    );
  }

  return (
    <FitnessContainer>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <Dumbbell size={32} />
          </HeaderIcon>
          <HeaderInfo>
            <HeaderTitle>Fitness Tracker</HeaderTitle>
            <HeaderSubtitle>Acompanhe sua jornada fitness</HeaderSubtitle>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton
            onClick={fetchData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Atualizar planilha"
          >
            <RefreshCw size={16} />
            Atualizar
          </ActionButton>
          <ActionButton
            onClick={handleAdd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Novo Registro
          </ActionButton>
          <ActionButton>
            <Download size={16} />
            Exportar
          </ActionButton>
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatTitle>Treinos Esta Semana</StatTitle>
            <StatIcon variant="gym">
              <Dumbbell size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.workouts}</StatValue>
          <StatSubtitle>Treinos realizados</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Refeições Esta Semana</StatTitle>
            <StatIcon variant="food">
              <Apple size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.meals}</StatValue>
          <StatSubtitle>Refeições registradas</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Água Hoje</StatTitle>
            <StatIcon variant="water">
              <Droplets size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.water}ml</StatValue>
          <StatSubtitle>Água consumida</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>Sono Médio</StatTitle>
            <StatIcon variant="sleep">
              <Activity size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.sleep}h</StatValue>
          <StatSubtitle>Por noite esta semana</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <Tab 
          active={activeTab === 'workouts'} 
          onClick={() => setActiveTab('workouts')}
        >
          <Dumbbell size={16} />
          Treinos
        </Tab>
        <Tab 
          active={activeTab === 'meals'} 
          onClick={() => setActiveTab('meals')}
        >
          <Apple size={16} />
          Refeições
        </Tab>
        <Tab 
          active={activeTab === 'water'} 
          onClick={() => setActiveTab('water')}
        >
          <Droplets size={16} />
          Água
        </Tab>
        <Tab 
          active={activeTab === 'sleep'} 
          onClick={() => setActiveTab('sleep')}
        >
          <Activity size={16} />
          Sono
        </Tab>
      </TabsContainer>

      <TableContainer>
        {activeTab === 'workouts' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Exercício</div>
              <div>Duração</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {workouts.length === 0 ? (
              <EmptyState>Nenhum treino registrado</EmptyState>
            ) : (
              workouts.map((workout, index) => (
                <TableRow
                  key={workout.id}
                  columns="1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {format(new Date(workout.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell bold>{workout.exercise}</TableCell>
                  <TableCell>{workout.duration} min</TableCell>
                  <TableCell>
                    <StatusBadge status={workout.completed ? 'completed' : 'missed'}>
                      {workout.completed ? 'Concluído' : 'Perdido'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(workout, 'workout')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(workout, 'workout')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'meals' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Refeição</div>
              <div>Calorias</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {meals.length === 0 ? (
              <EmptyState>Nenhuma refeição registrada</EmptyState>
            ) : (
              meals.map((meal, index) => (
                <TableRow
                  key={meal.id}
                  columns="1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {format(new Date(meal.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell bold>{meal.meal_type}</TableCell>
                  <TableCell>{meal.calories} cal</TableCell>
                  <TableCell>
                    <StatusBadge status={meal.healthy ? 'completed' : 'partial'}>
                      {meal.healthy ? 'Saudável' : 'Regular'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(meal, 'meal')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(meal, 'meal')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'water' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Quantidade</div>
              <div>Horário</div>
              <div>Ações</div>
            </TableHeader>
            {water.length === 0 ? (
              <EmptyState>Nenhum registro de água</EmptyState>
            ) : (
              water.map((waterItem, index) => (
                <TableRow
                  key={waterItem.id}
                  columns="1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {format(new Date(waterItem.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell bold>{waterItem.amount}ml</TableCell>
                  <TableCell>{waterItem.time}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(waterItem, 'water')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(waterItem, 'water')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'sleep' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Horário Dormir</div>
              <div>Horário Acordar</div>
              <div>Duração</div>
              <div>Ações</div>
            </TableHeader>
            {sleep.length === 0 ? (
              <EmptyState>Nenhum registro de sono</EmptyState>
            ) : (
              sleep.map((sleepItem, index) => (
                <TableRow
                  key={sleepItem.id}
                  columns="1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {format(new Date(sleepItem.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{sleepItem.bedtime}</TableCell>
                  <TableCell>{sleepItem.wake_time}</TableCell>
                  <TableCell bold>{sleepItem.hours}h</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(sleepItem, 'sleep')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(sleepItem, 'sleep')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}
      </TableContainer>

    </FitnessContainer>
  );
};

export default FitnessSpreadsheet;
