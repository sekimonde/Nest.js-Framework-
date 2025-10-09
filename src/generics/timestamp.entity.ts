import { DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";



export class TimestampEntity {
    @CreateDateColumn({
        update: false
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;    
}