import { Router, Response, Request } from 'express';
import { MatchEntity } from '../database/entities/matches.entity';
import { MatchService } from '../services/matches.service';

export class MatchController {
    public router: Router;
    private matchService: MatchService;

    constructor() {
        this.matchService = new MatchService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        const matches = await this.matchService.index();
        res.send(matches).json();
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
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}