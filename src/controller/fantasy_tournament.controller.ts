import { Router, Response, Request } from 'express';
import { FantasyTournamentEntity } from '../database/entities/fantasy_tournament.entity';
import { FantasyTournamentService } from '../services/fantasy_tournament.service';
import { TournamentController } from './tournament.controller';
import { TeamEntity } from '../database/entities/team.entity';

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
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_fantasy_tournament = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.fantasyTournamentService.get_fantasy_tournament(id).then(tournament => {
            return res.send(tournament);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_tournament_matches = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.fantasyTournamentService.get_fantasy_tournament_matches(id).then(matches => {
            return res.send(matches)
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_fantasy_tournament_tournament = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.fantasyTournamentService.get_fantasy_tournament_tournament(id).then(result => {
            return res.send(result)
        }).catch(err => {
            console.log(err);
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
        this.router.get('/:id', this.get_fantasy_tournament);
        this.router.get('/:id/tournament', this.get_fantasy_tournament_tournament);
        this.router.get('/:id/matches', this.get_tournament_matches);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}