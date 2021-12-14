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
exports.TechniqueController = void 0;
const express_1 = require("express");
const techniques_service_1 = require("../services/techniques.service");
class TechniqueController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const techniques = yield this.techniqueService.index();
            res.send(techniques).json();
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const technique = req['body'];
            console.log(technique);
            const new_technique = yield this.techniqueService.create(technique);
            res.send(new_technique).json();
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const technique = req['body'];
            const id = req['params']['id'];
            const updated_technique = yield this.techniqueService.update(technique, id);
            res.send(updated_technique).json();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req['params']['id'];
            const deleted_technique = yield this.techniqueService.delete(id);
            res.send(deleted_technique).json();
        });
        this.techniqueService = new techniques_service_1.TechniqueService();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}
exports.TechniqueController = TechniqueController;
