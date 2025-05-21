import { Router, Response, Request } from 'express';
import { WrestlerEntity } from '../database/entities/wrestler.entity';
import { SearchService } from '../services/search.service';
import { WrestlerService } from '../services/wrestler.service';
import { resolve } from 'path';
import { MatchService } from '../services/matches.service';

export class WrestlerController {
    public router: Router;
    private wrestlerService: WrestlerService;
    private matchService: MatchService;
    private searchService: SearchService;

    constructor() {
        this.wrestlerService = new WrestlerService();
        this.searchService = new SearchService();
        this.matchService = new MatchService();
        this.router = Router();
        this.routes();
    }

    public index = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;
        await this.wrestlerService.index(pageSize, skip).then((data) => {
            return res.json({
                data: data?.data,
                total: data?.count,
                page,
                pageSize,
                totalPages: (Math.ceil(data?.count / pageSize)),
                hasMore: ((page) * pageSize) < data?.count
            })
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_wrestler = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.wrestlerService.get_wrestler(id).then(wrestler => {
            return res.send(wrestler);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public get_wrestler_matches = async (req: Request, res: Response) => {
        let id = req['params']['id'];
        await this.matchService.get_wrestler_match(id).then(matches => {
            return res.send(matches);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public create = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        //console.log(wrestler);
        await this.wrestlerService.create(wrestler).then(new_wrestler => {
            return res.send(new_wrestler);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });

    }

    public update = async (req: Request, res: Response) => {
        const wrestler = req['body'] as WrestlerEntity;
        const id = req['params']['id'];
        await this.wrestlerService.update(wrestler, id).then(updated_wrestler => {
            return res.send(updated_wrestler);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });

    }

    public delete = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.wrestlerService.delete(id).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });

    }

    public search = async (req: Request, res: Response) => {
        const search = req['body']['ringname'];
        await this.searchService.search_wrestler(search).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });

    }

    public avatar = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.wrestlerService.get_wrestler(id).then(wrestler => {

            let path = resolve(__dirname + `/../../python/sumo_pics/${wrestler!.ringname}.jpg`);
            return res.sendFile(path);

        }).catch(err => {
            console.log(err)
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public icon = async (req: Request, res: Response) => {
        const id = req['params']['id'];
        await this.wrestlerService.get_wrestler(id).then(wrestler => {
            let path = resolve(__dirname + `/../../python/sumo_icons/${wrestler!.ringname}_icon.jpg`);
            return res.sendFile(path);
        }).catch(err => {
            console.log(err)
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public search_wrestler_score = async (req: Request, res: Response) => {
        const wrestler_id = req['body']['wrestler_id'];
        const tournament_id = req['body']['tournament_id'];
        const day_num = req['body']['day'] as number;
        await this.searchService.search_score(wrestler_id, tournament_id, day_num).then(result => {
            return res.send(result);
        }).catch(err => {
            return res.sendStatus(500).send({
                message: err.message || "some error occured"
            })
        });
    }

    public routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.get_wrestler);
        this.router.get('/:id/matches', this.get_wrestler_matches);
        this.router.get('/:id/avatar', this.avatar);
        this.router.get('/:id/icon', this.icon);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
        this.router.post('/search', this.search);
        this.router.post('/search_score', this.search_wrestler_score);
    }
}