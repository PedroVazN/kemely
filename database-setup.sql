-- Criação da tabela de transações financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'debtor')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Política RLS (Row Level Security) - permitir todas as operações para usuários autenticados
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (já que estamos usando a chave anônima)
CREATE POLICY "Permitir todas as operações" ON transactions
    FOR ALL USING (true);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO transactions (description, amount, type, category, date) VALUES
('Salário', 5000.00, 'income', 'Salário', CURRENT_DATE),
('Freelance', 1200.00, 'income', 'Freelance', CURRENT_DATE - INTERVAL '1 day'),
('Supermercado', 350.50, 'expense', 'Alimentação', CURRENT_DATE),
('Gasolina', 120.00, 'expense', 'Transporte', CURRENT_DATE - INTERVAL '2 days'),
('Academia', 89.90, 'expense', 'Saúde', CURRENT_DATE - INTERVAL '3 days'),
('Netflix', 25.90, 'expense', 'Lazer', CURRENT_DATE - INTERVAL '5 days')
ON CONFLICT DO NOTHING;
