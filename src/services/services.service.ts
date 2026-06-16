import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(createServiceDto: CreateServiceDto, userId: string) {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      user: { id: userId },
    });
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find({ relations: { user: true } });
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({ where: { id }, relations: { user: true } });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: string) {
    return `This action removes a #${id} service`;
  }
}
