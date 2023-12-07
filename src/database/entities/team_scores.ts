import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { TeamEntity } from './team.entity';

@Entity('team_scores')
export class TeamScores {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => TournamentEntity)
    tournament: TournamentEntity;

    @OneToOne(() => TeamEntity)
    team: TeamEntity;

    @Column({
        type: 'decimal'
    })
    score: number;
}