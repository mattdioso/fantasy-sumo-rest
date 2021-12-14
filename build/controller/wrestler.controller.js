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
exports.WrestlerController = void 0;
const express_1 = require("express");
const wrestler_service_1 = require("../services/wrestler.service");
class WrestlerController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wrestlers = yield this.wrestlerService.index();
            res.send(wrestlers).json();
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wrestler = req['body'];
            const new_wrestler = yield this.wrestlerService.create(wrestler);
            res.send(new_wrestler).json();
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wrestler = req['body'];
            const id = req['params']['id'];
            const updated_wrestler = yield this.wrestlerService.update(wrestler, id);
            res.send(updated_wrestler).json();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req['params']['id'];
            const deleted_wrestler = yield this.wrestlerService.delete(id);
            res.send(deleted_wrestler).json();
        });
        this.wrestlerService = new wrestler_service_1.WrestlerService();
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
exports.WrestlerController = WrestlerController;
