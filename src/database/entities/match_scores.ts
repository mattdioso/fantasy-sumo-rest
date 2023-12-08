import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { DaysEntity } from './day.entity';
import { MatchEntity } from './matches.entity';
import { WrestlerEntity } from './wrestler.entity';
import { FantasyMatchupEntity } from './fantasy_matchup.entity';

@Entity('match_scores')
export class MatchScores {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => TournamentEntity)
    @JoinColumn()
    tournament: TournamentEntity;

    @Column({
        type: 'integer'
    })
    day: number;

    @OneToOne(() => MatchEntity)
    @JoinColumn()
    match: MatchEntity;

    @ManyToOne(() => WrestlerEntity)
    @JoinColumn()
    wrestler: WrestlerEntity;

    @Column({
        type: 'decimal'
    })
    score: number;
}