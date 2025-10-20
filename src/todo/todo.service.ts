import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoStatus } from 'src/enum/todoStatus.enum';
import { searchFilterDto } from './dto/searchfilter.dto';
import { PaginationResult } from 'src/types/pagination.interface';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>, // <- pas de virgule finale
  ) {}

  async checkTodoExist(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async getTodos(searchFilter: searchFilterDto): Promise<PaginationResult<TodoEntity>> {
    const { page,limit,search,status } = searchFilter;
    const skip = (page - 1) * limit;
    let where: any;

    if (search && status) {
      // Both filters exist
      where = [
        { name: ILike(`%${search}%`), status },
        { description: ILike(`%${search}%`), status },
      ];
    } else if (search) {
      // Only search
      where = [
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    } else if (status) {
      // Only status
      where = { status };
    } else {
      // No filters
      where = {};
    }

    const [data, total] = await this.todoRepository.findAndCount({
      skip,
      take: limit,
      where
    });
    
    
    let pageCount =total===0?0:  Math.ceil(total/limit);
    const dataLength=data.length;
    const hasNextPage=page<pageCount;
    const hasPreviousPage=page>1;
    
    return {
        page,
        limit,
        total,
        pageCount,
        hasPreviousPage,
        hasNextPage,
        dataLength,
        data
    }
  }


    async getTodosWithQbuilder(searchFilter: searchFilterDto): Promise<PaginationResult<TodoEntity>> {
    const { page,limit,search,status } = searchFilter;
    const skip = (page - 1) * limit;
    const query = this.todoRepository.createQueryBuilder('todo');

  // Apply status filter if provided
  if (status) {
    query.andWhere('todo.status = :status', { status });
  }

  // Apply search filter if provided (name OR description)
  if (search) {
    query.andWhere(
      '(todo.name ILIKE :search OR todo.description ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  // Pagination
  query.skip(skip).take(limit);

  const [data, total] = await query.getManyAndCount();
    

let pageCount = Math.ceil(total / limit);
    if (total===0){
        pageCount=0;
    }
    const dataLength=data.length;
    const hasNextPage=page<pageCount;
    const hasPreviousPage=page>1;
    
    return {
        page,
        limit,
        total,
        pageCount,
        hasPreviousPage,
        hasNextPage,
        dataLength,
        data
    }
  }

   getTodo(id: number): Promise<TodoEntity> {
    return this.checkTodoExist(id);
  }


  addTodo(todo: CreateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.save(todo);
  }

   async updateTodo(id:number,updatedTodo: UpdateTodoDto): Promise<TodoEntity> {
        const newTodo=await this.todoRepository.preload({id,...updatedTodo});
        //we dont use  repository.save({ id: 5, ...cv }) because like that even the id doesn't exist it will create a new cv
        if(!newTodo){
            throw new NotFoundException('Todo not found');
        }
        return  this.todoRepository.save(newTodo);
  }

   async deleteTodo(id:number): Promise<string>{
    const result=await this.todoRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException('Todo not found');
    }
    return "todo with id " + id + " deleted successfully";
  }

  async removeTodo(id:number){
    const todo=await this.checkTodoExist(id);
    return this.todoRepository.remove(todo);
}

  async softDeleteTodo(id:number): Promise<string>{
    const result = await this.todoRepository.softDelete(id);
    if (result.affected === 0) {
        throw new NotFoundException('Todo not found');
    }
    
    return "todo with id " + id + " soft deleted successfully";
                                }
   
   async softRemoveTodo(id:number){
    const todo = await this.todoRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found or already soft-deleted`);
    }
    await this.todoRepository.softRemove(todo);
    return `todo with id ${id} soft removed successfully`;
       }                              

async restoreTodo(id: number): Promise<string> {
    const todo = await this.todoRepository.findOne({  withDeleted: true,where: {id:id, deletedAt: Not(IsNull()) } });
    if (!todo) throw new NotFoundException(`There is no soft-deleted todo with id ${id}`);
    await this.todoRepository.restore(id); // tehre is also recover with this.todoRepository.restore(todo)
    return `Todo with id ${id} restored successfully`;
  }

  /*Préparer une api permettant d’avoir en une seule requête le nombre de
todo pour chacun des trois statues*/

async getTodoCountByStatus() {
  const pendingCount = await this.todoRepository.count({ where: { status: TodoStatus.PENDING } });
  const inProgressCount = await this.todoRepository.count({ where: { status: TodoStatus.IN_PROGRESS } });
  const doneCount = await this.todoRepository.count({ where: { status: TodoStatus.DONE } });

  return {
    [TodoStatus.PENDING]: pendingCount,
    [TodoStatus.IN_PROGRESS]: inProgressCount,
    [TodoStatus.DONE]: doneCount
  };
}

  
 
}
