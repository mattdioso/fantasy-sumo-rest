import { getConnection, getCustomRepository } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { DaysRepository } from "../repository/day.repository";
import { TournamentRepository } from "../repository/tournament.repository";

export class TournamentService {
    private tournament_repository: TournamentRepository;
    private days_repository: DaysRepository;

    constructor() {
        this.tournament_repository = getConnection("sumo").getRepository(TournamentEntity);
        this.days_repository = getConnection("sumo").getRepository(DaysEntity);
    }

    public index = async() => {
        const tournaments = await this.tournament_repository.find();
        return tournaments;
    }

    public create = async (tournament: TournamentEntity) => {
        const new_tourney = await this.tournament_repository.create(tournament);
        let days = tournament.days;
        for (let i = 0; i< days.length; i++) {
            let day =  await this.days_repository.findOne({ id: days[i].id });
            days[i] = day!;
        }
        tournament.days = days;
        await this.tournament_repository.save(new_tourney);
        return new_tourney;
    }

    public update = async (tourament: TournamentEntity, id: string) => {
        for (let i = 0; i< tourament.days.length; i++) {
            let day = tourament.days[i];
            const new_day = await this.days_repository.findOne({ id: day.id });
            tourament.days[i] = day!;
        }
        const updated_tourney = await this.tournament_repository.update(id, tourament);
        return updated_tourney;
    }
}