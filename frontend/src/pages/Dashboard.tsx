import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  codigo_cliente_omie: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj_cpf: string;
  email: string;
}

interface Produto {
  codigo_produto: number;
  descricao: string;
  codigo: string;
  valor_unitario?: number;
}

interface HistoricoItem {
  pedido_numero: string;
  data_pedido: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

function Dashboard() {
  const [buscaCliente, setBuscaCliente] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [historico, setHistorico] = useState<any>(null);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [error, setError] = useState('');

  // Carregar histórico automaticamente quando cliente E produto forem selecionados
  useEffect(() => {
    if (clienteSelecionado && produtoSelecionado) {
      buscarHistorico();
    } else {
      setHistorico(null);
    }
  }, [clienteSelecionado, produtoSelecionado]);

  const buscarClientes = async () => {
    if (!buscaCliente.trim()) {
      setError('Digite algo para buscar');
      return;
    }
    setLoadingClientes(true);
    setError('');
    try {
      const response = await axios.post('/api/search/clientes', {
        razao_social: buscaCliente
      });
      if (response.data.success) {
        setClientes(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  const buscarProdutos = async () => {
    if (!buscaProduto.trim()) {
      setError('Digite algo para buscar');
      return;
    }
    if (!clienteSelecionado) {
      setError('Selecione um cliente primeiro');
      return;
    }
    setLoadingProdutos(true);
    setError('');
    try {
      const response = await axios.post('/api/search/produtos', {
        descricao: buscaProduto,
        codigo_cliente: clienteSelecionado.codigo_cliente_omie
      });
      if (response.data.success) {
        setProdutos(response.data.data);
        if (response.data.data.length === 0) {
          setError('Este cliente ainda não comprou produtos com essa descrição');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar produtos');
    } finally {
      setLoadingProdutos(false);
    }
  };

  const buscarHistorico = async () => {
    if (!clienteSelecionado || !produtoSelecionado) return;
    setLoadingHistorico(true);
    setError('');
    try {
      const response = await axios.post('/api/search/historico', {
        codigo_cliente: clienteSelecionado.codigo_cliente_omie,
        codigo_produto: produtoSelecionado.codigo_produto
      });
      if (response.data.success) {
        setHistorico(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar histórico');
    } finally {
      setLoadingHistorico(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Dashboard OMIE - Histórico de Vendas
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Busque clientes e produtos para visualizar o histórico de vendas e últimos valores
        </p>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #dc2626', padding: '16px', borderRadius: '8px', marginBottom: '20px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb', marginBottom: '16px' }}>🔍 Buscar Cliente</h2>
            <input type="text" placeholder="Digite razão social, CNPJ ou nome..." value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && buscarClientes()} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }} />
            <button onClick={buscarClientes} disabled={loadingClientes} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: loadingClientes ? 0.6 : 1 }}>
              {loadingClientes ? 'Buscando...' : 'Buscar Cliente'}
            </button>
            {clientes.length > 0 && (
              <div style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                {clientes.map((cliente) => (
                  <div key={cliente.codigo_cliente_omie} onClick={() => setClienteSelecionado(cliente)} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', background: clienteSelecionado?.codigo_cliente_omie === cliente.codigo_cliente_omie ? '#dbeafe' : 'white' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{cliente.razao_social}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>CNPJ: {cliente.cnpj_cpf}</div>
                    {(cliente.cidade || cliente.estado) && (
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {cliente.cidade}{cliente.cidade && cliente.estado && ' - '}{cliente.estado}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#10b981', marginBottom: '16px' }}>📦 Buscar Produto</h2>
            <input type="text" placeholder="Digite descrição ou código do produto..." value={buscaProduto} onChange={(e) => setBuscaProduto(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && buscarProdutos()} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }} />
            <button onClick={buscarProdutos} disabled={loadingProdutos} style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: loadingProdutos ? 0.6 : 1 }}>
              {loadingProdutos ? 'Buscando...' : 'Buscar Produto'}
            </button>
            {produtos.length > 0 && (
              <div style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                {produtos.map((produto: any) => (
                  <div key={produto.codigo_produto} onClick={() => setProdutoSelecionado(produto)} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', background: produtoSelecionado?.codigo_produto === produto.codigo_produto ? '#d1fae5' : 'white' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{produto.descricao}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Código: {produto.codigo}</div>
                    {produto.codigo_original && (
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Cód. Original: {produto.codigo_original}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {clienteSelecionado && produtoSelecionado && (
          <div style={{ background: '#dbeafe', border: '1px solid #3b82f6', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e40af', marginBottom: '8px' }}>Seleção Atual:</div>
            <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
              <strong>Cliente:</strong> {clienteSelecionado.razao_social} ({clienteSelecionado.cnpj_cpf})
            </div>
            <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
              <strong>Produto:</strong> {produtoSelecionado.descricao} ({produtoSelecionado.codigo})
            </div>
          </div>
        )}

        {loadingHistorico && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', fontSize: '16px', color: '#6b7280' }}>
            Carregando histórico de vendas...
          </div>
        )}

        {historico && !loadingHistorico && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#7c3aed', marginBottom: '24px' }}>📊 Histórico de Vendas</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f3e8ff', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#7c3aed', marginBottom: '8px', fontWeight: '500' }}>📦 Total Pedidos</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6b21a8' }}>{historico.resumo.total_pedidos}</div>
              </div>
              <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>📈 Qtd. Total</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>{historico.resumo.quantidade_total}</div>
              </div>
              <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#059669', marginBottom: '8px', fontWeight: '500' }}>💰 Último Valor</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857' }}>
                  R$ {(historico.resumo.ultimo_valor || 0).toFixed(2)}
                </div>
              </div>
              <div style={{ background: '#fed7aa', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#ea580c', marginBottom: '8px', fontWeight: '500' }}>📅 Última Data</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2410c' }}>{historico.resumo.ultima_data}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Histórico Detalhado ({historico.historico.length} vendas)
            </h3>

            {historico.historico.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>PEDIDO</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>DATA</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>QTD</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>VALOR UNIT.</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.historico.map((item: HistoricoItem, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{item.pedido_numero}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>{item.data_pedido}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>{item.quantidade}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                          R$ {(item.valor_unitario || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#047857', fontWeight: 'bold' }}>
                          R$ {(item.valor_total || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Nenhuma venda encontrada para este produto e cliente.
              </div>
            )}
          </div>
        )}

        {!historico && clienteSelecionado && produtoSelecionado && !loadingHistorico && (
          <div style={{ background: 'white', padding: '60px', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
            Selecione um cliente e um produto para ver o histórico de vendas
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
