import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';
import { CitiesController } from './cities.controller';

@Module({
  providers: [CitiesService],
  imports: [TypeOrmModule.forFeature([CityEntity])],
  controllers: [CitiesController],
})
export class CitiesModule {}
