# 🎯 GUIA VISUAL - EXECUTAR SQL NO SUPABASE

## ⚠️ **PROBLEMA ATUAL:**
- **Erro**: `Could not find the table 'public.transactions' in the schema cache`
- **Causa**: Tabelas não existem no banco de dados
- **Solução**: Executar o script SQL no Supabase

---

## 📋 **PASSO A PASSO VISUAL:**

### **PASSO 1: Acessar o Supabase**
1. Abra seu navegador
2. Vá para: **https://supabase.com/dashboard**
3. Faça login na sua conta
4. Clique no projeto: **qnzguamukkoiqieqeskm**

### **PASSO 2: Abrir o SQL Editor**
1. No menu lateral esquerdo, procure por **"SQL Editor"**
2. Clique em **"SQL Editor"**
3. Clique no botão **"New query"** (botão verde)

### **PASSO 3: Copiar o Script SQL**
1. Abra o arquivo `database-completo-setup.sql` no seu computador
2. Selecione **TUDO** o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)

### **PASSO 4: Colar e Executar**
1. No editor SQL do Supabase, cole o conteúdo (Ctrl+V)
2. Verifique se o script foi colado completamente
3. Clique no botão **"Run"** (botão verde)

### **PASSO 5: Verificar se Funcionou**
1. Vá para **"Table Editor"** no menu lateral
2. Você deve ver **4 tabelas**:
   - ✅ `transactions`
   - ✅ `leads`
   - ✅ `agendamentos`
   - ✅ `comissoes`

---

## 🔍 **COMO SABER SE DEU CERTO:**

### **✅ SUCESSO:**
- Aparece mensagem: "Success. No rows returned"
- 4 tabelas aparecem no Table Editor
- Aplicação para de dar erro 404

### **❌ ERRO:**
- Aparece mensagem de erro em vermelho
- Tabelas não aparecem no Table Editor
- Aplicação continua com erro 404

---

## 🚨 **SE DER ERRO:**

### **Erro de Permissão:**
- Verifique se está logado no Supabase
- Confirme se está no projeto correto

### **Erro de Sintaxe:**
- Copie o arquivo `database-completo-setup.sql` novamente
- Cole tudo de uma vez no editor

### **Tabelas Não Aparecem:**
- Execute o script novamente
- Verifique se não há erros no console do Supabase

---

## 📱 **TESTAR A APLICAÇÃO:**

### **1. Modo Financeiro:**
- Acesse: http://localhost:3000
- Deve carregar sem erros 404
- Dados de exemplo devem aparecer

### **2. Modo Corretora:**
- Clique em "🏢 Corretora" no header
- Deve carregar sem erros 404
- Dados de exemplo devem aparecer

### **3. Adicionar Dados:**
- Teste adicionar uma transação financeira
- Teste adicionar um lead na corretora
- Dados devem ser salvos no banco

---

## 🎯 **RESULTADO ESPERADO:**

Após executar o SQL corretamente:
- **✅ Erros 404 eliminados**
- **✅ Aplicação funcionando 100%**
- **✅ Dados persistindo no banco**
- **✅ Formulários funcionando**
- **✅ Navegação entre modos funcionando**

---

## 📞 **PRECISA DE AJUDA?**

Se ainda tiver problemas:
1. Verifique se está no projeto correto do Supabase
2. Confirme se copiou o script completo
3. Execute o script novamente
4. Verifique se as tabelas foram criadas

**🎉 Execute o SQL e a aplicação estará perfeita!**
