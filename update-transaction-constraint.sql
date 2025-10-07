-- Script para atualizar a constraint da tabela transactions
-- Execute este script no Supabase SQL Editor

-- Primeiro, remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Adicionar a nova constraint que inclui 'debtor'
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('income', 'expense', 'debtor'));

-- Verificar se a constraint foi aplicada corretamente
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'transactions'::regclass 
AND conname = 'transactions_type_check';
