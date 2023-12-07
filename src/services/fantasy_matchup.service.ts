import { getConnection } from "typeorm";
import { FantasyMatchupEntity } from "../database/entities/fantasy_matchup.entity";
import { FantasyMatchupRepository } from "../repository/fantasy_matchup.repository";
import dataSource from "../database/ormconfig";

export class FantasyMatchupService {
    private fantasy_matchup_repository: FantasyMatchupRepository;

    constructor() {
        //this.fantasy_matchup_repository = getConnection("default").getRepository(FantasyMatchupEntity);
        this.fantasy_matchup_repository = dataSource.getRepository(FantasyMatchupEntity);
    }

    public index = async() => {
        const fantasy_matchups = await this.fantasy_matchup_repository.find();
        return fantasy_matchups;
    }

    public get_fantasy_matchup = async(id: string) => {
        let matchup = await this.fantasy_matchup_repository.findOne({
            where: {
                id: id
            }
        });
        return matchup;
    }

    public create = async(matchup: FantasyMatchupEntity) => {
        const new_matchup = await this.fantasy_matchup_repository.create(matchup);
        await this.fantasy_matchup_repository.save(new_matchup);
        return new_matchup;
    }

    public update = async(matchup: FantasyMatchupEntity, id: string) => {
        return await this.fantasy_matchup_repository.findOne({
            where: {
                id: id
            }
        });
    }

    public delete = async(id: string) => {
        return await this.fantasy_matchup_repository.delete(id);
    }
}