import { v4 as uuidv4 } from 'uuid';
import { Provider } from '@nestjs/common';

export const UUID_GENERATOR = 'UUID_GENERATOR';

export const commonProviders: Provider[] = [
  {
    provide: UUID_GENERATOR,
    useValue: uuidv4,
  },
];
