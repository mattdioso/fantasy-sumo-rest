import { prototype } from 'events';
import express, {Request, Response} from 'express';
import { createConnection } from 'typeorm';
import { WrestlerController } from './controller/wrestler.controller';
import "reflect-metadata";
import * as dotenv from 'dotenv';
import { TechniqueController } from './controller/techniques.controller';
import { MatchController } from './controller/matches.controller';
import { RankingsController } from './controller/rankings.controller';
import { TournamentController } from './controller/tournament.controller';
import { DayController } from './controller/day.controller';
import { UserController } from './controller/user.controller';
import { TeamController } from './controller/team.controller';
import { MatchScoreController } from './controller/match_score.controller';


class Server {
    private app: express.Application;
    private wrestlerController: WrestlerController;
    private techniqueController: TechniqueController;
    private matchesController: MatchController;
    private rankingsController: RankingsController;
    private tournamentController: TournamentController;
    private dayController: DayController;
    private userController: UserController;
    private teamController: TeamController;
    private matchScoreController: MatchScoreController;

    constructor() {
        this.app = express();
        this.configuration();
        this.routes();
        dotenv.config();
    }

    public configuration() {
        this.app.set('port', process.env.PORT || 5000);
        this.app.use(express.json());
        var cors = require('cors');
        this.app.use(cors());
    }

    public async routes() {
        const connection = await createConnection();
        this.wrestlerController = new WrestlerController();
        this.techniqueController = new TechniqueController();
        this.matchesController = new MatchController();
        this.rankingsController = new RankingsController();
        this.tournamentController = new TournamentController();
        this.dayController = new DayController();
        this.userController = new UserController();
        this.teamController = new TeamController();
        this.matchScoreController = new MatchScoreController();
        this.app.use('/api/wrestlers', this.wrestlerController.router);
        this.app.use('/api/techniques', this.techniqueController.router);
        this.app.use('/api/matches', this.matchesController.router);
        this.app.use('/api/rankings', this.rankingsController.router);
        this.app.use('/api/tournaments', this.tournamentController.router);
        this.app.use('/api/days', this.dayController.router);
        this.app.use('/api/users', this.userController.router);
        this.app.use('/api/teams', this.teamController.router);
        this.app.use('/api/match_score', this.matchScoreController.router);
        this.app.get('/', (req: Request, res: Response) => {
            res.send("Hello world!");
        });
    }

    public start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening ${this.app.get('port')} port.`);
        });
    }
}

const server = new Server();
server.start();
