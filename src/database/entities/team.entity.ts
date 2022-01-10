import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentController } from "../../controller/tournament.controller";
import { TournamentEntity } from "./tournament.entity";
import { UserEntity } from "./user.entity";

@Entity('teams')
export class TeamEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    teamname: string;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    // @ManyToOne(() => TournamentEntity)
    // tournament: TournamentEntity;
    
}