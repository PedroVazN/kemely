import React, { useState } from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { GlobalStyle, Container, Title, Grid } from './styles/GlobalStyles';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SpreadsheetSummary from './components/SpreadsheetSummary';
import CorretoraSpreadsheet from './components/CorretoraSpreadsheet';
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

  const renderContent = () => {
    if (isCorretoraMode) {
      return <CorretoraSpreadsheet />;
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
    </AppContainer>
  );
};

export default App;
