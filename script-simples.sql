-- Script Simples para Criar Tabelas no Supabase
-- Copie e cole TUDO no SQL Editor do Supabase

-- 1. Criar tabela de transações
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de leads
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  pv VARCHAR(50),
  ac VARCHAR(50),
  ab VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('aprovado', 'pendente', 'rejeitado')),
  temperatura VARCHAR(10) DEFAULT 'frio' CHECK (temperatura IN ('quente', 'frio')),
  data_contato DATE DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de agendamentos
CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  cliente VARCHAR(255) NOT NULL,
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'realizado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de comissões
CREATE TABLE comissoes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  cliente VARCHAR(255) NOT NULL,
  produto VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  comissao DECIMAL(10,2) NOT NULL,
  data_venda DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comissoes ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de acesso
CREATE POLICY "Permitir todas as operações em transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Permitir todas as operações em leads" ON leads FOR ALL USING (true);
CREATE POLICY "Permitir todas as operações em agendamentos" ON agendamentos FOR ALL USING (true);
CREATE POLICY "Permitir todas as operações em comissoes" ON comissoes FOR ALL USING (true);

-- 7. Inserir dados de exemplo
INSERT INTO transactions (description, amount, type, category, date) VALUES
('Salário', 5000.00, 'income', 'Salário', '2024-01-01'),
('Freelance', 1200.00, 'income', 'Freelance', '2024-01-05'),
('Aluguel', 800.00, 'expense', 'Moradia', '2024-01-01'),
('Supermercado', 350.00, 'expense', 'Alimentação', '2024-01-03'),
('Gasolina', 150.00, 'expense', 'Transporte', '2024-01-04');

INSERT INTO leads (nome, telefone, email, pv, ac, ab, status, temperatura, observacoes) VALUES
('João Silva', '(11) 99999-9999', 'joao@email.com', 'PV001', 'AC001', 'AB001', 'quente', 'quente', 'Interessado em investimentos'),
('Maria Santos', '(11) 88888-8888', 'maria@email.com', 'PV002', 'AC002', 'AB002', 'aprovado', 'frio', 'Cliente aprovado'),
('Pedro Costa', '(11) 77777-7777', 'pedro@email.com', 'PV003', 'AC003', 'AB003', 'pendente', 'quente', 'Aguardando documentação');

INSERT INTO agendamentos (lead_id, cliente, data_agendamento, horario, tipo, status, observacoes) VALUES
(1, 'João Silva', '2024-01-20', '14:00:00', 'Reunião', 'agendado', 'Apresentação de produtos'),
(2, 'Maria Santos', '2024-01-21', '10:00:00', 'Follow-up', 'confirmado', 'Acompanhamento pós-venda');

INSERT INTO comissoes (lead_id, cliente, produto, valor, comissao, data_venda, status, observacoes) VALUES
(1, 'João Silva', 'Seguro de Vida', 5000.00, 500.00, '2024-01-15', 'pago', 'Comissão paga'),
(2, 'Maria Santos', 'Previdência Privada', 10000.00, 1000.00, '2024-01-14', 'pendente', 'Aguardando pagamento');
