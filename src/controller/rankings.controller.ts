import { Router, Response, Request } from 'express';
import { RankingsEntity } from '../database/entities/rankings.entity';
import { RankingsService } from '../services/rankings.service';

export class RankingsController {
    public router: Router;
    private rankingService: RankingsService;

    constructor() {
        this.rankingService = new RankingsService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        const rankings = await this.rankingService.index();
        res.send(rankings).json();
    }

    public routes() {
        this.router.get('/', this.index);
    }
}