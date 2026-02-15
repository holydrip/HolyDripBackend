import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

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
}
