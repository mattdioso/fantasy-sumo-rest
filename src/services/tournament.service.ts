import { getConnection, getCustomRepository } from "typeorm";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { TournamentRepository } from "../repository/tournament.repository";

export class TournamentService {
    private tournament_repository: TournamentRepository;

    constructor() {
        this.tournament_repository = getConnection("sumo").getRepository(TournamentEntity);
    }

    public index = async() => {
        const tournaments = await this.tournament_repository.find();
        return tournaments;
    }

    public create = async (tournament: TournamentEntity) => {
        const new_tourney = await this.tournament_repository.create(tournament);
        await this.tournament_repository.save(new_tourney);
        return new_tourney;
    }
}