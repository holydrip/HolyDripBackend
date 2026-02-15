import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AdminConfigService } from './admin.config';

@Module({
    imports: [ConfigModule, DatabaseModule], 
    providers: [AdminConfigService],
    exports: [AdminConfigService],
})
export class AdminConfigModule {}