"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmieService = void 0;
var axios_1 = __importDefault(require("axios"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var OmieService = /** @class */ (function () {
    function OmieService() {
        this.credentials = {
            appKey: process.env.OMIE_APP_KEY || '',
            appSecret: process.env.OMIE_APP_SECRET || ''
        };
        if (!this.credentials.appKey || !this.credentials.appSecret) {
            console.error('⚠️  OMIE credentials not configured properly');
            console.error('Please check OMIE_APP_KEY and OMIE_APP_SECRET in .env file');
        }
        this.api = axios_1.default.create({
            baseURL: 'https://app.omie.com.br/api/v1',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    OmieService.prototype.buildRequest = function (call, params) {
        if (params === void 0) { params = {}; }
        return {
            call: call,
            app_key: this.credentials.appKey,
            app_secret: this.credentials.appSecret,
            param: [params]
        };
    };
    OmieService.prototype.buscarClientes = function (filtro) {
        return __awaiter(this, void 0, void 0, function () {
            var params, request, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        params = {
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
                        request = this.buildRequest('ListarClientes', params);
                        return [4 /*yield*/, this.api.post('/geral/clientes/', request)];
                    case 1:
                        response = _b.sent();
                        if (response.data.clientes_cadastro) {
                            return [2 /*return*/, response.data.clientes_cadastro];
                        }
                        return [2 /*return*/, []];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Erro ao buscar clientes na OMIE:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OmieService.prototype.buscarClientePorId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, request, response, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        params = {
                            codigo_cliente_omie: parseInt(id)
                        };
                        request = this.buildRequest('ConsultarCliente', params);
                        return [4 /*yield*/, this.api.post('/geral/clientes/', request)];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _e.sent();
                        console.error('Erro ao buscar cliente por ID na OMIE:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                        if ((_d = (_c = (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.faultstring) === null || _d === void 0 ? void 0 : _d.includes('não cadastrado')) {
                            return [2 /*return*/, null];
                        }
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Buscar produtos que um cliente já comprou
    OmieService.prototype.buscarProdutosDoCliente = function (codigoCliente, filtro) {
        return __awaiter(this, void 0, void 0, function () {
            var pedidos, codigosProdutosComprados_1, _i, pedidos_1, nf, produtosDetalhes, _a, _b, codigoProduto, produto, error_3, produtosFiltrados, descricaoNormalizada_1, error_4;
            var _this = this;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        console.log("\n\uD83D\uDD0D Iniciando busca de produtos para cliente ".concat(codigoCliente));
                        return [4 /*yield*/, this.buscarPedidosPorCliente(codigoCliente)];
                    case 1:
                        pedidos = _d.sent();
                        console.log("\uD83D\uDCCB Cliente possui ".concat(pedidos.length, " notas fiscais"));
                        // DEBUG: Logar primeira NF se existir
                        if (pedidos.length > 0) {
                            console.log('📄 Estrutura da primeira NF:', JSON.stringify(pedidos[0], null, 2));
                        }
                        codigosProdutosComprados_1 = new Set();
                        for (_i = 0, pedidos_1 = pedidos; _i < pedidos_1.length; _i++) {
                            nf = pedidos_1[_i];
                            if (nf.det && nf.det.length > 0) {
                                console.log("\uD83D\uDCE6 NF ".concat(((_c = nf.ide) === null || _c === void 0 ? void 0 : _c.nNF) || 'N/A', " possui ").concat(nf.det.length, " itens"));
                                nf.det.forEach(function (item, index) {
                                    var _a, _b;
                                    // Pegar o ID OMIE do produto (nCodProd)
                                    var nCodProd = (_a = item.nfProdInt) === null || _a === void 0 ? void 0 : _a.nCodProd;
                                    console.log("  Item ".concat(index + 1, ": nCodProd=").concat(nCodProd, ", xProd=").concat((_b = item.prod) === null || _b === void 0 ? void 0 : _b.xProd));
                                    if (nCodProd) {
                                        codigosProdutosComprados_1.add(nCodProd);
                                    }
                                });
                            }
                        }
                        console.log("\u2705 Cliente ".concat(codigoCliente, " comprou ").concat(codigosProdutosComprados_1.size, " produtos diferentes"));
                        console.log("\uD83D\uDCCB IDs dos produtos: [".concat(Array.from(codigosProdutosComprados_1).join(', '), "]"));
                        // Se cliente não tem pedidos, retorna vazio
                        if (codigosProdutosComprados_1.size === 0) {
                            console.log("\u2139\uFE0F Cliente ".concat(codigoCliente, " n\u00E3o possui produtos comprados"));
                            return [2 /*return*/, []];
                        }
                        produtosDetalhes = [];
                        _a = 0, _b = Array.from(codigosProdutosComprados_1);
                        _d.label = 2;
                    case 2:
                        if (!(_a < _b.length)) return [3 /*break*/, 7];
                        codigoProduto = _b[_a];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.buscarProdutoPorId(codigoProduto.toString())];
                    case 4:
                        produto = _d.sent();
                        if (produto) {
                            produtosDetalhes.push(produto);
                            console.log("\u2705 Produto ".concat(codigoProduto, " adicionado: ").concat(produto.descricao));
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _d.sent();
                        console.log("\u26A0\uFE0F Produto ".concat(codigoProduto, " n\u00E3o encontrado ou erro ao buscar"));
                        return [3 /*break*/, 6];
                    case 6:
                        _a++;
                        return [3 /*break*/, 2];
                    case 7:
                        console.log("\n\uD83D\uDCCA Total de produtos com detalhes: ".concat(produtosDetalhes.length));
                        produtosFiltrados = produtosDetalhes;
                        if (filtro === null || filtro === void 0 ? void 0 : filtro.descricao) {
                            descricaoNormalizada_1 = this.normalizarTexto(filtro.descricao);
                            console.log("\uD83D\uDD0D Aplicando filtro de descri\u00E7\u00E3o: \"".concat(filtro.descricao, "\""));
                            produtosFiltrados = produtosFiltrados.filter(function (p) {
                                var descProduto = _this.normalizarTexto(p.descricao || '');
                                var descStatus = _this.normalizarTexto(p.descricao_status || '');
                                return descProduto.includes(descricaoNormalizada_1) || descStatus.includes(descricaoNormalizada_1);
                            });
                            console.log("\u2705 Produtos ap\u00F3s filtro de descri\u00E7\u00E3o: ".concat(produtosFiltrados.length));
                        }
                        if (filtro === null || filtro === void 0 ? void 0 : filtro.codigo) {
                            console.log("\uD83D\uDD0D Aplicando filtro de c\u00F3digo: \"".concat(filtro.codigo, "\""));
                            produtosFiltrados = produtosFiltrados.filter(function (p) {
                                return p.codigo_produto == filtro.codigo ||
                                    p.codigo_produto_integracao == filtro.codigo;
                            });
                            console.log("\u2705 Produtos ap\u00F3s filtro de c\u00F3digo: ".concat(produtosFiltrados.length));
                        }
                        console.log("\n\u2705 Retornando ".concat(produtosFiltrados.length, " produtos\n"));
                        return [2 /*return*/, produtosFiltrados];
                    case 8:
                        error_4 = _d.sent();
                        console.error('❌ Erro ao buscar produtos do cliente:', error_4);
                        throw error_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    OmieService.prototype.buscarProdutos = function (filtro) {
        return __awaiter(this, void 0, void 0, function () {
            var params, request, response, produtos, descricaoLower_1, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        params = {
                            pagina: 1,
                            registros_por_pagina: 100,
                            apenas_importado_api: 'N',
                            filtrar_apenas_omiepdv: 'N',
                            exibir_caracteristicas: 'S'
                        };
                        request = this.buildRequest('ListarProdutos', params);
                        return [4 /*yield*/, this.api.post('/geral/produtos/', request)];
                    case 1:
                        response = _b.sent();
                        if (response.data.produto_servico_cadastro) {
                            produtos = response.data.produto_servico_cadastro;
                            // Filtra localmente por descrição se fornecida
                            if (filtro.descricao) {
                                descricaoLower_1 = filtro.descricao.toLowerCase();
                                produtos = produtos.filter(function (p) {
                                    var _a, _b;
                                    return ((_a = p.descricao) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(descricaoLower_1)) ||
                                        ((_b = p.descricao_status) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(descricaoLower_1));
                                });
                            }
                            // Filtra por código se fornecido
                            if (filtro.codigo) {
                                produtos = produtos.filter(function (p) {
                                    return p.codigo_produto == filtro.codigo ||
                                        p.codigo_produto_integracao == filtro.codigo;
                                });
                            }
                            return [2 /*return*/, produtos];
                        }
                        return [2 /*return*/, []];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Erro ao buscar produtos na OMIE:', ((_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data) || error_5.message);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OmieService.prototype.buscarProdutoPorId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, request, response, error_6;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        params = {
                            codigo_produto: parseInt(id)
                        };
                        console.log("\uD83D\uDD0D Buscando produto ID: ".concat(id, " com params:"), params);
                        request = this.buildRequest('ConsultarProduto', params);
                        return [4 /*yield*/, this.api.post('/geral/produtos/', request)];
                    case 1:
                        response = _f.sent();
                        console.log("\u2705 Produto ".concat(id, " encontrado: ").concat(response.data.descricao));
                        return [2 /*return*/, response.data];
                    case 2:
                        error_6 = _f.sent();
                        console.error("\u274C Erro ao buscar produto ".concat(id, ":"), ((_b = (_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.faultstring) || error_6.message);
                        if ((_e = (_d = (_c = error_6.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.faultstring) === null || _e === void 0 ? void 0 : _e.includes('não cadastrado')) {
                            return [2 /*return*/, null];
                        }
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Método de teste de conexão
    OmieService.prototype.testarConexao = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        request = this.buildRequest('ListarClientes', {
                            pagina: 1,
                            registros_por_pagina: 1,
                            apenas_importado_api: 'N'
                        });
                        return [4 /*yield*/, this.api.post('/geral/clientes/', request)];
                    case 1:
                        response = _b.sent();
                        console.log('✅ Conexão com OMIE estabelecida com sucesso');
                        return [2 /*return*/, true];
                    case 2:
                        error_7 = _b.sent();
                        console.error('❌ Erro ao conectar com OMIE:', ((_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data) || error_7.message);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Buscar notas fiscais (vendas) por cliente
    OmieService.prototype.buscarPedidosPorCliente = function (codigoCliente) {
        return __awaiter(this, void 0, void 0, function () {
            var params, request, response, error_8;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        params = {
                            pagina: 1,
                            registros_por_pagina: 500, // Max para pegar histórico completo
                            apenas_importado_api: 'N',
                            nIdCliente: codigoCliente, // ID do cliente para filtrar
                            tpNF: 1 // 1 = Saída (venda)
                        };
                        console.log("\uD83D\uDD0D Buscando NFs do cliente ".concat(codigoCliente, " com params:"), params);
                        request = this.buildRequest('ListarNF', params);
                        return [4 /*yield*/, this.api.post('/produtos/nfconsultar/', request)];
                    case 1:
                        response = _e.sent();
                        if (response.data.nfCadastro) {
                            console.log("\u2705 Encontradas ".concat(response.data.nfCadastro.length, " notas fiscais"));
                            return [2 /*return*/, response.data.nfCadastro];
                        }
                        console.log("\u26A0\uFE0F Resposta sem nfCadastro:", response.data);
                        return [2 /*return*/, []];
                    case 2:
                        error_8 = _e.sent();
                        // Se não houver registros, retorna array vazio ao invés de erro
                        if ((_c = (_b = (_a = error_8.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.faultstring) === null || _c === void 0 ? void 0 : _c.includes('Não existem registros')) {
                            console.log("\u2139\uFE0F Cliente ".concat(codigoCliente, " n\u00E3o possui notas fiscais"));
                            return [2 /*return*/, []];
                        }
                        console.error('❌ Erro ao buscar notas fiscais na OMIE:', ((_d = error_8.response) === null || _d === void 0 ? void 0 : _d.data) || error_8.message);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Buscar histórico de vendas de um produto para um cliente
    OmieService.prototype.buscarHistoricoVendas = function (codigoCliente, codigoProduto) {
        return __awaiter(this, void 0, void 0, function () {
            var pedidos, historicoVendas, _i, pedidos_2, nf, _a, _b, item, nCodProd, valorUnitario, quantidade, valorTotal, numeroNF, dataNF, resumo, error_9;
            var _this = this;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        _t.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buscarPedidosPorCliente(codigoCliente)];
                    case 1:
                        pedidos = _t.sent();
                        // DEBUG: Logar estrutura do primeiro pedido
                        if (pedidos.length > 0) {
                            console.log('🔍 DEBUG PEDIDO:', JSON.stringify(pedidos[0], null, 2));
                        }
                        historicoVendas = [];
                        for (_i = 0, pedidos_2 = pedidos; _i < pedidos_2.length; _i++) {
                            nf = pedidos_2[_i];
                            if (!nf.det || nf.det.length === 0)
                                continue;
                            // Procurar o produto nos itens da nota fiscal
                            for (_a = 0, _b = nf.det; _a < _b.length; _a++) {
                                item = _b[_a];
                                nCodProd = (_c = item.nfProdInt) === null || _c === void 0 ? void 0 : _c.nCodProd;
                                // Verificar se é o produto que procuramos
                                if (nCodProd == codigoProduto ||
                                    ((_d = item.prod) === null || _d === void 0 ? void 0 : _d.cProd) == codigoProduto.toString()) {
                                    valorUnitario = parseFloat(((_e = item.prod) === null || _e === void 0 ? void 0 : _e.vUnCom) || ((_f = item.prod) === null || _f === void 0 ? void 0 : _f.valor_unitario) || 0);
                                    quantidade = parseFloat(((_g = item.prod) === null || _g === void 0 ? void 0 : _g.qCom) || ((_h = item.prod) === null || _h === void 0 ? void 0 : _h.quantidade) || 0);
                                    valorTotal = parseFloat(((_j = item.prod) === null || _j === void 0 ? void 0 : _j.vProd) || ((_k = item.prod) === null || _k === void 0 ? void 0 : _k.valor_total) || (quantidade * valorUnitario));
                                    numeroNF = ((_l = nf.ide) === null || _l === void 0 ? void 0 : _l.nNF) || nf.numero_nf || "NF-".concat(nf.codigo_nf || 0);
                                    dataNF = ((_m = nf.ide) === null || _m === void 0 ? void 0 : _m.dEmi) || nf.data_emissao || '';
                                    historicoVendas.push({
                                        pedido_numero: numeroNF,
                                        pedido_codigo: nf.codigo_nf || ((_o = nf.ide) === null || _o === void 0 ? void 0 : _o.cNF) || 0,
                                        data_pedido: dataNF,
                                        quantidade: quantidade,
                                        valor_unitario: valorUnitario,
                                        valor_total: valorTotal,
                                        valor_desconto: parseFloat(((_p = item.prod) === null || _p === void 0 ? void 0 : _p.vDesc) || 0),
                                        produto_descricao: ((_q = item.prod) === null || _q === void 0 ? void 0 : _q.xProd) || ((_r = item.produto) === null || _r === void 0 ? void 0 : _r.descricao) || ''
                                    });
                                    console.log('✅ Venda processada:', {
                                        nf: numeroNF,
                                        data: dataNF,
                                        produto: (_s = item.prod) === null || _s === void 0 ? void 0 : _s.xProd,
                                        qtd: quantidade,
                                        valor: valorUnitario
                                    });
                                }
                            }
                        }
                        // Ordenar por data (mais recente primeiro)
                        historicoVendas.sort(function (a, b) {
                            var dateA = _this.parseDate(a.data_pedido);
                            var dateB = _this.parseDate(b.data_pedido);
                            return dateB.getTime() - dateA.getTime();
                        });
                        resumo = {
                            total_pedidos: historicoVendas.length,
                            quantidade_total: historicoVendas.reduce(function (sum, item) { return sum + item.quantidade; }, 0),
                            valor_medio: historicoVendas.length > 0
                                ? historicoVendas.reduce(function (sum, item) { return sum + item.valor_unitario; }, 0) / historicoVendas.length
                                : 0,
                            ultimo_valor: historicoVendas.length > 0 ? historicoVendas[0].valor_unitario : 0,
                            ultima_data: historicoVendas.length > 0 ? historicoVendas[0].data_pedido : ''
                        };
                        return [2 /*return*/, {
                                historico: historicoVendas,
                                resumo: resumo
                            }];
                    case 2:
                        error_9 = _t.sent();
                        console.error('Erro ao buscar histórico de vendas:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Helper para parse de data DD/MM/YYYY
    OmieService.prototype.parseDate = function (dateStr) {
        var _a = dateStr.split('/').map(Number), day = _a[0], month = _a[1], year = _a[2];
        return new Date(year, month - 1, day);
    };
    // Helper para normalizar texto (remove acentos, lowercase, trim)
    OmieService.prototype.normalizarTexto = function (texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .trim();
    };
    return OmieService;
}());
exports.OmieService = OmieService;
