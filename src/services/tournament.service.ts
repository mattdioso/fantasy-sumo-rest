import { getConnection, getCustomRepository, QueryBuilder } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";
import { TournamentEntity } from "../database/entities/tournament.entity";
import { DaysRepository } from "../repository/day.repository";
import { TournamentRepository } from "../repository/tournament.repository";
import dataSource from "../database/ormconfig";
import { MatchRepository } from "../repository/matches.repository";
import { MatchEntity } from "../database/entities/matches.entity";

export class TournamentService {
    private tournament_repository: TournamentRepository;
    private days_repository: DaysRepository;
    private match_repository: MatchRepository;

    constructor() {
        // this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
        // this.days_repository = getConnection("default").getRepository(DaysEntity);
        this.tournament_repository = dataSource.getRepository(TournamentEntity);
        this.days_repository = dataSource.getRepository(DaysEntity);
        this.match_repository = dataSource.getRepository(MatchEntity);
    }

    public index = async () => {
        const tournaments = await this.tournament_repository.find();
        return tournaments;
    }

    public get_tournament = async (id: string) => {
        let tournament = await this.tournament_repository.findOne({
            where: {
                id: id
            }
        });
        return tournament;
    }

    public get_tournament_matches = async (id: string) => {
        let tournament = await this.tournament_repository.findOne({
            where: {
                id: id
            }
        });
        let res = this.match_repository.createQueryBuilder()
            .relation(TournamentEntity, "matches")
            .of(tournament).loadMany();
        return res;
    }

    public get_most_recent_tournament = async () => {
        let tournament = await this.tournament_repository.find({
            skip: 0,
            take: 1,
            order: {
                dateend: "ASC"
            }
        }).catch((error) => {
            console.error(error)
        });
        return tournament?.[0].id ?? "";
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
        if (tourament.matches) {
            for (let i = 0; i < tourament.matches.length; i++) {
                let match = await this.match_repository.findOne({
                    where: {
                        id: tourament.matches[i].id
                    }
                });
                await this.tournament_repository.createQueryBuilder()
                    .relation(TournamentEntity, "matches")
                    .of(id)
                    .add(match).catch(err => { console.log(err) });
            }
        }
        return await this.tournament_repository.findOne({
            where: {
                id: id
            }
        });
    }

    public delete = async (id: string) => {
        return await this.tournament_repository.delete(id);
    }
}