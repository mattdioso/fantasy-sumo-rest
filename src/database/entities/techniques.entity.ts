import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MatchEntity } from "./matches.entity";

@Entity('techniques')
export class TechniqueEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: true
    })
    techniquetype: string;

    @Column()
    techniquedescr: string;
}