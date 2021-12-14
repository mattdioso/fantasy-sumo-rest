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
exports.WrestlerEntity = void 0;
const typeorm_1 = require("typeorm");
let WrestlerEntity = class WrestlerEntity {
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getRingname() {
        return this.ringname;
    }
    setRingname(ringname) {
        this.ringname = ringname;
    }
    getFamilyname() {
        return this.familyname;
    }
    setFamilyname(ringfamilyname) {
        this.familyname = this.familyname;
    }
    getGivenname() {
        return this.givenname;
    }
    setGivenname(givenname) {
        this.givenname = givenname;
    }
    getBirthdate() {
        return this.birthdate;
    }
    setBirthdate(birthdate) {
        this.birthdate = birthdate;
    }
    getBirthplace() {
        return this.birthplace;
    }
    setBirthplace(birthplace) {
        this.birthplace = birthplace;
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
    }
    getWeight() {
        return this.weight;
    }
    setWeight(weight) {
        this.weight = weight;
    }
    getIdstable() {
        return this.idstable;
    }
    setIdstable(idstable) {
        this.idstable = idstable;
    }
    getRetired() {
        return this.retired;
    }
    setRetired(retired) {
        this.retired = retired;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", Number)
], WrestlerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", String)
], WrestlerEntity.prototype, "ringname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", String)
], WrestlerEntity.prototype, "familyname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", String)
], WrestlerEntity.prototype, "givenname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", String)
], WrestlerEntity.prototype, "birthdate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", String)
], WrestlerEntity.prototype, "birthplace", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "real",
        nullable: false
    }),
    __metadata("design:type", Number)
], WrestlerEntity.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "real",
        nullable: false
    }),
    __metadata("design:type", Number)
], WrestlerEntity.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        nullable: true
    }),
    __metadata("design:type", Number)
], WrestlerEntity.prototype, "idstable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 45,
        nullable: false
    }),
    __metadata("design:type", Boolean)
], WrestlerEntity.prototype, "retired", void 0);
WrestlerEntity = __decorate([
    (0, typeorm_1.Entity)('wrestlers')
], WrestlerEntity);
exports.WrestlerEntity = WrestlerEntity;
