import { getConnection, getCustomRepository } from "typeorm";
import { WrestlerEntity } from "../database/entities/wrestler.entity";
import { TechniqueEntity} from "../database/entities/techniques.entity";
import { WrestlerRepository } from "../repository/wrestler.repository";
import { TechniqueRepository } from "../repository/techniques.repository";

export class SearchService {
    private wrestler_repository: WrestlerRepository;
    private technique_repository: TechniqueRepository;

    constructor() {
        this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        this.technique_repository = getConnection("default").getRepository(TechniqueEntity);
    }

    public search_wrestler = async(wrestler: string) => {
        const result = this.wrestler_repository.createQueryBuilder()
        .select()
        .where('ringname ILIKE :searchTerm', {searchTerm: `%${wrestler}%`})
        .getOne();

        return result;
    }

    public search_technique = async(technique: string) => {
        const result = this.technique_repository.createQueryBuilder()
        .select()
        .where('techniquetype ILIKE :searchTerm', { searchTerm: `%${technique}%`})
        .getOne();

        return result;
    }
}