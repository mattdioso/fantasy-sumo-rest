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
exports.MatchController = void 0;
const express_1 = require("express");
const matches_service_1 = require("../services/matches.service");
class MatchController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const matches = yield this.matchService.index();
            res.send(matches).json();
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const match = req['body'];
            const new_match = yield this.matchService.create(match);
            res.send(new_match).json();
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const match = req['body'];
            const id = req['params']['id'];
            const updated_match = yield this.matchService.update(match, id);
            res.send(updated_match).json();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req['params']['id'];
            const deleted_match = yield this.matchService.delete(id);
            res.send(deleted_match).json();
        });
        this.matchService = new matches_service_1.MatchService();
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
exports.MatchController = MatchController;
