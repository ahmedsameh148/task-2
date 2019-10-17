import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BaseEntity} from "typeorm";

@Entity()
export class members extends BaseEntity{

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
        this.name="";
        this.committee="";
        this.email="";
        this.id=0;
        this.mobile=0;
    }
}
