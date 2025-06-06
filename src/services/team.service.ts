import { FindOptionsWhere, getConnection } from "typeorm";
import { TeamEntity } from "../database/entities/team.entity";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { UserEntity } from "../database/entities/user.entity";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { TeamRepository } from "../repository/team.repository";
import { TournamentRepository } from "../repository/tournament.repository";
import { UserRepository } from "../repository/user.repository";
import { WrestlerRepository } from "../repository/wrestler.repository";
import { WrestlerService } from "./wrestler.service";
import { FantasyTournamentRepository } from "../repository/fantasy_tournament.repository";
import { FantasyTournamentEntity } from "../database/entities/fantasy_tournament.entity";
import dataSource from "../database/ormconfig";

export class TeamService {
    private team_repository: TeamRepository;
    private wrestler_repository: WrestlerRepository;
    private user_repository: UserRepository;
    private tournament_repository: TournamentRepository;
    private fantasy_tournament_repository: FantasyTournamentRepository;

    constructor() {
        // this.team_repository = getConnection("default").getRepository(TeamEntity);
        // this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        // this.user_repository = getConnection("default").getRepository(UserEntity);
        // this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
        // this.fantasy_tournament_repository = getConnection("default").getRepository(FantasyTournamentEntity);
        this.team_repository = dataSource.getRepository(TeamEntity);
        this.wrestler_repository = dataSource.getRepository(WrestlerEntity);
        this.user_repository = dataSource.getRepository(UserEntity);
        this.tournament_repository = dataSource.getRepository(TournamentEntity);
        this.fantasy_tournament_repository = dataSource.getRepository(FantasyTournamentEntity);
    }

    public index = async () => {
        const teams = await this.team_repository.find().catch(err => { console.log(err) });
        return teams;
    }

    public get_team = async (id: string) => {
        let team = await this.team_repository.findOne({
            where: {
                id: id
            }
        });
        return team;
    }

    public get_team_wrestlers = async (id: string) => {
        let team = await this.team_repository.findOne({
            where: {
                id: id
            }
        });
        let res = await getConnection("default").createQueryBuilder()
            .relation(TeamEntity, "wrestlers")
            .of(team)
            .loadMany();
        return res;
    }

    public create = async (team: TeamEntity) => {
        const new_team = await this.team_repository.create(team);
        let wrestlers: WrestlerEntity[] = [];
        let user = await this.user_repository.findOne({
            where: {
                username: team.teamname
            }
        });
        team.user = user!;
        if (team.fantasy_tournament) {
            let tournament = await this.fantasy_tournament_repository.findOne({
                where: {
                    id: team.fantasy_tournament.id
                }
            });
            team.fantasy_tournament = tournament!;
        }
        for (const wrestler_id of team.wrestlers) {
            const wrestler = await this.wrestler_repository.findOne({
                where: [{
                    id: wrestler_id
                } as unknown as FindOptionsWhere<WrestlerEntity>]
            })
            wrestlers.push(wrestler!)
        }
        new_team.user = user!;
        new_team.wrestlers = wrestlers;
        await this.team_repository.save(new_team);
        return new_team;
    }

    public update = async (team: TeamEntity, id: string) => {
        if (team.user) {
            let user_id = team.user;
            console.log(user_id)
            // let user = await this.user_repository.findOne(user_id);
            // updated!.user = user!;
            await this.team_repository.createQueryBuilder()
                .relation(TeamEntity, "user")
                .of(id)
                .set(user_id).catch(err => { console.log(err) });
        }
        console.log("added user");
        if (team.fantasy_tournament) {
            // let tournament = await this.tournament_repository.findOne(team.tournament);
            // updated!.tournament = tournament!;
            await this.team_repository.createQueryBuilder()
                .relation(TeamEntity, "tournament")
                .of(id)
                .set(team.fantasy_tournament).catch(err => { console.log(err) });
        }
        console.log("added tournament");
        // await this.team_repository.update(id, updated!).catch(err => {console.log(err)});

        if (team.wrestlers) {
            let team_to_update = await this.team_repository.findOne({
                where: {
                    id: id
                }
            });
            team_to_update!.wrestlers = [];
            await this.team_repository.save(team_to_update!);
            for (let i = 0; i < team.wrestlers.length; i++) {
                await getConnection("default").createQueryBuilder()
                    .relation(TeamEntity, "wrestlers")
                    .of(id)
                    .add(team.wrestlers[i]).catch(err => { console.log(err) });
            }
        }
        console.log("added wrestlers");
        if (team.total_points) {
            await this.team_repository.update(id, team).then(() => {
                console.log('team updated');
            }).catch(err => {
                console.log(err);
            })
        }
        return await this.team_repository.findOne({
            where: {
                id: id
            }
        });
    }

    public delete = async (id: string) => {
        let deleted_team = await this.team_repository.delete(id).catch(err => { console.log(err) });
        return deleted_team;
    }
}