"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var omie_service_1 = require("../services/omie.service");
var router = (0, express_1.Router)();
var omieService = new omie_service_1.OmieService();
// Buscar clientes
router.post('/clientes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, razao_social, cnpj_cpf, nome_fantasia, clientes, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, razao_social = _a.razao_social, cnpj_cpf = _a.cnpj_cpf, nome_fantasia = _a.nome_fantasia;
                console.log('Buscando clientes com:', { razao_social: razao_social, cnpj_cpf: cnpj_cpf, nome_fantasia: nome_fantasia });
                return [4 /*yield*/, omieService.buscarClientes({
                        razao_social: razao_social,
                        cnpj_cpf: cnpj_cpf,
                        nome_fantasia: nome_fantasia
                    })];
            case 1:
                clientes = _c.sent();
                res.json({
                    success: true,
                    count: clientes.length,
                    data: clientes
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('Erro ao buscar clientes:', error_1);
                res.status(500).json({
                    success: false,
                    error: error_1.message || 'Erro ao buscar clientes',
                    details: ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) || undefined
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Buscar produtos
router.post('/produtos', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, descricao, codigo, produtos, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, descricao = _a.descricao, codigo = _a.codigo;
                console.log('Buscando produtos com:', { descricao: descricao, codigo: codigo });
                return [4 /*yield*/, omieService.buscarProdutos({
                        descricao: descricao,
                        codigo: codigo
                    })];
            case 1:
                produtos = _c.sent();
                res.json({
                    success: true,
                    count: produtos.length,
                    data: produtos
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                console.error('Erro ao buscar produtos:', error_2);
                res.status(500).json({
                    success: false,
                    error: error_2.message || 'Erro ao buscar produtos',
                    details: ((_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) || undefined
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Buscar cliente por ID
router.get('/clientes/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, cliente, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, omieService.buscarClientePorId(id)];
            case 1:
                cliente = _b.sent();
                if (!cliente) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Cliente n�o encontrado'
                        })];
                }
                res.json({
                    success: true,
                    data: cliente
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Erro ao buscar cliente:', error_3);
                res.status(500).json({
                    success: false,
                    error: error_3.message || 'Erro ao buscar cliente',
                    details: ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || undefined
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Buscar produto por ID
router.get('/produtos/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, produto, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, omieService.buscarProdutoPorId(id)];
            case 1:
                produto = _b.sent();
                if (!produto) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Produto n�o encontrado'
                        })];
                }
                res.json({
                    success: true,
                    data: produto
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Erro ao buscar produto:', error_4);
                res.status(500).json({
                    success: false,
                    error: error_4.message || 'Erro ao buscar produto',
                    details: ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || undefined
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
