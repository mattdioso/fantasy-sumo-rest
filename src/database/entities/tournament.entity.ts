import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DaysEntity } from "./day.entity";

@Entity('tournaments')
export class TournamentEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    month_year: string;

    @Column({
        type: "date",
        nullable: false
    })
    datestart: Date;

    @Column({
        type: "date",
        nullable: false
    })
    dateend: Date;

    @Column({
        type: "int",
        nullable: false
    })
    cancelled: boolean;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    location: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    banzuke_id: string;

    @OneToMany(() => DaysEntity, (day: DaysEntity) => day.id, {
        onDelete: "CASCADE",
        primary: true,
        eager: true
    })
    days: DaysEntity[]
}