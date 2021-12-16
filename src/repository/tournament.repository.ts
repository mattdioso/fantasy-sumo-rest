import { EntityRepository, Repository } from "typeorm";
import { TournamentEntity } from "../database/entities/tournament.entity";

@EntityRepository(TournamentEntity)
export class TournamentRepository extends Repository<TournamentEntity> {}