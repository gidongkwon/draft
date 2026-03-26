/**
 * @generated SignedSource<<b2b9dc1cdd90495c87baca4a477cb1e3>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: vp exec relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type homeFeedQuery$variables = {
  after?: string | null | undefined;
  first: number;
  isPersonal: boolean;
  isPublic: boolean;
  local: boolean;
};
export type homeFeedQuery$data = {
  readonly personalTimeline?: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly lastSharer: {
        readonly handle: string;
        readonly rawName: string | null | undefined;
        readonly username: string;
      } | null | undefined;
      readonly node: {
        readonly __typename: string;
        readonly actor: {
          readonly avatarUrl: string;
          readonly handle: string;
          readonly rawName: string | null | undefined;
          readonly username: string;
        };
        readonly engagementStats: {
          readonly reactions: number;
          readonly replies: number;
          readonly shares: number;
        };
        readonly excerpt: string;
        readonly id: string;
        readonly name: string | null | undefined;
        readonly published: string;
        readonly reactionGroups: ReadonlyArray<{
          readonly emoji?: string;
          readonly reactors?: {
            readonly totalCount: number;
          };
        }>;
        readonly replyTarget: {
          readonly id: string;
          readonly replyTarget: {
            readonly id: string;
            readonly replyTarget: {
              readonly id: string;
              readonly replyTarget: {
                readonly id: string;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
        readonly sharedPost: {
          readonly __typename: string;
          readonly actor: {
            readonly avatarUrl: string;
            readonly handle: string;
            readonly rawName: string | null | undefined;
            readonly username: string;
          };
          readonly engagementStats: {
            readonly reactions: number;
            readonly replies: number;
            readonly shares: number;
          };
          readonly excerpt: string;
          readonly id: string;
          readonly name: string | null | undefined;
          readonly published: string;
          readonly reactionGroups: ReadonlyArray<{
            readonly emoji?: string;
            readonly reactors?: {
              readonly totalCount: number;
            };
          }>;
          readonly replyTarget: {
            readonly id: string;
            readonly replyTarget: {
              readonly id: string;
              readonly replyTarget: {
                readonly id: string;
                readonly replyTarget: {
                  readonly id: string;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
      };
      readonly sharersCount: number;
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  };
  readonly publicTimeline?: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly lastSharer: {
        readonly handle: string;
        readonly rawName: string | null | undefined;
        readonly username: string;
      } | null | undefined;
      readonly node: {
        readonly __typename: string;
        readonly actor: {
          readonly avatarUrl: string;
          readonly handle: string;
          readonly rawName: string | null | undefined;
          readonly username: string;
        };
        readonly engagementStats: {
          readonly reactions: number;
          readonly replies: number;
          readonly shares: number;
        };
        readonly excerpt: string;
        readonly id: string;
        readonly name: string | null | undefined;
        readonly published: string;
        readonly reactionGroups: ReadonlyArray<{
          readonly emoji?: string;
          readonly reactors?: {
            readonly totalCount: number;
          };
        }>;
        readonly replyTarget: {
          readonly id: string;
          readonly replyTarget: {
            readonly id: string;
            readonly replyTarget: {
              readonly id: string;
              readonly replyTarget: {
                readonly id: string;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
        readonly sharedPost: {
          readonly __typename: string;
          readonly actor: {
            readonly avatarUrl: string;
            readonly handle: string;
            readonly rawName: string | null | undefined;
            readonly username: string;
          };
          readonly engagementStats: {
            readonly reactions: number;
            readonly replies: number;
            readonly shares: number;
          };
          readonly excerpt: string;
          readonly id: string;
          readonly name: string | null | undefined;
          readonly published: string;
          readonly reactionGroups: ReadonlyArray<{
            readonly emoji?: string;
            readonly reactors?: {
              readonly totalCount: number;
            };
          }>;
          readonly replyTarget: {
            readonly id: string;
            readonly replyTarget: {
              readonly id: string;
              readonly replyTarget: {
                readonly id: string;
                readonly replyTarget: {
                  readonly id: string;
                } | null | undefined;
              } | null | undefined;
            } | null | undefined;
          } | null | undefined;
        } | null | undefined;
      };
      readonly sharersCount: number;
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  };
};
export type homeFeedQuery = {
  response: homeFeedQuery$data;
  variables: homeFeedQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isPersonal"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isPublic"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "local"
},
v5 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v6 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v7 = [
  (v5/*: any*/),
  (v6/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sharersCount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "handle",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rawName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "excerpt",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "published",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "replyTarget",
  "plural": false,
  "selections": [
    (v14/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "replyTarget",
      "plural": false,
      "selections": [
        (v14/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "replyTarget",
          "plural": false,
          "selections": [
            (v14/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "replyTarget",
              "plural": false,
              "selections": [
                (v14/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "emoji",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ReactionGroupReactorsConnection",
      "kind": "LinkedField",
      "name": "reactors",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "EmojiReactionGroup",
  "abstractKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "reactionGroups",
  "plural": true,
  "selections": [
    (v19/*: any*/)
  ],
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "Actor",
  "kind": "LinkedField",
  "name": "actor",
  "plural": false,
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v21/*: any*/)
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "PostEngagementStats",
  "kind": "LinkedField",
  "name": "engagementStats",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "reactions",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "replies",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "shares",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v24 = [
  (v8/*: any*/),
  (v9/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Actor",
    "kind": "LinkedField",
    "name": "lastSharer",
    "plural": false,
    "selections": [
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v18/*: any*/),
      (v20/*: any*/),
      (v22/*: any*/),
      (v23/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "sharedPost",
        "plural": false,
        "selections": [
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v20/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v26 = [
  (v5/*: any*/),
  (v6/*: any*/),
  {
    "kind": "Variable",
    "name": "local",
    "variableName": "local"
  }
],
v27 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "replyTarget",
  "plural": false,
  "selections": [
    (v13/*: any*/),
    (v14/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "replyTarget",
      "plural": false,
      "selections": [
        (v13/*: any*/),
        (v14/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "replyTarget",
          "plural": false,
          "selections": [
            (v13/*: any*/),
            (v14/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "replyTarget",
              "plural": false,
              "selections": [
                (v13/*: any*/),
                (v14/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "reactionGroups",
  "plural": true,
  "selections": [
    (v13/*: any*/),
    (v19/*: any*/)
  ],
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "Actor",
  "kind": "LinkedField",
  "name": "actor",
  "plural": false,
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v21/*: any*/),
    (v14/*: any*/)
  ],
  "storageKey": null
},
v30 = [
  (v8/*: any*/),
  (v9/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Actor",
    "kind": "LinkedField",
    "name": "lastSharer",
    "plural": false,
    "selections": [
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v14/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v27/*: any*/),
      (v28/*: any*/),
      (v29/*: any*/),
      (v23/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "sharedPost",
        "plural": false,
        "selections": [
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v23/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "homeFeedQuery",
    "selections": [
      {
        "condition": "isPersonal",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "QueryPersonalTimelineConnection",
            "kind": "LinkedField",
            "name": "personalTimeline",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "QueryPersonalTimelineConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              (v25/*: any*/)
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isPublic",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v26/*: any*/),
            "concreteType": "QueryPublicTimelineConnection",
            "kind": "LinkedField",
            "name": "publicTimeline",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "QueryPublicTimelineConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              (v25/*: any*/)
            ],
            "storageKey": null
          }
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "homeFeedQuery",
    "selections": [
      {
        "condition": "isPersonal",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "QueryPersonalTimelineConnection",
            "kind": "LinkedField",
            "name": "personalTimeline",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "QueryPersonalTimelineConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": (v30/*: any*/),
                "storageKey": null
              },
              (v25/*: any*/)
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isPublic",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v26/*: any*/),
            "concreteType": "QueryPublicTimelineConnection",
            "kind": "LinkedField",
            "name": "publicTimeline",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "QueryPublicTimelineConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": (v30/*: any*/),
                "storageKey": null
              },
              (v25/*: any*/)
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ac449281881dbd391aa7e39a251906ea",
    "id": null,
    "metadata": {},
    "name": "homeFeedQuery",
    "operationKind": "query",
    "text": "query homeFeedQuery(\n  $first: Int!\n  $after: String\n  $isPersonal: Boolean!\n  $isPublic: Boolean!\n  $local: Boolean!\n) {\n  personalTimeline(first: $first, after: $after) @include(if: $isPersonal) {\n    edges {\n      cursor\n      sharersCount\n      lastSharer {\n        handle\n        rawName\n        username\n        id\n      }\n      node {\n        __typename\n        id\n        name\n        excerpt\n        published\n        replyTarget {\n          __typename\n          id\n          replyTarget {\n            __typename\n            id\n            replyTarget {\n              __typename\n              id\n              replyTarget {\n                __typename\n                id\n              }\n            }\n          }\n        }\n        reactionGroups {\n          __typename\n          ... on EmojiReactionGroup {\n            emoji\n            reactors {\n              totalCount\n            }\n          }\n        }\n        actor {\n          handle\n          rawName\n          username\n          avatarUrl\n          id\n        }\n        engagementStats {\n          reactions\n          replies\n          shares\n        }\n        sharedPost {\n          __typename\n          id\n          name\n          excerpt\n          published\n          replyTarget {\n            __typename\n            id\n            replyTarget {\n              __typename\n              id\n              replyTarget {\n                __typename\n                id\n                replyTarget {\n                  __typename\n                  id\n                }\n              }\n            }\n          }\n          reactionGroups {\n            __typename\n            ... on EmojiReactionGroup {\n              emoji\n              reactors {\n                totalCount\n              }\n            }\n          }\n          actor {\n            handle\n            rawName\n            username\n            avatarUrl\n            id\n          }\n          engagementStats {\n            reactions\n            replies\n            shares\n          }\n        }\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  publicTimeline(first: $first, after: $after, local: $local) @include(if: $isPublic) {\n    edges {\n      cursor\n      sharersCount\n      lastSharer {\n        handle\n        rawName\n        username\n        id\n      }\n      node {\n        __typename\n        id\n        name\n        excerpt\n        published\n        replyTarget {\n          __typename\n          id\n          replyTarget {\n            __typename\n            id\n            replyTarget {\n              __typename\n              id\n              replyTarget {\n                __typename\n                id\n              }\n            }\n          }\n        }\n        reactionGroups {\n          __typename\n          ... on EmojiReactionGroup {\n            emoji\n            reactors {\n              totalCount\n            }\n          }\n        }\n        actor {\n          handle\n          rawName\n          username\n          avatarUrl\n          id\n        }\n        engagementStats {\n          reactions\n          replies\n          shares\n        }\n        sharedPost {\n          __typename\n          id\n          name\n          excerpt\n          published\n          replyTarget {\n            __typename\n            id\n            replyTarget {\n              __typename\n              id\n              replyTarget {\n                __typename\n                id\n                replyTarget {\n                  __typename\n                  id\n                }\n              }\n            }\n          }\n          reactionGroups {\n            __typename\n            ... on EmojiReactionGroup {\n              emoji\n              reactors {\n                totalCount\n              }\n            }\n          }\n          actor {\n            handle\n            rawName\n            username\n            avatarUrl\n            id\n          }\n          engagementStats {\n            reactions\n            replies\n            shares\n          }\n        }\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2000e5551cc6a04463e23c810dc8e8fd";

export default node;
