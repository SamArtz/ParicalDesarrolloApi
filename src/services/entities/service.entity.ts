import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('service')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column()
  price!: string;

  @Column()
  provider!: string;

  @ManyToOne(() => User)
  user!: User;

}