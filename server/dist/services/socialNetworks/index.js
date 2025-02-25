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
exports.getAllSocialNetworksGraphs = exports.getSocialNetworkGraph = void 0;
const facebookService_1 = __importDefault(require("./facebookService"));
const twitterService_1 = __importDefault(require("./twitterService"));
const facebookServiceStub_1 = __importDefault(require("./facebookServiceStub"));
const twitterServiceStub_1 = __importDefault(require("./twitterServiceStub"));
const tryCatch_1 = require("../../common/tryCatch");
// this could come from a .env file, a config file or it could be a parameter of the function/request
const useStubs = true;
const services = {
    facebook: useStubs ? facebookServiceStub_1.default : facebookService_1.default,
    twitter: useStubs ? twitterServiceStub_1.default : twitterService_1.default,
};
const getService = (network) => {
    return services[network];
};
const getSocialNetworkGraph = (network) => __awaiter(void 0, void 0, void 0, function* () {
    const service = getService(network);
    if (!service) {
        console.error(`Service for network ${network} not found`);
        return null;
    }
    const result = yield (0, tryCatch_1.tryCatch)(service.getGraph());
    if (result.error) {
        return null;
    }
    return result.data;
});
exports.getSocialNetworkGraph = getSocialNetworkGraph;
const getAllSocialNetworksGraphs = () => __awaiter(void 0, void 0, void 0, function* () {
    const networks = Object.keys(services);
    const graphs = yield Promise.all(networks.map(exports.getSocialNetworkGraph));
    // TODO: Not deciding right now how to deal with the unhappy path/error handling, removing errors for now
    return graphs.filter((graph) => graph !== null);
});
exports.getAllSocialNetworksGraphs = getAllSocialNetworksGraphs;
exports.default = {
    getSocialNetworkGraph: exports.getSocialNetworkGraph,
    getAllSocialNetworksGraphs: exports.getAllSocialNetworksGraphs
};
