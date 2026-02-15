import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductEntity } from 'src/api/product/product.entity';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.prisma.product.findMany({});
  }

  async findById(id: string): Promise<ProductEntity> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByCategoryId(id: string): Promise<ProductEntity[]> {
    return this.prisma.product.findMany({
      where: { categoryId: id },
    });
  }
}
