import { EntityRepository, Repository } from "typeorm";
import { TechniqueEntity } from "../database/entities/techniques.entity";

@EntityRepository(TechniqueEntity)
export class TechniqueRepository extends Repository<TechniqueEntity> {
    
}