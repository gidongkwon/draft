import type { ReactionGroupModel } from "./reaction-group";

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
  reactionGroups: ReactionGroupModel[];
  shareSummary?: {
    sharer: {
      handle: string;
      name: string;
    };
    sharersCount: number;
  };
};
