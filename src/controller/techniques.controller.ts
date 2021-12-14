import { Router, Response, Request } from 'express';
import { TechniqueEntity } from '../database/entities/techniques.entity';
import { TechniqueService } from '../services/techniques.service';

export class TechniqueController {
    public router: Router;
    private techniqueService: TechniqueService;

    constructor() {
        this.techniqueService = new TechniqueService();
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
        const techniques = await this.techniqueService.index();
        res.send(techniques).json();
    }

    public create = async (req: Request, res: Response) => {
        const technique = req['body'] as TechniqueEntity;
        console.log(technique);
        const new_technique = await this.techniqueService.create(technique);
        res.send(new_technique).json();
    }

    public update = async (req: Request, res: Response) => {
        const technique = req['body'] as TechniqueEntity;
        const id = req['params']['id'];
        const updated_technique = await this.techniqueService.update(technique, id);
        res.send(updated_technique).json();
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        const deleted_technique = await this.techniqueService.delete(id);
        res.send(deleted_technique).json();
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}