import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

interface OmieCredentials {
  appKey: string;
  appSecret: string;
}

interface ClientesFiltro {
  razao_social?: string;
  cnpj_cpf?: string;
  nome_fantasia?: string;
}

interface ProdutosFiltro {
  descricao?: string;
  codigo?: string;
}

export class OmieService {
  private api: AxiosInstance;
  private credentials: OmieCredentials;

  constructor() {
    this.credentials = {
      appKey: process.env.OMIE_APP_KEY || '',
      appSecret: process.env.OMIE_APP_SECRET || ''
    };

    if (!this.credentials.appKey || !this.credentials.appSecret) {
      console.error('⚠️  OMIE credentials not configured properly');
      console.error('Please check OMIE_APP_KEY and OMIE_APP_SECRET in .env file');
    }

    this.api = axios.create({
      baseURL: 'https://app.omie.com.br/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  private buildRequest(call: string, params: any = {}) {
    return {
      call,
      app_key: this.credentials.appKey,
      app_secret: this.credentials.appSecret,
      param: [params]
    };
  }

  async buscarClientes(filtro: ClientesFiltro): Promise<any[]> {
    try {
      const params: any = {
        pagina: 1,
        registros_por_pagina: 100,
        apenas_importado_api: 'N',
        clientesFiltro: {}
      };

      // Adiciona filtros dentro de clientesFiltro (estrutura correta OMIE)
      if (filtro.razao_social) {
        params.clientesFiltro.razao_social = filtro.razao_social;
      }
      if (filtro.cnpj_cpf) {
        params.clientesFiltro.cnpj_cpf = filtro.cnpj_cpf;
      }
      if (filtro.nome_fantasia) {
        params.clientesFiltro.nome_fantasia = filtro.nome_fantasia;
      }

      const request = this.buildRequest('ListarClientes', params);
      const response = await this.api.post('/geral/clientes/', request);

      if (response.data.clientes_cadastro) {
        return response.data.clientes_cadastro;
      }

      return [];
    } catch (error: any) {
      console.error('Erro ao buscar clientes na OMIE:', error.response?.data || error.message);
      throw error;
    }
  }

  async buscarClientePorId(id: string): Promise<any> {
    try {
      const params = {
        codigo_cliente_omie: parseInt(id)
      };

      const request = this.buildRequest('ConsultarCliente', params);
      const response = await this.api.post('/geral/clientes/', request);

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar cliente por ID na OMIE:', error.response?.data || error.message);
      if (error.response?.data?.faultstring?.includes('não cadastrado')) {
        return null;
      }
      throw error;
    }
  }

  // Buscar produtos que um cliente já comprou
  async buscarProdutosDoCliente(codigoCliente: number, filtro?: ProdutosFiltro): Promise<any[]> {
    try {
      console.log(`\n🔍 Iniciando busca de produtos para cliente ${codigoCliente}`);

      // Primeiro buscar todos os pedidos do cliente
      const pedidos = await this.buscarPedidosPorCliente(codigoCliente);
      console.log(`📋 Cliente possui ${pedidos.length} notas fiscais`);

      // DEBUG: Logar primeira NF se existir
      if (pedidos.length > 0) {
        console.log('📄 Estrutura da primeira NF:', JSON.stringify(pedidos[0], null, 2));
      }

      // Extrair códigos únicos de produtos que o cliente já comprou (de NF-e)
      const codigosProdutosComprados = new Set<number>();
      for (const nf of pedidos) {
        if (nf.det && nf.det.length > 0) {
          console.log(`📦 NF ${nf.ide?.nNF || 'N/A'} possui ${nf.det.length} itens`);

          nf.det.forEach((item: any, index: number) => {
            // Pegar o ID OMIE do produto (nCodProd)
            const nCodProd = item.nfProdInt?.nCodProd;
            console.log(`  Item ${index + 1}: nCodProd=${nCodProd}, xProd=${item.prod?.xProd}`);

            if (nCodProd) {
              codigosProdutosComprados.add(nCodProd);
            }
          });
        }
      }

      console.log(`✅ Cliente ${codigoCliente} comprou ${codigosProdutosComprados.size} produtos diferentes`);
      console.log(`📋 IDs dos produtos: [${Array.from(codigosProdutosComprados).join(', ')}]`);

      // Se cliente não tem pedidos, retorna vazio
      if (codigosProdutosComprados.size === 0) {
        console.log(`ℹ️ Cliente ${codigoCliente} não possui produtos comprados`);
        return [];
      }

      // Buscar detalhes de cada produto comprado
      const produtosDetalhes: any[] = [];

      for (const codigoProduto of Array.from(codigosProdutosComprados)) {
        try {
          const produto = await this.buscarProdutoPorId(codigoProduto.toString());
          if (produto) {
            produtosDetalhes.push(produto);
            console.log(`✅ Produto ${codigoProduto} adicionado: ${produto.descricao}`);
          }
        } catch (error) {
          console.log(`⚠️ Produto ${codigoProduto} não encontrado ou erro ao buscar`);
        }
      }

      console.log(`\n📊 Total de produtos com detalhes: ${produtosDetalhes.length}`);

      // Aplicar filtros se fornecidos
      let produtosFiltrados = produtosDetalhes;

      if (filtro?.descricao) {
        const descricaoNormalizada = this.normalizarTexto(filtro.descricao);
        console.log(`🔍 Aplicando filtro de descrição: "${filtro.descricao}"`);

        produtosFiltrados = produtosFiltrados.filter((p: any) => {
          const descProduto = this.normalizarTexto(p.descricao || '');
          const descStatus = this.normalizarTexto(p.descricao_status || '');
          return descProduto.includes(descricaoNormalizada) || descStatus.includes(descricaoNormalizada);
        });

        console.log(`✅ Produtos após filtro de descrição: ${produtosFiltrados.length}`);
      }

      if (filtro?.codigo) {
        console.log(`🔍 Aplicando filtro de código: "${filtro.codigo}"`);

        produtosFiltrados = produtosFiltrados.filter((p: any) =>
          p.codigo_produto == filtro.codigo ||
          p.codigo_produto_integracao == filtro.codigo
        );

        console.log(`✅ Produtos após filtro de código: ${produtosFiltrados.length}`);
      }

      console.log(`\n✅ Retornando ${produtosFiltrados.length} produtos\n`);
      return produtosFiltrados;
    } catch (error: any) {
      console.error('❌ Erro ao buscar produtos do cliente:', error);
      throw error;
    }
  }

  async buscarProdutos(filtro: ProdutosFiltro): Promise<any[]> {
    try {
      const params: any = {
        pagina: 1,
        registros_por_pagina: 100,
        apenas_importado_api: 'N',
        filtrar_apenas_omiepdv: 'N',
        exibir_caracteristicas: 'S'
      };

      // Não há filtro de descrição direto na API ListarProdutos
      // A busca deve ser feita localmente após obter todos os produtos
      // ou usando codigo_produto/codigo_produto_integracao

      const request = this.buildRequest('ListarProdutos', params);
      const response = await this.api.post('/geral/produtos/', request);

      if (response.data.produto_servico_cadastro) {
        let produtos = response.data.produto_servico_cadastro;

        // Filtra localmente por descrição se fornecida
        if (filtro.descricao) {
          const descricaoLower = filtro.descricao.toLowerCase();
          produtos = produtos.filter((p: any) =>
            p.descricao?.toLowerCase().includes(descricaoLower) ||
            p.descricao_status?.toLowerCase().includes(descricaoLower)
          );
        }

        // Filtra por código se fornecido
        if (filtro.codigo) {
          produtos = produtos.filter((p: any) =>
            p.codigo_produto == filtro.codigo ||
            p.codigo_produto_integracao == filtro.codigo
          );
        }

        return produtos;
      }

      return [];
    } catch (error: any) {
      console.error('Erro ao buscar produtos na OMIE:', error.response?.data || error.message);
      throw error;
    }
  }

  async buscarProdutoPorId(id: string): Promise<any> {
    try {
      // A API ConsultarProduto aceita codigo_produto (int) como ID OMIE do produto
      const params = {
        codigo_produto: parseInt(id)
      };

      console.log(`🔍 Buscando produto ID: ${id} com params:`, params);
      const request = this.buildRequest('ConsultarProduto', params);
      const response = await this.api.post('/geral/produtos/', request);

      // Extrair código original de várias fontes possíveis
      let codigoOriginal = '';

      // 1. Tentar pegar das características customizadas
      if (response.data.caracteristicas && Array.isArray(response.data.caracteristicas)) {
        // Procurar característica com nome contendo "codigo" e "original"
        const caracteristicaCodigo = response.data.caracteristicas.find((c: any) =>
          c.cNomeCaract && (
            c.cNomeCaract.toLowerCase().includes('codigo') &&
            c.cNomeCaract.toLowerCase().includes('original')
          ) || c.cNomeCaract.toLowerCase() === 'codigo original'
        );

        if (caracteristicaCodigo && caracteristicaCodigo.cConteudo) {
          codigoOriginal = caracteristicaCodigo.cConteudo;
        }
      }

      // 2. Se não encontrou, tentar campo codigo_produto_integracao
      if (!codigoOriginal && response.data.codigo_produto_integracao) {
        codigoOriginal = response.data.codigo_produto_integracao;
      }

      // 3. Se ainda não encontrou, usar o código do produto mesmo
      if (!codigoOriginal && response.data.codigo) {
        codigoOriginal = response.data.codigo;
      }

      console.log(`📋 Produto ${id} - Código Original: ${codigoOriginal || 'N/A'}`);

      // Adicionar código original ao objeto retornado
      return {
        ...response.data,
        codigo_original: codigoOriginal
      };
    } catch (error: any) {
      console.error(`❌ Erro ao buscar produto ${id}:`, error.response?.data?.faultstring || error.message);
      if (error.response?.data?.faultstring?.includes('não cadastrado')) {
        return null;
      }
      throw error;
    }
  }

  // Método de teste de conexão
  async testarConexao(): Promise<boolean> {
    try {
      const request = this.buildRequest('ListarClientes', {
        pagina: 1,
        registros_por_pagina: 1,
        apenas_importado_api: 'N'
      });

      const response = await this.api.post('/geral/clientes/', request);
      console.log('✅ Conexão com OMIE estabelecida com sucesso');
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao conectar com OMIE:', error.response?.data || error.message);
      return false;
    }
  }

  // Buscar notas fiscais (vendas) por cliente
  async buscarPedidosPorCliente(codigoCliente: number): Promise<any[]> {
    try {
      const params = {
        pagina: 1,
        registros_por_pagina: 500, // Max para pegar histórico completo
        apenas_importado_api: 'N',
        nIdCliente: codigoCliente, // ID do cliente para filtrar
        tpNF: 1 // 1 = Saída (venda)
      };

      console.log(`🔍 Buscando NFs do cliente ${codigoCliente} com params:`, params);

      const request = this.buildRequest('ListarNF', params);
      const response = await this.api.post('/produtos/nfconsultar/', request);

      if (response.data.nfCadastro) {
        console.log(`✅ Encontradas ${response.data.nfCadastro.length} notas fiscais`);
        return response.data.nfCadastro;
      }

      console.log(`⚠️ Resposta sem nfCadastro:`, response.data);
      return [];
    } catch (error: any) {
      // Se não houver registros, retorna array vazio ao invés de erro
      if (error.response?.data?.faultstring?.includes('Não existem registros')) {
        console.log(`ℹ️ Cliente ${codigoCliente} não possui notas fiscais`);
        return [];
      }
      console.error('❌ Erro ao buscar notas fiscais na OMIE:', error.response?.data || error.message);
      throw error;
    }
  }

  // Buscar histórico de vendas de um produto para um cliente
  async buscarHistoricoVendas(codigoCliente: number, codigoProduto: number): Promise<any> {
    try {
      // Buscar todos os pedidos do cliente
      const pedidos = await this.buscarPedidosPorCliente(codigoCliente);

      // DEBUG: Logar estrutura do primeiro pedido
      if (pedidos.length > 0) {
        console.log('🔍 DEBUG PEDIDO:', JSON.stringify(pedidos[0], null, 2));
      }

      // Filtrar pedidos que contêm o produto
      const historicoVendas: any[] = [];

      for (const nf of pedidos) {
        if (!nf.det || nf.det.length === 0) continue;

        // Procurar o produto nos itens da nota fiscal
        for (const item of nf.det) {
          // nCodProd é o ID OMIE do produto
          const nCodProd = item.nfProdInt?.nCodProd;

          // Verificar se é o produto que procuramos
          if (nCodProd == codigoProduto ||
              item.prod?.cProd == codigoProduto.toString()) {

            // Extrair valores da estrutura de NF-e
            const valorUnitario = parseFloat(item.prod?.vUnCom || item.prod?.valor_unitario || 0);
            const quantidade = parseFloat(item.prod?.qCom || item.prod?.quantidade || 0);
            const valorTotal = parseFloat(item.prod?.vProd || item.prod?.valor_total || (quantidade * valorUnitario));

            const numeroNF = nf.ide?.nNF || nf.numero_nf || `NF-${nf.codigo_nf || 0}`;
            const dataNF = nf.ide?.dEmi || nf.data_emissao || '';

            historicoVendas.push({
              pedido_numero: numeroNF,
              pedido_codigo: nf.codigo_nf || nf.ide?.cNF || 0,
              data_pedido: dataNF,
              quantidade: quantidade,
              valor_unitario: valorUnitario,
              valor_total: valorTotal,
              valor_desconto: parseFloat(item.prod?.vDesc || 0),
              produto_descricao: item.prod?.xProd || item.produto?.descricao || ''
            });

            console.log('✅ Venda processada:', {
              nf: numeroNF,
              data: dataNF,
              produto: item.prod?.xProd,
              qtd: quantidade,
              valor: valorUnitario
            });
          }
        }
      }

      // Ordenar por data (mais recente primeiro)
      historicoVendas.sort((a, b) => {
        const dateA = this.parseDate(a.data_pedido);
        const dateB = this.parseDate(b.data_pedido);
        return dateB.getTime() - dateA.getTime();
      });

      // Calcular resumo
      const resumo = {
        total_pedidos: historicoVendas.length,
        quantidade_total: historicoVendas.reduce((sum, item) => sum + item.quantidade, 0),
        valor_medio: historicoVendas.length > 0
          ? historicoVendas.reduce((sum, item) => sum + item.valor_unitario, 0) / historicoVendas.length
          : 0,
        ultimo_valor: historicoVendas.length > 0 ? historicoVendas[0].valor_unitario : 0,
        ultima_data: historicoVendas.length > 0 ? historicoVendas[0].data_pedido : ''
      };

      return {
        historico: historicoVendas,
        resumo
      };
    } catch (error: any) {
      console.error('Erro ao buscar histórico de vendas:', error);
      throw error;
    }
  }

  // Helper para parse de data DD/MM/YYYY
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Helper para normalizar texto (remove acentos, lowercase, trim)
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .trim();
  }
}