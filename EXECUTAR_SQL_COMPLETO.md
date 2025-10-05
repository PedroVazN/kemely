# 🚀 Executar SQL Completo no Supabase - CORRIGIR ERROS 404

## ⚡ **SOLUÇÃO DEFINITIVA PARA OS ERROS 404**

### **🔍 Problema Identificado:**
- **Erro**: `Could not find the table 'public.transactions' in the schema cache`
- **Causa**: Tabela `transactions` não existe no banco
- **Solução**: Executar script SQL completo

### **📋 PASSO A PASSO:**

#### **1. Acessar o Supabase**
1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Clique no projeto: **qnzguamukkoiqieqeskm**

#### **2. Limpar Tabelas Existentes (se houver)**
1. Vá para **"Table Editor"**
2. Se existir alguma tabela, delete-a
3. Vá para **"SQL Editor"**

#### **3. Executar Script Completo**
1. Clique em **"New query"**
2. Copie **TUDO** do arquivo `database-completo-setup.sql`
3. Cole no editor SQL
4. Clique em **"Run"** (botão verde)

#### **4. Verificar Tabelas Criadas**
Após executar, você deve ter **4 tabelas**:
- ✅ `transactions` (financeiro)
- ✅ `leads` (corretora)
- ✅ `agendamentos` (corretora)
- ✅ `comissoes` (corretora)

#### **5. Testar a Aplicação**
1. Volte para: http://localhost:3000
2. **Modo Financeiro**: Deve funcionar sem erros 404
3. **Modo Corretora**: Clique em "🏢 Corretora"
4. **Adicionar Lead**: Clique em "➕ Novo Lead"

---

## 🎯 **O QUE O SCRIPT FAZ:**

### **✅ Cria Tabela `transactions`**
```sql
- id (PK)
- description (descrição)
- amount (valor)
- type (income/expense)
- category (categoria)
- date (data)
- created_at/updated_at
```

### **✅ Cria Tabelas da Corretora**
```sql
- leads (leads)
- agendamentos (agendamentos)
- comissoes (comissões)
```

### **✅ Adiciona Dados de Exemplo**
- **8 transações** financeiras
- **3 leads** da corretora
- **2 agendamentos**
- **2 comissões**

### **✅ Configura Segurança**
- RLS habilitado
- Políticas de acesso
- Triggers automáticos

---

## 🔧 **SE AINDA DER ERRO:**

### **Erro de Permissão**
- Verifique se está logado no Supabase
- Confirme se está no projeto correto

### **Erro de Sintaxe**
- Copie o arquivo `database-completo-setup.sql` novamente
- Cole tudo de uma vez

### **Tabelas Não Aparecem**
- Execute o script novamente
- Verifique se não há erros no console do Supabase

---

## ✅ **RESULTADO ESPERADO:**

Após executar o SQL:
- **✅ Erros 404 eliminados**
- **✅ Modo financeiro funcionando**
- **✅ Modo corretora funcionando**
- **✅ Formulários funcionando**
- **✅ Dados persistindo no banco**

**🎉 Problema resolvido! A aplicação estará 100% funcional!**
