import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2,
  Calendar,
  Users,
  DollarSign,
  Phone,
  CheckCircle,
  Clock,
  Star,
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
  UserCheck,
  UserX,
  Thermometer,
  Flame,
  Snowflake,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
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

const CorretoraContainer = styled.div`
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
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
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
    '#ffffff' : 
    'transparent'
  };
  color: ${props => props.variant === 'primary' ? 
    '#1a1a1a' : 
    '#ffffff'
  };
  border: 1px solid ${props => props.variant === 'primary' ? 
    'transparent' : 
    '#ffffff'
  };
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.variant === 'primary' ? 
    '0 4px 14px 0 rgba(59, 130, 246, 0.3)' : 
    'none'
  };

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.variant === 'primary' ? 
      '#f3f4f6' : 
      '#ffffff'
    };
    color: #1a1a1a;
    box-shadow: ${props => props.variant === 'primary' ? 
      '0 8px 25px rgba(255, 255, 255, 0.4)' : 
      '0 4px 14px 0 rgba(255, 255, 255, 0.3)'
    };
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
  margin-bottom: 12px;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const StatSubtitle = styled.div`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #ffffff;
`;

const Tab = styled(motion.button)`
  padding: 12px 24px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
    'transparent'
  };
  color: ${props => props.$active ? 
    '#ffffff' : 
    '#a0a0a0'
  };
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${props => props.$active ? 
    '0 4px 16px rgba(245, 158, 11, 0.3)' : 
    'none'
  };

  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
      'rgba(245, 158, 11, 0.15)'
    };
    color: ${props => props.$active ? 
      '#ffffff' : 
      '#3b82f6'
    };
    transform: translateY(-2px);
    box-shadow: ${props => props.$active ? 
      '0 8px 32px rgba(245, 158, 11, 0.4)' : 
      '0 4px 16px rgba(245, 158, 11, 0.2)'
    };
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
    border-left: 3px solid rgba(255, 255, 255, 0.3);
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch(props.status) {
      case 'aprovado': return 'rgba(16, 185, 129, 0.1)';
      case 'pendente': return 'rgba(245, 158, 11, 0.1)';
      case 'rejeitado': return 'rgba(239, 68, 68, 0.1)';
      case 'quente': return 'rgba(239, 68, 68, 0.1)';
      case 'frio': return 'rgba(59, 130, 246, 0.1)';
      case 'confirmado': return 'rgba(16, 185, 129, 0.1)';
      case 'agendado': return 'rgba(245, 158, 11, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'aprovado': return '#10b981';
      case 'pendente': return '#ffffff';
      case 'rejeitado': return '#ef4444';
      case 'quente': return '#ef4444';
      case 'frio': return '#ffffff';
      case 'confirmado': return '#10b981';
      case 'agendado': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'aprovado': return 'rgba(16, 185, 129, 0.2)';
      case 'pendente': return 'rgba(245, 158, 11, 0.2)';
      case 'rejeitado': return 'rgba(239, 68, 68, 0.2)';
      case 'quente': return 'rgba(239, 68, 68, 0.2)';
      case 'frio': return 'rgba(59, 130, 246, 0.2)';
      case 'confirmado': return 'rgba(16, 185, 129, 0.2)';
      case 'agendado': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};

  svg {
    color: inherit;
  }
`;

const TemperatureIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.temperature === 'quente' ? '#ef4444' : '#3b7280'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  svg {
    color: inherit;
  }

  &:hover {
    background: #ffffff;
    border-color: #f3f4f6;
    color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.4);
  }
`;

const CorretoraSpreadsheet = ({ 
  onLeadFormOpen, 
  onAppointmentFormOpen, 
  onCommissionFormOpen, 
  onEditLead, 
  onDeleteLead, 
  onDeleteAppointment, 
  onDeleteCommission 
}) => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Buscar agendamentos
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_agendamento', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      // Buscar comissões
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('comissoes')
        .select('*')
        .order('data_venda', { ascending: false });

      if (commissionsError) throw commissionsError;

      setLeads(leadsData || []);
      setAppointments(appointmentsData || []);
      setCommissions(commissionsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar dados da corretora');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    onLeadFormOpen();
  };

  const handleLeadAdded = () => {
    fetchData();
  };

  const handleAppointmentAdded = () => {
    fetchData();
  };

  const handleCommissionAdded = () => {
    fetchData();
  };


  const handleEditLeadClick = (lead) => {
    onEditLead(lead);
  };

  const handleLeadUpdated = () => {
    fetchData();
  };

  const handleDeleteLeadClick = (lead) => {
    onDeleteLead(lead);
  };

  const handleDeleteAppointmentClick = (appointment) => {
    onDeleteAppointment(appointment);
  };

  const handleDeleteCommissionClick = (commission) => {
    onDeleteCommission(commission);
  };

  const handleApproveLead = async (lead) => {
    try {
      await updateData('leads', lead.id, { status: 'aprovado' });
      toast.success('Lead aprovado com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao aprovar lead: ' + error.message);
    }
  };

  const handleRejectLead = async (lead) => {
    try {
      await updateData('leads', lead.id, { status: 'rejeitado' });
      toast.success('Lead rejeitado com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao rejeitar lead: ' + error.message);
    }
  };


  const stats = {
    totalLeads: leads.length,
    leadsQuentes: leads.filter(l => l.temperatura === 'quente').length,
    leadsFrios: leads.filter(l => l.temperatura === 'frio').length,
    aprovados: leads.filter(l => l.status === 'aprovado').length,
    totalAppointments: appointments.length,
    appointmentsHoje: appointments.filter(a => a.data_agendamento === format(new Date(), 'yyyy-MM-dd')).length,
    totalCommissions: commissions.reduce((sum, c) => sum + parseFloat(c.comissao), 0),
    commissionsPendentes: commissions.filter(c => c.status === 'pendente').length
  };

  if (loading) {
    return (
      <CorretoraContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ 
            display: 'inline-block',
            width: '24px',
            height: '24px',
            border: '3px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#3b82f6',
            animation: 'spin 1s ease-in-out infinite'
          }} />
          <div style={{ marginTop: '16px', color: '#64748b' }}>Carregando dados da corretora...</div>
        </div>
      </CorretoraContainer>
    );
  }

  return (
    <CorretoraContainer>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <Building2 size={28} />
          </HeaderIcon>
          <div>
            <HeaderTitle>🏢 Planilha de Corretora</HeaderTitle>
            <HeaderSubtitle>Gestão de leads, agendamentos e comissões</HeaderSubtitle>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton 
            variant="primary"
            onClick={handleAddLead}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Novo Lead
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
            <StatTitle>
              <Users size={16} />
              Total de Leads
            </StatTitle>
            <StatIcon variant="leads">
              <Users size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalLeads}</StatValue>
          <StatSubtitle>Leads cadastrados</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>
              <Flame size={16} />
              Leads Quentes
            </StatTitle>
            <StatIcon variant="leads">
              <Flame size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.leadsQuentes}</StatValue>
          <StatSubtitle>Alto potencial</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>
              <Calendar size={16} />
              Agendamentos
            </StatTitle>
            <StatIcon variant="appointments">
              <Calendar size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalAppointments}</StatValue>
          <StatSubtitle>{stats.appointmentsHoje} hoje</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>
              <DollarSign size={16} />
              Comissões
            </StatTitle>
            <StatIcon variant="commissions">
              <DollarSign size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>R$ {stats.totalCommissions.toFixed(2)}</StatValue>
          <StatSubtitle>{stats.commissionsPendentes} pendentes</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <Tab
          $active={activeTab === 'leads'}
          onClick={() => setActiveTab('leads')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={16} />
          Leads
        </Tab>
        <Tab
          $active={activeTab === 'appointments'}
          onClick={() => setActiveTab('appointments')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar size={16} />
          Agendamentos
        </Tab>
        <Tab
          $active={activeTab === 'commissions'}
          onClick={() => setActiveTab('commissions')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DollarSign size={16} />
          Comissões
        </Tab>
      </TabsContainer>

      {/* Action Buttons for each tab */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '20px',
        gap: '12px'
      }}>
        {activeTab === 'leads' && (
          <ActionButton 
            variant="primary"
            onClick={handleAddLead}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Novo Lead
          </ActionButton>
        )}
        
        {activeTab === 'appointments' && (
          <ActionButton 
            variant="primary"
            onClick={onAppointmentFormOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Novo Agendamento
          </ActionButton>
        )}
        
        {activeTab === 'commissions' && (
          <ActionButton 
            variant="primary"
            onClick={onCommissionFormOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Nova Comissão
          </ActionButton>
        )}
      </div>

      <TableContainer>
        {activeTab === 'leads' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
              <div>Nome</div>
              <div>Telefone</div>
              <div>PV</div>
              <div>AC</div>
              <div>AB</div>
              <div>Status</div>
              <div>Temperatura</div>
              <div>Ações</div>
            </TableHeader>
            {leads.map((lead, index) => (
              <TableRow
                key={lead.id}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TableCell bold>{lead.nome}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} />
                    {lead.telefone}
                  </div>
                </TableCell>
                <TableCell>{lead.pv}</TableCell>
                <TableCell>{lead.ac}</TableCell>
                <TableCell>{lead.ab}</TableCell>
                <TableCell>
                  <StatusBadge status={lead.status}>
                    {lead.status === 'aprovado' && <CheckCircle size={12} />}
                    {lead.status === 'pendente' && <Clock size={12} />}
                    {lead.status === 'rejeitado' && <AlertCircle size={12} />}
                    {lead.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <TemperatureIcon temperature={lead.temperatura}>
                    {lead.temperatura === 'quente' ? <Flame size={14} /> : <Snowflake size={14} />}
                    {lead.temperatura}
                  </TemperatureIcon>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    {lead.status === 'pendente' && (
                      <>
                        <ActionBtn 
                          onClick={() => handleApproveLead(lead)}
                          style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981' }}
                          title="Aprovar Lead"
                        >
                          <UserCheck size={12} />
                        </ActionBtn>
                        <ActionBtn 
                          onClick={() => handleRejectLead(lead)}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' }}
                          title="Rejeitar Lead"
                        >
                          <UserX size={12} />
                        </ActionBtn>
                      </>
                    )}
                    <ActionBtn onClick={() => handleEditLeadClick(lead)}>
                      <Edit size={12} />
                    </ActionBtn>
                    <ActionBtn onClick={() => handleDeleteLeadClick(lead)}>
                      <Trash2 size={12} />
                    </ActionBtn>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </>
        )}

        {activeTab === 'appointments' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
              <div>Cliente</div>
              <div>Data</div>
              <div>Horário</div>
              <div>Tipo</div>
              <div>Status</div>
              <div>Observações</div>
              <div>Ações</div>
            </TableHeader>
            {appointments.map((appointment, index) => (
              <TableRow
                key={appointment.id}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TableCell bold>{appointment.cliente}</TableCell>
                <TableCell>{format(new Date(appointment.data_agendamento), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                <TableCell>{appointment.horario}</TableCell>
                <TableCell>{appointment.tipo}</TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status}>
                    {appointment.status === 'agendado' && <Clock size={12} />}
                    {appointment.status === 'confirmado' && <CheckCircle size={12} />}
                    {appointment.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{appointment.observacoes}</TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionBtn>
                      <Eye size={12} />
                    </ActionBtn>
                    <ActionBtn>
                      <Edit size={12} />
                    </ActionBtn>
                    <ActionBtn onClick={() => handleDeleteAppointmentClick(appointment)}>
                      <Trash2 size={12} />
                    </ActionBtn>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </>
        )}

        {activeTab === 'commissions' && (
          <>
            <TableHeader columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
              <div>Cliente</div>
              <div>Produto</div>
              <div>Valor</div>
              <div>Comissão</div>
              <div>Data</div>
              <div>Status</div>
              <div>Ações</div>
            </TableHeader>
            {commissions.map((commission, index) => (
              <TableRow
                key={commission.id}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TableCell bold>{commission.cliente}</TableCell>
                <TableCell>{commission.produto}</TableCell>
                <TableCell>R$ {parseFloat(commission.valor).toFixed(2)}</TableCell>
                <TableCell bold style={{ color: '#ffffff' }}>R$ {parseFloat(commission.comissao).toFixed(2)}</TableCell>
                <TableCell>{format(new Date(commission.data_venda), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                <TableCell>
                  <StatusBadge status={commission.status}>
                    {commission.status === 'pago' && <CheckCircle size={12} />}
                    {commission.status === 'pendente' && <Clock size={12} />}
                    {commission.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionBtn>
                      <Eye size={12} />
                    </ActionBtn>
                    <ActionBtn>
                      <Edit size={12} />
                    </ActionBtn>
                    <ActionBtn onClick={() => handleDeleteCommissionClick(commission)}>
                      <Trash2 size={12} />
                    </ActionBtn>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableContainer>

    </CorretoraContainer>
  );
};

export default CorretoraSpreadsheet;
