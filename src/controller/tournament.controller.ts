import { Router, Response, Request } from 'express';
import { TournamentEntity } from '../database/entities/tournament.entity';
import { TournamentService } from '../services/tournament.service';

export class TournamentController {
    public router: Router;
    private tournamentService: TournamentService;

    constructor() {
        this.tournamentService = new TournamentService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        const tournaments = await this.tournamentService.index();
        res.send(tournaments).json();
    }

    public create = async (req: Request, res: Response) => {
        const tourney = req['body'] as TournamentEntity;
        const new_tourney = await this.tournamentService.create(tourney);
        res.send(new_tourney).json();
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
    }
}