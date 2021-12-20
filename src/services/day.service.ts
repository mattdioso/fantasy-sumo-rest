import { getConnection, getCustomRepository } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";
import { MatchEntity } from "../database/entities/matches.entity";
import { DaysRepository } from "../repository/day.repository";
import { MatchRepository } from "../repository/matches.repository";

export class DaysService {
    private days_repository: DaysRepository;
    private match_repository: MatchRepository;

    constructor() {
        this.days_repository = getConnection("sumo").getRepository(DaysEntity);
        this.match_repository = getConnection("sumo").getRepository(MatchEntity);
    }

    public index = async() => {
        const days = await this.days_repository.find();
        return days;
    }

    public create = async (day: DaysEntity) => {
        const new_day = await this.days_repository.create(day);
        let matches = day.matches;
        for (let i = 0; i < matches.length; i++) {
            console.log(matches[i].id);
            let match = await this.match_repository.findOne({ id: matches[i].id });
            matches[i] = match!;
        }
        day.matches = matches;
        await this.days_repository.save(new_day);
        return new_day;
    }

    public update = async (day: DaysEntity, id: string) => {
        for (let i = 0; i < day.matches.length; i++) {
            let match = day.matches[i];
            const new_match = await this.match_repository.findOne({ id: match.id });
            console.log(new_match);
            day.matches[i] = new_match!;
        }
        const updated_day = await this.days_repository.update(id, day);
        return updated_day;
    }
}