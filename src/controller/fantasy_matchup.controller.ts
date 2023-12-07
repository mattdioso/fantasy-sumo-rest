import { Router, Response, Request } from "express";
import { FantasyMatchupEntity } from "../database/entities/fantasy_matchup.entity";
import { FantasyMatchupService } from "../services/fantasy_matchup.service";

export class FantasyMatchupController {
    public router: Router;
    private fantasyMatchupService: FantasyMatchupService;

    constructor() {
        this.fantasyMatchupService = new FantasyMatchupService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response)=> {
        await this.fantasyMatchupService.index().then(tournaments => {
            return res.send(tournaments);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_matchup = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.fantasyMatchupService.get_fantasy_matchup(id).then(matchup => {
            return res.send(matchup);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async(req: Request, res: Response) => {
        const tourney = req['body'] as FantasyMatchupEntity;
        await this.fantasyMatchupService.create(tourney).then(new_matchup => {
            return res.send(new_matchup);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async(req: Request, res: Response) => {
        const tournament = req['body'] as FantasyMatchupEntity;
        const id = req['params']['id'];
        await this.fantasyMatchupService.update(tournament, id).then(updated_matchup => {
            return res.send(updated_matchup);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public delete = async(req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.fantasyMatchupService.delete(id).then(() => {
            res.sendStatus(204);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {

    }
}