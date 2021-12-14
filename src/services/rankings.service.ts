import { getConnection } from "typeorm";
import { RankingsEntity } from "../database/entities/rankings.entity";
import { RankingsRepository } from "../repository/rankings.repository";

export class RankingsService {
    private rankings_repository: RankingsRepository;

    constructor() {
        this.rankings_repository = getConnection("sumo").getRepository(RankingsEntity);
    }

    public index = async() => {
        const rankings = await this.rankings_repository.find();
        return rankings;
    }

}