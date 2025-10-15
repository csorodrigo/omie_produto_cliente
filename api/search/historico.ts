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
    const { codigo_cliente, codigo_produto } = req.body;

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

    const response = await axios.post(
      'https://app.omie.com.br/api/v1/produtos/nfconsultar/',
      nfRequest
    );

    const historico = [];
    if (response.data.nfCadastro) {
      for (const nf of response.data.nfCadastro) {
        if (!nf.det) continue;
        for (const item of nf.det) {
          if (item.nfProdInt?.nCodProd == codigo_produto) {
            historico.push({
              pedido_numero: nf.ide?.nNF || 'N/A',
              pedido_codigo: nf.codigo_nf || 0,
              data_pedido: nf.ide?.dEmi || '',
              quantidade: parseFloat(item.prod?.qCom || 0),
              valor_unitario: parseFloat(item.prod?.vUnCom || 0),
              valor_total: parseFloat(item.prod?.vProd || 0)
            });
          }
        }
      }
    }

    const resumo = {
      total_pedidos: historico.length,
      quantidade_total: historico.reduce((s: number, i: any) => s + i.quantidade, 0),
      valor_medio: historico.length > 0 ? historico.reduce((s: number, i: any) => s + i.valor_unitario, 0) / historico.length : 0,
      ultimo_valor: historico.length > 0 ? historico[0].valor_unitario : 0,
      ultima_data: historico.length > 0 ? historico[0].data_pedido : ''
    };

    return res.json({
      success: true,
      data: { historico, resumo }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
