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
exports.MatchService = void 0;
const typeorm_1 = require("typeorm");
const matches_entity_1 = require("../database/entities/matches.entity");
class MatchService {
    constructor() {
        this.index = () => __awaiter(this, void 0, void 0, function* () {
            const matches = yield this.match_repository.find();
            return matches;
        });
        this.create = (match) => __awaiter(this, void 0, void 0, function* () {
            const new_match = yield this.match_repository.create(match);
            yield this.match_repository.save(new_match);
            return new_match;
        });
        this.update = (match, id) => __awaiter(this, void 0, void 0, function* () {
            const updated_match = yield this.match_repository.update(id, match);
            return updated_match;
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const deleted_match = yield this.match_repository.delete(id);
            return deleted_match;
        });
        this.match_repository = (0, typeorm_1.getConnection)("sumo").getRepository(matches_entity_1.MatchEntity);
    }
}
exports.MatchService = MatchService;
