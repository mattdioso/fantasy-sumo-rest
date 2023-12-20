import { getConnection, getCustomRepository } from "typeorm";
import { MatchEntity } from "../database/entities/matches.entity";
import { MatchScores } from "../database/entities/match_scores";
import { MatchRepository } from "../repository/matches.repository";
import { MatchScoreRepository } from "../repository/match_score.repository";
import { MatchScoreService } from "./match_score.service";
import dataSource from "../database/ormconfig";

export class MatchService {
    private match_repository: MatchRepository;
    private match_score_service: MatchScoreService;

    constructor() {
        //this.match_repository = getConnection("default").getRepository(MatchEntity);
        this.match_repository = dataSource.getRepository(MatchEntity);
        this.match_score_service = new MatchScoreService();
    }

    public index = async() => {
        const matches = await this.match_repository.find();
        return matches;
    }

    public get_match = async(id: string) => {
        let match = await this.match_repository.findOne({
            where: {
                id: id
            }
        });
        return match;
    }

    public get_wrestler_match = async(wrestler_id: string) => {
        let matches = await this.match_repository.createQueryBuilder()
        .where("MatchEntity.wrestler1Id = :id", {id: wrestler_id})
        .orWhere("MatchEntity.wrestler2Id = :id", {id: wrestler_id}).getMany();

        return matches;        
    }

    public create = async (match: MatchEntity) => {
        const new_match = await this.match_repository.create(match);
        await this.match_repository.save(new_match);
        await this.match_score_service.create_match_score(new_match.id);
        return new_match;
    }

    public update = async (match: MatchEntity, id: string) => {
        const updated_match = await this.match_repository.update(id, match);
        return updated_match;
    }

    public delete = async (id: string) => {
        const deleted_match = await this.match_repository.delete(id);
        return deleted_match;
    }
}