import { Router, Response, Request } from 'express';
import { FantasyTournamentEntity } from '../database/entities/fantasy_tournament.entity';
import { FantasyTournamentService } from '../services/fantasy_tournament.service';

export class FantasyTournamentController {
    public router: Router;
    private fantasyTournamentService: FantasyTournamentService;

    constructor() {
        this.fantasyTournamentService = new FantasyTournamentService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response)=> {
        await this.fantasyTournamentService.index().then(tournaments => {
            return res.send(tournaments);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_tournament = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.fantasyTournamentService.get_fantasy_tournament(id).then(tournament => {
            return res.send(tournament);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async(req: Request, res: Response) => {
        const tourney = req['body'] as FantasyTournamentEntity;
        await this.fantasyTournamentService.create(tourney).then(new_tourney => {
            return res.send(new_tourney);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async(req: Request, res: Response) => {
        const tournament = req['body'] as FantasyTournamentEntity;
        const id = req['params']['id'];
        await this.fantasyTournamentService.update(tournament, id).then(updated_tourney => {
            return res.send(updated_tourney);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public delete = async(req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.fantasyTournamentService.delete(id).then(() => {
            res.sendStatus(204);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_tournament);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}