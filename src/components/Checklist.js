import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ChecklistContainer = styled.div`
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
      rgba(59, 130, 246, 0.8) 0%, 
      rgba(59, 130, 246, 0.4) 50%, 
      rgba(59, 130, 246, 0.8) 100%);
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
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

const AddTaskForm = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(59, 130, 246, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const AddButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
    border-color: rgba(59, 130, 246, 0.4);
  }
`;

const CheckboxButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$completed ? '#10b981' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: ${props => props.$completed ? '#059669' : '#3b82f6'};
    transform: scale(1.1);
  }
`;

const TaskText = styled.span`
  flex: 1;
  color: ${props => props.$completed ? 'rgba(255, 255, 255, 0.5)' : '#ffffff'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  font-size: 0.95rem;
  font-weight: 500;
`;

const TaskDate = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DeleteButton = styled.button`
  background: none;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  padding: 20px;
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color || '#ffffff'};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Checklist = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('checklist_tasks')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      toast.error('Digite uma tarefa');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('checklist_tasks')
        .insert([
          {
            task: newTask.trim(),
            completed: false,
            date: format(new Date(), 'yyyy-MM-dd')
          }
        ])
        .select();

      if (error) throw error;

      setTasks([data[0], ...tasks]);
      setNewTask('');
      toast.success('Tarefa adicionada!');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      toast.error('Erro ao adicionar tarefa');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const { error } = await supabase
        .from('checklist_tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ));
      
      toast.success(task.completed ? 'Tarefa desmarcada' : 'Tarefa concluída!');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('checklist_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Tarefa excluída');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <ChecklistContainer>
      <Header>
        <HeaderLeft>
          <HeaderIcon>
            <CheckCircle size={32} />
          </HeaderIcon>
          <HeaderInfo>
            <HeaderTitle>Checklist Diário</HeaderTitle>
            <HeaderSubtitle>Tarefas de hoje - {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</HeaderSubtitle>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderRight>
          <ActionButton
            onClick={fetchTasks}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Atualizar
          </ActionButton>
        </HeaderRight>
      </Header>

      <StatsBar>
        <StatCard>
          <StatValue color="#3b82f6">{stats.total}</StatValue>
          <StatLabel>Total</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#10b981">{stats.completed}</StatValue>
          <StatLabel>Concluídas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#f59e0b">{stats.pending}</StatValue>
          <StatLabel>Pendentes</StatLabel>
        </StatCard>
      </StatsBar>

      <AddTaskForm>
        <Input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <AddButton
          onClick={handleAddTask}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Adicionar
        </AddButton>
      </AddTaskForm>

      <TaskList>
        {loading ? (
          <EmptyState>Carregando...</EmptyState>
        ) : tasks.length === 0 ? (
          <EmptyState>Nenhuma tarefa para hoje. Adicione uma nova!</EmptyState>
        ) : (
          <AnimatePresence>
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <CheckboxButton
                  $completed={task.completed}
                  onClick={() => handleToggleTask(task)}
                >
                  {task.completed ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </CheckboxButton>
                <TaskText $completed={task.completed}>
                  {task.task}
                </TaskText>
                <TaskDate>
                  <Clock size={14} />
                  {format(new Date(task.created_at), 'HH:mm', { locale: ptBR })}
                </TaskDate>
                <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                  <Trash2 size={16} />
                </DeleteButton>
              </TaskItem>
            ))}
          </AnimatePresence>
        )}
      </TaskList>
    </ChecklistContainer>
  );
};

export default Checklist;

