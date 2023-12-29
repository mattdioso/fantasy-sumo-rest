import { getConnection } from "typeorm";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { WrestlerRepository } from "../repository/wrestler.repository";
import dataSource from "../database/ormconfig";
import { SearchService } from "./search.service";

export class WrestlerService {
    private wrestler_repository: WrestlerRepository;
    private searchService: SearchService;

    constructor() {
        //this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        this.wrestler_repository = dataSource.getRepository(WrestlerEntity);
        this.searchService = new SearchService();
    }

    public index = async () => {
        return await this.wrestler_repository.find();
        
    }

    public get_wrestler = async (id: string) => {
        let wrestler =  await this.wrestler_repository.findOne({
            where: {
                id: id
            }
        });
        return wrestler;
    }

    public create = async (wrestler: WrestlerEntity) => {
        let ringname = wrestler['ringname'];
        const exists = await this.checkWrestlerExists(wrestler);
        
        if (!exists) {
            const new_wrestler = await this.wrestler_repository.create(wrestler);
            //console.log(new_wrestler);
            const results = await this.wrestler_repository.save(new_wrestler);
            //console.log(results);
            return new_wrestler;
        } else {
            return {message: `${ringname} already exists`};
        }
        
    }

    public update = async (wrestler: WrestlerEntity, id: string) => {
        await this.wrestler_repository.update(id, wrestler).then(updated_wrestler => {
            return updated_wrestler;
        })
    }

    public delete = async (id: string) => {
        const deleted_wrestler = await this.wrestler_repository.delete(id);
        return deleted_wrestler;
    }

    public checkWrestlerExists = async (wrestler: WrestlerEntity) : Promise<Boolean> => {
        let ringname = wrestler['ringname'];
        let ret = false;
        await this.searchService.search_wrestler(ringname).then(result => {
            
            if (result.length > 0) {
                for (let i = 0 ; i < result.length; i++) {
                    if (result[i].ringname === ringname) {
                        ret= true;
                    }
                }
                
            }
        });
        //console.log(ret);
        return ret;
    }
}