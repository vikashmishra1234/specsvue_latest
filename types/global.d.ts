// types/global.d.ts

export {}

declare global {
  interface ProductType {
    _id: string;
    brandName: string;
    collection: string;
    condition: string;
    createdAt: string;
    discount: string;
    frameColor: string;
    frameDimensions: string;
    frameMaterial: string;
    frameShape: string;
    frameSize: string;
    frameStyle: string;
    frameStyleSecondary: string;
    frameType: string;
    frameWidth: string;
    gender: string;
    height: string;
    images: string[];
    material: string;
    modelNumber: string;
    prescriptionType: string;
    price: string;
    productType: string;
    productWarranty: string;
    templeColor: string;
    templeMaterial: string;
    updatedAt: string;
    weight: string;
    weightGroup: string;
    stock: stock;
  }
}
