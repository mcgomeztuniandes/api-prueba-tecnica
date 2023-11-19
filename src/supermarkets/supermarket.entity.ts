import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity } from '../cities/city.entity';

@Entity()
export class SupermarketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    longitude: number;

    @Column()
    latitude: number;

    @Column()
    website: string;

    @ManyToMany(() => CityEntity, city => city.supermarkets)
    @JoinTable()
    cities: CityEntity[];
}
