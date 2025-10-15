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
    const { razao_social, cnpj_cpf } = req.body;

    const omieRequest = {
      call: 'ListarClientes',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 50,
        apenas_importado_api: 'N',
        clientesFiltro: {
          razao_social,
          cnpj_cpf
        }
      }]
    };

    const response = await axios.post(
      'https://app.omie.com.br/api/v1/geral/clientes/',
      omieRequest
    );

    return res.json({
      success: true,
      count: response.data.clientes_cadastro?.length || 0,
      data: response.data.clientes_cadastro || []
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar clientes'
    });
  }
}
