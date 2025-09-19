export type Product = {
    id?: number;
    sku: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    category: string;
    imageUrl?: string;
}