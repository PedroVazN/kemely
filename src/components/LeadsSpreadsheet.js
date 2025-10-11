import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users,
  Phone,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Flame,
  Snowflake,
  AlertCircle,
  UserCheck,
  UserX,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updateData } from '../lib/database-setup';
import toast from 'react-hot-toast';

const Container = styled.div`
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
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-4px);
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
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const StatSubtitle = styled.div`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

const TableContainer = styled.div`
  background: rgba(42, 42, 42, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TableHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 24px;
  display: grid;
  grid-template-columns: ${props => props.columns};
  gap: 16px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  transition: all 0.3s ease;
  background: rgba(42, 42, 42, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    transform: translateX(4px);
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
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'aprovado': return '#10b981';
      case 'pendente': return '#ffffff';
      case 'rejeitado': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'aprovado': return 'rgba(16, 185, 129, 0.2)';
      case 'pendente': return 'rgba(245, 158, 11, 0.2)';
      case 'rejeitado': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
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

  &:hover {
    background: #ffffff;
    color: #1a1a1a;
    transform: translateY(-2px);
  }
`;

const LeadsSpreadsheet = ({ 
  onLeadFormOpen,
  onEditLead,
  onDeleteLead
}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLead = async (lead) => {
    try {
      await updateData('leads', lead.id, { status: 'aprovado' });
      toast.success('Lead aprovado com sucesso!');
      fetchLeads();
    } catch (error) {
      toast.error('Erro ao aprovar lead');
    }
  };

  const handleRejectLead = async (lead) => {
    try {
      await updateData('leads', lead.id, { status: 'rejeitado' });
      toast.success('Lead rejeitado com sucesso!');
      fetchLeads();
    } catch (error) {
      toast.error('Erro ao rejeitar lead');
    }
  };

  const stats = {
    total: leads.length,
    quentes: leads.filter(l => l.temperatura === 'quente').length,
    frios: leads.filter(l => l.temperatura === 'frio').length,
    aprovados: leads.filter(l => l.status === 'aprovado').length,
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#a0a0a0' }}>Carregando leads...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <Users size={28} />
          </HeaderIcon>
          <div>
            <HeaderTitle>👥 Leads</HeaderTitle>
            <HeaderSubtitle>Gestão de leads e prospecção</HeaderSubtitle>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton 
            onClick={fetchLeads}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Atualizar planilha"
          >
            <RefreshCw size={16} />
            Atualizar
          </ActionButton>
          <ActionButton 
            variant="primary"
            onClick={onLeadFormOpen}
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
              Total
            </StatTitle>
            <StatIcon>
              <Users size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.total}</StatValue>
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
              Quentes
            </StatTitle>
            <StatIcon>
              <Flame size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.quentes}</StatValue>
          <StatSubtitle>Alto potencial</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>
              <Snowflake size={16} />
              Frios
            </StatTitle>
            <StatIcon>
              <Snowflake size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.frios}</StatValue>
          <StatSubtitle>Baixo potencial</StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>
              <CheckCircle size={16} />
              Aprovados
            </StatTitle>
            <StatIcon>
              <CheckCircle size={16} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.aprovados}</StatValue>
          <StatSubtitle>Leads aprovados</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <TableContainer>
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
              <Phone size={14} />
              {lead.telefone}
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
                <ActionBtn onClick={() => onEditLead(lead)}>
                  <Edit size={12} />
                </ActionBtn>
                <ActionBtn onClick={() => onDeleteLead(lead)}>
                  <Trash2 size={12} />
                </ActionBtn>
              </ActionButtons>
            </TableCell>
          </TableRow>
        ))}
      </TableContainer>
    </Container>
  );
};

export default LeadsSpreadsheet;

