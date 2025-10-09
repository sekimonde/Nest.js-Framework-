import { TodoStatus } from "src/enum/todoStatus.enum";
import { TimestampEntity } from "src/generics/timestamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('todos')
export class TodoEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    description: string;

    @Column(
        {type: 'enum',
         enum: TodoStatus,
         default: TodoStatus.PENDING
        }
    )
    status: string;
}