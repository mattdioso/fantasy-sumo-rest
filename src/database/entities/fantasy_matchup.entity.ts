import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FantasyTournamentEntity } from "./fantasy_tournament.entity";
import { TeamEntity } from "./team.entity";
import { MatchScores } from "./match_scores";
import { MatchEntity } from "./matches.entity";

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

    @ManyToOne(() => TeamEntity, {
        eager: true
    })
    @JoinColumn()
    team1: TeamEntity;

    @ManyToOne(() => TeamEntity, {
        eager: true
    })
    @JoinColumn()
    team2: TeamEntity;

    @Column({
        type: 'float',
        nullable: true
    })
    team1_score: number;

    @Column({
        type: 'float',
        nullable: true
    })
    team2_score: number;

    @OneToMany(() => MatchEntity, (match: MatchEntity) => match.fantasy_matchup, {
        onDelete: "SET NULL",
        cascade: true,
        eager: true
    })
    @JoinColumn()
    matches: MatchEntity[];
}