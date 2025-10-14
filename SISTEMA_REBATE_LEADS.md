# 🔄 Sistema Automático de Rebate de Leads

## 📋 Descrição

Sistema automático que identifica leads que precisam ser contatados novamente (rebatidos) após 2 dias sem interação, destacando-os visualmente e facilitando o contato via WhatsApp.

## 🚀 Funcionalidades

### 1. **Detecção Automática de Leads para Rebater**
- O sistema calcula automaticamente quantos dias se passaram desde:
  - O cadastro do lead (`created_at`), ou
  - O último rebate (`ultimo_rebate`)
- Leads com **2 dias ou mais** sem contato ficam **destacados em VERMELHO**

### 2. **Destaque Visual**
- **Linha vermelha**: Lead que precisa ser rebatido
- **Borda vermelha à esquerda**: Indicador visual forte
- **Card de estatísticas**: Mostra quantos leads precisam ser rebatidos

### 3. **Botão Rebater com WhatsApp**
- Botão **verde do WhatsApp** aparece automaticamente quando o lead precisa ser rebatido
- Ao clicar:
  1. Abre o WhatsApp Web/App com o número do lead
  2. Atualiza automaticamente a data do último rebate
  3. Remove o destaque vermelho
  4. Lead só voltará a ficar vermelho após 2 dias do novo rebate

### 4. **Formatação Automática de Telefone**
- Formata automaticamente o número para WhatsApp
- Adiciona código do país (55) se necessário
- Exemplo: `11962234936` → `https://wa.me/5511962234936`

### 5. **Estatísticas**
- Novo card **"Para Rebater"** no dashboard
- Mostra quantos leads precisam de atenção
- Destaque vermelho quando há leads pendentes

## 🔧 Instalação

### Passo 1: Atualizar o Banco de Dados

Execute o script SQL no Supabase:

```sql
-- Copiar e colar no SQL Editor do Supabase
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ultimo_rebate TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_leads_ultimo_rebate ON leads(ultimo_rebate);
```

**OU** use o arquivo `ADD_REBATE_SYSTEM.sql` que foi criado.

### Passo 2: Código já Atualizado

O componente `LeadsSpreadsheet.js` já foi atualizado com todas as funcionalidades.

## 📊 Como Funciona

### Fluxo de Trabalho

```
1. Lead cadastrado → created_at = hoje
   ↓
2. Passa 1 dia → Nada acontece
   ↓
3. Passa 2 dias → Lead fica VERMELHO + Botão "Rebater" aparece
   ↓
4. Você clica em "Rebater"
   ↓
5. WhatsApp abre → ultimo_rebate = hoje
   ↓
6. Lead volta ao normal (sem destaque)
   ↓
7. Passa 2 dias do rebate → Lead fica VERMELHO novamente
```

### Cálculo de Dias

```javascript
// Se nunca foi rebatido
dias = hoje - created_at

// Se já foi rebatido
dias = hoje - ultimo_rebate

// Vermelho quando: dias >= 2
```

## 🎨 Elementos Visuais

### Card de Estatísticas
- **Título**: "Para Rebater"
- **Cor normal**: Preto/cinza
- **Cor alerta**: Vermelho (#ef4444)
- **Ícone**: MessageCircle (chat)

### Linha da Tabela
- **Background normal**: `rgba(42, 42, 42, 0.3)`
- **Background alerta**: `rgba(239, 68, 68, 0.15)` (vermelho transparente)
- **Borda**: Vermelho sólido à esquerda (4px)

### Botão Rebater
- **Cor**: Verde WhatsApp (#25D366)
- **Ícone**: MessageCircle
- **Hover**: Verde escuro (#128C7E)
- **Posição**: Primeira ação, antes dos outros botões

## 📱 Formato do Link WhatsApp

### Exemplos

| Número Cadastrado | Formatado Para | Link Gerado |
|-------------------|----------------|-------------|
| 11962234936 | 5511962234936 | https://wa.me/5511962234936 |
| (11) 96223-4936 | 5511962234936 | https://wa.me/5511962234936 |
| 5511962234936 | 5511962234936 | https://wa.me/5511962234936 |
| 1196223-4936 | 5511962234936 | https://wa.me/5511962234936 |

## 🔍 Campos no Banco de Dados

### Tabela: `leads`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `created_at` | TIMESTAMP | Data de cadastro do lead |
| `ultimo_rebate` | TIMESTAMP | Data do último rebate (novo campo) |

## ⚙️ Funções Principais

### `needsRebate(lead)`
Verifica se um lead precisa ser rebatido.

```javascript
const needsRebate = (lead) => {
  const referenceDate = lead.ultimo_rebate 
    ? new Date(lead.ultimo_rebate) 
    : new Date(lead.created_at);
  
  const daysDifference = Math.floor(
    (new Date() - referenceDate) / (1000 * 60 * 60 * 24)
  );
  
  return daysDifference >= 2;
};
```

### `formatPhoneForWhatsApp(phone)`
Formata o telefone para o padrão do WhatsApp.

```javascript
const formatPhoneForWhatsApp = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  
  if (cleaned.length === 11 || cleaned.length === 10) {
    return '55' + cleaned;
  }
  
  return cleaned;
};
```

### `handleRebateLead(lead)`
Abre o WhatsApp e atualiza o banco de dados.

```javascript
const handleRebateLead = async (lead) => {
  const phoneFormatted = formatPhoneForWhatsApp(lead.telefone);
  const whatsappUrl = `https://wa.me/${phoneFormatted}`;
  
  // Abre WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Atualiza banco
  await updateData('leads', lead.id, { 
    ultimo_rebate: new Date().toISOString() 
  });
  
  toast.success('WhatsApp aberto! Data de rebate atualizada.');
  fetchLeads();
};
```

## 🎯 Casos de Uso

### Caso 1: Lead Novo
- **Dia 0**: Lead cadastrado
- **Dia 1**: Nada acontece
- **Dia 2**: Fica vermelho, botão aparece
- **Ação**: Clicar em "Rebater"

### Caso 2: Lead Rebatido
- **Dia 0**: Último rebate
- **Dia 1**: Normal
- **Dia 2**: Fica vermelho novamente
- **Ação**: Rebater novamente

### Caso 3: Lead Antigo Nunca Rebatido
- **Dia 30**: Lead com 30 dias sem contato
- **Status**: Vermelho desde o dia 2
- **Ação**: Rebater urgentemente

## 🐛 Possíveis Problemas e Soluções

### Problema: Botão não aparece
**Solução**: Verificar se o campo `ultimo_rebate` foi criado no banco.

### Problema: WhatsApp não abre
**Solução**: Verificar formatação do número de telefone.

### Problema: Lead não fica vermelho
**Solução**: Verificar se `created_at` está sendo salvo corretamente.

### Problema: Erro ao atualizar rebate
**Solução**: Verificar permissões do Supabase na tabela `leads`.

## 📈 Melhorias Futuras (Opcionais)

1. **Notificações**: Alerta quando houver leads para rebater
2. **Agendamento**: Agendar rebate para data específica
3. **Histórico**: Registrar todos os rebates em uma tabela separada
4. **Mensagem automática**: Enviar mensagem pré-formatada no WhatsApp
5. **Filtros**: Filtrar apenas leads que precisam rebater

## ✅ Checklist de Implementação

- [x] Criar campo `ultimo_rebate` no banco
- [x] Adicionar função `needsRebate()`
- [x] Adicionar função `formatPhoneForWhatsApp()`
- [x] Adicionar função `handleRebateLead()`
- [x] Adicionar destaque visual vermelho
- [x] Adicionar botão "Rebater"
- [x] Adicionar card de estatísticas
- [x] Integrar com WhatsApp
- [x] Atualizar automaticamente o banco após rebate

## 🎉 Pronto para Usar!

O sistema está completamente funcional. Basta executar o script SQL no Supabase e começar a usar!

---

**Desenvolvido com ❤️ para otimizar o gerenciamento de leads**

