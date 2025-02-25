"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peopleRoutes_1 = __importDefault(require("./peopleRoutes"));
const socialNetworkRoutes_1 = __importDefault(require("./socialNetworkRoutes"));
const router = (0, express_1.Router)();
router.use('/people', peopleRoutes_1.default);
router.use('/socialNetwork', socialNetworkRoutes_1.default);
exports.default = router;
