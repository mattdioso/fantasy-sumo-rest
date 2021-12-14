"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const wrestler_controller_1 = require("./controller/wrestler.controller");
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const techniques_controller_1 = require("./controller/techniques.controller");
const matches_controller_1 = require("./controller/matches.controller");
const rankings_controller_1 = require("./controller/rankings.controller");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.configuration();
        this.routes();
        dotenv.config();
        console.log(__dirname + '/../src/database/entities/**/*{.ts,.js}');
    }
    configuration() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
    }
    routes() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, typeorm_1.createConnection)({
                type: "postgres",
                host: "192.168.0.54",
                port: 5432,
                username: "matt",
                password: "!Univega1986",
                database: "sumo",
                entities: [__dirname + "/database/entities/**/*{.ts,.js}"],
                synchronize: true,
                name: "sumo"
            });
            this.wrestlerController = new wrestler_controller_1.WrestlerController();
            this.techniqueController = new techniques_controller_1.TechniqueController();
            this.matchesController = new matches_controller_1.MatchController();
            this.rankingsController = new rankings_controller_1.RankingsController();
            this.app.use('/api/wrestlers', this.wrestlerController.router);
            this.app.use('/api/techniques', this.techniqueController.router);
            this.app.use('/api/matches', this.matchesController.router);
            this.app.use('/api/rankings', this.rankingsController.router);
            this.app.get('/', (req, res) => {
                res.send("Hello world!");
            });
        });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening ${this.app.get('port')} port.`);
        });
    }
}
const server = new Server();
server.start();
