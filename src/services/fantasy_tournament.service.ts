import { getConnection, getCustomRepository } from "typeorm";
import { FantasyTournamentEntity } from "../database/entities/fantasy_tournament.entity";
import { FantasyTournamentRepository } from "../repository/fantasy_tournament.repository";
import dataSource from "../database/ormconfig";
import { TeamEntity } from "../database/entities/team.entity";

export class FantasyTournamentService {
    private fantasy_tournament_repository: FantasyTournamentRepository;

    constructor() {
        //this.fantasy_tournament_repository = getConnection("default").getRepository(FantasyTournamentEntity);
        this.fantasy_tournament_repository = dataSource.getRepository(FantasyTournamentEntity);
    }

    public index = async() => {
        const fantasy_tournaments = await this.fantasy_tournament_repository.find();
        return fantasy_tournaments;
    }

    public get_fantasy_tournament = async(id: string) => {
        let fantasy = await this.fantasy_tournament_repository.findOne({
            where: {
                id: id
            }
        });
        return fantasy;
    }

    public get_fantasy_tournament_teams = async(id: string) => {
        let fantasy_tournament = await this.fantasy_tournament_repository.findOne({
            where: {
                id: id
            }
        });
        let res = this.fantasy_tournament_repository.createQueryBuilder()
            .relation(TeamEntity, "fantasy_tournament")
            .of(fantasy_tournament).loadMany();
            
        return res;
    }

    public create = async(fantasy: FantasyTournamentEntity) => {
        const new_fantasy = await this.fantasy_tournament_repository.create(fantasy);
        await this.fantasy_tournament_repository.save(new_fantasy);
        return new_fantasy;
    }

    public update = async (fantasy: FantasyTournamentEntity, id: string) => {
        return await this.fantasy_tournament_repository.findOne({
            where: {
                id: id
            }
        });
    }

    public delete = async(id: string) => {
        return await this.fantasy_tournament_repository.delete(id);
    }
}