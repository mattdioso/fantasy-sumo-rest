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
exports.TechniqueService = void 0;
const typeorm_1 = require("typeorm");
const techniques_entity_1 = require("../database/entities/techniques.entity");
class TechniqueService {
    constructor() {
        this.index = () => __awaiter(this, void 0, void 0, function* () {
            const techniques = yield this.technique_repository.find();
            return techniques;
        });
        this.create = (technique) => __awaiter(this, void 0, void 0, function* () {
            const new_technique = yield this.technique_repository.create(technique);
            yield this.technique_repository.save(new_technique);
            return new_technique;
        });
        this.update = (techique, id) => __awaiter(this, void 0, void 0, function* () {
            const updated_technique = yield this.technique_repository.update(id, techique);
            return updated_technique;
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const deleted_technique = yield this.technique_repository.delete(id);
            return deleted_technique;
        });
        this.technique_repository = (0, typeorm_1.getConnection)("sumo").getRepository(techniques_entity_1.TechniqueEntity);
    }
}
exports.TechniqueService = TechniqueService;
