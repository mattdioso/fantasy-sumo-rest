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
        await this.tournamentService.index().then(tournaments => {
            return res.send(tournaments);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const tourney = req['body'] as TournamentEntity;
        await this.tournamentService.create(tourney).then(new_tourney => {
            return res.send(new_tourney);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        const tournament = req['body'] as TournamentEntity;
        const id = req['params']['id'];
        await this.tournamentService.update(tournament, id).then(updated_tourney => {
            return res.send(updated_tourney);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
    }
}