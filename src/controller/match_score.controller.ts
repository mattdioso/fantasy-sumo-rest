import { Router, Response, Request } from 'express';
import { MatchScores } from '../database/entities/match_scores';
import { MatchScoreService } from '../services/match_score.service';

export class MatchScoreController {
    public router: Router;
    private match_score_service: MatchScoreService;

    constructor() {
        this.match_score_service = new MatchScoreService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        await this.match_score_service.index().then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        let match = req['body'];
        for (let i = 0; i < match.length; i ++) {
            this.match_score_service.create_match_score(match[i]);
        }
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.post('/', this.create);
    }
}