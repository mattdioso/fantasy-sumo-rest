import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WrestlerEntity } from "./wrestler.entity";

@Entity('rankings')
export class RankingsEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    rankName: string;

    @Column()
    rankNumber: string;

    @Column()
    rankCardinal: string;

    @Column()
    @OneToOne(() => WrestlerEntity, (wrestler: WrestlerEntity) => wrestler.id)
    @JoinColumn()
    idWrestler: string;
}