-- EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR
-- Para permitir o tipo 'debtor' nas transações

-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Adicionar a nova constraint que inclui 'debtor'
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('income', 'expense', 'debtor'));

-- Verificar se funcionou
SELECT 'Constraint atualizada com sucesso!' as status;
