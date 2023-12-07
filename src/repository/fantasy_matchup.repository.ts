import { Repository } from "typeorm";
import { FantasyMatchupEntity } from "../database/entities/fantasy_matchup.entity";

export class FantasyMatchupRepository extends Repository<FantasyMatchupEntity> {}