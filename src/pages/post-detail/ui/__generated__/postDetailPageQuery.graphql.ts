/**
 * @generated SignedSource<<c9c6551f10aa316bb704f6a9f8975f10>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: vp exec relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type postDetailPageQuery$variables = {
  id: string;
};
export type postDetailPageQuery$data = {
  readonly node: {
    readonly __typename: string;
    readonly actor?: {
      readonly avatarUrl: string;
      readonly bio: string | null | undefined;
      readonly handle: string;
      readonly rawName: string | null | undefined;
      readonly username: string;
    };
    readonly content?: string;
    readonly engagementStats?: {
      readonly quotes: number;
      readonly reactions: number;
      readonly replies: number;
      readonly shares: number;
    };
    readonly id?: string;
    readonly name?: string | null | undefined;
    readonly published?: string;
    readonly reactionGroups?: ReadonlyArray<{
      readonly emoji?: string;
      readonly reactors?: {
        readonly totalCount: number;
      };
    }>;
    readonly summary?: string | null | undefined;
    readonly url?: string | null | undefined;
  } | null | undefined;
};
export type postDetailPageQuery = {
  response: postDetailPageQuery$data;
  variables: postDetailPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "published",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v9 = {
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
  "name": "avatarUrl",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bio",
  "storageKey": null
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "quotes",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "postDetailPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "reactionGroups",
                "plural": true,
                "selections": [
                  (v9/*: any*/)
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
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "type": "Post",
            "abstractKey": "__isPost"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "postDetailPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "reactionGroups",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v9/*: any*/)
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
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "type": "Post",
            "abstractKey": "__isPost"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b236bcdcbb91d92b60fe974762d98e3a",
    "id": null,
    "metadata": {},
    "name": "postDetailPageQuery",
    "operationKind": "query",
    "text": "query postDetailPageQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Post {\n      __isPost: __typename\n      id\n      name\n      summary\n      content\n      published\n      url\n      reactionGroups {\n        __typename\n        ... on EmojiReactionGroup {\n          emoji\n          reactors {\n            totalCount\n          }\n        }\n      }\n      actor {\n        handle\n        rawName\n        username\n        avatarUrl\n        bio\n        id\n      }\n      engagementStats {\n        reactions\n        replies\n        shares\n        quotes\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "25c67b4daa94d17346795de92561591b";

export default node;
