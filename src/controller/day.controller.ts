import { Router, Response, Request } from 'express';
import { getConnection } from 'typeorm';
import { DaysEntity } from '../database/entities/day.entity';
import { MatchEntity } from '../database/entities/matches.entity';
import { MatchRepository } from '../repository/matches.repository';
import { DaysService } from '../services/day.service';
import { MatchService } from '../services/matches.service';

export class DayController {
    public router: Router;
    private dayService: DaysService;
    private matchRepository: MatchRepository;

    constructor() {
        this.dayService = new DaysService();
        this.matchRepository = getConnection("sumo").getRepository(MatchEntity);
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
        const days = await this.dayService.index();
        res.send(days).json();
    }

    public create = async (req: Request, res: Response) => {
        const day = req['body'] as DaysEntity;
        const new_day = await this.dayService.create(day);
        res.send(new_day).json();
    }

    public update = async (req: Request, res: Response) => {
        const day = req['body'] as DaysEntity;
        const id = req['params']['id'];
        const updated_day = await this.dayService.update(day, id);
        res.send(updated_day).json();
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
    }
}