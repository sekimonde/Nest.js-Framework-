import { Inject, Injectable } from '@nestjs/common';
import { AppProvidersToken } from 'src/config/app.provider.token';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AppProvidersToken.UUID_GENERATOR) private readonly uuid: () => string,
  ) {}

  createUser() {
    const id = this.uuid();
    return { id, name: 'Helmi' };
  }
}
