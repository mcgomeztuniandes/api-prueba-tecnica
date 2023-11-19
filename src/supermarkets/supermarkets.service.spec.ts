import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketEntity } from './supermarket.entity';
import { faker } from '@faker-js/faker';

describe('SupermarketsService', () => {
  let service: SupermarketsService;
  let repository: Repository<SupermarketEntity>;
  let supermarketList = [];

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermarketEntity = await repository.save({
        name: 'Supermarket ' + faker.company.name(),
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        website: faker.internet.url()
      })
      supermarketList.push(supermarket);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketsService],
    }).compile();

    service = module.get<SupermarketsService>(SupermarketsService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const stored: SupermarketEntity = supermarketList[0];
    const supermarket: SupermarketEntity = await service.findOne(stored.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(stored.name)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity= {
      id: "",
      name: 'Supermarket ' + faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
      cities: []
    }
 
    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();
 
    const stored: SupermarketEntity = await repository.findOne({where: {id: newSupermarket.id}})
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(newSupermarket.name);
    expect(stored.website).toEqual(newSupermarket.website);
  });

  it('create should throw an exception for an exists supermarket', async () => {
    const supermarketCreate: SupermarketEntity = supermarketList[0];
    
    const supermarket: SupermarketEntity = {
      id: "",
      name: supermarketCreate.name,
      longitude: supermarketCreate.longitude,
      latitude: supermarketCreate.latitude,
      website: faker.internet.url(),
      cities: []
    }
    await expect(() => service.create(supermarket)).rejects.toHaveProperty("message", "A supermarket with the submitted name, latitude and longitude, already exists")
  });

  it('create should throw an exception for a name menor 10 characters', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: 'Super',
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
      cities: []
    }
    await expect(() => service.create(supermarket)).rejects.toHaveProperty("message", "Supermarket name must have more than 10 characters")
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name= 'Supermarket ' + faker.company.name(),
    supermarket.longitude= faker.location.longitude(),
    supermarket.latitude= faker.location.latitude(),
    supermarket.website= faker.internet.url()

    const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
    const stored: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(updatedSupermarket.name);
    expect(stored.website).toEqual(updatedSupermarket.website);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermarketEntity = supermarketList[0];
    supermarket = {
      ...supermarket, name: "Tagamandapio"
    }
    await expect(() => service.update("0", supermarket)).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id")
  });

  it('update should throw an exception for an exists supermarket', async () => {
    await expect(() => service.update(supermarketList[1].id, supermarketList[0])).rejects.toHaveProperty("message", "A supermarket with the submitted name, latitude and longitude, already exists")
  });

  it('update should throw an exception for a name menor 10 characters', async () => {
    const supermarket: SupermarketEntity = {
      id: supermarketList[1].id,
      name: 'Super',
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
      cities: []
    }
    await expect(() => service.create(supermarket)).rejects.toHaveProperty("message", "Supermarket name must have more than 10 characters")
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Supermarket does not exist for the sent id")
  });
});
