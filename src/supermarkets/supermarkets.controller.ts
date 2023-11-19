import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermarketDto } from './supermarket.dto';
import { SupermarketEntity } from './supermarket.entity';
import { plainToInstance } from 'class-transformer';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketsController {
    constructor(private readonly supermarketsService: SupermarketsService) {}

    @Get()
    async findAll() {
        return await this.supermarketsService.findAll();
    }

    @Get(':supermarketId')
    async findOne(@Param('supermarketId') supermarketId: string) {
        return await this.supermarketsService.findOne(supermarketId);
    }

    @Post()
    async create(@Body() supermarketDto: SupermarketDto) {
        const supermarket: SupermarketEntity = plainToInstance(SupermarketEntity, supermarketDto);
        return await this.supermarketsService.create(supermarket);
    }

    @Put(':supermarketId')
    async update(@Param('supermarketId') supermarketId: string, @Body() supermarketDto: SupermarketDto) {
        const supermarket: SupermarketEntity = plainToInstance(SupermarketEntity, supermarketDto);
        return await this.supermarketsService.update(supermarketId, supermarket);
    }

    @Delete(':supermarketId')
    @HttpCode(204)
    async delete(@Param('supermarketId') supermarketId: string) {
        return await this.supermarketsService.delete(supermarketId);
    }
}
