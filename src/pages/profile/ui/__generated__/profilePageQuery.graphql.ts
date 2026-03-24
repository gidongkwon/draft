/**
 * @generated SignedSource<<ad2395ef8170535425b7b0a927b02c74>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: vp exec relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type profilePageQuery$variables = {
  first: number;
  handle: string;
};
export type profilePageQuery$data = {
  readonly actorByHandle: {
    readonly avatarUrl: string;
    readonly bio: string | null | undefined;
    readonly handle: string;
    readonly posts: {
      readonly edges: ReadonlyArray<{
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
        };
      }>;
    };
    readonly published: string | null | undefined;
    readonly rawName: string | null | undefined;
    readonly username: string;
  } | null | undefined;
};
export type profilePageQuery = {
  response: profilePageQuery$data;
  variables: profilePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "handle"
},
v2 = [
  {
    "kind": "Literal",
    "name": "allowLocalHandle",
    "value": true
  },
  {
    "kind": "Variable",
    "name": "handle",
    "variableName": "handle"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "handle",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rawName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bio",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "published",
  "storageKey": null
},
v9 = [
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "excerpt",
  "storageKey": null
},
v14 = {
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
v15 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "profilePageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Actor",
        "kind": "LinkedField",
        "name": "actorByHandle",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "ActorPostsConnection",
            "kind": "LinkedField",
            "name": "posts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ActorPostsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "reactionGroups",
                        "plural": true,
                        "selections": [
                          (v14/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Actor",
                        "kind": "LinkedField",
                        "name": "actor",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/)
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
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "profilePageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Actor",
        "kind": "LinkedField",
        "name": "actorByHandle",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "ActorPostsConnection",
            "kind": "LinkedField",
            "name": "posts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ActorPostsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "reactionGroups",
                        "plural": true,
                        "selections": [
                          (v10/*: any*/),
                          (v14/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Actor",
                        "kind": "LinkedField",
                        "name": "actor",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "29343409fbb2fce2cc0b597d948d8184",
    "id": null,
    "metadata": {},
    "name": "profilePageQuery",
    "operationKind": "query",
    "text": "query profilePageQuery(\n  $handle: String!\n  $first: Int!\n) {\n  actorByHandle(handle: $handle, allowLocalHandle: true) {\n    handle\n    rawName\n    username\n    avatarUrl\n    bio\n    published\n    posts(first: $first) {\n      edges {\n        node {\n          __typename\n          id\n          name\n          excerpt\n          published\n          reactionGroups {\n            __typename\n            ... on EmojiReactionGroup {\n              emoji\n              reactors {\n                totalCount\n              }\n            }\n          }\n          actor {\n            handle\n            rawName\n            username\n            avatarUrl\n            id\n          }\n          engagementStats {\n            reactions\n            replies\n            shares\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e4c6a0329c1915d6828cc325507f8301";

export default node;
