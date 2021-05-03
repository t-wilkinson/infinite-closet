/**
 * Model definition for file
 */
export interface StrapiFile {
  id: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: { [key: string]: any };
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  providermetadata?: { [key: string]: any };
  related: any[];
  created_by: string;
}