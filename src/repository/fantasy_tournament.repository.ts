import { Repository } from "typeorm";
import { FantasyTournamentEntity } from "../database/entities/fantasy_tournament.entity";

export class FantasyTournamentRepository extends Repository<FantasyTournamentEntity> {}