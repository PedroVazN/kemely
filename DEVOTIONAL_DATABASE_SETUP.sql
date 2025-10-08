-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - DEVOCIONAL
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para criar as tabelas necessárias para o planejamento devocional

-- 1. Tabela de Jejuns
CREATE TABLE IF NOT EXISTS devotional_fasting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  fast_type VARCHAR(50) NOT NULL CHECK (fast_type IN ('completo', 'parcial', 'daniel', 'liquido', 'tecnologico')),
  duration INTEGER NOT NULL CHECK (duration > 0 AND duration <= 168),
  purpose TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Orações
CREATE TABLE IF NOT EXISTS devotional_prayer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  theme VARCHAR(255) NOT NULL,
  duration INTEGER CHECK (duration > 0 AND duration <= 480),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Estudos Bíblicos
CREATE TABLE IF NOT EXISTS devotional_bible_study (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL,
  theme VARCHAR(255) NOT NULL,
  book_chapter VARCHAR(255) NOT NULL,
  verses VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Adoração
CREATE TABLE IF NOT EXISTS devotional_worship (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  activity VARCHAR(50) NOT NULL CHECK (activity IN ('musica', 'meditacao', 'gratidao', 'testemunho', 'leitura', 'silencioso')),
  duration INTEGER CHECK (duration > 0 AND duration <= 180),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);





-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
-- Criar índices para melhorar a performance das consultas

CREATE INDEX IF NOT EXISTS idx_devotional_fasting_date ON devotional_fasting(date);
CREATE INDEX IF NOT EXISTS idx_devotional_fasting_type ON devotional_fasting(fast_type);
CREATE INDEX IF NOT EXISTS idx_devotional_fasting_status ON devotional_fasting(status);

CREATE INDEX IF NOT EXISTS idx_devotional_prayer_date ON devotional_prayer(date);
CREATE INDEX IF NOT EXISTS idx_devotional_prayer_theme ON devotional_prayer(theme);
CREATE INDEX IF NOT EXISTS idx_devotional_prayer_status ON devotional_prayer(status);

CREATE INDEX IF NOT EXISTS idx_devotional_bible_study_week_start ON devotional_bible_study(week_start);
CREATE INDEX IF NOT EXISTS idx_devotional_bible_study_theme ON devotional_bible_study(theme);
CREATE INDEX IF NOT EXISTS idx_devotional_bible_study_status ON devotional_bible_study(status);

CREATE INDEX IF NOT EXISTS idx_devotional_worship_date ON devotional_worship(date);
CREATE INDEX IF NOT EXISTS idx_devotional_worship_activity ON devotional_worship(activity);
CREATE INDEX IF NOT EXISTS idx_devotional_worship_status ON devotional_worship(status);

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
CREATE TRIGGER update_devotional_fasting_updated_at 
  BEFORE UPDATE ON devotional_fasting 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotional_prayer_updated_at 
  BEFORE UPDATE ON devotional_prayer 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotional_bible_study_updated_at 
  BEFORE UPDATE ON devotional_bible_study 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotional_worship_updated_at 
  BEFORE UPDATE ON devotional_worship 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Habilitar RLS nas tabelas (opcional, dependendo da configuração do Supabase)

-- ALTER TABLE devotional_fasting ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devotional_prayer ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devotional_bible_study ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devotional_worship ENABLE ROW LEVEL SECURITY;

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
WHERE table_name IN ('devotional_fasting', 'devotional_prayer', 'devotional_bible_study', 'devotional_worship')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
-- As tabelas de Planejamento Devocional foram criadas com sucesso!
-- Agora você pode usar o sistema de planejamento espiritual no aplicativo.
