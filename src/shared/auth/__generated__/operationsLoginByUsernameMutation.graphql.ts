/**
 * @generated SignedSource<<6e7bd07897c0447c4b4dfcfafa18b664>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: ./node_modules/.bin/relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsLoginByUsernameMutation$variables = {
  locale: string;
  username: string;
  verifyUrl: string;
};
export type operationsLoginByUsernameMutation$data = {
  readonly loginByUsername: {
    readonly __typename: "AccountNotFoundError";
    readonly query: string;
  } | {
    readonly __typename: "LoginChallenge";
    readonly token: `${string}-${string}-${string}-${string}-${string}`;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type operationsLoginByUsernameMutation = {
  response: operationsLoginByUsernameMutation$data;
  variables: operationsLoginByUsernameMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locale"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "username"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "verifyUrl"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "locale",
        "variableName": "locale"
      },
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "username"
      },
      {
        "kind": "Variable",
        "name": "verifyUrl",
        "variableName": "verifyUrl"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "loginByUsername",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "token",
            "storageKey": null
          }
        ],
        "type": "LoginChallenge",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "query",
            "storageKey": null
          }
        ],
        "type": "AccountNotFoundError",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsLoginByUsernameMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsLoginByUsernameMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "15dec3bfcb13561e8fb35e1393e0f108",
    "id": null,
    "metadata": {},
    "name": "operationsLoginByUsernameMutation",
    "operationKind": "mutation",
    "text": "mutation operationsLoginByUsernameMutation(\n  $locale: Locale!\n  $username: String!\n  $verifyUrl: URITemplate!\n) {\n  loginByUsername(locale: $locale, username: $username, verifyUrl: $verifyUrl) {\n    __typename\n    ... on LoginChallenge {\n      token\n    }\n    ... on AccountNotFoundError {\n      query\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e15712342002934b76f224ab779c9ecd";

export default node;
