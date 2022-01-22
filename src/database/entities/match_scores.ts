import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { DaysEntity } from './day.entity';
import { MatchEntity } from './matches.entity';
import { WrestlerEntity } from './wrestler.entity';

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

    @OneToOne(() => WrestlerEntity)
    @JoinColumn()
    wrestler: WrestlerEntity;

    @Column({
        type: 'decimal'
    })
    score: number;
}