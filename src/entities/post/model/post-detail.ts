export type PostDetailModel = {
  id: string;
  kind: "note" | "article";
  title: string | null;
  summary: string | null;
  contentHtml: string;
  publishedAt: string;
  canonicalUrl: string | null;
  author: {
    handle: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    profileHref: string;
  };
  stats: {
    reactions: number;
    replies: number;
    shares: number;
    quotes?: number;
  };
};
