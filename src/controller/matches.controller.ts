import { Router, Response, Request } from 'express';
import { MatchEntity } from '../database/entities/matches.entity';
import { MatchService } from '../services/matches.service';
import { MatchScoreService } from '../services/match_score.service';

export class MatchController {
    public router: Router;
    private matchService: MatchService;
    private match_score_service: MatchScoreService;

    constructor() {
        this.matchService = new MatchService();
        this.match_score_service = new MatchScoreService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        await this.matchService.index().then(result => {
            return res.send(JSON.stringify(result));
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured on the server"
            })
        });   
    }

    public get_match = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.matchService.get_match(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_match_score = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.match_score_service.get_match_score(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create_match_score = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.match_score_service.create_match_score(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const match = req['body'] as MatchEntity;
        const new_match = await this.matchService.create(match);
        res.send(new_match);
    }

    public update = async (req: Request, res: Response) => {
        const match = req['body'] as MatchEntity;
        const id = req['params']['id'];
        const updated_match = await this.matchService.update(match, id);
        res.send(updated_match).json();
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        const deleted_match = await this.matchService.delete(id);
        res.send(deleted_match).json();
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_match);
        this.router.get('/:id/score', this.get_match_score);
        this.router.post('/', this.create);
        this.router.post('/:id/score', this.create_match_score);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}