import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    username: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @OneToMany(() => TeamEntity, team => team.user, {
        onDelete: "SET NULL",
        cascade: true
    })
    @JoinColumn()
    team: TeamEntity;

    @Column({
        type: "varchar",
        nullable: true
    })
    avatar_store: string;
}