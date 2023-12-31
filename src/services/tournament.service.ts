import { getConnection, getCustomRepository, QueryBuilder } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { DaysRepository } from "../repository/day.repository";
import { TournamentRepository } from "../repository/tournament.repository";
import dataSource from "../database/ormconfig";

export class TournamentService {
    private tournament_repository: TournamentRepository;
    private days_repository: DaysRepository;

    constructor() {
        // this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
        // this.days_repository = getConnection("default").getRepository(DaysEntity);
        this.tournament_repository = dataSource.getRepository(TournamentEntity);
        this.days_repository = dataSource.getRepository(DaysEntity);
    }

    public index = async() => {
        const tournaments = await this.tournament_repository.find();
        return tournaments;
    }

    public get_tournament = async(id: string) => {
        let tournament = await this.tournament_repository.findOne({
            where: {
                id: id
            }
        });
        return tournament;
    }

    public create = async (tournament: TournamentEntity) => {
        const new_tourney = await this.tournament_repository.create(tournament);
        // let days = tournament.days;
        // for (let i = 0; i< days.length; i++) {
        //     let day =  await this.days_repository.findOne({ id: days[i].id });
        //     days[i] = day!;
        // }
        // tournament.days = days;
        await this.tournament_repository.save(new_tourney);
        return new_tourney;
    }

    public update = async (tourament: TournamentEntity, id: string) => {
        // for (let i = 0 ; i < tourament.days.length; i++) {
        //     let day = await this.days_repository.findOne({ id: tourament.days[i].id });
        //     await getConnection("default").createQueryBuilder()
        //         .relation(TournamentEntity, "days")
        //         .of(id)
        //         .add(tourament.days[i].id);
        // }
        return await this.tournament_repository.findOne({ 
            where: {
                id: id
            } 
        });
    }

    public delete = async (id:string) => {
        return await this.tournament_repository.delete(id);
    }
}