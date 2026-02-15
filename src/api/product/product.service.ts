import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "src/database/repositories/product.repository";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}
    async getAll(): Promise<ProductEntity[]> {
        return this.productRepository.findAll();
    }

    async getById(id: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findById(id);
        if (!product) throw new NotFoundException(`Product with id ${id} not found`);
        return product;
    }

    async getByCategoryId(id: string): Promise<ProductEntity[]>{
        return this.productRepository.findByCategoryId(id);
    }
}