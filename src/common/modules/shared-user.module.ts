import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';

@Global()
@Module({
  imports: [UserModule],
  exports: [UserModule],
})
export class SharedUserModule {}
