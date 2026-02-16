import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
//@ts-ignore
import { AdminModuleOptions } from '@adminjs/nestjs';
//@ts-ignore
import { getModelByName } from '@adminjs/prisma';
import { v2 as cloudinary } from 'cloudinary';

import { ProductProperties, ProductUploadOptions } from './resource/product.resource';

@Injectable()
export class AdminConfigService {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {}

async createAdminOptions(): Promise<AdminModuleOptions> {
    const AdminJSModule = await eval('import("adminjs")');
    const componentLoader = new AdminJSModule.ComponentLoader();
    
    const uploadModule = await eval('import("@adminjs/upload")');
    const uploadFeature = uploadModule.default;
    const BaseProvider = uploadModule.BaseProvider;

    class MyCloudinaryProvider extends BaseProvider {
        constructor(options) {
            super(options.bucket);
            cloudinary.config(options.cloudinary);
        }

        async upload(file, key) {
            return await cloudinary.uploader.upload(file.path, {
                public_id: key,
                overwrite: true,
                resource_type: 'auto',
            });
        }

        async delete(key) {
            return await cloudinary.uploader.destroy(key);
        }

        async path(key) {
            return cloudinary.url(key, { secure: true });
        }
    }

    const cloudinaryProvider = new MyCloudinaryProvider({
        bucket: 'holy-drip',
        cloudinary: {
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        },
    });

    return {
        adminJsOptions: {
            rootPath: '/admin',
            componentLoader,
            resources: [
                { resource: { model: getModelByName('User'), client: this.prisma }, options: {} },
                { resource: { model: getModelByName('Category'), client: this.prisma }, options: {} },
                {
                    resource: { model: getModelByName('Product'), client: this.prisma },
                    options: {
                        properties: ProductProperties, 
                    },
                    features: [
                        uploadFeature({
                            componentLoader,
                            provider: cloudinaryProvider,
                            ...ProductUploadOptions,
                        }),
                    ],
                },
            ],
        },
        auth: {
            authenticate: async (email, password) => {
                if (
                    email === this.config.get('ADMIN_EMAIL') &&
                    password === this.config.get('ADMIN_PASSWORD')
                ) {
                    return { email };
                }
                return null;
            },
            cookieName: 'adminjs',
            cookiePassword: this.config.get('SESSION_SECRET') || 'super-secret-password-longer-than-32-chars',
        },
        sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: this.config.get('SESSION_SECRET') || 'secret',
        },
    };
}
}