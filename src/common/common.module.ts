import { Global, Module } from '@nestjs/common';
import { commonProviders } from './common.providers';

//global module

@Global()
@Module({
    providers: commonProviders,
    exports: commonProviders,
  })
export class CommonModule {}
