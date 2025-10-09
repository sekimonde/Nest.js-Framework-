import { Inject, Injectable } from '@nestjs/common';
import { UUID_GENERATOR } from 'src/common/common.providers';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UUID_GENERATOR) private readonly uuid: () => string,
  ) {}

  createUser() {
    const id = this.uuid();
    return { id, name: 'Helmi' };
  }
}
