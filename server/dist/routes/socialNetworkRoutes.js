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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const socialNetworks_1 = require("../services/socialNetworks");
const networkModel_1 = require("../models/network/networkModel");
const router = (0, express_1.Router)();
router.get('/network/:network/graph', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { network } = req.params;
    const graph = yield (0, socialNetworks_1.getSocialNetworkGraph)(network);
    res.json({ graph });
})));
router.get('/network/:network/isolated', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { network } = req.params;
    const networkConnections = yield (0, networkModel_1.getNetworkConnections)(network);
    res.json({ count: networkConnections.isolated });
})));
exports.default = router;
