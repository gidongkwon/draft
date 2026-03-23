/**
 * @generated SignedSource<<fad43270ada514113971e167fba3dd4b>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: ./node_modules/.bin/relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsCompleteLoginChallengeMutation$variables = {
  code: string;
  token: `${string}-${string}-${string}-${string}-${string}`;
};
export type operationsCompleteLoginChallengeMutation$data = {
  readonly completeLoginChallenge: {
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
  } | null | undefined;
};
export type operationsCompleteLoginChallengeMutation = {
  response: operationsCompleteLoginChallengeMutation$data;
  variables: operationsCompleteLoginChallengeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "code"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "token"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "code",
        "variableName": "code"
      },
      {
        "kind": "Variable",
        "name": "token",
        "variableName": "token"
      }
    ],
    "concreteType": "Session",
    "kind": "LinkedField",
    "name": "completeLoginChallenge",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsCompleteLoginChallengeMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "operationsCompleteLoginChallengeMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "49d9647ef4caf287df90568078ee0145",
    "id": null,
    "metadata": {},
    "name": "operationsCompleteLoginChallengeMutation",
    "operationKind": "mutation",
    "text": "mutation operationsCompleteLoginChallengeMutation(\n  $token: UUID!\n  $code: String!\n) {\n  completeLoginChallenge(token: $token, code: $code) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "611f0ff9e898ce553b584c7052271866";

export default node;
