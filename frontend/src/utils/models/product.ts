import { StrapiCategory } from './category';
import { StrapiColor } from './color';
import { StrapiDesigner } from './designer';
import { StrapiFile } from './file';
import { StrapiFit } from './fit';
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
  shortRentalPrice: number;
  longRentalPrice: number;
  retailPrice?: number;
  purchasePrice?: number;
  images: StrapiFile[];
  sizes: StrapiSize[];
  details?: string;
  stylistNotes?: string;
  designer?: StrapiDesigner;
  categories: StrapiCategory[];
  colors: StrapiColor[];
  fits: StrapiFit[];
  occasions: StrapiOccasion[];
  styles: StrapiStyle[];
  weather: StrapiWeather[];
  sizingNotes?: string;
  created_by: string;
}