import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Star,
  Target,
  Book,
  Cross,
  BookMarked,
  Flame,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  Crown,
  Shield,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchData, insertData, updateData, deleteData } from '../lib/database-setup';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';
import DevotionalForm from './DevotionalForm';
import EditDevotionalModal from './EditDevotionalModal';
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

const glow = `
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
    50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
  }
`;

const DevotionalContainer = styled.div`
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
      rgba(255, 215, 0, 0.8) 0%, 
      rgba(255, 215, 0, 0.4) 50%, 
      rgba(255, 215, 0, 0.8) 100%);
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
    background: radial-gradient(circle, rgba(255, 215, 0, 0.03) 0%, transparent 70%);
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
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
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
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
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
  background: rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
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
    background: rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.4);
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
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.4);
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
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(255, 215, 0, 0.4);
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 215, 0, 0.2),
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
      case 'fasting': return 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)';
      case 'prayer': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'bible': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'worship': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
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
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#cccccc'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    color: #ffffff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
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
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
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
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
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
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent);
    transition: width 0.3s ease;
  }

  &:hover {
    background: rgba(255, 215, 0, 0.05);
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
      case 'in_progress': return 'rgba(255, 215, 0, 0.1)';
      case 'pending': return 'rgba(107, 114, 128, 0.1)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#ffd700';
      case 'pending': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'completed': return 'rgba(16, 185, 129, 0.2)';
      case 'in_progress': return 'rgba(255, 215, 0, 0.2)';
      case 'pending': return 'rgba(107, 114, 128, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
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
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.4);
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
  border-top: 4px solid #ffd700;
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

const DevotionalPlanner = ({ onFormOpen, onEdit, onDelete, currentWeek, onWeekChange }) => {
  const [activeTab, setActiveTab] = useState('fasting');
  const [fastingPlans, setFastingPlans] = useState([]);
  const [prayerPlans, setPrayerPlans] = useState([]);
  const [bibleStudies, setBibleStudies] = useState([]);
  const [worshipPlans, setWorshipPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentWeek]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      const [fastingData, prayerData, bibleData, worshipData] = await Promise.all([
        supabase.from('devotional_fasting').select('*').gte('date', weekStart.toISOString().split('T')[0]).lte('date', weekEnd.toISOString().split('T')[0]).order('date', { ascending: true }),
        supabase.from('devotional_prayer').select('*').gte('date', weekStart.toISOString().split('T')[0]).lte('date', weekEnd.toISOString().split('T')[0]).order('date', { ascending: true }),
        supabase.from('devotional_bible_study').select('*').gte('week_start', weekStart.toISOString().split('T')[0]).lte('week_start', weekEnd.toISOString().split('T')[0]),
        supabase.from('devotional_worship').select('*').gte('date', weekStart.toISOString().split('T')[0]).lte('date', weekEnd.toISOString().split('T')[0]).order('date', { ascending: true })
      ]);

      if (fastingData.error) throw fastingData.error;
      if (prayerData.error) throw prayerData.error;
      if (bibleData.error) throw bibleData.error;
      if (worshipData.error) throw worshipData.error;

      setFastingPlans(fastingData.data || []);
      setPrayerPlans(prayerData.data || []);
      setBibleStudies(bibleData.data || []);
      setWorshipPlans(worshipData.data || []);
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
    
    const weekFasting = fastingPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= weekStart && planDate <= weekEnd;
    });

    const weekPrayer = prayerPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= weekStart && planDate <= weekEnd;
    });

    const weekBible = bibleStudies.filter(study => {
      const studyDate = new Date(study.week_start);
      return studyDate >= weekStart && studyDate <= weekEnd;
    });

    const weekWorship = worshipPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= weekStart && planDate <= weekEnd;
    });

    const totalFastingHours = weekFasting.reduce((sum, plan) => sum + (plan.duration || 0), 0);
    const completedPrayers = weekPrayer.filter(plan => plan.status === 'completed').length;
    const completedBibleStudies = weekBible.filter(study => study.status === 'completed').length;
    const completedWorship = weekWorship.filter(plan => plan.status === 'completed').length;

    return {
      totalFasting: totalFastingHours,
      totalPrayers: weekPrayer.length,
      completedPrayers,
      totalBibleStudies: weekBible.length,
      completedBibleStudies,
      totalWorship: weekWorship.length,
      completedWorship
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
      <DevotionalContainer>
        <LoadingSpinner />
      </DevotionalContainer>
    );
  }

  return (
    <DevotionalContainer>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <Cross size={32} />
          </HeaderIcon>
          <HeaderInfo>
            <HeaderTitle>Planejamento Devocional</HeaderTitle>
            <HeaderSubtitle>Jejum, oração, estudo bíblico e adoração</HeaderSubtitle>
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
            <StatTitle>Jejum</StatTitle>
            <StatIcon variant="fasting">
              <Clock size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalFasting}h</StatValue>
          <StatSubtitle>Horas de jejum esta semana</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Oração</StatTitle>
            <StatIcon variant="prayer">
              <BookOpen size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.completedPrayers}/{stats.totalPrayers}</StatValue>
          <StatSubtitle>Momentos de oração</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Estudo Bíblico</StatTitle>
            <StatIcon variant="bible">
              <BookMarked size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.completedBibleStudies}/{stats.totalBibleStudies}</StatValue>
          <StatSubtitle>Estudos concluídos</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>Adoração</StatTitle>
            <StatIcon variant="worship">
              <Heart size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.completedWorship}/{stats.totalWorship}</StatValue>
          <StatSubtitle>Momentos de adoração</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <Tab 
          active={activeTab === 'fasting'} 
          onClick={() => setActiveTab('fasting')}
        >
          <Clock size={16} />
          Jejum
        </Tab>
        <Tab 
          active={activeTab === 'prayer'} 
          onClick={() => setActiveTab('prayer')}
        >
          <BookOpen size={16} />
          Oração
        </Tab>
        <Tab 
          active={activeTab === 'bible'} 
          onClick={() => setActiveTab('bible')}
        >
          <BookMarked size={16} />
          Estudo Bíblico
        </Tab>
        <Tab 
          active={activeTab === 'worship'} 
          onClick={() => setActiveTab('worship')}
        >
          <Heart size={16} />
          Adoração
        </Tab>
      </TabsContainer>

      <TableContainer>
        {activeTab === 'fasting' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Tipo de Jejum</div>
              <div>Duração</div>
              <div>Propósito</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {fastingPlans.length === 0 ? (
              <EmptyState>Nenhum jejum planejado para esta semana</EmptyState>
            ) : (
              fastingPlans.map((plan, index) => (
                <TableRow
                  key={plan.id}
                  columns="1fr 1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {formatDate(plan.date)}
                  </TableCell>
                  <TableCell bold>{plan.fast_type}</TableCell>
                  <TableCell>{plan.duration}h</TableCell>
                  <TableCell>{plan.purpose}</TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status}>
                      {plan.status === 'completed' ? 'Concluído' : plan.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(plan, 'fasting')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(plan, 'fasting')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'prayer' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Horário</div>
              <div>Tema</div>
              <div>Duração</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {prayerPlans.length === 0 ? (
              <EmptyState>Nenhum momento de oração planejado para esta semana</EmptyState>
            ) : (
              prayerPlans.map((plan, index) => (
                <TableRow
                  key={plan.id}
                  columns="1fr 1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {formatDate(plan.date)}
                  </TableCell>
                  <TableCell>{plan.time}</TableCell>
                  <TableCell bold>{plan.theme}</TableCell>
                  <TableCell>{plan.duration} min</TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status}>
                      {plan.status === 'completed' ? 'Concluído' : plan.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(plan, 'prayer')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(plan, 'prayer')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'bible' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 80px">
              <div>Tema</div>
              <div>Livro/Capítulo</div>
              <div>Versículos</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {bibleStudies.length === 0 ? (
              <EmptyState>Nenhum estudo bíblico planejado para esta semana</EmptyState>
            ) : (
              bibleStudies.map((study, index) => (
                <TableRow
                  key={study.id}
                  columns="1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell bold>{study.theme}</TableCell>
                  <TableCell>{study.book_chapter}</TableCell>
                  <TableCell>{study.verses}</TableCell>
                  <TableCell>
                    <StatusBadge status={study.status}>
                      {study.status === 'completed' ? 'Concluído' : study.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(study, 'bible')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(study, 'bible')}>
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </>
        )}

        {activeTab === 'worship' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 80px">
              <div>Data</div>
              <div>Horário</div>
              <div>Atividade</div>
              <div>Duração</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {worshipPlans.length === 0 ? (
              <EmptyState>Nenhum momento de adoração planejado para esta semana</EmptyState>
            ) : (
              worshipPlans.map((plan, index) => (
                <TableRow
                  key={plan.id}
                  columns="1fr 1fr 1fr 1fr 1fr 80px"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    {formatDate(plan.date)}
                  </TableCell>
                  <TableCell>{plan.time}</TableCell>
                  <TableCell bold>{plan.activity}</TableCell>
                  <TableCell>{plan.duration} min</TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status}>
                      {plan.status === 'completed' ? 'Concluído' : plan.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionBtn onClick={() => handleEdit(plan, 'worship')}>
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => handleDelete(plan, 'worship')}>
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
    </DevotionalContainer>
  );
};

export default DevotionalPlanner;
