import { EntityRepository, Repository } from "typeorm";
import { MatchEntity } from "../database/entities/matches.entity";

@EntityRepository(MatchEntity)
export class MatchRepository extends Repository<MatchEntity> {
    
}