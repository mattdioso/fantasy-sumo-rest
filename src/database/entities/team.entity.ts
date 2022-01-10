import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentController } from "../../controller/tournament.controller";
import { WrestlerRepository } from "../../repository/wrestler.repository";
import { TournamentEntity } from "./tournament.entity";
import { UserEntity } from "./user.entity";
import { WrestlerEntity } from "./wrestler.entity";

@Entity('teams')
export class TeamEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    teamname: string;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    @ManyToOne(() => TournamentEntity, (tournament: TournamentEntity) => tournament.teams)
    tournament: TournamentEntity;
    
    @ManyToMany(() => WrestlerEntity)
    @JoinTable()
    wrestlers: WrestlerEntity[];
}