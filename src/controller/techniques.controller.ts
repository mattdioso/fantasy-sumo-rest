import { Router, Response, Request } from 'express';
import { resourceLimits } from 'worker_threads';
import { TechniqueEntity } from '../database/entities/techniques.entity';
import { SearchService } from '../services/search.service';
import { TechniqueService } from '../services/techniques.service';

export class TechniqueController {
    public router: Router;
    private techniqueService: TechniqueService;
    private searchService: SearchService;

    constructor() {
        this.techniqueService = new TechniqueService();
        this.searchService = new SearchService();
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
        const techniques = await this.techniqueService.index().then(techniques => {
            return res.send(techniques);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_technique = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.techniqueService.get_technique(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const technique = req['body'] as TechniqueEntity;
        console.log(technique);
        await this.techniqueService.create(technique).then(created_technique => {
            return res.send(created_technique);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        const technique = req['body'] as TechniqueEntity;
        const id = req['params']['id'];
        await this.techniqueService.update(technique, id).then(updated_technique => {
            return res.send(updated_technique);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        })
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.techniqueService.delete(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public search = async (req: Request, res: Response) => {
        const search = req['body']['technique'];
        await this.searchService.search_technique(search).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
        
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_technique);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
        this.router.post('/search', this.search);
    }
}