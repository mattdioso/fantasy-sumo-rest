import { Router, Response, Request } from 'express';
import { WrestlerEntity } from '../database/entities/wrestler.entity';
import { SearchService } from '../services/search.service';
import { WrestlerService } from '../services/wrestler.service';

export class WrestlerController {
    public router: Router;
    private wrestlerService: WrestlerService;
    private searchService: SearchService;

    constructor() {
        this.wrestlerService = new WrestlerService();
        this.searchService = new SearchService();
        this.router = Router();
        this.routes();
    }

    public index = async ( req: Request, res: Response) => {
        await this.wrestlerService.index().then(wrestlers => {
            return res.send(wrestlers);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public create = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        await this.wrestlerService.create(wrestler).then(new_wrestler => {
            return res.send(new_wrestler);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public update = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        const id = req['params']['id'];
        await this.wrestlerService.update(wrestler, id).then(updated_wrestler => {
            return res.send(updated_wrestler);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.wrestlerService.delete(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public search = async (req: Request, res: Response) => {
        const search = req['body']['ringname'];
        await this.searchService.search_wrestler(search).then(result => {
            return res.send(result);
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
        this.router.delete('/:id', this.delete);
        this.router.post('/search', this.search);
    }
}