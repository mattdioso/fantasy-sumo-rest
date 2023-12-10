import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentController } from "../../controller/tournament.controller";
import { WrestlerRepository } from "../../repository/wrestler.repository";
import { TournamentEntity } from "./tournament.entity";
import { UserEntity } from "./user.entity";
import { WrestlerEntity } from "./wrestler.entity";
import { FantasyTournamentEntity } from "./fantasy_tournament.entity";

@Entity('teams')
export class TeamEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    teamname: string;

    @OneToOne(() => UserEntity, user => user.team, {
        eager: true
    })
    user: UserEntity;

    @ManyToOne(() => FantasyTournamentEntity, (fantasy_tournament: FantasyTournamentEntity) => fantasy_tournament.teams)
    fantasy_tournament: FantasyTournamentEntity;
    
    @ManyToMany(() => WrestlerEntity, {
        eager: true
    })
    @JoinTable()
    wrestlers: WrestlerEntity[];

    @Column({type: 'int', default: 0, nullable: true})
    wins: number;

    @Column({type: 'int', default: 0, nullable: true})
    losses: number;
}