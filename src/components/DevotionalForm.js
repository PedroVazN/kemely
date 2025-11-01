import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Clock, BookOpen, Book, Heart, Check } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { insertData, updateData } from '../lib/database-setup';

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

const FormContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContent = styled.div`
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 700px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
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
`;

const FormHeader = styled.div`
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

const FormTitle = styled.h2`
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const Select = styled.select`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  option {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #ffd700;
`;

const CheckboxLabel = styled.label`
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.variant === 'primary' 
    ? '#1a1a1a' 
    : '#ffffff'};
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'rgba(255, 215, 0, 0.3)' 
    : 'rgba(255, 255, 255, 0.2)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  animation: fadeInUp 0.4s ease-out;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  animation: fadeInUp 0.4s ease-out;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const DayButton = styled.button`
  padding: 12px 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(26, 26, 26, 0.6)'};
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 0.875rem;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.4);
  }
`;

const DevotionalForm = ({ isOpen, onClose, onPlanAdded, editingItem, currentWeek }) => {
  // Função para obter a data local no formato YYYY-MM-DD
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    type: 'fasting',
    date: getLocalDateString(),
    data_inicio: '',
    data_termino: '',
    time: '',
    fast_type: '',
    duration: '',
    purpose: '',
    theme: '',
    book_chapter: '',
    verses: '',
    activity: '',
    status: 'pending',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('fasting');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Função para obter a data padrão ao abrir o formulário
  const getDefaultDate = () => {
    const today = new Date();
    const todayFormatted = format(today, 'yyyy-MM-dd');
    
    // Verifica se hoje está na semana atual sendo visualizada
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    if (today >= weekStart && today <= weekEnd) {
      return todayFormatted;
    }
    
    // Se não, retorna o primeiro dia da semana (segunda-feira)
    return format(weekStart, 'yyyy-MM-dd');
  };

  useEffect(() => {
    if (isOpen && !editingItem) {
      // Quando o formulário abre sem item para editar, define a data padrão
      const defaultDate = getDefaultDate();
      setFormData(prev => ({
        ...prev,
        date: defaultDate
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem, currentWeek]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || 'fasting',
        date: editingItem.date || getDefaultDate(),
        data_inicio: editingItem.data_inicio || '',
        data_termino: editingItem.data_termino || '',
        time: editingItem.time || '',
        fast_type: editingItem.fast_type || '',
        duration: editingItem.duration || '',
        purpose: editingItem.purpose || '',
        theme: editingItem.theme || '',
        book_chapter: editingItem.book_chapter || '',
        verses: editingItem.verses || '',
        activity: editingItem.activity || '',
        status: editingItem.status || 'pending',
        notes: editingItem.notes || ''
      });
      setActiveTab(editingItem.type || 'fasting');
    } else {
      setFormData({
        type: 'fasting',
        date: getDefaultDate(),
        data_inicio: '',
        data_termino: '',
        time: '',
        fast_type: '',
        duration: '',
        purpose: '',
        theme: '',
        book_chapter: '',
        verses: '',
        activity: '',
        status: 'pending',
        notes: ''
      });
      setActiveTab('fasting');
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDaySelect = (day) => {
    setFormData(prev => ({
      ...prev,
      date: format(day, 'yyyy-MM-dd')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');

      const tableMap = {
        fasting: 'devotional_fasting',
        prayer: 'devotional_prayer',
        bible: 'devotional_bible_study',
        worship: 'devotional_worship'
      };

      // Filtrar campos específicos para cada tipo de tabela
      let dataToInsert = {};

      if (activeTab === 'fasting') {
        dataToInsert = {
          date: formData.data_inicio || formData.date,
          fast_type: formData.fast_type,
          duration: formData.duration ? parseInt(formData.duration) : null,
          purpose: formData.purpose || null,
          status: formData.status,
          notes: formData.notes || null
        };
      } else if (activeTab === 'prayer') {
        dataToInsert = {
          date: formData.data_inicio || formData.date,
          time: formData.time,
          theme: formData.theme,
          duration: formData.duration ? parseInt(formData.duration) : null,
          status: formData.status,
          notes: formData.notes || null
        };
      } else if (activeTab === 'bible') {
        dataToInsert = {
          week_start: formData.data_inicio || formData.date,
          theme: formData.theme,
          book_chapter: formData.book_chapter,
          verses: formData.verses || null,
          status: formData.status,
          notes: formData.notes || null
        };
      } else if (activeTab === 'worship') {
        dataToInsert = {
          date: formData.data_inicio || formData.date,
          time: formData.time,
          activity: formData.activity,
          duration: formData.duration ? parseInt(formData.duration) : null,
          status: formData.status,
          notes: formData.notes || null
        };
      }

      if (editingItem) {
        await updateData(tableMap[activeTab], editingItem.id, dataToInsert);
        setMessage('Planejamento devocional atualizado com sucesso!');
      } else {
        await insertData(tableMap[activeTab], dataToInsert);
        setMessage('Planejamento devocional criado com sucesso!');
      }
      
      onPlanAdded();
      
      // Fechar o formulário após 1.5 segundos de sucesso
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage('Erro ao salvar planejamento devocional');
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    const typeMap = {
      fasting: 'Jejum',
      prayer: 'Oração',
      bible: 'Estudo Bíblico',
      worship: 'Adoração'
    };
    return editingItem ? `Editar ${typeMap[activeTab]}` : `Novo ${typeMap[activeTab]}`;
  };

  const getFormIcon = () => {
    const iconMap = {
      fasting: <Clock size={24} />,
      prayer: <BookOpen size={24} />,
      bible: <Book size={24} />,
      worship: <Heart size={24} />
    };
    return iconMap[activeTab];
  };

  if (!isOpen) return null;

  return (
    <FormContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <FormContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <FormHeader>
          <FormTitle>
            {getFormIcon()}
            {getFormTitle()}
          </FormTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Tipo de Planejamento Devocional</Label>
            <Select
              name="type"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              required
            >
              <option value="fasting">Jejum</option>
              <option value="prayer">Oração</option>
              <option value="bible">Estudo Bíblico</option>
              <option value="worship">Adoração</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Data de Início</Label>
            <Input
              type="date"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Data de Término</Label>
            <Input
              type="date"
              name="data_termino"
              value={formData.data_termino}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {activeTab === 'fasting' && (
            <>
              <FormGroup>
                <Label>Tipo de Jejum</Label>
                <Select
                  name="fast_type"
                  value={formData.fast_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="completo">Jejum Completo</option>
                  <option value="parcial">Jejum Parcial</option>
                  <option value="daniel">Jejum de Daniel</option>
                  <option value="liquido">Jejum Líquido</option>
                  <option value="tecnologico">Jejum Tecnológico</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Duração (horas)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 12, 24, 48"
                  min="1"
                  max="168"
                />
              </FormGroup>
              <FormGroup>
                <Label>Propósito do Jejum</Label>
                <TextArea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Descreva o propósito espiritual do jejum..."
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'prayer' && (
            <>
              <FormGroup>
                <Label>Horário</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Tema da Oração</Label>
                <Input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="Ex: Gratidão, Intercessão, Adoração..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 15, 30, 60"
                  min="1"
                  max="480"
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'bible' && (
            <>
              <FormGroup>
                <Label>Tema do Estudo</Label>
                <Input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="Ex: Fé, Esperança, Amor, Perdão..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Livro e Capítulo</Label>
                <Input
                  type="text"
                  name="book_chapter"
                  value={formData.book_chapter}
                  onChange={handleChange}
                  placeholder="Ex: João 3, Salmos 23, Romanos 8"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Versículos</Label>
                <Input
                  type="text"
                  name="verses"
                  value={formData.verses}
                  onChange={handleChange}
                  placeholder="Ex: 1-17, 16-21, 1-10"
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'worship' && (
            <>
              <FormGroup>
                <Label>Horário</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Atividade de Adoração</Label>
                <Select
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="musica">Música e Cânticos</option>
                  <option value="meditacao">Meditação</option>
                  <option value="gratidao">Momento de Gratidão</option>
                  <option value="testemunho">Testemunho</option>
                  <option value="leitura">Leitura Devocional</option>
                  <option value="silencioso">Adoração Silenciosa</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 20, 30, 45"
                  min="1"
                  max="180"
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Status</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <TextArea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Adicione observações importantes sobre este planejamento devocional..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Salvando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {editingItem ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </Button>
          </ButtonGroup>

          {message && (
            message.includes('sucesso') ? 
              <SuccessMessage>{message}</SuccessMessage> : 
              <ErrorMessage>{message}</ErrorMessage>
          )}
        </Form>
      </FormContent>
    </FormContainer>
  );
};

export default DevotionalForm;
