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
exports.RankingsService = void 0;
const typeorm_1 = require("typeorm");
const rankings_entity_1 = require("../database/entities/rankings.entity");
class RankingsService {
    constructor() {
        this.index = () => __awaiter(this, void 0, void 0, function* () {
            const rankings = yield this.rankings_repository.find();
            return rankings;
        });
        this.rankings_repository = (0, typeorm_1.getConnection)("sumo").getRepository(rankings_entity_1.RankingsEntity);
    }
}
exports.RankingsService = RankingsService;
