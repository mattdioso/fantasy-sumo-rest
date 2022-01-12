import { Router, Response, Request } from 'express';
import { TeamEntity } from '../database/entities/team.entity';
import { TeamService } from '../services/team.service';

export class TeamController {
    public router: Router;
    private teamService: TeamService;

    constructor() {
        this.teamService = new TeamService();
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
        await this.teamService.index().then(teams => {
            return res.send(teams);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_team = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.teamService.get_team(id).then(team => {
            return res.send(team);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        let team = req['body'] as TeamEntity;
        await this.teamService.create(team).then(new_team => {
            return res.send(new_team);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        let team = req['body'] as TeamEntity;
        let id = req['params']['id'];
        await this.teamService.update(team, id).then(updated_team => {
            return res.send(updated_team);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public delete = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.teamService.delete(id).then(deleted_team => {
            return res.send(deleted_team);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        })
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_team);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
}