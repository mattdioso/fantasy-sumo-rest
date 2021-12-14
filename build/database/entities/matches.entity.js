"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEntity = void 0;
const typeorm_1 = require("typeorm");
const techniques_entity_1 = require("./techniques.entity");
const wrestler_entity_1 = require("./wrestler.entity");
let MatchEntity = class MatchEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], MatchEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => wrestler_entity_1.WrestlerEntity, idWrestler1 => idWrestler1.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", String)
], MatchEntity.prototype, "idWrestler1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "win1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "winByForfeit1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => wrestler_entity_1.WrestlerEntity, idWrestler2 => idWrestler2.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", String)
], MatchEntity.prototype, "idWrestler2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "win2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "winByForfeit2", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => techniques_entity_1.TechniqueEntity, winTechnique => winTechnique.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", String)
], MatchEntity.prototype, "winTechnique", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "matchNum", void 0);
MatchEntity = __decorate([
    (0, typeorm_1.Entity)('matches')
], MatchEntity);
exports.MatchEntity = MatchEntity;
