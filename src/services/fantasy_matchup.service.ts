import { getConnection } from "typeorm";
import { FantasyMatchupEntity } from "../database/entities/fantasy_matchup.entity";
import { FantasyMatchupRepository } from "../repository/fantasy_matchup.repository";
import dataSource from '@database/ormconfig';
import { UserRepository } from "../repository/user.repository";
import { UserEntity } from "../database/entities/user.entity";
import { TeamRepository } from "../repository/team.repository";
import { TeamEntity } from "../database/entities/team.entity";
import { MatchRepository } from "../repository/matches.repository";
import { MatchEntity } from "../database/entities/matches.entity";

export class FantasyMatchupService {
    private fantasy_matchup_repository: FantasyMatchupRepository;
    private team_repository: TeamRepository;
    private match_repository: MatchRepository;

    constructor() {
        //this.fantasy_matchup_repository = getConnection("default").getRepository(FantasyMatchupEntity);
        this.fantasy_matchup_repository = dataSource.getRepository(FantasyMatchupEntity);
        this.team_repository = dataSource.getRepository(TeamEntity);
        this.match_repository = dataSource.getRepository(MatchEntity);
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
        let team1 = await this.team_repository.findOne({
            where: {
                id: matchup.team1.id
            }
        });
        let team2 = await this.team_repository.findOne({
            where: {
                id: matchup.team2.id
            }
        });
        new_matchup.team1 = team1!;
        new_matchup.team2 = team2!;
        console.log(new_matchup);
        await this.fantasy_matchup_repository.save(new_matchup);
        return new_matchup;
    }

    public update = async(matchup: FantasyMatchupEntity, id: string) => {
        if (matchup.matches) {
            let new_matches = []
            for (let i = 0; i < matchup.matches.length; i++) {
                let match = await this.match_repository.findOne({
                    where: {
                        id: matchup.matches[i].id
                    }
                });
                await dataSource.createQueryBuilder().relation(FantasyMatchupEntity, "matches")
                .of(id)
                .add(match)
                matchup.matches[i] = match!;
            }
            
        } else {
            await this.fantasy_matchup_repository.update(id, matchup);
        }

        //await this.fantasy_matchup_repository.update(id, {"matches": matchup.matches});
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