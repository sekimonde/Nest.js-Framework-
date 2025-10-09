import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsOptional, IsEnum, Length, MinLength } from 'class-validator';
import { ValidationMessages } from '../../constants/messages';
import { TodoStatus } from 'src/enum/todoStatus.enum';


export class UpdateTodoDto extends PartialType(CreateTodoDto){
         @IsOptional() 
         @IsEnum(TodoStatus, { message: ValidationMessages.TODO_STATUS_INVALID }) 
         status?: TodoStatus;


                                                                }