import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TournamentEntity } from "./tournament.entity";
import { WrestlerEntity } from "./wrestler.entity";

@Entity('rankings')
export class RankingsEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    rank: string;

    @Column()
    @ManyToOne(() => TournamentEntity, idTournament => idTournament.id)
    idTournament: string;

    @Column()
    wins: number;

    @Column()
    losses: number;

    @Column()
    division: string;

    @Column()
    @OneToOne(() => WrestlerEntity, (wrestler: WrestlerEntity) => wrestler.id)
    idWrestler: string;
}