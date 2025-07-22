const express = require('express');
const cors = require('cors');

const app = express();

// Configuração CORS permissiva
app.use(cors({
  origin: ['*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Backend CNH Social funcionando perfeitamente no Railway'
  });
});

// Endpoint de status geral
app.get('/status', (req, res) => {
  res.json({
    service: 'CNH Social Backend',
    version: '2.0.0',
    status: 'online',
    platform: 'Railway',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version
  });
});

// Endpoint de teste para monitor
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend CNH Social - Teste OK (Railway)',
    timestamp: new Date().toISOString(),
    data: {
      amount: 6472, // R$ 64,72 em centavos
      customer: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 98765-4321',
        document: '12345678901'
      },
      items: [{
        title: 'Tarifa de Processo CNH Social',
        name: 'Tarifa CNH',
        quantity: 1,
        unit_amount: 6472
      }]
    }
  });
});

// Endpoint raiz
app.get('/', (req, res) => {
  res.json({
    message: 'CNH Social Backend API (Railway)',
    version: '2.0.0',
    status: 'online',
    platform: 'Railway',
    endpoints: {
      health: '/health',
      status: '/status',
      test: '/test'
    },
    timestamp: new Date().toISOString()
  });
});

// Endpoint para dados do funil (simulado)
app.get('/funnel-data', (req, res) => {
  res.json({
    success: true,
    data: {
      total_orders: 1247,
      total_revenue: 80623.84, // R$ 80.623,84
      average_order: 64.72,
      today_orders: 23,
      today_revenue: 1488.56,
      conversion_rate: 3.2,
      last_transaction: {
        id: 'txn_123456789',
        amount: 6472,
        customer: 'João Silva',
        timestamp: new Date().toISOString()
      }
    }
  });
});

// Endpoint para criar transação (simulado)
app.post('/aureolink/create', (req, res) => {
  const { amount, customer, items } = req.body;
  
  console.log('Transação recebida:', { amount, customer, items });
  
  res.json({
    success: true,
    message: 'Transação criada com sucesso (Railway)',
    transaction_id: 'txn_' + Date.now(),
    amount: amount,
    customer: customer,
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend CNH Social rodando na porta ${PORT} (Railway)`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Status: http://localhost:${PORT}/status`);
  console.log(`🧪 Teste: http://localhost:${PORT}/test`);
});