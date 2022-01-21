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
        await this.matchService.index().then(result => {
            return res.send(result);
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
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}