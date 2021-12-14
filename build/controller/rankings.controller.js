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
exports.RankingsController = void 0;
const express_1 = require("express");
const rankings_service_1 = require("../services/rankings.service");
class RankingsController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rankings = yield this.rankingService.index();
            res.send(rankings).json();
        });
        this.rankingService = new rankings_service_1.RankingsService();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get('/', this.index);
    }
}
exports.RankingsController = RankingsController;
