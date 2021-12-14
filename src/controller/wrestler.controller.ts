import { Router, Response, Request } from 'express';
import { WrestlerEntity } from '../database/entities/wrestler.entity';
import { WrestlerService } from '../services/wrestler.service';

export class WrestlerController {
    public router: Router;
    private wrestlerService: WrestlerService;

    constructor() {
        this.wrestlerService = new WrestlerService();
        this.router = Router();
        this.routes();
    }

    public index = async ( req: Request, res: Response) => {
        const wrestlers = await this.wrestlerService.index();
        res.send(wrestlers).json();
    }

    public create = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        const new_wrestler = await this.wrestlerService.create(wrestler);
        res.send(new_wrestler).json();
    }

    public update = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        const id = req['params']['id'];
        const updated_wrestler = await this.wrestlerService.update(wrestler, id);
        res.send(updated_wrestler).json();
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        const deleted_wrestler = await this.wrestlerService.delete(id);
        res.send(deleted_wrestler).json();
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}