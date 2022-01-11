import { getConnection } from "typeorm";
import { TeamEntity } from "../database/entities/team.entity";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { TeamRepository } from "../repository/team.repository";
import { WrestlerRepository } from "../repository/wrestler.repository";

export class TeamService {
    private team_repository: TeamRepository;
    private wrestler_repository: WrestlerRepository;

    constructor() {
        this.team_repository = getConnection("default").getRepository(TeamEntity);
        this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
    }

    public index = async() => {
        const teams = await this.team_repository.find();
        return teams;
    }

    public get_team = async(id: string) => {
        let team = await this.team_repository.findOne(id);
        return team;
    }

    public create = async (team: TeamEntity) => {
        const new_team = await this.team_repository.create(team);
        let wrestlers = team.wrestlers;
        for (let i = 0; i < wrestlers.length; i++) {
            let wrestler = await this.wrestler_repository.findOne({ id: wrestlers[i].id });
            wrestlers[i] = wrestler!;
        }
        team.wrestlers = wrestlers;
        await this.team_repository.save(new_team);
        return new_team;
    }

    public update = async(team: TeamEntity, id: string) => {
        
    }
}