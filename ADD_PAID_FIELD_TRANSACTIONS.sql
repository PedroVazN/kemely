-- =====================================================
-- ADICIONAR CAMPO PAID NA TABELA TRANSACTIONS
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para adicionar o campo 'paid' nas transações

-- Adicionar campo 'paid' na tabela transactions
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false;

-- Adicionar campo 'paid_date' para registrar quando foi pago
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS paid_date DATE;

-- Adicionar campo 'parent_transaction_id' para rastrear transações geradas
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS parent_transaction_id BIGINT REFERENCES transactions(id);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_paid ON transactions(paid);
CREATE INDEX IF NOT EXISTS idx_transactions_paid_date ON transactions(paid_date);
CREATE INDEX IF NOT EXISTS idx_transactions_parent_id ON transactions(parent_transaction_id);

-- Atualizar transações existentes para ter paid = false
UPDATE transactions 
SET paid = false 
WHERE paid IS NULL;

-- Comentário explicativo
COMMENT ON COLUMN transactions.paid IS 'Indica se a despesa foi paga';
COMMENT ON COLUMN transactions.paid_date IS 'Data em que a despesa foi paga';
COMMENT ON COLUMN transactions.parent_transaction_id IS 'ID da transação pai (para transações geradas)';

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
-- O campo 'paid' foi adicionado com sucesso!
-- Agora as despesas podem ser marcadas como pagas.
