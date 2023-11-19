import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CityDto } from './city.dto';
import { CityEntity } from './city.entity';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get()
    async findAll() {
        return await this.citiesService.findAll();
    }

    @Get(':cityId')
    async findOne(@Param('cityId') cityId: string) {
        return await this.citiesService.findOne(cityId);
    }

    @Post()
    async create(@Body() cityDto: CityDto) {
        const city: CityEntity = plainToInstance(CityEntity, cityDto);
        return await this.citiesService.create(city);
    }

    @Put(':cityId')
    async update(@Param('cityId') cityId: string, @Body() cityDto: CityDto) {
        const city: CityEntity = plainToInstance(CityEntity, cityDto);
        return await this.citiesService.update(cityId, city);
    }

    @Delete(':cityId')
    @HttpCode(204)
    async delete(@Param('cityId') cityId: string) {
        return await this.citiesService.delete(cityId);
    }
}
