import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TechniqueEntity } from './techniques.entity';
import { WrestlerEntity } from './wrestler.entity';

@Entity('matches')
export class MatchEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @ManyToOne(() => WrestlerEntity, idWrestler1 => idWrestler1.id)
    @JoinColumn()
    idWrestler1: string;

    @Column()
    win1: number;

    @Column()
    winByForfeit1: number;

    @Column()
    @ManyToOne(() => WrestlerEntity, idWrestler2 => idWrestler2.id)
    @JoinColumn()
    idWrestler2: string;
    
    @Column()
    win2: number;

    @Column()
    winByForfeit2: number;

    @ManyToOne(() => TechniqueEntity, winTechnique => winTechnique.id)
    @JoinColumn()
    winTechnique: string;

    @Column()
    matchNum: number;
}