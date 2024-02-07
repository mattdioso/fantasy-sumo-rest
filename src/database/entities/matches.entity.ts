import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { DaysEntity } from './day.entity';
import { TechniqueEntity } from './techniques.entity';
import { WrestlerEntity } from './wrestler.entity';
import { TournamentEntity } from './tournament.entity';
import { FantasyMatchupController } from '../../controller/fantasy_matchup.controller';
import { FantasyMatchupEntity } from './fantasy_matchup.entity';
import { MatchScores } from './match_scores';

@Entity('matches')
export class MatchEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    
    @ManyToOne(() => WrestlerEntity, {
        eager: true
    })
    @JoinColumn()
    wrestler1: WrestlerEntity;

    @Column()
    win1: boolean;

    @Column()
    winByForfeit1: boolean;

    
    @ManyToOne(() => WrestlerEntity, {
        eager: true
    })
    @JoinColumn()
    wrestler2: WrestlerEntity;
    
    @Column()
    win2: boolean;

    @Column()
    winByForfeit2: boolean;

    @Column()
    @ManyToOne(() => TechniqueEntity, winTechnique => winTechnique.id)
    winTechniqueId: string;

    @Column()
    matchNum: number;

    // @ManyToOne(()=> DaysEntity, (day: DaysEntity) => day.matches)
    // day: DaysEntity;
    @Column({
        type: "integer",
        nullable: true
    })
    day: number;

    @ManyToOne(() => TournamentEntity, (tournament: TournamentEntity) => tournament.matches)
    tournament: TournamentEntity;

    @ManyToOne(() => FantasyMatchupEntity, (matchup: FantasyMatchupEntity) => matchup.matches, {
        onDelete: "SET NULL"
    })
    fantasy_matchup: FantasyMatchupEntity;

    @OneToOne(() => MatchScores, score => score.match, {
        eager: true
    })
    match_score: MatchScores;
}