import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { descricao, codigo, codigo_cliente } = req.body;

    if (!codigo_cliente) {
      return res.status(400).json({
        success: false,
        error: 'Selecione um cliente primeiro'
      });
    }

    // Buscar NF-e do cliente
    const nfRequest = {
      call: 'ListarNF',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 500,
        apenas_importado_api: 'N',
        nIdCliente: parseInt(codigo_cliente),
        tpNF: 1
      }]
    };

    const nfResponse = await axios.post(
      'https://app.omie.com.br/api/v1/produtos/nfconsultar/',
      nfRequest
    );

    // Extrair IDs únicos de produtos
    const produtosIds = new Set();
    if (nfResponse.data.nfCadastro) {
      for (const nf of nfResponse.data.nfCadastro) {
        if (nf.det) {
          for (const item of nf.det) {
            if (item.nfProdInt?.nCodProd) {
              produtosIds.add(item.nfProdInt.nCodProd);
            }
          }
        }
      }
    }

    // Buscar detalhes dos produtos
    const produtos = [];
    for (const id of Array.from(produtosIds)) {
      try {
        const prodRequest = {
          call: 'ConsultarProduto',
          app_key: process.env.OMIE_APP_KEY,
          app_secret: process.env.OMIE_APP_SECRET,
          param: [{ codigo_produto: id }]
        };

        const prodResponse = await axios.post(
          'https://app.omie.com.br/api/v1/geral/produtos/',
          prodRequest
        );

        // Extrair código original
        let codigoOriginal = '';
        if (prodResponse.data.caracteristicas) {
          const caract = prodResponse.data.caracteristicas.find((c: any) =>
            c.cNomeCaract?.toLowerCase().includes('codigo') &&
            c.cNomeCaract?.toLowerCase().includes('original')
          );
          if (caract) codigoOriginal = caract.cConteudo || '';
        }

        produtos.push({
          ...prodResponse.data,
          codigo_original: codigoOriginal
        });
      } catch {}
    }

    // Filtrar por descrição
    let filtered = produtos;
    if (descricao) {
      const desc = descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = produtos.filter((p: any) => {
        const pDesc = (p.descricao || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return pDesc.includes(desc);
      });
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar produtos'
    });
  }
}
