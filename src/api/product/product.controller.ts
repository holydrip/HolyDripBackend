import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async getAll() {
    return await this.productService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Get('category/:id')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  async getByCategoryId(id: string) {
    return await this.productService.getByCategoryId(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Sync product from Sanity' })
  async sync(@Body() body: ProductEntity & { action: 'create' | 'update' | 'delete'; categorySanityId?: string }) {
    const { sanityId, name, price, description, images, categorySanityId, action, sizes } = body;

    if (action === 'delete') {
      return await this.productService.deleteBySanityId(sanityId);
    }

    const cleanImages = Array.isArray(images) 
      ? images.filter((img): img is string => typeof img === 'string' && img !== null)
      : [];

    return await this.productService.upsertFromSanity({
      sanityId,
      name,
      price: Number(price),
      description: description || '',
      images: cleanImages,
      sizes,
      categorySanityId,
    });
  }
}
