import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FantasyTournamentEntity } from "./fantasy_tournament.entity";
import { TeamEntity } from "./team.entity";

@Entity("fantasy_matchup")
export class FantasyMatchupEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => FantasyTournamentEntity, (tournament: FantasyTournamentEntity) => tournament.matches)
    fantasy_tournament: FantasyTournamentEntity;

    @Column()
    day1: number;

    @Column()
    day2: number;
    
    @Column()
    day3: number;

    @OneToOne(() => TeamEntity)
    @JoinColumn()
    team1: TeamEntity;

    @OneToOne(() => TeamEntity)
    @JoinColumn()
    team2: TeamEntity;

    @Column()
    team1_score: number;

    @Column()
    team2_score: number;
}