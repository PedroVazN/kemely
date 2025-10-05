# 🚀 Comandos de Instalação - Kemely Financeiro

## 📋 **Instalação Completa**

### **Windows (PowerShell/CMD)**
```cmd
# 1. Instalar dependências
npm install

# 2. Executar aplicação
npm start
```

### **Linux/Mac (Terminal)**
```bash
# 1. Instalar dependências
npm install

# 2. Executar aplicação
npm start
```

### **Scripts Automatizados**

#### **Windows**
```cmd
# Execute o arquivo install.bat
install.bat
```

#### **Linux/Mac**
```bash
# Torne o script executável
chmod +x install.sh

# Execute o script
./install.sh
```

## 🔧 **Comandos de Desenvolvimento**

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Ejetar configurações (não recomendado)
npm run eject
```

## 📦 **Dependências Instaladas**

### **Principais**
- `react` - Interface do usuário
- `@supabase/supabase-js` - Banco de dados
- `styled-components` - Estilização
- `framer-motion` - Animações
- `recharts` - Gráficos
- `react-hot-toast` - Notificações

### **Utilitários**
- `date-fns` - Manipulação de datas
- `lucide-react` - Ícones
- `jspdf` - Geração de PDF
- `html2canvas` - Captura de tela
- `react-datepicker` - Seletor de datas
- `react-select` - Select customizado
- `react-modal` - Modais

## 🗄️ **Configuração do Banco de Dados**

### **1. Acessar Supabase**
- URL: https://supabase.com/dashboard
- Projeto: `qnzguamukkoiqieqeskm`

### **2. Executar Script SQL**
```sql
-- Copie e cole o conteúdo do arquivo database-setup.sql
-- no SQL Editor do Supabase
```

### **3. Verificar Tabela**
- Vá para Table Editor
- Confirme se a tabela `transactions` foi criada
- Verifique se há dados de exemplo

## 🌐 **Acesso à Aplicação**

Após executar `npm start`:
- **URL Local**: http://localhost:3000
- **Porta**: 3000 (padrão)
- **Modo**: Desenvolvimento com hot reload

## 🔍 **Verificação da Instalação**

### **1. Verificar Dependências**
```bash
npm list --depth=0
```

### **2. Verificar Build**
```bash
npm run build
```

### **3. Verificar Testes**
```bash
npm test
```

## 🚨 **Solução de Problemas**

### **Erro: Module not found**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro: Port already in use**
```bash
# Usar porta diferente
PORT=3001 npm start
```

### **Erro: Supabase connection**
- Verificar credenciais em `src/lib/supabase.js`
- Confirmar se o projeto Supabase está ativo

### **Erro: Database table not found**
- Executar script `database-setup.sql` no Supabase
- Verificar se a tabela `transactions` existe

## 📱 **Teste da Aplicação**

### **1. Acessar Dashboard**
- Verificar se os cards de resumo aparecem
- Confirmar se os valores estão corretos

### **2. Testar Transações**
- Adicionar uma nova transação
- Verificar se aparece na lista
- Testar filtros e busca

### **3. Testar Gráficos**
- Verificar se os gráficos carregam
- Confirmar se os dados estão corretos

### **4. Testar Exportação**
- Exportar dados em CSV
- Gerar relatório em PDF
- Verificar se os arquivos são baixados

## 🎯 **Próximos Passos**

1. **Personalizar**: Ajustar cores e temas
2. **Dados**: Adicionar suas transações reais
3. **Categorias**: Criar categorias personalizadas
4. **Relatórios**: Configurar relatórios automáticos
5. **Backup**: Configurar backup dos dados

---

**🎉 Instalação Concluída! Sua planilha financeira profissional está pronta para uso!**
