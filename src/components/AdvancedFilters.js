import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Input, Button, Card, Flex, Badge } from '../styles/GlobalStyles';

const FiltersContainer = styled(Card)`
  margin-bottom: 24px;
  padding: 20px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  grid-column: 1 / -1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff;
  z-index: 1;
`;

const FilterActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ffffff;
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #c0392b;
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
`;

const DateSeparator = styled.span`
  color: #7f8c8d;
  font-weight: 600;
`;

const AdvancedFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Casa', 'Devedor', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros']
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.search) active.push(`Busca: "${filters.search}"`);
    if (filters.type) active.push(`Tipo: ${filters.type === 'income' ? 'Receita' : 'Despesa'}`);
    if (filters.category) active.push(`Categoria: ${filters.category}`);
    if (filters.dateFrom) active.push(`De: ${filters.dateFrom}`);
    if (filters.dateTo) active.push(`Até: ${filters.dateTo}`);
    if (filters.amountMin) active.push(`Valor min: R$ ${filters.amountMin}`);
    if (filters.amountMax) active.push(`Valor max: R$ ${filters.amountMax}`);
    return active;
  };

  return (
    <FiltersContainer>
      <Flex>
        <Filter size={20} color="#667eea" />
        <h3 style={{ margin: 0, color: '#2c3e50' }}>Filtros Avançados</h3>
        {getActiveFiltersCount() > 0 && (
          <Badge variant="success">
            {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
          </Badge>
        )}
      </Flex>

      <FilterRow>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <Input
            type="text"
            placeholder="Buscar por descrição..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ paddingLeft: '45px' }}
          />
        </SearchContainer>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#2c3e50', textTransform: 'uppercase' }}>
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer'
            }}
          >
            <option value="">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#2c3e50', textTransform: 'uppercase' }}>
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer'
            }}
          >
            <option value="">Todas as categorias</option>
            {filters.type === 'income' ? 
              categories.income.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              )) :
              filters.type === 'expense' ?
              categories.expense.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              )) :
              [...categories.income, ...categories.expense].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#2c3e50', textTransform: 'uppercase' }}>
            Período
          </label>
          <DateRangeContainer>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              placeholder="Data inicial"
            />
            <DateSeparator>até</DateSeparator>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              placeholder="Data final"
            />
          </DateRangeContainer>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#2c3e50', textTransform: 'uppercase' }}>
            Valor
          </label>
          <DateRangeContainer>
            <Input
              type="number"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e.target.value)}
              placeholder="Valor mínimo"
              step="0.01"
              min="0"
            />
            <DateSeparator>até</DateSeparator>
            <Input
              type="number"
              value={filters.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e.target.value)}
              placeholder="Valor máximo"
              step="0.01"
              min="0"
            />
          </DateRangeContainer>
        </div>
      </FilterRow>

      <FilterActions>
        <ActiveFilters>
          {getActiveFilters().map((filter, index) => (
            <Badge key={index} variant="success">
              {filter}
            </Badge>
          ))}
        </ActiveFilters>
        
        {getActiveFiltersCount() > 0 && (
          <ClearButton onClick={handleClearFilters}>
            <X size={14} style={{ marginRight: '4px' }} />
            Limpar filtros
          </ClearButton>
        )}
      </FilterActions>
    </FiltersContainer>
  );
};

export default AdvancedFilters;
