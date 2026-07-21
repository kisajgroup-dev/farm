export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  quantity: number;
  available: boolean;
  imageUrl: string | null;
  description: string | null;
}
