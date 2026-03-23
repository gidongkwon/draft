import { z } from "zod";

const authCompleteSearchSchema = z.object({
  code: z.string().trim().min(1, "Verification code is required."),
  next: z.string().optional(),
});

export type AuthCompleteSearch = z.infer<typeof authCompleteSearchSchema>;

export function parseAuthCompleteSearch(input: unknown): AuthCompleteSearch {
  return authCompleteSearchSchema.parse(input);
}

export function resolvePostSignInRedirect(next?: string) {
  if (next == null || next.length === 0) {
    return "/";
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}
