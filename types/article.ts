export interface Article {
  title: string;
  slug: string;
  meta: {
    title: string;
    description: string;
    ogImage: { src: string } | null;
  };
  body: string;
}
