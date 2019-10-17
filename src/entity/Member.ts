import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BaseEntity} from "typeorm";

@Entity()
export class Member extends BaseEntity{
    @PrimaryColumn({unique: true})
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    mobile: number;

    @Column()
    committee: string;

    constructor(){
        super();
        this.id = 0;
        this.name = "";
        this.email = "";
        this.mobile = 0;
        this.committee = "";

    }
}