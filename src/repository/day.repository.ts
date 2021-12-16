import { Entity, EntityRepository, Repository } from "typeorm";
import { DaysEntity } from "../database/entities/day.entity";

@EntityRepository(DaysEntity)
export class DaysRepository extends Repository<DaysEntity> {}