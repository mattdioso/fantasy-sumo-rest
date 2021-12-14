import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wrestlers')
export class WrestlerEntity {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    ringname: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    familyname: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    givenname: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    birthdate: string;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    birthplace: string;

    @Column({
        type: "real",
        nullable: false
    })
    height: number;

    @Column({
        type: "real",
        nullable: false
    })
    weight: number;

    @Column({
        type: "int",
        nullable: true
    })
    idstable: number;

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    retired: boolean;

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getRingname(): string {
        return this.ringname;
    }

    public setRingname(ringname: string): void {
        this.ringname = ringname;
    }

    public getFamilyname(): string {
        return this.familyname;
    }

    public setFamilyname(ringfamilyname: string): void {
        this.familyname = this.familyname;
    }

    public getGivenname(): string {
        return this.givenname;
    }

    public setGivenname(givenname: string): void {
        this.givenname = givenname;
    }


    public getBirthdate(): string {
        return this.birthdate;
    }

    public setBirthdate(birthdate: string): void {
        this.birthdate = birthdate;
    }

    public getBirthplace(): string {
        return this.birthplace;
    }

    public setBirthplace(birthplace: string): void {
        this.birthplace = birthplace;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public getWeight(): number {
        return this.weight;
    }

    public setWeight(weight: number): void {
        this.weight = weight;
    }

    public getIdstable(): number {
        return this.idstable;
    }

    public setIdstable(idstable: number): void {
        this.idstable = idstable;
    }

    public getRetired(): boolean {
        return this.retired;
    }

    public setRetired(retired: boolean): void {
        this.retired = retired;
    }
}