import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { DaysEntity } from './day.entity';
import { TechniqueEntity } from './techniques.entity';
import { WrestlerEntity } from './wrestler.entity';
import { TournamentEntity } from './tournament.entity';
import { FantasyMatchupController } from '../../controller/fantasy_matchup.controller';
import { FantasyMatchupEntity } from './fantasy_matchup.entity';

@Entity('matches')
export class MatchEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @ManyToOne(() => WrestlerEntity, idWrestler1 => idWrestler1.id)
    idWrestler1: string;

    @Column()
    win1: number;

    @Column()
    winByForfeit1: number;

    @Column()
    @ManyToOne(() => WrestlerEntity, idWrestler2 => idWrestler2.id)
    idWrestler2: string;
    
    @Column()
    win2: number;

    @Column()
    winByForfeit2: number;

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

    @ManyToOne(() => FantasyMatchupEntity, (matchup: FantasyMatchupEntity) => matchup.matches)
    fantasy_matchup: FantasyMatchupEntity;
}