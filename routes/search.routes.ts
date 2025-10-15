import { Router } from 'express';
import { OmieService } from '../services/omie.service';

const router = Router();
const omieService = new OmieService();

// Buscar clientes
router.post('/clientes', async (req, res, next) => {
  try {
    const { razao_social, cnpj_cpf, nome_fantasia } = req.body;

    console.log('Buscando clientes com:', { razao_social, cnpj_cpf, nome_fantasia });

    const clientes = await omieService.buscarClientes({
      razao_social,
      cnpj_cpf,
      nome_fantasia
    });

    res.json({
      success: true,
      count: clientes.length,
      data: clientes
    });
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar clientes',
      details: error.response?.data || undefined
    });
  }
});

// Buscar produtos (apenas os que o cliente já comprou)
router.post('/produtos', async (req, res, next) => {
  try {
    const { descricao, codigo, codigo_cliente } = req.body;

    if (!codigo_cliente) {
      return res.status(400).json({
        success: false,
        error: 'Selecione um cliente primeiro'
      });
    }

    console.log('Buscando produtos do cliente:', { codigo_cliente, descricao, codigo });

    const produtos = await omieService.buscarProdutosDoCliente(
      parseInt(codigo_cliente, 10),
      { descricao, codigo }
    );

    res.json({
      success: true,
      count: produtos.length,
      data: produtos
    });
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar produtos',
      details: error.response?.data || undefined
    });
  }
});

// Buscar cliente por ID
router.get('/clientes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const cliente = await omieService.buscarClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente n�o encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar cliente',
      details: error.response?.data || undefined
    });
  }
});

// Buscar produto por ID
router.get('/produtos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const produto = await omieService.buscarProdutoPorId(id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto n�o encontrado'
      });
    }

    res.json({
      success: true,
      data: produto
    });
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar produto',
      details: error.response?.data || undefined
    });
  }
});

// Buscar histórico de vendas produto x cliente
router.post('/historico', async (req, res, next) => {
  try {
    const { codigo_cliente, codigo_produto } = req.body;

    if (!codigo_cliente || !codigo_produto) {
      return res.status(400).json({
        success: false,
        error: 'codigo_cliente e codigo_produto são obrigatórios'
      });
    }

    console.log('Buscando histórico de vendas:', { codigo_cliente, codigo_produto });

    const historico = await omieService.buscarHistoricoVendas(
      parseInt(codigo_cliente, 10),
      parseInt(codigo_produto, 10)
    );

    res.json({
      success: true,
      data: historico
    });
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar histórico de vendas',
      details: error.response?.data || undefined
    });
  }
});

export default router;