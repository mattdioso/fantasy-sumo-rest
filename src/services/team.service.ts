import { emitWarning } from "process";
import { getConnection } from "typeorm";
import { TeamEntity } from "../database/entities/team.entity";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { UserEntity } from "../database/entities/user.entity";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { TeamRepository } from "../repository/team.repository";
import { TournamentRepository } from "../repository/tournament.repository";
import { UserRepository } from "../repository/user.repository";
import { WrestlerRepository } from "../repository/wrestler.repository";
import { WrestlerService } from "./wrestler.service";

export class TeamService {
    private team_repository: TeamRepository;
    private wrestler_repository: WrestlerRepository;
    private user_repository: UserRepository;
    private tournament_repository: TournamentRepository;

    constructor() {
        this.team_repository = getConnection("default").getRepository(TeamEntity);
        this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        this.user_repository = getConnection("default").getRepository(UserEntity);
        this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
    }

    public index = async() => {
        const teams = await this.team_repository.find().catch(err => {console.log(err)});
        return teams;
    }

    public get_team = async(id: string) => {
        let team = await this.team_repository.findOne(id);
        return team;
    }

    public get_team_wrestlers = async(id: string) => {
        let team = await this.team_repository.findOne(id);
        let res =  await getConnection("default").createQueryBuilder()
                .relation(TeamEntity, "wrestlers")
                .of(team)
                .loadMany();
        return res;
    }

    public create = async (team: TeamEntity) => {
        const new_team = await this.team_repository.create(team);
        let wrestlers = team.wrestlers;
        let user = await this.user_repository.findOne(team.user);
        team.user = user!;
        if (team.tournament) {
            let tournament = await this.tournament_repository.findOne(team.tournament);
            team.tournament = tournament!;
        }
        if (team.wrestlers) {
           for (let i = 0; i < wrestlers.length; i++) {
               let wrestler_id = wrestlers[i];
                let wrestler = await this.wrestler_repository.findOne(wrestler_id);
                console.log(wrestler);
                team.wrestlers[i] = wrestler!;
            }
            team.wrestlers = wrestlers;
        }
        new_team.wrestlers = team.wrestlers;
        await this.team_repository.save(new_team);
        return new_team;
    }

    public update = async(team: TeamEntity, id: string) => {
        if (team.user) {
            let user_id = team.user;
            console.log(user_id)
            // let user = await this.user_repository.findOne(user_id);
            // updated!.user = user!;
            await getConnection("default").createQueryBuilder()
            .relation(TeamEntity, "user")
            .of(id)
            .set(user_id).catch(err => {console.log(err)});
        }
        console.log("added user");
        if (team.tournament) {
            // let tournament = await this.tournament_repository.findOne(team.tournament);
            // updated!.tournament = tournament!;
            await getConnection("default").createQueryBuilder()
            .relation(TeamEntity, "tournament")
            .of(id)
            .set(team.tournament).catch(err => {console.log(err)});
        }
        console.log("added tournament");
        // await this.team_repository.update(id, updated!).catch(err => {console.log(err)});

        if (team.wrestlers) {
            let team_to_update = await this.team_repository.findOne(id);
            team_to_update!.wrestlers = [];
            await this.team_repository.save(team_to_update!);
            for (let i = 0; i< team.wrestlers.length; i++) {
                await getConnection("default").createQueryBuilder()
                .relation(TeamEntity, "wrestlers")
                .of(id)
                .add(team.wrestlers[i]).catch(err => {console.log(err)});
            }
        }
        console.log("added wrestlers");
        
        return await this.team_repository.findOne(id);
    }

    public delete = async (id: string) => {
        let deleted_team = await this.team_repository.delete(id).catch(err => {console.log(err)});
        return deleted_team;
    }
}