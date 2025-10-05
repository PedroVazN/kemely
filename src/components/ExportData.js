import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button, Card, Flex } from '../styles/GlobalStyles';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportContainer = styled(Card)`
  margin-bottom: 24px;
  padding: 20px;
`;

const ExportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ExportButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 16px 20px;
  font-size: 14px;
  background: ${props => props.variant === 'pdf' ? 
    'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' :
    props.variant === 'csv' ?
    'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' :
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  box-shadow: ${props => props.variant === 'pdf' ? 
    '0 8px 25px rgba(231, 76, 60, 0.3)' :
    props.variant === 'csv' ?
    '0 8px 25px rgba(39, 174, 96, 0.3)' :
    '0 8px 25px rgba(102, 126, 234, 0.3)'
  };

  &:hover {
    box-shadow: ${props => props.variant === 'pdf' ? 
      '0 12px 35px rgba(231, 76, 60, 0.4)' :
      props.variant === 'csv' ?
      '0 12px 35px rgba(39, 174, 96, 0.4)' :
      '0 12px 35px rgba(102, 126, 234, 0.4)'
    };
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const DateSeparator = styled.span`
  color: #7f8c8d;
  font-weight: 600;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const ExportData = () => {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    let query = supabase.from('transactions').select('*');
    
    if (dateRange.from) {
      query = query.gte('date', dateRange.from);
    }
    if (dateRange.to) {
      query = query.lte('date', dateRange.to);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const transactions = await fetchTransactions();
      
      const csvContent = [
        ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor (R$)'],
        ...transactions.map(t => [
          format(new Date(t.date), 'dd/MM/yyyy', { locale: ptBR }),
          t.description,
          t.type === 'income' ? 'Receita' : 'Despesa',
          t.category,
          t.amount.toFixed(2)
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transacoes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const transactions = await fetchTransactions();
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setTextColor(102, 126, 234);
      pdf.text('Relatório Financeiro - Kemely', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Período: ${dateRange.from || 'Início'} até ${dateRange.to || 'Hoje'}`, pageWidth / 2, 45, { align: 'center' });
      pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, 55, { align: 'center' });
      
      // Resumo
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpense;
      
      pdf.setFontSize(14);
      pdf.text('RESUMO FINANCEIRO', 20, 75);
      
      pdf.setFontSize(12);
      pdf.text(`Total de Receitas: R$ ${totalIncome.toFixed(2)}`, 20, 90);
      pdf.text(`Total de Despesas: R$ ${totalExpense.toFixed(2)}`, 20, 100);
      pdf.text(`Saldo: R$ ${balance.toFixed(2)}`, 20, 110);
      pdf.text(`Total de Transações: ${transactions.length}`, 20, 120);
      
      // Tabela de transações
      pdf.setFontSize(14);
      pdf.text('TRANSAÇÕES', 20, 140);
      
      let yPosition = 155;
      const lineHeight = 8;
      
      // Cabeçalho da tabela
      pdf.setFontSize(10);
      pdf.text('Data', 20, yPosition);
      pdf.text('Descrição', 50, yPosition);
      pdf.text('Tipo', 120, yPosition);
      pdf.text('Categoria', 140, yPosition);
      pdf.text('Valor', 170, yPosition);
      
      yPosition += lineHeight;
      
      // Linha separadora
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      
      // Dados das transações
      transactions.forEach((transaction, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR }), 20, yPosition);
        pdf.text(transaction.description.substring(0, 20), 50, yPosition);
        pdf.text(transaction.type === 'income' ? 'Receita' : 'Despesa', 120, yPosition);
        pdf.text(transaction.category, 140, yPosition);
        pdf.text(`R$ ${transaction.amount.toFixed(2)}`, 170, yPosition);
        
        yPosition += lineHeight;
      });
      
      pdf.save(`relatorio_financeiro_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const exportSummary = async () => {
    setLoading(true);
    try {
      const transactions = await fetchTransactions();
      
      const summary = {
        periodo: {
          inicio: dateRange.from || 'Início',
          fim: dateRange.to || 'Hoje'
        },
        resumo: {
          totalReceitas: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          totalDespesas: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          saldo: 0,
          totalTransacoes: transactions.length
        },
        categorias: {}
      };
      
      summary.resumo.saldo = summary.resumo.totalReceitas - summary.resumo.totalDespesas;
      
      // Agrupar por categoria
      transactions.forEach(t => {
        if (!summary.categorias[t.category]) {
          summary.categorias[t.category] = { receitas: 0, despesas: 0 };
        }
        summary.categorias[t.category][t.type === 'income' ? 'receitas' : 'despesas'] += t.amount;
      });
      
      const summaryText = `
RELATÓRIO FINANCEIRO - KEMELY
==============================

Período: ${summary.periodo.inicio} até ${summary.periodo.fim}
Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}

RESUMO GERAL
------------
Total de Receitas: R$ ${summary.resumo.totalReceitas.toFixed(2)}
Total de Despesas: R$ ${summary.resumo.totalDespesas.toFixed(2)}
Saldo: R$ ${summary.resumo.saldo.toFixed(2)}
Total de Transações: ${summary.resumo.totalTransacoes}

DETALHAMENTO POR CATEGORIA
--------------------------
${Object.entries(summary.categorias).map(([categoria, dados]) => 
  `${categoria}:
  Receitas: R$ ${dados.receitas.toFixed(2)}
  Despesas: R$ ${dados.despesas.toFixed(2)}
  Saldo: R$ ${(dados.receitas - dados.despesas).toFixed(2)}
  `
).join('\n')}
      `.trim();
      
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `resumo_financeiro_${format(new Date(), 'yyyy-MM-dd')}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar resumo:', error);
      alert('Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <LoadingOverlay>
          <div>Gerando arquivo...</div>
        </LoadingOverlay>
      )}
      
      <ExportContainer>
        <Flex>
          <Download size={20} color="#667eea" />
          <h3 style={{ margin: 0, color: '#2c3e50' }}>Exportar Dados</h3>
        </Flex>
        
        <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
          Exporte seus dados financeiros em diferentes formatos
        </p>
        
        <DateRangeContainer>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            style={{
              padding: '12px 16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)'
            }}
            placeholder="Data inicial"
          />
          <DateSeparator>até</DateSeparator>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            style={{
              padding: '12px 16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.9)'
            }}
            placeholder="Data final"
          />
        </DateRangeContainer>
        
        <ExportOptions>
          <ExportButton variant="csv" onClick={exportToCSV}>
            <FileSpreadsheet size={16} />
            Exportar CSV
          </ExportButton>
          
          <ExportButton variant="pdf" onClick={exportToPDF}>
            <FileText size={16} />
            Exportar PDF
          </ExportButton>
          
          <ExportButton onClick={exportSummary}>
            <Calendar size={16} />
            Resumo Texto
          </ExportButton>
        </ExportOptions>
      </ExportContainer>
    </>
  );
};

export default ExportData;
