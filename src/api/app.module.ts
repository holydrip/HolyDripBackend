import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AdminConfigService } from 'src/admin/admin.config';

//@ts-ignore
import { Database, Resource } from '@adminjs/prisma'
//@ts-ignore
import AdminJS from 'adminjs'
import { PrismaService } from 'src/database/prisma.service';
import { AdminConfigModule } from 'src/admin/admin.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

AdminJS.registerAdapter({ Database, Resource })

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    import('@adminjs/nestjs').then(({ AdminModule }) => 
      AdminModule.createAdminAsync({
        imports: [AdminConfigModule], 
        inject: [AdminConfigService],
        useFactory: async (adminConfigService: AdminConfigService) => {
          return await adminConfigService.createAdminOptions();
        },
      })
    ),
  ],
  providers: [PrismaService], 
})
export class AppModule {}
