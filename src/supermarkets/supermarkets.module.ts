import { Module } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketsController } from './supermarkets.controller';

@Module({
  providers: [SupermarketsService],
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  controllers: [SupermarketsController],
})
export class SupermarketsModule {}
