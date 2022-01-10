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
        this.matchRepository = getConnection("default").getRepository(MatchEntity);
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
       await this.dayService.index().then(days => {
           return res.send(days);
       }).catch(err => {
           return res.sendStatus(500).send({
               message: err.message || "some error occured"
           })
       });
    }

    public get_day = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.dayService.get_day(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const day = req['body'] as DaysEntity;
        await this.dayService.create(day).then(new_day => {
            return res.send(new_day);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        const day = req['body'] as DaysEntity;
        const id = req['params']['id'];
        await this.dayService.update(day, id).then(updated_day => {
            return res.send(updated_day);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        })

    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_day);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
    }
}