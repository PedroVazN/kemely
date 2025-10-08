-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - FITNESS
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para criar as tabelas necessárias para o Fitness Tracker

-- 1. Tabela de Treinos
CREATE TABLE IF NOT EXISTS fitness_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  exercise VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Refeições
CREATE TABLE IF NOT EXISTS fitness_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  meal_type VARCHAR(100) NOT NULL,
  calories INTEGER NOT NULL,
  healthy BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Água
CREATE TABLE IF NOT EXISTS fitness_water (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  amount INTEGER NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Sono
CREATE TABLE IF NOT EXISTS fitness_sleep (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  hours DECIMAL(3,1) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
-- Descomente as linhas abaixo para inserir dados de exemplo

-- Inserir treinos de exemplo
INSERT INTO fitness_workouts (date, exercise, duration, completed, notes) VALUES
  (CURRENT_DATE - INTERVAL '7 days', 'Musculação - Peito e Tríceps', 60, true, 'Treino intenso, 4 séries de cada exercício'),
  (CURRENT_DATE - INTERVAL '6 days', 'Corrida', 30, true, 'Corrida no parque, ritmo moderado'),
  (CURRENT_DATE - INTERVAL '5 days', 'Yoga', 45, true, 'Sessão de yoga matinal, muito relaxante'),
  (CURRENT_DATE - INTERVAL '4 days', 'Musculação - Costas e Bíceps', 55, true, 'Foco em exercícios de puxada'),
  (CURRENT_DATE - INTERVAL '3 days', 'Caminhada', 25, true, 'Caminhada leve no final do dia'),
  (CURRENT_DATE - INTERVAL '2 days', 'Musculação - Pernas', 70, true, 'Treino pesado de pernas'),
  (CURRENT_DATE - INTERVAL '1 day', 'Natação', 40, true, 'Aula de natação, 20 piscinas'),
  (CURRENT_DATE, 'Musculação - Ombros', 50, false, 'Treino cancelado por indisposição');

-- Inserir refeições de exemplo
INSERT INTO fitness_meals (date, meal_type, calories, healthy, notes) VALUES
  (CURRENT_DATE - INTERVAL '7 days', 'Café da manhã', 350, true, 'Aveia com banana e mel'),
  (CURRENT_DATE - INTERVAL '7 days', 'Almoço', 450, true, 'Frango grelhado com arroz integral e salada'),
  (CURRENT_DATE - INTERVAL '7 days', 'Jantar', 300, true, 'Salmão com quinoa e brócolis'),
  (CURRENT_DATE - INTERVAL '6 days', 'Café da manhã', 280, true, 'Omelete com espinafre e tomate'),
  (CURRENT_DATE - INTERVAL '6 days', 'Almoço', 500, false, 'Hambúrguer com batata frita'),
  (CURRENT_DATE - INTERVAL '6 days', 'Jantar', 400, true, 'Sopa de legumes com pão integral'),
  (CURRENT_DATE - INTERVAL '5 days', 'Café da manhã', 320, true, 'Smoothie de frutas com proteína'),
  (CURRENT_DATE - INTERVAL '5 days', 'Almoço', 480, true, 'Peixe assado com batata doce'),
  (CURRENT_DATE - INTERVAL '5 days', 'Jantar', 350, true, 'Salada de quinoa com grão-de-bico'),
  (CURRENT_DATE, 'Café da manhã', 300, true, 'Panqueca de aveia com frutas');

-- Inserir registros de água de exemplo
INSERT INTO fitness_water (date, amount, time, notes) VALUES
  (CURRENT_DATE - INTERVAL '7 days', 250, '08:00', 'Primeiro copo do dia'),
  (CURRENT_DATE - INTERVAL '7 days', 250, '10:30', 'Após o café da manhã'),
  (CURRENT_DATE - INTERVAL '7 days', 500, '12:00', 'Durante o almoço'),
  (CURRENT_DATE - INTERVAL '7 days', 250, '15:00', 'Lanche da tarde'),
  (CURRENT_DATE - INTERVAL '7 days', 250, '17:30', 'Após o treino'),
  (CURRENT_DATE - INTERVAL '7 days', 250, '20:00', 'Durante o jantar'),
  (CURRENT_DATE - INTERVAL '6 days', 250, '08:30', 'Café da manhã'),
  (CURRENT_DATE - INTERVAL '6 days', 250, '11:00', 'Meio da manhã'),
  (CURRENT_DATE - INTERVAL '6 days', 500, '13:00', 'Almoço'),
  (CURRENT_DATE - INTERVAL '6 days', 250, '16:00', 'Tarde'),
  (CURRENT_DATE - INTERVAL '6 days', 250, '19:00', 'Jantar'),
  (CURRENT_DATE, '250', '09:00', 'Café da manhã'),
  (CURRENT_DATE, '250', '12:00', 'Almoço'),
  (CURRENT_DATE, '250', '15:00', 'Tarde');

-- Inserir registros de sono de exemplo
INSERT INTO fitness_sleep (date, bedtime, wake_time, hours, notes) VALUES
  (CURRENT_DATE - INTERVAL '7 days', '23:00', '07:00', 8.0, 'Sono profundo e reparador'),
  (CURRENT_DATE - INTERVAL '6 days', '22:30', '06:30', 8.0, 'Acordei naturalmente'),
  (CURRENT_DATE - INTERVAL '5 days', '23:30', '07:30', 8.0, 'Sono tranquilo'),
  (CURRENT_DATE - INTERVAL '4 days', '00:00', '08:00', 8.0, 'Dormi tarde mas acordei bem'),
  (CURRENT_DATE - INTERVAL '3 days', '22:00', '06:00', 8.0, 'Sono excelente'),
  (CURRENT_DATE - INTERVAL '2 days', '23:15', '07:15', 8.0, 'Sono regular'),
  (CURRENT_DATE - INTERVAL '1 day', '22:45', '06:45', 8.0, 'Sono bom'),
  (CURRENT_DATE, '23:30', '07:30', 8.0, 'Sono profundo');

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
-- Criar índices para melhorar a performance das consultas

CREATE INDEX IF NOT EXISTS idx_fitness_workouts_date ON fitness_workouts(date);
CREATE INDEX IF NOT EXISTS idx_fitness_workouts_exercise ON fitness_workouts(exercise);
CREATE INDEX IF NOT EXISTS idx_fitness_workouts_completed ON fitness_workouts(completed);

CREATE INDEX IF NOT EXISTS idx_fitness_meals_date ON fitness_meals(date);
CREATE INDEX IF NOT EXISTS idx_fitness_meals_meal_type ON fitness_meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_fitness_meals_healthy ON fitness_meals(healthy);

CREATE INDEX IF NOT EXISTS idx_fitness_water_date ON fitness_water(date);
CREATE INDEX IF NOT EXISTS idx_fitness_water_time ON fitness_water(time);

CREATE INDEX IF NOT EXISTS idx_fitness_sleep_date ON fitness_sleep(date);
CREATE INDEX IF NOT EXISTS idx_fitness_sleep_hours ON fitness_sleep(hours);

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
CREATE TRIGGER update_fitness_workouts_updated_at 
  BEFORE UPDATE ON fitness_workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_meals_updated_at 
  BEFORE UPDATE ON fitness_meals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_water_updated_at 
  BEFORE UPDATE ON fitness_water 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_sleep_updated_at 
  BEFORE UPDATE ON fitness_sleep 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Habilitar RLS nas tabelas (opcional, dependendo da configuração do Supabase)

-- ALTER TABLE fitness_workouts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fitness_meals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fitness_water ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fitness_sleep ENABLE ROW LEVEL SECURITY;

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
WHERE table_name IN ('fitness_workouts', 'fitness_meals', 'fitness_water', 'fitness_sleep')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
-- As tabelas do Fitness Tracker foram criadas com sucesso!
-- Agora você pode usar o sistema de fitness no aplicativo.
