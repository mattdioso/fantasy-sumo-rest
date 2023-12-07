import { getConnection, getCustomRepository } from "typeorm";
import { TechniqueEntity } from "../database/entities/techniques.entity";
import { TechniqueRepository } from "../repository/techniques.repository";
import dataSource from "../database/ormconfig";

export class TechniqueService {
    private technique_repository: TechniqueRepository;

    constructor() {
        //this.technique_repository = getConnection("default").getRepository(TechniqueEntity);
        this.technique_repository = dataSource.getRepository(TechniqueEntity);
    }

    public index = async() => {
        return await this.technique_repository.find()
        
    }

    public get_technique = async(id: string) => {
        return await this.technique_repository.findOne({
            where: {
                id: id
            }
        })
    }

    public create = async (technique: TechniqueEntity) => {
        const new_technique = await this.technique_repository.create(technique);
        await this.technique_repository.save(new_technique);
        return new_technique;
    }

    public update = async (techique: TechniqueEntity, id: string) => {
        const updated_technique = await this.technique_repository.update(id, techique);
        return updated_technique;
    }

    public delete = async (id: string) => {
        const deleted_technique = await this.technique_repository.delete(id);
        return deleted_technique;
    }
}