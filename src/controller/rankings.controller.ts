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

    public get_tournament_rankings = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.rankingService.get_tournament_rankings(id).then(rankings => {
            return res.send(rankings);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const ranking = req['body'] as RankingsEntity;
        await this.rankingService.create(ranking).then(new_ranking => {
            return res.send(new_ranking);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        const rank = req['body'] as RankingsEntity;
        const id = req['params']['id'];
        await this.rankingService.update(rank, id).then(updated_rank => {
            return res.send(updated_rank);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.rankingService.delete(id).then(deleted_rank => {
            return res.send(deleted_rank);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_tournament_rankings);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}