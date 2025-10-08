-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - MÉTRICAS SEMANAIS
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para criar as tabelas necessárias para o planejamento semanal

-- 1. Tabela de Planejamentos Semanais
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('appointment', 'visit', 'sale', 'follow_up')),
  activity VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  client_phone VARCHAR(20),
  client_email VARCHAR(255),
  property_address TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'pending', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Metas Semanais
CREATE TABLE IF NOT EXISTS weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL,
  goal_name VARCHAR(255) NOT NULL,
  target_value DECIMAL(15,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Tarefas Semanais
CREATE TABLE IF NOT EXISTS weekly_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('prospecting', 'follow_up', 'documentation', 'marketing', 'administrative')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  deadline TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
-- Criar índices para melhorar a performance das consultas

CREATE INDEX IF NOT EXISTS idx_weekly_plans_date ON weekly_plans(date);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_type ON weekly_plans(type);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_status ON weekly_plans(status);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_client_name ON weekly_plans(client_name);

CREATE INDEX IF NOT EXISTS idx_weekly_goals_week_start ON weekly_goals(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_status ON weekly_goals(status);

CREATE INDEX IF NOT EXISTS idx_weekly_tasks_date ON weekly_tasks(date);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_category ON weekly_tasks(category);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_priority ON weekly_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_status ON weekly_tasks(status);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================
-- Criar função para atualizar automaticamente o campo updated_at

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_weekly_plans_updated_at 
  BEFORE UPDATE ON weekly_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_goals_updated_at 
  BEFORE UPDATE ON weekly_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_tasks_updated_at 
  BEFORE UPDATE ON weekly_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Habilitar RLS nas tabelas (opcional, dependendo da configuração do Supabase)

-- ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Verificar se as tabelas foram criadas corretamente

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('weekly_plans', 'weekly_goals', 'weekly_tasks')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
-- As tabelas de Métricas Semanais foram criadas com sucesso!
-- Agora você pode usar o sistema de planejamento semanal no aplicativo.
