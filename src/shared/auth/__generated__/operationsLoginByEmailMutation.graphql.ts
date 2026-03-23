/**
 * @generated SignedSource<<8883184d969a574d1abd25705cc7b5ad>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: ./node_modules/.bin/relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsLoginByEmailMutation$variables = {
  email: string;
  locale: string;
  verifyUrl: string;
};
export type operationsLoginByEmailMutation$data = {
  readonly loginByEmail: {
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
export type operationsLoginByEmailMutation = {
  response: operationsLoginByEmailMutation$data;
  variables: operationsLoginByEmailMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "locale"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "verifyUrl"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "locale",
        "variableName": "locale"
      },
      {
        "kind": "Variable",
        "name": "verifyUrl",
        "variableName": "verifyUrl"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "loginByEmail",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsLoginByEmailMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "operationsLoginByEmailMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "fcff589a1d9d184833398f1ea38328a3",
    "id": null,
    "metadata": {},
    "name": "operationsLoginByEmailMutation",
    "operationKind": "mutation",
    "text": "mutation operationsLoginByEmailMutation(\n  $locale: Locale!\n  $email: String!\n  $verifyUrl: URITemplate!\n) {\n  loginByEmail(locale: $locale, email: $email, verifyUrl: $verifyUrl) {\n    __typename\n    ... on LoginChallenge {\n      token\n    }\n    ... on AccountNotFoundError {\n      query\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "79acaa8c050d6877f80193e6b3484b2b";

export default node;
