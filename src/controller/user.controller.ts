import { Router, Response, Request } from 'express';
import { resolve } from 'path';
import { UserEntity } from '../database/entities/user.entity';
import { UserService } from '../services/user.service';

export class UserController {
    public router: Router;
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    public index = async(req: Request, res: Response) => {
        await this.userService.index().then(users => {
            return res.send(users);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_user = async(req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.userService.get_user(id).then(user => {
            return res.send(user);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        let user = req['body'] as UserEntity;
        await this.userService.create_user(user).then(new_user => {
            return res.send(new_user);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public update = async (req: Request, res: Response) => {
        let user = req['body'] as UserEntity;
        let id = req['params']['id'];
        await this.userService.update(user, id).then(updated_user => {
            return res.send(updated_user);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public avatar = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.userService.get_user(id).then(user => {
            let path = resolve(__dirname + `/../../python/user_pics/${user!.lastname}.jpg`);
            return res.sendFile(path);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_user);
        this.router.get('/:id/avatar', this.avatar);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
    }
}