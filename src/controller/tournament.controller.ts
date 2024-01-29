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
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_tournaent = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.tournamentService.get_tournament(id).then(tournament => {
            return res.send(tournament);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_tournament_matches = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.tournamentService.get_tournament_matches(id).then(matches => {
            return res.send(matches);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    // public get_tournament_days = async(req: Request, res: Response) => {
    //   let id = req['params']['id'];
    //   await this.tournamentService.get_tournament(id).then(tournament => {
    //       return res.send(tournament!.days);
    //   }).catch(err => {
    //       return res.sendStatus(500).send({
    //         message: err.message || "some error occured"
    //       });
    //   });
    // }

    public create = async (req: Request, res: Response) => {
        const tourney = req['body'] as TournamentEntity;
        await this.tournamentService.create(tourney).then(new_tourney => {
            return res.send(new_tourney);
        }).catch(err => {
            console.log(err)
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

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.tournamentService.delete(id).then(() => {
            res.sendStatus(204);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        })
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_tournaent);
        this.router.get('/:id/matches', this.get_tournament_matches);
        // this.router.get('/:id/days', this.get_tournament_days);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete("/:id", this.delete);
    }
}
