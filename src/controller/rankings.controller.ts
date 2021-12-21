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
        await this.rankingService.index().then(rankings => {
            return res.send(rankings);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
    }
}