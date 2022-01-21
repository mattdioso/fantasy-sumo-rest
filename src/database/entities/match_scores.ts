import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { DaysEntity } from './day.entity';
import { MatchEntity } from './matches.entity';

@Entity('match_scores')
export class MatchScores {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => TournamentEntity)
    @JoinColumn()
    tournament: TournamentEntity;

    @OneToOne(() => DaysEntity)
    @JoinColumn()
    day: DaysEntity;

    @OneToOne(() => MatchEntity)
    @JoinColumn()
    match: MatchEntity;

    @Column()
    score: number;
}