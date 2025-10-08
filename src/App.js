import React, { useState } from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyle, Container, Title, Grid } from './styles/GlobalStyles';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SpreadsheetSummary from './components/SpreadsheetSummary';
import CorretoraSpreadsheet from './components/CorretoraSpreadsheet';
import FitnessSpreadsheet from './components/FitnessSpreadsheet';
import WeeklyMetrics from './components/WeeklyMetrics';
import WeeklyPlanForm from './components/WeeklyPlanForm';
import EditWeeklyPlanModal from './components/EditWeeklyPlanModal';
import DevotionalPlanner from './components/DevotionalPlanner';
import DevotionalForm from './components/DevotionalForm';
import EditDevotionalModal from './components/EditDevotionalModal';
import FitnessForm from './components/FitnessForm';
import EditFitnessModal from './components/EditFitnessModal';
import LeadForm from './components/LeadForm';
import AppointmentForm from './components/AppointmentForm';
import CommissionForm from './components/CommissionForm';
import EditLeadModal from './components/EditLeadModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import HomePage from './components/HomePage';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinancialSummary from './components/FinancialSummary';
import Charts from './components/Charts';
import AdvancedFilters from './components/AdvancedFilters';
import ExportData from './components/ExportData';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(29, 78, 216, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const HeaderSection = styled.header`
  text-align: center;
  padding: 60px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 1s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
`;

const MainContent = styled.main`
  padding: 0 24px;
  position: relative;
  z-index: 1;
`;

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [isCorretoraMode, setIsCorretoraMode] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  
  // Estados para modais de métricas semanais
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);
  const [showEditWeeklyModal, setShowEditWeeklyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Estados para modais de devocional
  const [showDevotionalForm, setShowDevotionalForm] = useState(false);
  const [showEditDevotionalModal, setShowEditDevotionalModal] = useState(false);
  const [showDevotionalDeleteModal, setShowDevotionalDeleteModal] = useState(false);
  const [editingDevotionalItem, setEditingDevotionalItem] = useState(null);
  const [selectedDevotionalItem, setSelectedDevotionalItem] = useState(null);
  const [devotionalDeleteType, setDevotionalDeleteType] = useState('');
  const [devotionalCurrentWeek, setDevotionalCurrentWeek] = useState(new Date());
  
  // Estados para modais de fitness
  const [showFitnessForm, setShowFitnessForm] = useState(false);
  const [showEditFitnessModal, setShowEditFitnessModal] = useState(false);
  const [showFitnessDeleteModal, setShowFitnessDeleteModal] = useState(false);
  const [editingFitnessItem, setEditingFitnessItem] = useState(null);
  const [selectedFitnessItem, setSelectedFitnessItem] = useState(null);
  const [fitnessDeleteType, setFitnessDeleteType] = useState('');
  
  // Estados para modais da corretora
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showCommissionForm, setShowCommissionForm] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [showCorretoraDeleteModal, setShowCorretoraDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [corretoraDeleteType, setCorretoraDeleteType] = useState('');

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTransactionDeleted = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowFilters(false);
    setShowExport(false);
    setShowCharts(false);
  };

  const handleAddTransaction = () => {
    setActiveTab('transactions');
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = () => {
    setShowExport(!showExport);
  };

  const handleShowCharts = () => {
    setShowCharts(!showCharts);
  };

  const handleToggleMode = () => {
    setIsCorretoraMode(!isCorretoraMode);
    setActiveTab('dashboard');
    setShowFilters(false);
    setShowExport(false);
    setShowCharts(false);
  };

  const handleEnterApp = () => {
    setShowHomePage(false);
  };

  // Funções para gerenciar modais de métricas semanais
  const handleWeeklyFormOpen = () => {
    setShowWeeklyForm(true);
  };

  const handleWeeklyFormClose = () => {
    setShowWeeklyForm(false);
    setEditingItem(null);
  };

  const handleWeeklyFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowWeeklyForm(false);
    setEditingItem(null);
  };

  const handleEditWeekly = (item) => {
    setEditingItem(item);
    setShowEditWeeklyModal(true);
  };

  const handleEditWeeklyClose = () => {
    setShowEditWeeklyModal(false);
    setEditingItem(null);
  };

  const handleEditWeeklySubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowEditWeeklyModal(false);
    setEditingItem(null);
  };

  const handleDeleteWeekly = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { supabase } = await import('./lib/supabase');
      const tableMap = {
        plan: 'weekly_plans',
        goal: 'weekly_goals',
        task: 'weekly_tasks'
      };

      const { error } = await supabase
        .from(tableMap[deleteType])
        .delete()
        .eq('id', selectedItem.id);

      if (error) throw error;

      setRefreshKey(prev => prev + 1);
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteType('');
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
    setDeleteType('');
  };

  // Funções para gerenciar modais de devocional
  const handleDevotionalFormOpen = () => {
    setShowDevotionalForm(true);
  };

  const handleDevotionalFormClose = () => {
    setShowDevotionalForm(false);
    setEditingDevotionalItem(null);
  };

  const handleDevotionalFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowDevotionalForm(false);
    setEditingDevotionalItem(null);
  };

  const handleEditDevotional = (item) => {
    setEditingDevotionalItem(item);
    setShowEditDevotionalModal(true);
  };

  const handleEditDevotionalClose = () => {
    setShowEditDevotionalModal(false);
    setEditingDevotionalItem(null);
  };

  const handleEditDevotionalSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowEditDevotionalModal(false);
    setEditingDevotionalItem(null);
  };

  const handleDeleteDevotional = (item, type) => {
    setSelectedDevotionalItem(item);
    setDevotionalDeleteType(type);
    setShowDevotionalDeleteModal(true);
  };

  const handleDevotionalDeleteConfirm = async () => {
    try {
      const { supabase } = await import('./lib/supabase');
      const tableMap = {
        fasting: 'devotional_fasting',
        prayer: 'devotional_prayer',
        bible: 'devotional_bible_study',
        worship: 'devotional_worship'
      };

      const { error } = await supabase
        .from(tableMap[devotionalDeleteType])
        .delete()
        .eq('id', selectedDevotionalItem.id);

      if (error) throw error;

      setRefreshKey(prev => prev + 1);
      setShowDevotionalDeleteModal(false);
      setSelectedDevotionalItem(null);
      setDevotionalDeleteType('');
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleDevotionalDeleteClose = () => {
    setShowDevotionalDeleteModal(false);
    setSelectedDevotionalItem(null);
    setDevotionalDeleteType('');
  };

  // Handlers para modais de fitness
  const handleFitnessFormOpen = () => {
    setShowFitnessForm(true);
  };

  const handleFitnessFormClose = () => {
    setShowFitnessForm(false);
    setEditingFitnessItem(null);
  };

  const handleFitnessFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowFitnessForm(false);
    setEditingFitnessItem(null);
  };

  const handleEditFitness = (item) => {
    setEditingFitnessItem(item);
    setShowEditFitnessModal(true);
  };

  const handleEditFitnessClose = () => {
    setShowEditFitnessModal(false);
    setEditingFitnessItem(null);
  };

  const handleEditFitnessSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowEditFitnessModal(false);
    setEditingFitnessItem(null);
  };

  const handleDeleteFitness = (item, type) => {
    setSelectedFitnessItem(item);
    setFitnessDeleteType(type);
    setShowFitnessDeleteModal(true);
  };

  const handleFitnessDeleteConfirm = async () => {
    try {
      const { supabase } = await import('./lib/supabase');
      const tableMap = {
        workout: 'fitness_workouts',
        meal: 'fitness_meals',
        water: 'fitness_water',
        sleep: 'fitness_sleep'
      };

      const { error } = await supabase
        .from(tableMap[fitnessDeleteType])
        .delete()
        .eq('id', selectedFitnessItem.id);

      if (error) throw error;

      setRefreshKey(prev => prev + 1);
      setShowFitnessDeleteModal(false);
      setSelectedFitnessItem(null);
      setFitnessDeleteType('');
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleFitnessDeleteClose = () => {
    setShowFitnessDeleteModal(false);
    setSelectedFitnessItem(null);
    setFitnessDeleteType('');
  };

  // Handlers para modais da corretora
  const handleLeadFormOpen = () => {
    setShowLeadForm(true);
  };

  const handleLeadFormClose = () => {
    setShowLeadForm(false);
  };

  const handleLeadFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowLeadForm(false);
  };

  const handleAppointmentFormOpen = () => {
    setShowAppointmentForm(true);
  };

  const handleAppointmentFormClose = () => {
    setShowAppointmentForm(false);
  };

  const handleAppointmentFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowAppointmentForm(false);
  };

  const handleCommissionFormOpen = () => {
    setShowCommissionForm(true);
  };

  const handleCommissionFormClose = () => {
    setShowCommissionForm(false);
  };

  const handleCommissionFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowCommissionForm(false);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowEditLeadModal(true);
  };

  const handleEditLeadClose = () => {
    setShowEditLeadModal(false);
    setSelectedLead(null);
  };

  const handleEditLeadSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setShowEditLeadModal(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (lead) => {
    setSelectedLead(lead);
    setSelectedAppointment(null);
    setSelectedCommission(null);
    setCorretoraDeleteType('lead');
    setShowCorretoraDeleteModal(true);
  };

  const handleDeleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedLead(null);
    setSelectedCommission(null);
    setCorretoraDeleteType('appointment');
    setShowCorretoraDeleteModal(true);
  };

  const handleDeleteCommission = (commission) => {
    setSelectedCommission(commission);
    setSelectedLead(null);
    setSelectedAppointment(null);
    setCorretoraDeleteType('commission');
    setShowCorretoraDeleteModal(true);
  };

  const handleCorretoraDeleteConfirm = async () => {
    try {
      const { supabase } = await import('./lib/supabase');
      const tableMap = {
        lead: 'leads',
        appointment: 'appointments',
        commission: 'commissions'
      };

      const { error } = await supabase
        .from(tableMap[corretoraDeleteType])
        .delete()
        .eq('id', selectedLead?.id || selectedAppointment?.id || selectedCommission?.id);

      if (error) throw error;

      setRefreshKey(prev => prev + 1);
      setShowCorretoraDeleteModal(false);
      setSelectedLead(null);
      setSelectedAppointment(null);
      setSelectedCommission(null);
      setCorretoraDeleteType('');
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleCorretoraDeleteClose = () => {
    setShowCorretoraDeleteModal(false);
    setSelectedLead(null);
    setSelectedAppointment(null);
    setSelectedCommission(null);
    setCorretoraDeleteType('');
  };

  const renderContent = () => {
    if (isCorretoraMode) {
      return (
        <CorretoraSpreadsheet
          onLeadFormOpen={handleLeadFormOpen}
          onAppointmentFormOpen={handleAppointmentFormOpen}
          onCommissionFormOpen={handleCommissionFormOpen}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          onDeleteAppointment={handleDeleteAppointment}
          onDeleteCommission={handleDeleteCommission}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <SpreadsheetSummary />
            <Dashboard />
          </>
        );
      case 'transactions':
        return (
          <Grid>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <TransactionList 
              onTransactionDeleted={handleTransactionDeleted}
              filters={filters}
              key={refreshKey}
            />
          </Grid>
        );
      case 'fitness':
        return (
          <FitnessSpreadsheet
            onFormOpen={handleFitnessFormOpen}
            onEdit={handleEditFitness}
            onDelete={handleDeleteFitness}
          />
        );
      case 'metrics':
        return (
          <WeeklyMetrics 
            onFormOpen={handleWeeklyFormOpen}
            onEdit={handleEditWeekly}
            onDelete={handleDeleteWeekly}
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />
        );
      case 'devotional':
        return (
          <DevotionalPlanner 
            onFormOpen={handleDevotionalFormOpen}
            onEdit={handleEditDevotional}
            onDelete={handleDeleteDevotional}
            currentWeek={devotionalCurrentWeek}
            onWeekChange={setDevotionalCurrentWeek}
          />
        );
      case 'charts':
        return <Charts key={refreshKey} />;
      case 'reports':
        return <ExportData />;
      default:
        return (
          <>
            <SpreadsheetSummary />
            <Dashboard />
          </>
        );
    }
  };

  if (showHomePage) {
    return (
      <AppContainer>
        <GlobalStyle />
        <HomePage onEnterApp={handleEnterApp} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
            },
          }}
        />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
          },
        }}
      />
      
      <Header
        onAddTransaction={handleAddTransaction}
        onShowFilters={handleShowFilters}
        onExport={handleExport}
        onShowCharts={handleShowCharts}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onToggleMode={handleToggleMode}
        isCorretoraMode={isCorretoraMode}
      />
      
      <MainContent>
        <Container>
          {showFilters && (
            <AdvancedFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          )}
          
          {showExport && <ExportData />}
          
          {showCharts && <Charts key={refreshKey} />}
          
          {renderContent()}
        </Container>
      </MainContent>

      {/* Modais de Métricas Semanais */}
      <AnimatePresence>
        {showWeeklyForm && (
          <WeeklyPlanForm
            isOpen={showWeeklyForm}
            onClose={handleWeeklyFormClose}
            onPlanAdded={handleWeeklyFormSubmit}
            editingItem={editingItem}
            currentWeek={currentWeek}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditWeeklyModal && (
          <EditWeeklyPlanModal
            isOpen={showEditWeeklyModal}
            onClose={handleEditWeeklyClose}
            onPlanUpdated={handleEditWeeklySubmit}
            editingItem={editingItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={handleDeleteClose}
            onConfirm={handleDeleteConfirm}
            itemType={deleteType}
            itemName={selectedItem?.activity || selectedItem?.goal_name || selectedItem?.task_name}
          />
        )}
      </AnimatePresence>

      {/* Modais de Devocional */}
      <AnimatePresence>
        {showDevotionalForm && (
          <DevotionalForm
            isOpen={showDevotionalForm}
            onClose={handleDevotionalFormClose}
            onPlanAdded={handleDevotionalFormSubmit}
            editingItem={editingDevotionalItem}
            currentWeek={devotionalCurrentWeek}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDevotionalModal && (
          <EditDevotionalModal
            isOpen={showEditDevotionalModal}
            onClose={handleEditDevotionalClose}
            onPlanUpdated={handleEditDevotionalSubmit}
            editingItem={editingDevotionalItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDevotionalDeleteModal && (
          <DeleteConfirmModal
            isOpen={showDevotionalDeleteModal}
            onClose={handleDevotionalDeleteClose}
            onConfirm={handleDevotionalDeleteConfirm}
            itemType={devotionalDeleteType}
            itemName={selectedDevotionalItem?.fast_type || selectedDevotionalItem?.theme || selectedDevotionalItem?.activity}
          />
        )}
      </AnimatePresence>

      {/* Modais de Fitness */}
      <AnimatePresence>
        {showFitnessForm && (
          <FitnessForm
            isOpen={showFitnessForm}
            onClose={handleFitnessFormClose}
            onFitnessAdded={handleFitnessFormSubmit}
            editingItem={editingFitnessItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditFitnessModal && (
          <EditFitnessModal
            isOpen={showEditFitnessModal}
            onClose={handleEditFitnessClose}
            onFitnessUpdated={handleEditFitnessSubmit}
            editingItem={editingFitnessItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFitnessDeleteModal && (
          <DeleteConfirmModal
            isOpen={showFitnessDeleteModal}
            onClose={handleFitnessDeleteClose}
            onConfirm={handleFitnessDeleteConfirm}
            itemType={fitnessDeleteType}
            itemName={selectedFitnessItem?.exercise || selectedFitnessItem?.meal_type || selectedFitnessItem?.amount || selectedFitnessItem?.hours}
          />
        )}
      </AnimatePresence>

      {/* Modais da Corretora */}
      <AnimatePresence>
        {showLeadForm && (
          <LeadForm
            isOpen={showLeadForm}
            onClose={handleLeadFormClose}
            onLeadAdded={handleLeadFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAppointmentForm && (
          <AppointmentForm
            isOpen={showAppointmentForm}
            onClose={handleAppointmentFormClose}
            onAppointmentAdded={handleAppointmentFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCommissionForm && (
          <CommissionForm
            isOpen={showCommissionForm}
            onClose={handleCommissionFormClose}
            onCommissionAdded={handleCommissionFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditLeadModal && (
          <EditLeadModal
            isOpen={showEditLeadModal}
            onClose={handleEditLeadClose}
            lead={selectedLead}
            onLeadUpdated={handleEditLeadSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCorretoraDeleteModal && (
          <DeleteConfirmModal
            isOpen={showCorretoraDeleteModal}
            onClose={handleCorretoraDeleteClose}
            onConfirm={handleCorretoraDeleteConfirm}
            title={`Excluir ${corretoraDeleteType === 'lead' ? 'Lead' : corretoraDeleteType === 'appointment' ? 'Agendamento' : 'Comissão'}`}
            itemName={selectedLead?.nome || selectedAppointment?.cliente || selectedCommission?.cliente}
            itemType={corretoraDeleteType}
          />
        )}
      </AnimatePresence>
    </AppContainer>
  );
};

export default App;
