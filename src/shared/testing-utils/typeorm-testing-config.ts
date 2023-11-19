import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../../cities/city.entity';
import { SupermarketEntity } from '../../supermarkets/supermarket.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CityEntity, SupermarketEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([CityEntity, SupermarketEntity]),
];