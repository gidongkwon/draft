export type PostCardModel = {
  id: string;
  kind: "note" | "article";
  title: string | null;
  excerpt: string;
  publishedAt: string;
  href: string;
  author: {
    handle: string;
    name: string;
    avatarUrl: string | null;
  };
  stats: {
    reactions: number;
    replies: number;
    shares: number;
  };
};
