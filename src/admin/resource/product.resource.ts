//@ts-ignore
import { UploadOptions } from '@adminjs/upload';
//@ts-ignore
import { ComponentLoader } from 'adminjs';

export const ProductProperties = {
    images: {
        isArray: true,
        type: 'string',
        isVisible: { list: true, filter: false, show: true, edit: false },
    },
    uploadFiles: {
        isVisible: { list: false, filter: false, show: true, edit: true },
        label: 'Фотографии товара',
    },
};

export const ProductUploadOptions: Omit<UploadOptions, 'provider' | 'componentLoader'> = {
    properties: {
        key: 'images',
        file: 'uploadFiles',
    },
    multiple: true,
    validation: {
        mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    },
    uploadPath: (record, filename) => {
        const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
        return `holy-drip/products/${record.id()}/${Date.now()}_${nameWithoutExt}`;
    }
};