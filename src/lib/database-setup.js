import { supabase } from './supabase';

// Função para verificar e criar as tabelas necessárias
export const setupDatabase = async () => {
  try {
    console.log('🔧 Configurando banco de dados...');

    // Verificar se as tabelas existem
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('⚠️ Não foi possível verificar tabelas existentes:', tablesError);
    } else {
      console.log('📋 Tabelas existentes:', tables?.map(t => t.table_name) || []);
    }

    // Dados de exemplo para testar
    const sampleData = {
      leads: [
        {
          nome: 'João Silva',
          telefone: '(11) 99999-9999',
          pv: 85,
          ac: 70,
          ab: 60,
          status: 'quente',
          temperatura: 'alta',
          observacoes: 'Cliente interessado em investimentos',
          created_at: new Date().toISOString()
        },
        {
          nome: 'Maria Santos',
          telefone: '(11) 88888-8888',
          pv: 60,
          ac: 45,
          ab: 30,
          status: 'morno',
          temperatura: 'media',
          observacoes: 'Aguardando retorno',
          created_at: new Date().toISOString()
        }
      ],
      agendamentos: [
        {
          cliente: 'João Silva',
          data_agendamento: '2024-01-15',
          horario: '14:00',
          tipo: 'consulta',
          status: 'agendado',
          observacoes: 'Primeira consulta sobre investimentos',
          created_at: new Date().toISOString()
        },
        {
          cliente: 'Maria Santos',
          data_agendamento: '2024-01-16',
          horario: '10:00',
          tipo: 'apresentacao',
          status: 'confirmado',
          observacoes: 'Apresentação de produtos',
          created_at: new Date().toISOString()
        }
      ],
      comissoes: [
        {
          cliente: 'João Silva',
          produto: 'Fundo de Investimento',
          valor: 10000.00,
          comissao: 500.00,
          data_venda: '2024-01-10',
          status: 'pago',
          observacoes: 'Venda realizada com sucesso',
          created_at: new Date().toISOString()
        },
        {
          cliente: 'Maria Santos',
          produto: 'Plano de Previdência',
          valor: 5000.00,
          comissao: 250.00,
          data_venda: '2024-01-12',
          status: 'pendente',
          observacoes: 'Aguardando pagamento',
          created_at: new Date().toISOString()
        }
      ]
    };

    // Inserir dados de exemplo se as tabelas existirem
    for (const [tableName, data] of Object.entries(sampleData)) {
      try {
        const { error } = await supabase
          .from(tableName)
          .insert(data);

        if (error) {
          console.log(`⚠️ Erro ao inserir dados em ${tableName}:`, error.message);
        } else {
          console.log(`✅ Dados inseridos em ${tableName}`);
        }
      } catch (err) {
        console.log(`⚠️ Tabela ${tableName} não existe ou erro de permissão:`, err.message);
      }
    }

    console.log('✅ Configuração do banco concluída!');
  } catch (error) {
    console.error('❌ Erro na configuração do banco:', error);
  }
};

// Função para buscar dados
export const fetchData = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Erro ao buscar dados de ${tableName}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Erro ao buscar dados de ${tableName}:`, error);
    return [];
  }
};

// Função para inserir dados
export const insertData = async (tableName, data) => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([{
        ...data,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error(`Erro ao inserir dados em ${tableName}:`, error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`Erro ao inserir dados em ${tableName}:`, error);
    throw error;
  }
};

// Função para atualizar dados
export const updateData = async (tableName, id, data) => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Erro ao atualizar dados em ${tableName}:`, error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`Erro ao atualizar dados em ${tableName}:`, error);
    throw error;
  }
};

// Função para deletar dados
export const deleteData = async (tableName, id) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar dados de ${tableName}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Erro ao deletar dados de ${tableName}:`, error);
    throw error;
  }
};
