import { getConnection, getCustomRepository } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";
import { DaysRepository } from "../repository/day.repository";

export class DaysService {
    private days_repository: DaysRepository;

    constructor() {
        this.days_repository = getConnection("sumo").getRepository(DaysEntity);
    }

    public index = async() => {
        const days = await this.days_repository.find();
        return days;
    }

    public create = async (day: DaysEntity) => {
        const new_day = await this.days_repository.create(day);
        await this.days_repository.save(new_day);
        return new_day;
    }

    public update = async (day: DaysEntity, id: string) => {
        const updated_day = await this.days_repository.update(id, day);
        return updated_day;
    }
}