import { EntityRepository, Repository } from "typeorm";
import { WrestlerEntity } from "../database/entities/wrestler.entity";

@EntityRepository(WrestlerEntity)
export class WrestlerRepository extends Repository<WrestlerEntity> {
    
}