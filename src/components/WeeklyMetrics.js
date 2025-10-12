import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Target,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Briefcase,
  Home,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  ChevronRight,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchData, insertData, updateData, deleteData } from '../lib/database-setup';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import WeeklyPlanForm from './WeeklyPlanForm';
import EditWeeklyPlanModal from './EditWeeklyPlanModal';
import DeleteConfirmModal from './DeleteConfirmModal';

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

const MetricsContainer = styled.div`
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
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

const WeekNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WeekButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const WeekInfo = styled.div`
  text-align: center;
`;

const WeekTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
`;

const WeekDates = styled.p`
  font-size: 1rem;
  color: #cccccc;
  margin: 0;
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
      case 'leads': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'appointments': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'visits': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'sales': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
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
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#cccccc'};
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
  font-weight: ${props => props.$bold ? '700' : '500'};
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
      case 'pending': return 'rgba(245, 158, 11, 0.1)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.1)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'completed': return 'rgba(16, 185, 129, 0.2)';
      case 'pending': return 'rgba(245, 158, 11, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.2)';
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

const WeeklyMetrics = ({ onFormOpen, onEdit, onDelete, currentWeek, onWeekChange }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentWeek]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      const [plansData, goalsData] = await Promise.all([
        supabase.from('weekly_plans').select('*').gte('date', weekStart.toISOString().split('T')[0]).lte('date', weekEnd.toISOString().split('T')[0]).order('date', { ascending: true }),
        supabase.from('weekly_goals').select('*').gte('week_start', weekStart.toISOString().split('T')[0]).lte('week_start', weekEnd.toISOString().split('T')[0])
      ]);

      if (plansData.error) throw plansData.error;
      if (goalsData.error) throw goalsData.error;

      setWeeklyPlans(plansData.data || []);
      setGoals(goalsData.data || []);
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

  const goToPreviousWeek = () => {
    onWeekChange(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    onWeekChange(addDays(currentWeek, 7));
  };

  const goToCurrentWeek = () => {
    onWeekChange(new Date());
  };

  const getWeekStats = () => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    
    const weekPlans = weeklyPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= weekStart && planDate <= weekEnd;
    });

    const weekGoals = goals.filter(goal => {
      const goalDate = new Date(goal.week_start);
      return goalDate >= weekStart && goalDate <= weekEnd;
    });

    // Filtrar agendamentos pessoais e de corretora
    const personalPlans = weekPlans.filter(plan => plan.type === 'personal');
    const corretoraPlans = weekPlans.filter(plan => 
      plan.type !== 'personal' && 
      ['visita_decorado', 'primeira_visita', 'segunda_visita', 'primeira_visita_aprovado', 'retorno', 'reuniao', 'follow_up', 'apresentacao', 'vistoria'].includes(plan.type)
    );

    return {
      totalPersonal: personalPlans.length,
      totalCorretora: corretoraPlans.length,
      totalGoals: weekGoals.length,
      totalPlans: weekPlans.length
    };
  };

  const stats = getWeekStats();

  const getWeekTitle = () => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    
    return `${format(weekStart, 'dd/MM', { locale: ptBR })} - ${format(weekEnd, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  if (loading) {
    return (
      <MetricsContainer>
        <LoadingSpinner />
      </MetricsContainer>
    );
  }

  return (
    <MetricsContainer>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <Calendar size={32} />
          </HeaderIcon>
          <HeaderInfo>
            <HeaderTitle>Métricas Semanais</HeaderTitle>
            <HeaderSubtitle>Planejamento e acompanhamento de vendas</HeaderSubtitle>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton
            onClick={handleAdd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Novo Planejamento
          </ActionButton>
          <ActionButton
            onClick={fetchData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Atualizar
          </ActionButton>
          <ActionButton>
            <Download size={16} />
            Exportar
          </ActionButton>
        </HeaderRight>
      </Header>

      <WeekNavigation>
        <WeekButton onClick={goToPreviousWeek}>
          <ChevronLeft size={16} />
          Semana Anterior
        </WeekButton>
        
        <WeekInfo>
          <WeekTitle>Semana de {getWeekTitle()}</WeekTitle>
          <WeekDates>
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM/yyyy', { locale: ptBR })} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM/yyyy', { locale: ptBR })}
          </WeekDates>
        </WeekInfo>
        
        <WeekButton onClick={goToNextWeek}>
          Próxima Semana
          <ChevronRight size={16} />
        </WeekButton>
      </WeekNavigation>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatTitle>Agendamentos Pessoais</StatTitle>
            <StatIcon variant="leads">
              <Users size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalPersonal}</StatValue>
          <StatSubtitle>Agendamentos pessoais</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Agendamentos Corretora</StatTitle>
            <StatIcon variant="appointments">
              <Home size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalCorretora}</StatValue>
          <StatSubtitle>Visitas e reuniões</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Metas</StatTitle>
            <StatIcon variant="visits">
              <Target size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalGoals}</StatValue>
          <StatSubtitle>Metas da semana</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>Total</StatTitle>
            <StatIcon variant="sales">
              <Calendar size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalPlans}</StatValue>
          <StatSubtitle>Atividades planejadas</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <Tab 
          $active={activeTab === 'personal'} 
          onClick={() => setActiveTab('personal')}
        >
          <Users size={16} />
          Pessoal
        </Tab>
        <Tab 
          $active={activeTab === 'corretora'} 
          onClick={() => setActiveTab('corretora')}
        >
          <Home size={16} />
          Corretora
        </Tab>
        <Tab 
          $active={activeTab === 'goals'} 
          onClick={() => setActiveTab('goals')}
        >
          <Target size={16} />
          Metas
        </Tab>
      </TabsContainer>

      <TableContainer>
        {activeTab === 'personal' && (
          <>
            <TableHeader columns="1fr 2fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Atividade</div>
              <div>Cliente</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {weeklyPlans.filter(p => p.type === 'personal').length === 0 ? (
              <EmptyState>Nenhum agendamento pessoal para esta semana</EmptyState>
            ) : (
              weeklyPlans.filter(p => p.type === 'personal').map((plan, index) => (
                <TableRow
                  key={plan.id}
                  columns="1fr 2fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {format(new Date(plan.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell $bold>{plan.activity}</TableCell>
                  <TableCell>{plan.client_name || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status}>
                      {plan.status === 'completed' ? 'Concluído' : plan.status === 'pending' ? 'Pendente' : 'Agendado'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(plan, 'plan')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(plan, 'plan')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'corretora' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Tipo</div>
              <div>Atividade</div>
              <div>Cliente</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {weeklyPlans.filter(p => p.type !== 'personal').length === 0 ? (
              <EmptyState>Nenhum agendamento de corretora para esta semana</EmptyState>
            ) : (
              weeklyPlans.filter(p => p.type !== 'personal').map((plan, index) => {
                const typeLabels = {
                  'visita_decorado': 'Visita Decorado',
                  'primeira_visita': '1ª Visita',
                  'segunda_visita': '2ª Visita',
                  'primeira_visita_aprovado': '1ª Visita Aprovado',
                  'retorno': 'Retorno',
                  'reuniao': 'Reunião',
                  'follow_up': 'Follow-up',
                  'apresentacao': 'Apresentação',
                  'vistoria': 'Vistoria'
                };
                
                return (
                  <TableRow
                    key={plan.id}
                    columns="1fr 1fr 1fr 1fr 1fr 80px"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell>
                      {format(new Date(plan.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="scheduled">
                        {typeLabels[plan.type] || plan.type}
                      </StatusBadge>
                    </TableCell>
                    <TableCell $bold>{plan.activity}</TableCell>
                    <TableCell>{plan.client_name || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={plan.status}>
                        {plan.status === 'completed' ? 'Concluído' : plan.status === 'pending' ? 'Pendente' : 'Agendado'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionBtn onClick={() => handleEdit(plan, 'plan')}>
                          <Edit size={16} />
                        </ActionBtn>
                        <ActionBtn onClick={() => handleDelete(plan, 'plan')}>
                          <Trash2 size={16} />
                        </ActionBtn>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </>
        )}

        {activeTab === 'goals' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 80px">
              <div>Meta</div>
              <div>Valor</div>
              <div>Progresso</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {goals.length === 0 ? (
              <EmptyState>Nenhuma meta definida para esta semana</EmptyState>
            ) : (
              goals.map((goal, index) => (
                <TableRow
                  key={goal.id}
                  columns="1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell $bold>{goal.goal_name}</TableCell>
                  <TableCell>R$ {goal.target_value?.toLocaleString('pt-BR') || '-'}</TableCell>
                  <TableCell>{goal.progress || 0}%</TableCell>
                  <TableCell>
                    <StatusBadge status={goal.status}>
                      {goal.status === 'completed' ? 'Concluída' : goal.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(goal, 'goal')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(goal, 'goal')}>
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

    </MetricsContainer>
  );
};

export default WeeklyMetrics;
