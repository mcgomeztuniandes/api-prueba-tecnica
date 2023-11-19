import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketCityService } from './supermarket-city.service';
import { CityEntity } from '../cities/city.entity';
import { SupermarketEntity } from '../supermarkets/supermarket.entity';
import { faker } from '@faker-js/faker';

describe('SupermarketCityService', () => {
  let service: SupermarketCityService;
  let supermarketRepository: Repository<SupermarketEntity>;
  let cityRepository: Repository<CityEntity>;
  let city: CityEntity;
  let supermakertsList : SupermarketEntity[];

  const seedDatabase = async () => {
    cityRepository.clear();
    supermarketRepository.clear();
 
    supermakertsList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermarketEntity = await supermarketRepository.save({
        name: 'Supermarket ' + faker.company.name(),
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        website: faker.internet.url(),
      })
      supermakertsList.push(supermarket);
    }
 
    city = await cityRepository.save({
      name: faker.location.city(),
      country: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      population: faker.number.int({ min: 1, max: 40000000 }),
      supermarkets: supermakertsList
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketCityService],
    }).compile();

    service = module.get<SupermarketCityService>(SupermarketCityService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    supermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an supermarket to a city', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.country() + faker.number.int({ min: 1, max:99999999 }),
      country: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      population: faker.number.int({ min: 1, max: 40000000 }),
    });
 
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    const result: SupermarketEntity = await service.addSupermarketToCity(newSupermarket.id, newCity.id);
   
    expect(result.cities.length).toBe(1);
    expect(result.cities[0]).not.toBeNull();
    expect(result.cities[0].name).toBe(newCity.name)
    expect(result.cities[0].country).toBe(newCity.country)
    expect(result.cities[0].population).toBe(newCity.population)
  });

  it('addSupermarketToCity should thrown exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    await expect(() => service.addSupermarketToCity(newSupermarket.id, "0")).rejects.toHaveProperty("message", "City does not exist for the sent id");
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.country() + faker.number.int({ min: 1, max:99999999 }),
      country: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      population: faker.number.int({ min: 1, max: 40000000 }),
    });
 
    await expect(() => service.addSupermarketToCity("0", newCity.id)).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id");
  });

  it('findSupermarketsFromCity should return supermarkets from city', async () => {
    const supermarkets: SupermarketEntity[] = await service.findSupermarketsFromCity(city.id);
    expect(supermarkets.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "City does not exist for the sent id");
  });

  it('findSupermarketFromCity should return supermarket from city', async () => {
    const supermarket: SupermarketEntity = supermakertsList[0];
    const stored: SupermarketEntity = await service.findSupermarketFromCity(supermarket.id, city.id)
    expect(stored).not.toBeNull();
    expect(stored.name).toBe(supermarket.name);
    expect(stored.website).toBe(supermarket.website);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.findSupermarketFromCity("0", city.id)).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id");
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermakertsList[0];
    await expect(()=> service.findSupermarketFromCity(supermarket.id, "0")).rejects.toHaveProperty("message", "City does not exist for the sent id");
  });

  it('findSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    await expect(()=> service.findSupermarketFromCity(newSupermarket.id, city.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the supermarket");
  });

  it('updateSupermarketsFromCity should update supermarket list for a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    const updated: CityEntity = await service.updateSupermarketsFromCity(city.id, [newSupermarket]);
    expect(updated.supermarkets.length).toBe(1);
    expect(updated.supermarkets[0].name).toBe(newSupermarket.name);
    expect(updated.supermarkets[0].website).toBe(newSupermarket.website);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    await expect(()=> service.updateSupermarketsFromCity("0", [newSupermarket])).rejects.toHaveProperty("message", "City does not exist for the sent id");
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermarketEntity = supermakertsList[0];
    supermarket.id = "0";
 
    await expect(()=> service.updateSupermarketsFromCity(city.id, [supermarket])).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id");
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermarket: SupermarketEntity = supermakertsList[0];
   
    await service.deleteSupermarketFromCity(supermarket.id, city.id);
 
    const stored: CityEntity = await cityRepository.findOne({where: {id: city.id}, relations: ["supermarkets"]});
    const deletedSupermarket: SupermarketEntity = stored.supermarkets.find(a => a.id === supermarket.id);
 
    expect(deletedSupermarket).toBeUndefined();
 
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(()=> service.deleteSupermarketFromCity("0", city.id)).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id");
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermakertsList[0];
    await expect(()=> service.deleteSupermarketFromCity(supermarket.id, "0")).rejects.toHaveProperty("message", "City does not exist for the sent id");
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url()
    })
 
    await expect(()=> service.deleteSupermarketFromCity(newSupermarket.id, city.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the supermarket");
  });
});
