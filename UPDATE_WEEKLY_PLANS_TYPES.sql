-- Atualizar constraint de tipos da tabela weekly_plans
-- Execute este código no SQL Editor do Supabase

-- 1. Remover o constraint antigo
ALTER TABLE weekly_plans DROP CONSTRAINT IF EXISTS weekly_plans_type_check;

-- 2. Adicionar novo constraint com todos os tipos permitidos
ALTER TABLE weekly_plans ADD CONSTRAINT weekly_plans_type_check 
  CHECK (type IN (
    -- Tipos pessoais
    'personal',
    -- Tipos de corretora
    'visita_decorado',
    'primeira_visita',
    'segunda_visita',
    'primeira_visita_aprovado',
    'retorno',
    'reuniao',
    'follow_up',
    'apresentacao',
    'vistoria',
    -- Tipos antigos (manter compatibilidade)
    'appointment',
    'visit',
    'sale'
  ));

-- Comentário explicativo
COMMENT ON CONSTRAINT weekly_plans_type_check ON weekly_plans IS 
  'Tipos permitidos: personal (pessoal), visita_decorado, primeira_visita, segunda_visita, primeira_visita_aprovado, retorno, reuniao, follow_up, apresentacao, vistoria, appointment, visit, sale';

