import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MatchEntity } from './matches.entity';
import { TournamentEntity } from './tournament.entity';

@Entity('days')
export class DaysEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => TournamentEntity, (tourney: TournamentEntity) => tourney.id)

    tournament_id: string;

    @OneToMany(() => MatchEntity, (match: MatchEntity)=> match.id, {
        onDelete: "CASCADE",
        primary: true,
        eager: true
    })
    matches: MatchEntity[];

}