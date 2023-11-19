import { Injectable } from '@nestjs/common';
import { SupermarketEntity } from './supermarket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SupermarketsService {
    constructor(
        @InjectRepository(SupermarketEntity)
        private readonly supermarketRepository: Repository<SupermarketEntity>
    ){}

    async findAll(): Promise<SupermarketEntity[]>{
        return await this.supermarketRepository.find({
            relations: [
                "cities"
            ]
        });
    }

    async findOne(id: string): Promise<SupermarketEntity>{
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {id},
            relations: [
                "cities"
            ]
        });
        if(!supermarket){
            throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);
        }            
        return supermarket
    }

    async create(supermarket:SupermarketEntity): Promise<SupermarketEntity> {
        const supermarkets: SupermarketEntity[] = await this.supermarketRepository.find({
            where: {name: supermarket.name, latitude: supermarket.latitude, longitude: supermarket.longitude}
        })
        if (supermarkets.length > 0){
            throw new BusinessLogicException("A supermarket with the submitted name, latitude and longitude, already exists", BusinessError.PRECONDITION_FAILED);
        }

        this.validateSupermarketName(supermarket.name);
        return await this.supermarketRepository.save(supermarket)
    }

    async update(id:string, supermarket:SupermarketEntity): Promise<SupermarketEntity>{
        const persistencesupermarket: SupermarketEntity = await this.supermarketRepository.findOne({where:{id}});
        if(!persistencesupermarket){
            throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);
        }
        if(supermarket.name && (supermarket.name != persistencesupermarket.name)){
            const supermarkets: SupermarketEntity[] = await this.supermarketRepository.find({
                where: {name: supermarket.name, latitude: supermarket.latitude, longitude: supermarket.longitude}
            })
            if (supermarkets.length > 0){
                throw new BusinessLogicException("A supermarket with the submitted name, latitude and longitude, already exists", BusinessError.PRECONDITION_FAILED);
            }
        }

        this.validateSupermarketName(supermarket.name);
        return await this.supermarketRepository.save({...persistencesupermarket, ...supermarket});
    }

    async delete(id:string){
        const supermarket:SupermarketEntity = await this.supermarketRepository.findOne({where:{id}});
        if(!supermarket){
            throw new BusinessLogicException("Supermarket does not exist for the sent id", BusinessError.NOT_FOUND);
        }

        this.validateSupermarketName(supermarket.name);
        await this.supermarketRepository.remove(supermarket);
    }

    private validateSupermarketName(name: string): void {
        if (name.length <= 10) {
            throw new BusinessLogicException('Supermarket name must have more than 10 characters', BusinessError.PRECONDITION_FAILED);
        }
    }
}
