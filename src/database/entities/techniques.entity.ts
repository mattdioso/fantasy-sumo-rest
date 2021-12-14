import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchEntity } from "./matches.entity";

@Entity('techniques')
export class TechniqueEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    techniqueType: string;

    @Column()
    techniqueDescr: string;
}