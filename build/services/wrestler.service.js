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
exports.WrestlerService = void 0;
const typeorm_1 = require("typeorm");
const wrestler_entity_1 = require("../database/entities/wrestler.entity");
class WrestlerService {
    constructor() {
        this.index = () => __awaiter(this, void 0, void 0, function* () {
            const wrestlers = yield this.wrestler_repository.find();
            console.log(wrestlers);
            return wrestlers;
        });
        this.create = (wrestler) => __awaiter(this, void 0, void 0, function* () {
            const new_wrestler = yield this.wrestler_repository.create(wrestler);
            const results = yield this.wrestler_repository.save(new_wrestler);
            console.log(results);
            return new_wrestler;
        });
        this.update = (wrestler, id) => __awaiter(this, void 0, void 0, function* () {
            const updated_wrestler = yield this.wrestler_repository.update(id, wrestler);
            return updated_wrestler;
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const deleted_wrestler = yield this.wrestler_repository.delete(id);
            return deleted_wrestler;
        });
        this.wrestler_repository = (0, typeorm_1.getConnection)("sumo").getRepository(wrestler_entity_1.WrestlerEntity);
    }
}
exports.WrestlerService = WrestlerService;
