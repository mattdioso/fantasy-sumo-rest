import { getConnection } from "typeorm";
import { RankingsEntity } from "../database/entities/rankings.entity";
import { RankingsRepository } from "../repository/rankings.repository";
import Rank from '../ranks/rank.enum';
import dataSource from "../database/ormconfig";

export class RankingsService {
    private rankings_repository: RankingsRepository;

    constructor() {
        //this.rankings_repository = getConnection("default").getRepository(RankingsEntity);
        this.rankings_repository = dataSource.getRepository(RankingsEntity);
    }

    public index = async() => {
        const rankings = await this.rankings_repository.find();
        return rankings;
    }

    public get_tournament_rankings = async(tournament_id: string) => {
        const rankings = await this.rankings_repository.find({ 
            where: {
                idTournament: tournament_id 
            }
        });
        rankings.sort((a, b) => Rank.indexOf(a.rank) - Rank.indexOf(b.rank));
        return rankings;
    }

    public create = async (ranking: RankingsEntity) => {
        const new_ranking = await this.rankings_repository.create(ranking);
        await this.rankings_repository.save(new_ranking);
        return new_ranking;
    }

    public update = async (ranking: RankingsEntity, id: string) => {
        const updated_ranking = await this.rankings_repository.update(id, ranking);
        return updated_ranking;
    }

    public delete = async (id: string) => {
        const deleted_match = await this.rankings_repository.delete(id);
        return deleted_match;
    }

}