# 📋 Instruções de Instalação - Kemely Financeiro

## 🚀 Passo a Passo para Executar a Aplicação

### 1. Instalar Dependências
Execute o comando abaixo no terminal na pasta do projeto:
```bash
npm install
```

**⚠️ IMPORTANTE:** A instalação pode levar alguns minutos devido às dependências avançadas incluídas.

### 2. Configurar Banco de Dados Supabase

#### 2.1. Acessar o Supabase
1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: `qnzguamukkoiqieqeskm`

#### 2.2. Executar Script SQL
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `database-setup.sql`
4. Clique em **Run** para executar o script

#### 2.3. Verificar Tabela
1. Vá para **Table Editor**
2. Verifique se a tabela `transactions` foi criada
3. Você deve ver alguns dados de exemplo já inseridos

### 3. Executar a Aplicação
```bash
npm start
```

A aplicação será aberta automaticamente no navegador em `http://localhost:3000`

## ✅ Verificação da Instalação

Após seguir os passos acima, você deve ver:

1. **Tela inicial** com o título "Kemely Financeiro"
2. **Cards de resumo** mostrando:
   - Total de Receitas
   - Total de Despesas  
   - Saldo Atual
   - Total de Transações
3. **Formulário** para adicionar novas transações
4. **Lista** com as transações existentes

## 🔧 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as credenciais estão corretas no arquivo `src/lib/supabase.js`
- Confirme se o projeto Supabase está ativo

### Erro ao Carregar Transações
- Verifique se a tabela `transactions` foi criada corretamente
- Confirme se as políticas RLS estão configuradas

### Problemas de Estilo
- Verifique se todas as dependências foram instaladas: `npm install`
- Limpe o cache: `npm start` (com Ctrl+C e executar novamente)

## 📱 Testando a Aplicação

1. **Adicionar Transação**:
   - Preencha o formulário
   - Clique em "Adicionar Transação"
   - Verifique se aparece na lista

2. **Filtrar Transações**:
   - Use os botões "Todas", "Receitas", "Despesas"
   - Verifique se a filtragem funciona

3. **Excluir Transação**:
   - Clique no ícone de lixeira
   - Confirme a exclusão
   - Verifique se foi removida

## 🎨 Personalização

Para personalizar o tema azul claro, edite o arquivo `src/styles/GlobalStyles.js`:
- Cores principais: `#4A90E2`, `#E6F3FF`
- Gradientes: `linear-gradient(135deg, #E6F3FF 0%, #B3D9FF 100%)`

## 📞 Suporte

Se encontrar problemas:
1. Verifique se seguiu todos os passos
2. Confirme se as dependências estão instaladas
3. Verifique se o Supabase está configurado corretamente
4. Consulte o arquivo README.md para mais detalhes

---

**Desenvolvido com ❤️ para Kemely**
