import { v4 as uuidv4 } from 'uuid';
import { Provider } from '@nestjs/common';
import { AppProvidersToken } from 'src/config/app.provider.token';



export const commonProviders: Provider[] = [
  {
    provide: AppProvidersToken.UUID_GENERATOR,
    useValue: uuidv4,
  },
];
