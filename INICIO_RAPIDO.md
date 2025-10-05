# 🚀 Início Rápido - Kemely Financeiro

## ⚡ Instalação em 3 Passos

### 1️⃣ **Instalar Dependências**
```bash
npm install
```

### 2️⃣ **Configurar Banco de Dados**
1. Acesse: https://supabase.com/dashboard
2. Execute o script `database-setup.sql` no SQL Editor
3. Aguarde a criação da tabela `transactions`

### 3️⃣ **Executar Aplicação**
```bash
npm start
```

## 🎯 **Funcionalidades Principais**

### 📊 **Dashboard**
- Resumo financeiro em tempo real
- Cards com receitas, despesas e saldo
- Contador de transações

### 💳 **Transações**
- Adicionar receitas e despesas
- Categorização automática
- Filtros avançados por data, valor, tipo
- Busca por descrição

### 📈 **Gráficos**
- Gastos por categoria (Pizza)
- Receitas vs Despesas (Barras)
- Tendência dos últimos 7 dias (Linha)

### 📤 **Exportação**
- CSV para planilhas
- PDF com relatórios completos
- Resumo em texto

## 🎨 **Design Profissional**

- ✨ Animações suaves com Framer Motion
- 🎨 Tema azul moderno e elegante
- 📱 Totalmente responsivo
- 🔔 Notificações elegantes
- 🌟 Micro-interações

## 🔧 **Comandos Úteis**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 📱 **Acesso**

Após executar `npm start`, acesse:
**http://localhost:3000**

## 🆘 **Problemas Comuns**

### Erro de Conexão
- Verifique se o Supabase está configurado
- Confirme as credenciais em `src/lib/supabase.js`

### Erro de Dependências
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

### Erro de Banco de Dados
- Execute o script `database-setup.sql` no Supabase
- Verifique se a tabela `transactions` foi criada

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique se seguiu todos os passos
2. Consulte o arquivo `README.md`
3. Verifique os logs no console do navegador

---

**🎉 Pronto! Sua planilha financeira profissional está funcionando!**
