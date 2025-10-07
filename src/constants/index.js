export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const TRANSACTION_CATEGORIES = {
  [TRANSACTION_TYPES.INCOME]: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Devedor',
    'Outros'
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Casa',
    'Devedor',
    'Outros'
  ]
};

export const CHART_COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f5576c',
  '#4facfe',
  '#00f2fe',
  '#43e97b',
  '#38f9d7',
  '#ff9a9e',
  '#fecfef',
  '#a8edea',
  '#fed6e3'
];

export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  TXT: 'txt'
};

export const FILTER_TYPES = {
  ALL: 'all',
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  INPUT: 'yyyy-MM-dd',
  LONG: 'dd \'de\' MMMM \'de\' yyyy',
  SHORT: 'dd/MM'
};

export const CURRENCY_SYMBOL = 'R$';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

export const TOAST_DURATION = 4000;

export const VALIDATION_RULES = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  MIN_DESCRIPTION_LENGTH: 3,
  MAX_DESCRIPTION_LENGTH: 100
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'kemely_user_preferences',
  FILTERS: 'kemely_filters',
  THEME: 'kemely_theme'
};

export const API_ENDPOINTS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  REPORTS: 'reports'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  UNAUTHORIZED: 'Acesso negado. Faça login novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.'
};

export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transação adicionada com sucesso!',
  TRANSACTION_UPDATED: 'Transação atualizada com sucesso!',
  TRANSACTION_DELETED: 'Transação excluída com sucesso!',
  DATA_EXPORTED: 'Dados exportados com sucesso!',
  FILTERS_CLEARED: 'Filtros limpos com sucesso!'
};
