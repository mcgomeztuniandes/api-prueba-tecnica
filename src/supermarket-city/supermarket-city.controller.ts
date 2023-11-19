import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermarketCityService } from './supermarket-city.service';
import { SupermarketDto } from 'src/supermarkets/supermarket.dto';
import { plainToInstance } from 'class-transformer';
import { SupermarketEntity } from 'src/supermarkets/supermarket.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketCityController {
    constructor(private readonly supermarketCityService: SupermarketCityService){}

    @Post(':cityId/supermarkets/:supermarketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.supermarketCityService.addSupermarketToCity(supermarketId, cityId);
    }   

    @Get(':cityId/supermarkets/:supermarketId')
    async findSupermarketFromCity(@Param('supermarketId') supermarketId: string, @Param('cityId') cityId: string){
        return await this.supermarketCityService.findSupermarketFromCity(supermarketId, cityId);
    }

    @Get(':cityId/supermarkets')
    async findSupermarketsFromCity(@Param('supermarketId') supermarketId: string){
        return await this.supermarketCityService.findSupermarketsFromCity(supermarketId);
    }

    @Put(':cityId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermarketDto: SupermarketDto[], @Param('cityId') cityId: string){
        const supermarkets = plainToInstance(SupermarketEntity, supermarketDto)
        return await this.supermarketCityService.updateSupermarketsFromCity(cityId, supermarkets);
    }

    @Delete(':cityId/supermarkets/:supermarketId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('supermarketId') supermarketId: string, @Param('cityId') cityId: string){
        return await this.supermarketCityService.deleteSupermarketFromCity(supermarketId, cityId);
    }
}
