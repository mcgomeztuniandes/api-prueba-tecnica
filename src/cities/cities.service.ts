import { Injectable } from '@nestjs/common';
import { CityEntity } from './city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>
    ){}

    async findAll(): Promise<CityEntity[]>{
        return await this.cityRepository.find({
            relations: [
                "supermarkets"
            ]
        });
    }

    async findOne(id: string): Promise<CityEntity>{
        const city: CityEntity = await this.cityRepository.findOne({
            where: {id},
            relations: [
                "supermarkets"
            ]
        });
        if(!city){
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
        }            
        return city
    }

    async create(city:CityEntity): Promise<CityEntity> {
        const cities: CityEntity[] = await this.cityRepository.find({
            where: {name: city.name, country: city.country}
        })
        if (cities.length > 0){
            throw new BusinessLogicException("A city with the submitted name and country already exists", BusinessError.PRECONDITION_FAILED);
        }
        this.validateCountry(city.country);
        return await this.cityRepository.save(city)
    }

    async update(id:string, city:CityEntity): Promise<CityEntity>{
        const persistencecity: CityEntity = await this.cityRepository.findOne({where:{id}});
        if(!persistencecity){
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
        }
        if(city.name && (city.name != persistencecity.name)){
            const cities: CityEntity[] = await this.cityRepository.find({
                where: {name: city.name, country: city.country}
            })
            if (cities.length > 0){
                throw new BusinessLogicException("A city with the submitted name and country already exists", BusinessError.PRECONDITION_FAILED);
            }
        }
        this.validateCountry(city.country);
        return await this.cityRepository.save({...persistencecity, ...city});
    }

    async delete(id:string){
        const city:CityEntity = await this.cityRepository.findOne({where:{id}});
        if(!city){
            throw new BusinessLogicException("City does not exist for the sent id", BusinessError.NOT_FOUND);
        }
        this.validateCountry(city.country);
        await this.cityRepository.remove(city);
    }

    private validateCountry(country: string): void {
        const allowedCountries = ['Argentina', 'Ecuador', 'Paraguay'];
        if (!allowedCountries.includes(country)) {
            throw new BusinessLogicException("Invalid country must be in the following list: Argentina, Ecuador or Paraguay", BusinessError.PRECONDITION_FAILED);
        }
    }
}
