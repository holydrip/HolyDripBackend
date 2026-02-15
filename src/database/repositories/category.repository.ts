import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryEntity } from 'src/api/category/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  async findById(id: string): Promise<CategoryEntity> {
    return this.prisma.category.findUnique({
        where: {id},
        include: {
            products: true
        }
    })
  }
}
