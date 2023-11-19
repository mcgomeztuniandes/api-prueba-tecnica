import { Module } from '@nestjs/common';
import { SupermarketCityService } from './supermarket-city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../cities/city.entity';
import { SupermarketEntity } from '../supermarkets/supermarket.entity';
import { SupermarketCityController } from './supermarket-city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  providers: [SupermarketCityService],
  controllers: [SupermarketCityController],
})
export class SupermarketCityModule {}
