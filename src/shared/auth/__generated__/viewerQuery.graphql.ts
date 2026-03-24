/**
 * @generated SignedSource<<b2ef62d6f119d1a9d779c3da91fb4979>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: vp exec relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type viewerQuery$variables = Record<PropertyKey, never>;
export type viewerQuery$data = {
  readonly viewer: {
    readonly avatarUrl: string;
    readonly id: string;
    readonly name: string;
    readonly username: string;
  } | null | undefined;
};
export type viewerQuery = {
  response: viewerQuery$data;
  variables: viewerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Account",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "username",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "avatarUrl",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "viewerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "viewerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "0abe57b46adde49c8ea16790b441e7b3",
    "id": null,
    "metadata": {},
    "name": "viewerQuery",
    "operationKind": "query",
    "text": "query viewerQuery {\n  viewer {\n    id\n    name\n    username\n    avatarUrl\n  }\n}\n"
  }
};
})();

(node as any).hash = "5083e815cbff0308d82284e6b10bdde8";

export default node;
