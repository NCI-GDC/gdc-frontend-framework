import {
  convertFilterToGqlFilter,
  convertGqlFilterToFilter,
  GqlOperation,
  Operation,
} from "./filters";

type Scenario = {
  readonly name: string;
  readonly op: Operation;
  readonly gqlOp: GqlOperation;
};

const equals: Scenario = {
  name: "equals",
  op: {
    operator: "=",
    field: "asdf",
    operand: "jkl;",
  },
  gqlOp: {
    op: "=",
    content: {
      field: "asdf",
      value: "jkl;",
    },
  },
};

const notEquals: Scenario = {
  name: "not equals",
  op: {
    operator: "!=",
    field: "asdf",
    operand: "jkl;",
  },
  gqlOp: {
    op: "!=",
    content: {
      field: "asdf",
      value: "jkl;",
    },
  },
};

const lessThan: Scenario = {
  name: "less than",
  op: {
    operator: "<",
    field: "asdf",
    operand: 3,
  },
  gqlOp: {
    op: "<",
    content: {
      field: "asdf",
      value: 3,
    },
  },
};

const lessThanOrEquals: Scenario = {
  name: "less than or equals",
  op: {
    operator: "<=",
    field: "asdf",
    operand: 3,
  },
  gqlOp: {
    op: "<=",
    content: {
      field: "asdf",
      value: 3,
    },
  },
};

const greaterThan: Scenario = {
  name: "greater than",
  op: {
    operator: ">",
    field: "asdf",
    operand: 6,
  },
  gqlOp: {
    op: ">",
    content: {
      field: "asdf",
      value: 6,
    },
  },
};

const greaterThanOrEquals: Scenario = {
  name: "greater than or equals",
  op: {
    operator: ">=",
    field: "asdf",
    operand: 7,
  },
  gqlOp: {
    op: ">=",
    content: {
      field: "asdf",
      value: 7,
    },
  },
};

const missing: Scenario = {
  name: "missing",
  op: {
    operator: "missing",
    field: "asdf",
  },
  gqlOp: {
    op: "is",
    content: {
      field: "asdf",
      value: "MISSING",
    },
  },
};

const exists: Scenario = {
  name: "exists",
  op: {
    operator: "exists",
    field: "asdf",
  },
  gqlOp: {
    op: "not",
    content: {
      field: "asdf",
    },
  },
};

const includes: Scenario = {
  name: "includes",
  op: {
    operator: "includes",
    field: "asdf",
    operands: ["a", "b"],
  },
  gqlOp: {
    op: "in",
    content: {
      field: "asdf",
      value: ["a", "b"],
    },
  },
};

const excludes: Scenario = {
  name: "excludes",
  op: {
    operator: "excludes",
    field: "asdf",
    operands: ["a", "b"],
  },
  gqlOp: {
    op: "exclude",
    content: {
      field: "asdf",
      value: ["a", "b"],
    },
  },
};

const excludeifany: Scenario = {
  name: "excludeifany",
  op: {
    operator: "excludeifany",
    field: "asdf",
    operands: ["a", "b"],
  },
  gqlOp: {
    op: "excludeifany",
    content: {
      field: "asdf",
      value: ["a", "b"],
    },
  },
};

const intersection: Scenario = {
  name: "intersection",
  op: {
    operator: "and",
    operands: [
      {
        operator: "=",
        field: "temperature",
        operand: 88,
      },
      {
        operator: ">",
        field: "age",
        operand: 65,
      },
    ],
  },
  gqlOp: {
    op: "and",
    content: [
      {
        op: "=",
        content: {
          field: "temperature",
          value: 88,
        },
      },
      {
        op: ">",
        content: {
          field: "age",
          value: 65,
        },
      },
    ],
  },
};

const union: Scenario = {
  name: "union",
  op: {
    operator: "or",
    operands: [
      {
        operator: "=",
        field: "temperature",
        operand: 88,
      },
      {
        operator: ">",
        field: "age",
        operand: 65,
      },
    ],
  },
  gqlOp: {
    op: "or",
    content: [
      {
        op: "=",
        content: {
          field: "temperature",
          value: 88,
        },
      },
      {
        op: ">",
        content: {
          field: "age",
          value: 65,
        },
      },
    ],
  },
};

const scenarios: ReadonlyArray<Scenario> = [
  equals,
  notEquals,
  lessThan,
  lessThanOrEquals,
  greaterThan,
  greaterThanOrEquals,
  missing,
  exists,
  includes,
  excludes,
  excludeifany,
  intersection,
  union,
];

describe("Convert between portal filters and gql filters", () => {
  scenarios.forEach((params) => {
    test(`portal -> gql: ${params.name}`, () => {
      expect(convertFilterToGqlFilter(params.op)).toEqual(params.gqlOp);
    });

    test(`gql -> portal: ${params.name}`, () => {
      expect(convertGqlFilterToFilter(params.gqlOp)).toEqual(params.op);
    });
  });
});
