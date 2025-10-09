import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TodoStatus } from 'src/enum/todoStatus.enum';
import { ValidationMessages } from '../../constants/messages';

export class searchFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional() 
  @IsEnum(TodoStatus, { message: ValidationMessages.TODO_STATUS_INVALID }) 
  status?: TodoStatus;
}
