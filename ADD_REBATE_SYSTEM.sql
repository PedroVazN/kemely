-- =====================================================
-- ADICIONAR SISTEMA DE REBATE DE LEADS
-- =====================================================
-- Copie e cole este script no SQL Editor do Supabase

-- Adicionar campo para armazenar a data do último rebate
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ultimo_rebate TIMESTAMP WITH TIME ZONE;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_leads_ultimo_rebate ON leads(ultimo_rebate);

-- Comentários explicativos
COMMENT ON COLUMN leads.ultimo_rebate IS 'Data e hora do último rebate/contato com o lead';

