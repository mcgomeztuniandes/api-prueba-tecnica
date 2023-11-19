import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SupermarketEntity } from '../supermarkets/supermarket.entity';

@Entity()
export class CityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    country: string;

    @Column()
    population: number;

    @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
    supermarkets: SupermarketEntity[];
}
