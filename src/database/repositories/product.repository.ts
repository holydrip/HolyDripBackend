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

  async upsertBySanityId(data: {
    sanityId: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    sizes: string[];
    images: string[];
    categorySanityId?: string;
  }) {
    const { categorySanityId, ...productData } = data;

    return this.prisma.product.upsert({
      where: { sanityId: data.sanityId },
      update: {
        ...productData,
        category: categorySanityId 
          ? { connect: { sanityId: categorySanityId } } 
          : undefined,
      },
      create: {
        ...productData,
        sanityId: data.sanityId,
        category: categorySanityId 
          ? { connect: { sanityId: categorySanityId } } 
          : undefined,
      },
    });
  }

  async deleteBySanityId(sanityId: string) {
    return this.prisma.product.delete({
      where: { sanityId },
    });
  }
}
