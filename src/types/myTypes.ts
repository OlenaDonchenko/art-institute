export type Artwork = {
  id: number;
  title: string;
  creators: { description: string }[];
  images: { web: { url: string } } | null;
};
