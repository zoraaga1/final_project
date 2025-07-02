export type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  imgs: string[]; 
  createdBy: {
    _id: string;
    name: string;
    email: string;
    rating: number;
  };
  reviews?: number; 
  discountedPrice?: number;
  hasExpertDemand?: boolean;
  __v?: number;
}
