# 🚀 Executar SQL no Supabase - INSTRUÇÕES RÁPIDAS

## ⚡ **PASSO A PASSO SIMPLES**

### **1. Acessar o Supabase**
1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Clique no projeto: **qnzguamukkoiqieqeskm**

### **2. Abrir SQL Editor**
1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique no botão **"New query"**

### **3. Executar o Script**
1. Copie **TUDO** do arquivo `database-corretora-setup.sql`
2. Cole no editor SQL
3. Clique em **"Run"** (botão verde)

### **4. Verificar se Funcionou**
1. Vá para **"Table Editor"** no menu lateral
2. Você deve ver 3 novas tabelas:
   - ✅ `leads`
   - ✅ `agendamentos` 
   - ✅ `comissoes`

### **5. Testar a Aplicação**
1. Volte para a aplicação: http://localhost:3000
2. Clique em **"🏢 Corretora"** no header
3. Clique em **"➕ Novo Lead"**
4. Preencha e salve um lead
5. Verifique se aparece na tabela

---

## 🔧 **SE DER ERRO**

### **Erro de Permissão**
- Verifique se você está logado no Supabase
- Confirme se está no projeto correto

### **Erro de Sintaxe**
- Copie o arquivo `database-corretora-setup.sql` novamente
- Cole tudo de uma vez no editor

### **Tabelas Não Aparecem**
- Execute o script novamente
- Verifique se não há erros no console do Supabase

---

## ✅ **RESULTADO ESPERADO**

Após executar o SQL, você deve ter:
- **3 tabelas criadas** no banco
- **Dados de exemplo** inseridos
- **Aplicação funcionando** sem erros 404
- **Formulário de leads** funcionando

**🎉 Pronto! A planilha de corretora estará conectada ao banco!**
