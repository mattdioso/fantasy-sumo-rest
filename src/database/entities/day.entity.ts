import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MatchEntity } from './matches.entity';
import { TournamentEntity } from './tournament.entity';

@Entity('days')
export class DaysEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @ManyToOne(() => TournamentEntity, (tournament: TournamentEntity) => tournament.days)
    // tournament: TournamentEntity;

    @Column({
        type: "int"
    })
    day_num: number;

    @OneToMany(() => MatchEntity, (match: MatchEntity)=> match.day, {
        onDelete: "CASCADE",
        cascade: true,
        eager: true
    })
    @JoinColumn()
    matches: MatchEntity[];

}