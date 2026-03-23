/**
 * @generated SignedSource<<54acabb9bcae5056ad085fe88e71de9e>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: ./node_modules/.bin/relay-compiler
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsRevokeSessionMutation$variables = {
  sessionId: `${string}-${string}-${string}-${string}-${string}`;
};
export type operationsRevokeSessionMutation$data = {
  readonly revokeSession: {
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
  } | null | undefined;
};
export type operationsRevokeSessionMutation = {
  response: operationsRevokeSessionMutation$data;
  variables: operationsRevokeSessionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sessionId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "sessionId",
        "variableName": "sessionId"
      }
    ],
    "concreteType": "Session",
    "kind": "LinkedField",
    "name": "revokeSession",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsRevokeSessionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsRevokeSessionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a1b85ee49d8845ab4b88d4e8bc363774",
    "id": null,
    "metadata": {},
    "name": "operationsRevokeSessionMutation",
    "operationKind": "mutation",
    "text": "mutation operationsRevokeSessionMutation(\n  $sessionId: UUID!\n) {\n  revokeSession(sessionId: $sessionId) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "efb995fd6dc02c74f5f421f895990e49";

export default node;
