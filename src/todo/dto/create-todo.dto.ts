import { IsNotEmpty, Length, MinLength } from 'class-validator';
import { ValidationMessages } from '../../constants/messages';


export class CreateTodoDto {
  @IsNotEmpty({ message: ValidationMessages.TODO_NAME_REQUIRED })
  @Length(3, 10, { message: ValidationMessages.TODO_NAME_LENGTH })
  name: string;

  @IsNotEmpty({ message: ValidationMessages.TODO_DESCRIPTION_REQUIRED })
  @MinLength(10, { message: ValidationMessages.TODO_DESCRIPTION_MIN })
  description: string;
}
