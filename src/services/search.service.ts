import { getConnection, getCustomRepository } from "typeorm";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { TechniqueEntity} from "../database/entities/techniques.entity";
import { WrestlerRepository } from "../repository/wrestler.repository";
import { TechniqueRepository } from "../repository/techniques.repository";
import { MatchScoreRepository } from "../repository/match_score.repository";
import { MatchScores } from "../database/entities/match_scores";
import dataSource from "../database/ormconfig";

export class SearchService {
    private wrestler_repository: WrestlerRepository;
    private technique_repository: TechniqueRepository;
    private match_score_repository: MatchScoreRepository;

    constructor() {
        // this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        // this.technique_repository = getConnection("default").getRepository(TechniqueEntity);
        // this.match_score_repository = getConnection("default").getRepository(MatchScores);
        this.wrestler_repository = dataSource.getRepository(WrestlerEntity);
        this.technique_repository = dataSource.getRepository(TechniqueEntity);
        this.match_score_repository = dataSource.getRepository(MatchScores);
    }

    public search_wrestler = async(wrestler: string) => {
        const result = await this.wrestler_repository.createQueryBuilder()
        .select()
        .where('ringname ILIKE :searchTerm', {searchTerm: `%${wrestler}%`})
        .getMany();

        return result;
    }

    public search_technique = async(technique: string) => {
        const result = this.technique_repository.createQueryBuilder()
        .select()
        .where('techniquetype ILIKE :searchTerm', { searchTerm: `%${technique}%`})
        .getOne();

        return result;
    }

    public search_score = async(wrestler_id: string, tournament_id: string, day: number) => {
        console.log(wrestler_id + "\t" + tournament_id + "\t" + day);
        const result = this.match_score_repository.createQueryBuilder()
            .select("*")
            .innerJoin("match_scores.day", "day")
            .innerJoin("day.tournament", "tournaments")
            .where("tournaments.id = :id", { id: tournament_id })
            .andWhere("day.day_num = :day_num", { day_num : day })
            .andWhere("match_score.idWrestler1 = :wrestler_id1", { wrestler_id1: wrestler_id })
            .orWhere("match_score.idWrestler2 = :wrestler_id2", { wrestler_id2: wrestler_id})
            .getOne()
            .catch(err => {
                console.log(err);
            });

        return result;
    }
}