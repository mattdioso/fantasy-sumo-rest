import { getConnection, getCustomRepository } from "typeorm";
import { MatchEntity } from "../database/entities/matches.entity";
import { MatchRepository } from "../repository/matches.repository";

export class MatchService {
    private match_repository: MatchRepository;

    constructor() {
        this.match_repository = getConnection("default").getRepository(MatchEntity);
    }

    public index = async() => {
        const matches = await this.match_repository.find();
        return matches;
    }

    public get_match = async(id: string) => {
        let match = await this.match_repository.findOne(id);
        return match;
    }

    public create = async (match: MatchEntity) => {
        const new_match = await this.match_repository.create(match);
        await this.match_repository.save(new_match);
        return new_match;
    }

    public update = async (match: MatchEntity, id: string) => {
        const updated_match = await this.match_repository.update(id, match);
        return updated_match;
    }

    public delete = async (id: string) => {
        const deleted_match = await this.match_repository.delete(id);
        return deleted_match;
    }
}