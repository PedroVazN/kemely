-- Tabela para o Checklist de Tarefas Diárias
-- Execute este código no SQL Editor do Supabase

-- Criar tabela checklist_tasks
CREATE TABLE IF NOT EXISTS checklist_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_checklist_tasks_date ON checklist_tasks(date);
CREATE INDEX IF NOT EXISTS idx_checklist_tasks_completed ON checklist_tasks(completed);

-- Habilitar Row Level Security (RLS)
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (ajuste conforme sua necessidade de autenticação)
-- Política para permitir leitura
CREATE POLICY "Enable read access for all users" ON checklist_tasks
  FOR SELECT USING (true);

-- Política para permitir inserção
CREATE POLICY "Enable insert for all users" ON checklist_tasks
  FOR INSERT WITH CHECK (true);

-- Política para permitir atualização
CREATE POLICY "Enable update for all users" ON checklist_tasks
  FOR UPDATE USING (true);

-- Política para permitir deleção
CREATE POLICY "Enable delete for all users" ON checklist_tasks
  FOR DELETE USING (true);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checklist_tasks_updated_at
  BEFORE UPDATE ON checklist_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas colunas
COMMENT ON TABLE checklist_tasks IS 'Tabela para armazenar tarefas diárias do checklist';
COMMENT ON COLUMN checklist_tasks.id IS 'Identificador único da tarefa';
COMMENT ON COLUMN checklist_tasks.task IS 'Descrição da tarefa';
COMMENT ON COLUMN checklist_tasks.completed IS 'Indica se a tarefa foi concluída';
COMMENT ON COLUMN checklist_tasks.date IS 'Data da tarefa';
COMMENT ON COLUMN checklist_tasks.created_at IS 'Data e hora de criação';
COMMENT ON COLUMN checklist_tasks.updated_at IS 'Data e hora da última atualização';

