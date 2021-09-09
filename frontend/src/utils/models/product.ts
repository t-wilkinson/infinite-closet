import { StrapiCategory } from './category';
import { StrapiColor } from './color';
import { StrapiDesigner } from './designer';
import { StrapiFile } from './file';
import { StrapiFit } from './fit';
import { StrapiMaterial } from './material';
import { StrapiMetal } from './metal';
import { StrapiOccasion } from './occasion';
import { StrapiSize } from './custom/sizes';
import { StrapiStyle } from './style';
import { StrapiWeather } from './weather';

/**
 * Model definition for Product
 */
export interface StrapiProduct {
  id: string;
  name: string;
  slug: string;
  designer?: StrapiDesigner;
  shortRentalPrice: number;
  longRentalPrice: number;
  retailPrice?: number;
  purchasePrice?: number;
  images: StrapiFile[];
  sizes: StrapiSize[];
  details?: string;
  stylistNotes?: string;
  sizingNotes?: string;
  categories: StrapiCategory[];
  colors: StrapiColor[];
  fits: StrapiFit[];
  occasions: StrapiOccasion[];
  styles: StrapiStyle[];
  weather: StrapiWeather[];
  materials: StrapiMaterial[];
  metals: StrapiMetal[];
  categories_?: string;
  colors_?: string;
  fits_?: string;
  occasions_?: string;
  styles_?: string;
  weather_?: string;
  materials_?: string;
  metals_?: string;
  sizes_?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}