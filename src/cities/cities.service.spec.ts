import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CitiesService } from './cities.service';
import { CityEntity } from './city.entity';
import { faker } from '@faker-js/faker';

describe('CitiesService', () => {
  let service: CitiesService;
  let repository: Repository<CityEntity>;
  let citiesList = [];

  const seedDatabase = async () => {
    repository.clear();
    citiesList = [];
    for(let i = 0; i < 5; i++){
        const city: CityEntity = await repository.save({
        name: faker.location.city(),
        country: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
        population: faker.number.int({ min: 1, max: 40000000 })
      })
      citiesList.push(city);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitiesService],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    repository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CityEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(citiesList.length);
  });

  it('findOne should return a city by id', async () => {
    const stored: CityEntity = citiesList[0];
    const city: CityEntity = await service.findOne(stored.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(stored.name)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "City does not exist for the sent id")
  });

  it('create should return a new city', async () => {
    const city: CityEntity = {
      id: "",
      name: faker.location.country() + faker.number.int({ min: 1, max:99999999 }),
      country: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      population: faker.number.int({ min: 1, max: 40000000 }),
      supermarkets: []
    }
 
    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();
 
    const stored: CityEntity = await repository.findOne({where: {id: newCity.id}})
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(newCity.name);
    expect(stored.country).toEqual(newCity.country);
    expect(stored.population).toEqual(newCity.population);
  });

  it('create should throw an exception for an exists city', async () => {
    const cityCreate: CityEntity = citiesList[0];
    
    const city: CityEntity = {
      id: "",
      name: cityCreate.name,
      country: cityCreate.country,
      population: faker.number.int({ min: 1, max: 40000000 }),
      supermarkets: []
    }
    await expect(() => service.create(city)).rejects.toHaveProperty("message", "A city with the submitted name and country already exists")
  });

  it('create should throw an exception for an country not list', async () => {
    const city: CityEntity = {
      id: "",
      name: faker.location.country() + faker.number.int({ min: 1, max:99999999 }),
      country: 'Colombia',
      population: faker.number.int({ min: 1, max: 40000000 }),
      supermarkets: []
    }
    await expect(() => service.create(city)).rejects.toHaveProperty("message", "Invalid country must be in the following list: Argentina, Ecuador or Paraguay")
  });

  it('update should modify a city', async () => {
    const city: CityEntity = citiesList[0];
    city.name = faker.location.country() + '-' + faker.location.city();
    city.country = faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']);
    city.population = faker.number.int({ min: 1, max: 40000000 })


    const updatedCity: CityEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const stored: CityEntity = await repository.findOne({ where: { id: city.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(updatedCity.name);
    expect(stored.country).toEqual(updatedCity.country);
    expect(stored.population).toEqual(updatedCity.population);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CityEntity = citiesList[0];
    city = {
      ...city, name: "Tagamandapio"
    }
    await expect(() => service.update("0", city)).rejects.toHaveProperty("message", "City does not exist for the sent id")
  });

  it('update should throw an exception for an exists city', async () => {
    await expect(() => service.update(citiesList[1].id, citiesList[0])).rejects.toHaveProperty("message", "A city with the submitted name and country already exists")
  });

  it('update should throw an exception for an country not list', async () => {
    const city: CityEntity = citiesList[0];
    city.name = faker.location.country() + '-' + faker.location.city();
    city.country = 'Colombia';
    city.population = faker.number.int({ min: 1, max: 40000000 })

    await expect(() => service.update(city.id, city)).rejects.toHaveProperty("message", "Invalid country must be in the following list: Argentina, Ecuador or Paraguay")
  });

  it('delete should remove a city', async () => {
    const city: CityEntity = citiesList[0];
    await service.delete(city.id);
    const deletedCity: CityEntity = await repository.findOne({ where: { id: city.id } })
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "City does not exist for the sent id")
  });
});
