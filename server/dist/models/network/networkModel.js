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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkConnections = getNetworkConnections;
const socialNetworks_1 = require("../../services/socialNetworks");
function getNetworkConnections(network) {
    return __awaiter(this, void 0, void 0, function* () {
        const graphs = yield (0, socialNetworks_1.getSocialNetworkGraph)(network);
        if (!graphs) {
            // TODO: Not deciding right now how to deal with the unhappy path/error handling, setting to 0 for now
            return { sn: network, isolated: 0 };
        }
        const isolated = graphs.people.filter((person) => !graphs.relationships.some((relationship) => relationship.startNode === person.name || relationship.endNode === person.name)).length;
        return { sn: network, isolated };
    });
}
exports.default = {
    getNetworkConnections
};
