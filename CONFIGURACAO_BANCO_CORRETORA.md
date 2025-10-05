# 🗄️ Configuração do Banco de Dados - Corretora

## 📋 **Passo a Passo para Configurar o Banco**

### **1. Acessar o Supabase**
1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto: `qnzguamukkoiqieqeskm`

### **2. Executar o Script SQL**
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `database-corretora-setup.sql`
4. Cole no editor SQL
5. Clique em **Run** para executar

### **3. Verificar as Tabelas Criadas**
Após executar o script, você deve ter as seguintes tabelas:

#### **📊 Tabela `leads`**
- `id` - ID único (auto-incremento)
- `nome` - Nome do lead
- `telefone` - Telefone de contato
- `email` - Email (opcional)
- `pv` - Código PV
- `ac` - Código AC
- `ab` - Código AB
- `status` - Status (aprovado, pendente, rejeitado)
- `temperatura` - Temperatura (quente, frio)
- `data_contato` - Data do primeiro contato
- `observacoes` - Observações (opcional)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

#### **📅 Tabela `agendamentos`**
- `id` - ID único (auto-incremento)
- `lead_id` - Referência ao lead
- `cliente` - Nome do cliente
- `data_agendamento` - Data do agendamento
- `horario` - Horário do agendamento
- `tipo` - Tipo de agendamento
- `status` - Status (agendado, confirmado, cancelado, realizado)
- `observacoes` - Observações (opcional)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

#### **💰 Tabela `comissoes`**
- `id` - ID único (auto-incremento)
- `lead_id` - Referência ao lead
- `cliente` - Nome do cliente
- `produto` - Nome do produto
- `valor` - Valor da venda
- `comissao` - Valor da comissão
- `data_venda` - Data da venda
- `status` - Status (pago, pendente, cancelado)
- `observacoes` - Observações (opcional)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### **4. Verificar Políticas de Segurança (RLS)**
O script já configura as políticas de Row Level Security:
- ✅ `leads` - RLS habilitado
- ✅ `agendamentos` - RLS habilitado  
- ✅ `comissoes` - RLS habilitado

### **5. Dados de Exemplo**
O script inclui alguns dados de exemplo para testar:
- **3 leads** com diferentes status e temperaturas
- **2 agendamentos** para demonstração
- **2 comissões** com valores diferentes

## 🔧 **Funcionalidades Implementadas**

### **✅ CRUD Completo**
- **Create**: Adicionar novos leads via formulário
- **Read**: Listar leads, agendamentos e comissões
- **Update**: Editar dados existentes (via botões de ação)
- **Delete**: Excluir registros (via botões de ação)

### **✅ Relacionamentos**
- **Foreign Keys**: Agendamentos e comissões referenciam leads
- **Cascade Delete**: Exclusão de lead remove agendamentos e comissões relacionados

### **✅ Validações**
- **Status**: Valores permitidos definidos via CHECK constraints
- **Temperatura**: Apenas 'quente' ou 'frio'
- **Campos Obrigatórios**: Nome e telefone são obrigatórios

### **✅ Performance**
- **Índices**: Criados para campos frequentemente consultados
- **Triggers**: Atualização automática de `updated_at`

## 🚀 **Como Testar**

### **1. Adicionar Lead**
1. Acesse a aplicação
2. Clique no botão "🏢 Corretora" no header
3. Clique em "➕ Novo Lead"
4. Preencha os dados obrigatórios
5. Clique em "Salvar Lead"

### **2. Verificar Dados**
1. Os dados aparecerão na tabela de leads
2. As estatísticas serão atualizadas automaticamente
3. Os dados persistem no banco Supabase

### **3. Navegar entre Abas**
1. **Leads**: Visualizar todos os leads
2. **Agendamentos**: Ver agendamentos (vazio inicialmente)
3. **Comissões**: Ver comissões (vazio inicialmente)

## 🔍 **Verificação no Supabase**

### **1. Table Editor**
- Vá para **Table Editor** no painel do Supabase
- Verifique se as 3 tabelas foram criadas
- Confirme se os dados de exemplo estão lá

### **2. SQL Editor**
- Execute: `SELECT * FROM leads;`
- Execute: `SELECT * FROM agendamentos;`
- Execute: `SELECT * FROM comissoes;`

### **3. Logs**
- Vá para **Logs** para ver se há erros
- Verifique se as operações estão sendo registradas

## ⚠️ **Troubleshooting**

### **Erro de Permissão**
- Verifique se as políticas RLS estão corretas
- Confirme se a chave anon está funcionando

### **Erro de Conexão**
- Verifique se a URL do Supabase está correta
- Confirme se a chave anon está válida

### **Dados Não Aparecem**
- Verifique se o script SQL foi executado completamente
- Confirme se não há erros no console do navegador

---

**🎉 Após seguir estes passos, a planilha de corretora estará totalmente conectada ao banco de dados!**
