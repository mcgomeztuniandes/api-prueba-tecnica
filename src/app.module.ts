import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { SupermarketsModule } from './supermarkets/supermarkets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './cities/city.entity';
import { SupermarketEntity } from './supermarkets/supermarket.entity';
import { SupermarketCityModule } from './supermarket-city/supermarket-city.module';

@Module({
  imports: [CitiesModule, SupermarketsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'supermarket',
      entities: [CityEntity, SupermarketEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    SupermarketCityModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
