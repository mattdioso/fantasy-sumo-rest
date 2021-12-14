import { prototype } from 'events';
import express, {Request, Response} from 'express';
import { createConnection } from 'typeorm';
import { WrestlerController } from './controller/wrestler.controller';
import "reflect-metadata";
import * as dotenv from 'dotenv';
import { TechniqueController } from './controller/techniques.controller';
import { MatchController } from './controller/matches.controller';
import { RankingsController } from './controller/rankings.controller';

class Server {
    private app: express.Application;
    private wrestlerController: WrestlerController;
    private techniqueController: TechniqueController;
    private matchesController: MatchController;
    private rankingsController: RankingsController;

    constructor() {
        this.app = express();
        this.configuration();
        this.routes();
        dotenv.config();
        console.log(__dirname + '/../src/database/entities/**/*{.ts,.js}');
    }

    public configuration() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.json());
        
    }

    public async routes() {
        const connection = await createConnection({
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
        this.wrestlerController = new WrestlerController();
        this.techniqueController = new TechniqueController();
        this.matchesController = new MatchController();
        this.rankingsController = new RankingsController();
        this.app.use('/api/wrestlers', this.wrestlerController.router);
        this.app.use('/api/techniques', this.techniqueController.router);
        this.app.use('/api/matches', this.matchesController.router);
        this.app.use('/api/rankings', this.rankingsController.router);
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