import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentEntity } from "./tournament.entity";
import { TeamEntity } from "./team.entity";
import { UserEntity } from "./user.entity";
import { FantasyMatchupEntity } from "./fantasy_matchup.entity";

@Entity("fantasy_tournament")
export class FantasyTournamentEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    name: string;

    @OneToOne(() => TournamentEntity)
    @JoinColumn()
    tournament: TournamentEntity;

    @OneToMany(() => FantasyMatchupEntity, (fantasy_matchup: FantasyMatchupEntity) => fantasy_matchup.fantasy_tournament, {
        onDelete: "CASCADE",
        cascade: true
    })
    matches: FantasyMatchupEntity[];

    @OneToMany(() => TeamEntity, (team: TeamEntity) => team.fantasy_tournament, {
        onDelete: "CASCADE",
        cascade:true,
        eager: true
    })
    @JoinColumn({name: "id"})
    teams: TeamEntity[];

    @OneToOne(() => UserEntity)
    @JoinColumn()
    winner: UserEntity;
}