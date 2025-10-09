import { Body, Controller, Post, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { searchFilterDto } from './dto/searchfilter.dto';
import { PaginationResult } from 'src/types/pagination.interface';    
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    getTodos(@Query() searchFilter: searchFilterDto): Promise<PaginationResult<TodoEntity>> {
        return this.todoService.getTodosWithQbuilder(searchFilter);
    }

    @Get(':id')
    getTodo(@Param('id') id: number): Promise<TodoEntity> {
        return this.todoService.getTodo(id);
    }

    @Post()
    addTodo(@Body() todo: CreateTodoDto): Promise<TodoEntity> {
        return this.todoService.addTodo(todo);
    }

    @Put(':id')
    updateTodo(@Body() updatedTodo: UpdateTodoDto, @Param('id') id: number): Promise<TodoEntity> {
        return this.todoService.updateTodo(id, updatedTodo)
    }

    @Delete('delete/:id')
    deleteTodo(@Param('id') id: number) {
        return this.todoService.deleteTodo(id)
    }

    @Delete('remove/:id')
    removeTodo(@Param('id') id: number) {
        return this.todoService.removeTodo(id)
    }

    @Delete('softdelete/:id')
    softDeleteTodo(@Param('id') id: number) {
        return this.todoService.softDeleteTodo(id)
    }

    @Delete('softremove/:id')
    softRemoveTodo(@Param('id') id: number) {
        return this.todoService.softRemoveTodo(id)
    }

    

    @Delete('restore/:id')
    restoreTodo(@Param('id') id: number) {
        return this.todoService.restoreTodo(id)
    }

    @Get('count')
    getTodoCountByStatus() {
        return this.todoService.getTodoCountByStatus()
    }
}
