# 🏢 Planilha de Corretora - Kemely

## 🎯 **Funcionalidades Implementadas**

### **📊 Resumo Executivo**
- **Total de Leads**: Contador de leads cadastrados
- **Leads Quentes**: Leads com alto potencial
- **Agendamentos**: Total e agendamentos do dia
- **Comissões**: Valor total e pendências

### **👥 Gestão de Leads**
- **Dados Completos**: Nome, telefone, email
- **Códigos**: PV, AC, AB para identificação
- **Status**: Aprovado, Pendente, Rejeitado
- **Temperatura**: Quente (🔥) ou Frio (❄️)
- **Observações**: Notas sobre cada lead

### **📅 Agendamentos**
- **Cliente**: Nome do lead
- **Data e Horário**: Agendamento completo
- **Tipo**: Reunião, Follow-up, Apresentação
- **Status**: Agendado, Confirmado, Cancelado
- **Observações**: Detalhes do agendamento

### **💰 Comissões**
- **Cliente**: Nome do cliente
- **Produto**: Tipo de produto vendido
- **Valor**: Valor da venda
- **Comissão**: Valor da comissão
- **Data**: Data da venda
- **Status**: Pago, Pendente

## 🎨 **Design e Interface**

### **Tema Corretora**
- **Cores**: Laranja (#f59e0b) como cor principal
- **Ícones**: Profissionais e contextuais
- **Layout**: Organizado como planilha real
- **Animações**: Suaves e elegantes

### **Componentes Visuais**
- **Cards de Estatísticas**: Resumo executivo
- **Abas**: Leads, Agendamentos, Comissões
- **Tabelas**: Dados organizados em colunas
- **Badges**: Status coloridos e visuais

## 📋 **Estrutura da Planilha**

### **Cabeçalho**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🏢 Planilha de Corretora                    [➕ Novo Lead] [📥 Exportar] │
│  Gestão de leads, agendamentos e comissões                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### **Cards de Estatísticas**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  👥 Total Leads │ │  🔥 Leads Quentes│ │  📅 Agendamentos│ │  💰 Comissões   │
│  25             │ │  8              │ │  12             │ │  R$ 15.000,00  │
│  Leads cadastrados│ │  Alto potencial │ │  3 hoje         │ │  5 pendentes   │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### **Abas de Navegação**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  [👥 Leads] [📅 Agendamentos] [💰 Comissões]                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### **Tabela de Leads**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Nome        │ Telefone      │ PV    │ AC    │ AB    │ Status │ Temp │ Ações │
├─────────────────────────────────────────────────────────────────────────┤
│  João Silva  │ (11) 99999-9999│ PV001 │ AC001 │ AB001 │ ✅ Aprovado│ 🔥 Quente│ 👁️✏️🗑️│
│  Maria Santos│ (11) 88888-8888│ PV002 │ AC002 │ AB002 │ ⏰ Pendente│ ❄️ Frio │ 👁️✏️🗑️│
│  Pedro Costa │ (11) 77777-7777│ PV003 │ AC003 │ AB003 │ ❌ Rejeitado│ 🔥 Quente│ 👁️✏️🗑️│
└─────────────────────────────────────────────────────────────────────────┘
```

### **Tabela de Agendamentos**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cliente     │ Data        │ Horário │ Tipo      │ Status    │ Obs │ Ações │
├─────────────────────────────────────────────────────────────────────────┤
│  João Silva  │ 20/01/2024  │ 14:00   │ Reunião   │ ⏰ Agendado│ ... │ 👁️✏️🗑️│
│  Maria Santos│ 21/01/2024  │ 10:00   │ Follow-up │ ✅ Confirmado│ ... │ 👁️✏️🗑️│
└─────────────────────────────────────────────────────────────────────────┘
```

### **Tabela de Comissões**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cliente     │ Produto      │ Valor      │ Comissão   │ Data    │ Status │ Ações │
├─────────────────────────────────────────────────────────────────────────┤
│  João Silva  │ Seguro Vida  │ R$ 5.000,00│ R$ 500,00  │ 15/01   │ ✅ Pago │ 👁️✏️🗑️│
│  Maria Santos│ Previdência  │ R$ 10.000,00│ R$ 1.000,00│ 14/01   │ ⏰ Pendente│ 👁️✏️🗑️│
└─────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **Funcionalidades Técnicas**

### **Botão de Alternância**
- **Localização**: Header, ao lado do logo
- **Função**: Alterna entre modo Financeiro e Corretora
- **Visual**: Botão com ícone e texto
- **Animação**: Hover e click effects

### **Sistema de Abas**
- **Leads**: Gestão completa de leads
- **Agendamentos**: Controle de reuniões
- **Comissões**: Acompanhamento financeiro
- **Transições**: Suaves entre abas

### **Status e Badges**
- **Cores Dinâmicas**: Verde (aprovado), Amarelo (pendente), Vermelho (rejeitado)
- **Ícones Contextuais**: CheckCircle, Clock, AlertCircle
- **Temperatura**: Flame (quente), Snowflake (frio)

### **Ações por Linha**
- **👁️ Visualizar**: Ver detalhes
- **✏️ Editar**: Modificar dados
- **🗑️ Excluir**: Remover item

## 🎨 **Ícones Profissionais**

### **Categorias de Ícones**
- **👥 Leads**: Users, UserCheck, UserX
- **📅 Agendamentos**: Calendar, Clock
- **💰 Comissões**: DollarSign, TrendingUp
- **🏢 Corretora**: Building2, Target
- **🔥 Temperatura**: Flame, Snowflake
- **✅ Status**: CheckCircle, AlertCircle

### **Cores dos Ícones**
- **Verde**: Aprovado, Sucesso (#10b981)
- **Amarelo**: Pendente, Aviso (#f59e0b)
- **Vermelho**: Rejeitado, Quente (#ef4444)
- **Azul**: Frio, Informação (#3b82f6)
- **Laranja**: Corretora, Destaque (#f59e0b)

## 📱 **Responsividade**

### **Desktop (1200px+)**
- 4 cards de estatísticas lado a lado
- Tabelas com todas as colunas
- Ações completas por linha

### **Tablet (768px - 1199px)**
- 2 cards por linha
- Tabelas adaptadas
- Ações compactas

### **Mobile (< 768px)**
- 1 card por linha
- Tabelas em coluna única
- Ações em menu

## 🚀 **Como Usar**

### **1. Alternar Modo**
- Clique no botão "🏢 Corretora" no header
- Interface muda para modo corretora
- Botão muda para "💰 Financeiro"

### **2. Navegar entre Abas**
- Clique em "Leads", "Agendamentos" ou "Comissões"
- Dados são filtrados automaticamente
- Transições suaves entre abas

### **3. Gerenciar Dados**
- Use os botões de ação em cada linha
- Visualizar, editar ou excluir
- Status são atualizados automaticamente

### **4. Exportar Dados**
- Botão "Exportar" no header
- Dados da aba ativa são exportados
- Formato compatível com Excel

---

**🎉 Resultado: Uma planilha de corretora completa com gestão de leads, agendamentos e comissões!**
