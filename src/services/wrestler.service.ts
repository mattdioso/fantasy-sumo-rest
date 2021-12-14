import { getConnection } from "typeorm";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { WrestlerRepository } from "../repository/wrestler.repository";

export class WrestlerService {
    private wrestler_repository: WrestlerRepository;

    constructor() {
        this.wrestler_repository = getConnection("sumo").getRepository(WrestlerEntity);
    }

    public index = async () => {
        const wrestlers = await this.wrestler_repository.find();
        console.log(wrestlers);
        return wrestlers;
    }

    public create = async (wrestler: WrestlerEntity) => {
        const new_wrestler = await this.wrestler_repository.create(wrestler);
        const results = await this.wrestler_repository.save(new_wrestler);
        console.log(results);
        return new_wrestler;
    }

    public update = async (wrestler: WrestlerEntity, id: string) => {
        const updated_wrestler = await this.wrestler_repository.update(id, wrestler);
        return updated_wrestler;
    }

    public delete = async (id: string) => {
        const deleted_wrestler = await this.wrestler_repository.delete(id);
        return deleted_wrestler;
    }
}