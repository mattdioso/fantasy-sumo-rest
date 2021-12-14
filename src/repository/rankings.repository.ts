import { EntityRepository, Repository } from "typeorm";
import { RankingsEntity } from "../database/entities/rankings.entity";

@EntityRepository(RankingsEntity)
export class RankingsRepository extends Repository<RankingsEntity> {
    
}