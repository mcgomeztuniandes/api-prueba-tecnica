import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../cities/city.entity';
import { SupermarketEntity } from '../supermarkets/supermarket.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SupermarketCityService {
    constructor(
        @InjectRepository(SupermarketEntity)
        private readonly supermarketRepository: Repository<SupermarketEntity>,
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>,
        
    ) {}

    async addSupermarketToCity(supermarketId: string, cityId: string): Promise<SupermarketEntity> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}});
        if (!city)
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
        
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}, relations: ["cities"]})
        if (!supermarket)
            throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);

            supermarket.cities = [...supermarket.cities, city];
        return await this.supermarketRepository.save(supermarket);
    }

    async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId} , relations: ["supermarkets"]});
        if (!city)
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
       
        return city.supermarkets;
    }

    async findSupermarketFromCity(supermarketId: string, cityId: string): Promise<SupermarketEntity> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId} , relations: ["supermarkets"]});
        if (!city)
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
        
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}, relations: ["cities"]})
            if (!supermarket)
                throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);
    
        const supermarketCity: SupermarketEntity = city.supermarkets.find(e => e.id === supermarket.id);
    
        if (!supermarketCity)
            throw new BusinessLogicException("The city with the given id is not associated to the supermarket", BusinessError.PRECONDITION_FAILED)
    
        return supermarketCity;
    }

    async updateSupermarketsFromCity(cityId: string, supermarkets: SupermarketEntity[]): Promise<CityEntity> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId} , relations: ["supermarkets"]});
        if (!city)
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);

        for (let i = 0; i < supermarkets.length; i++) {
            const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarkets[i].id}});
            if (!supermarket)
                throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND)
        }

        city.supermarkets = supermarkets;
        return await this.cityRepository.save(city);
    }

    async deleteSupermarketFromCity(supermarketId: string, cityId: string){
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}})
        if (!supermarket)
            throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);
    
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId} , relations: ["supermarkets"]});
        if (!city)
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
    
        const citySupermarket: SupermarketEntity = city.supermarkets.find(e => e.id === supermarket.id);
    
        if (!citySupermarket)
            throw new BusinessLogicException("The city with the given id is not associated to the supermarket", BusinessError.PRECONDITION_FAILED)
 
        city.supermarkets = city.supermarkets.filter(e => e.id !== supermarketId);
        await this.cityRepository.save(city);
    }
}
