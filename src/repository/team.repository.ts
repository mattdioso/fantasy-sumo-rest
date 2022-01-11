import { EntityRepository, Repository } from "typeorm";
import { TeamEntity } from "../database/entities/team.entity";

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {

}