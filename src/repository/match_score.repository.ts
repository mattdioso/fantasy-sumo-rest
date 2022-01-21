import { EntityRepository, Repository } from "typeorm";
import { MatchScores } from "../database/entities/match_scores";

@EntityRepository(MatchScores)
export class MatchScoreRepository extends Repository<MatchScores> {
    
}