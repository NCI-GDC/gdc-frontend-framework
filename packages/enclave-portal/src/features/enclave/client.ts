/*****************************************
 * Portal representation of cohort filters
 *****************************************/
interface IncludesOperation {
  readonly operator: "includes";
  readonly field: string;
  readonly operands: ReadonlyArray<string>;
}

interface GreaterThanOrEqualsOperation {
  readonly operator: ">=";
  readonly field: string;
  readonly operand: number;
}

interface LessThanOrEqualsOperation {
  readonly operator: "<=";
  readonly field: string;
  readonly operand: number;
}

type PortalOperation =
  | IncludesOperation
  | GreaterThanOrEqualsOperation
  | LessThanOrEqualsOperation;

interface GenderOperation {
  ["gender"]: IncludesOperation;
}

interface RaceOperation {
  ["race"]: IncludesOperation;
}

interface VitalStatusOperation {
  ["vital_status"]: IncludesOperation;
}

interface EthnicityOperation {
  ["ethnicity"]: IncludesOperation;
}

interface PrimaryDiagnosisOperation {
  ["primary_diagnosis"]: IncludesOperation;
}

interface TissueOrOrganOfOriginOperation {
  ["tissue_or_organ_of_origin"]: IncludesOperation;
}
interface AgeAtDiagnosisMaxOperation {
  ["age_at_diagnosis_max"]: LessThanOrEqualsOperation;
}

interface AgeAtDiagnosisMinOperation {
  ["age_at_diagnosis_min"]: GreaterThanOrEqualsOperation;
}

type PortalFilters = GenderOperation &
  RaceOperation &
  VitalStatusOperation &
  EthnicityOperation &
  PrimaryDiagnosisOperation &
  TissueOrOrganOfOriginOperation &
  AgeAtDiagnosisMaxOperation &
  AgeAtDiagnosisMinOperation;

/**************************************
 * GDC representation of cohort filters
 **************************************/
interface GdcAndOperation {
  readonly op: "and";
  readonly content: ReadonlyArray<GdcOperation>;
}

interface GdcIncludesOperation {
  readonly op: "in";
  readonly content: {
    readonly field: string;
    readonly value: ReadonlyArray<string>;
  };
}

interface GdcGreaterThanOrEqualsOperation {
  readonly op: ">=";
  readonly content: {
    readonly field: string;
    readonly value: number;
  };
}

interface GdcLessThanOrEqualsOperation {
  readonly op: "<=";
  readonly content: {
    readonly field: string;
    readonly value: number;
  };
}

type GdcOperation =
  | GdcAndOperation
  | GdcIncludesOperation
  | GdcGreaterThanOrEqualsOperation
  | GdcLessThanOrEqualsOperation;

interface GdcEmptyFilter {}

type GdcFilter = GdcOperation | GdcEmptyFilter;

const assertUnreachable = (x: never): never => {
  throw new Error(x);
};

export const buildGdcOperationFromPortalOperation = (
  portalOperation: PortalOperation,
): GdcOperation | undefined => {
  const operator = portalOperation.operator;
  switch (operator) {
    case "includes":
      if (portalOperation.operands.length > 0) {
        return {
          op: "in",
          content: {
            field: enclavePropertyToGdcProperty(portalOperation.field),
            value: portalOperation.operands,
          },
        };
      }
      return undefined;
    case "<=":
    case ">=":
      return {
        op: portalOperation.operator,
        content: {
          field: enclavePropertyToGdcProperty(portalOperation.field),
          value: portalOperation.operand,
        },
      };
    default:
      return assertUnreachable(operator);
  }
};

export const buildGdcFiltersFromPortalFilters = (
  filters: Partial<PortalFilters>,
): GdcFilter => {
  // limiting gdc results to tcga
  const tcgaOperation: GdcIncludesOperation = {
    op: "in",
    content: {
      field: "project.program.name",
      value: ["TCGA"],
    },
  };

  const stringProperties: ReadonlyArray<keyof PortalFilters> = [
    "gender",
    "race",
    "vital_status",
    "ethnicity",
    "primary_diagnosis",
    "tissue_or_organ_of_origin",
    "age_at_diagnosis_max",
    "age_at_diagnosis_min",
  ];
  const operations = stringProperties.reduce<ReadonlyArray<GdcOperation>>(
    (acc, name) => {
      if (filters?.[name]) {
        const portalOperation = filters[name];
        const gdcOperation =
          buildGdcOperationFromPortalOperation(portalOperation);
        if (gdcOperation !== undefined) {
          return [...acc, gdcOperation];
        }
      }
      return acc;
    },
    [tcgaOperation],
  );

  return {
    op: "and",
    content: operations,
  };
};

const enclavePropertyToGdcProperty = (prop: string): string => {
  const enclaveToGdc: Record<string, string> = {
    gender: "demographic.gender",
    race: "demographic.race",
    vital_status: "demographic.vital_status",
    ethnicity: "demographic.ethnicity",
    primary_diagnosis: "diagnoses.primary_diagnosis",
    tissue_or_organ_of_origin: "diagnoses.tissue_or_organ_of_origin",
    age_at_diagnosis_min: "diagnoses.age_at_diagnosis",
    age_at_diagnosis_max: "diagnoses.age_at_diagnosis",
  };

  return enclaveToGdc[prop];
};

/*********************
 * Fake Enclave Client
 *********************/
export interface EnclaveFilters {
  gender: ReadonlyArray<string>;
  race: ReadonlyArray<string>;
  vital_status: ReadonlyArray<string>;
  ethnicity: ReadonlyArray<string>;
  primary_diagnosis: ReadonlyArray<string>;
  tissue_or_organ_of_origin: ReadonlyArray<string>;
  age_at_diagnosis_min: number;
  age_at_diagnosis_max: number;
}

const buildEnclaveFiltersFromPortalFilters = (
  filters: Partial<PortalFilters>,
): Partial<EnclaveFilters> => {
  const properties: (keyof PortalFilters)[] = [
    "gender",
    "race",
    "vital_status",
    "ethnicity",
    "primary_diagnosis",
    "tissue_or_organ_of_origin",
    "age_at_diagnosis_max",
    "age_at_diagnosis_min",
  ];

  return properties.reduce((acc, property) => {
    const operation = filters[property];
    if (operation !== undefined) {
      const value =
        operation.operator === "includes"
          ? operation.operands
          : operation.operand;
      return {
        ...acc,
        [property]: value,
      };
    }
    return acc;
  }, {});
};

/**
 * /api/v1/filters
 * @returns
 */
export const fetchFilterNames = async () => {
  return {
    filters: [
      "gender",
      "race",
      "vital_status",
      "ethnicity",
      "primary_diagnosis",
      "tissue_or_organ_of_origin",
      "age_at_diagnosis_min",
      "age_at_diagnosis_max",
    ],
    help: "Provide a query parameter value 'filter' to return the allowed values and desciption of a specific filter. For example, /api/v1/filters?filter=gender will provide information about the gender filter.",
  };
};

export interface FilterTopValuesResponse {
  readonly filter: string;
  readonly top_n_values: ReadonlyArray<string>;
}

/**
 *   /api/v1/filters/<filter>:
 * Note: The description of this endpoint and the example response do not match
 */
export const fetchFilterTopValues = async (
  filter: string,
  quantity: number,
  filters: Partial<PortalFilters>,
): Promise<FilterTopValuesResponse> => {
  const gdc_property = enclavePropertyToGdcProperty(filter);
  if (gdc_property === undefined) throw Error(`Unknown filter: ${filter}`);

  const payload = {
    facets: gdc_property,
    size: 0,
    case_filters: buildGdcFiltersFromPortalFilters(filters),
  };
  const res = await fetch("https://api.gdc.cancer.gov/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  const buckets: ReadonlyArray<{ doc_count: number; key: string }> =
    body?.data?.aggregations?.[gdc_property]?.buckets;
  if (!(buckets?.length > 0)) {
    return {
      filter: filter,
      top_n_values: [],
    };
  }

  return {
    filter: filter,
    top_n_values: buckets.map((b) => b.key).slice(0, quantity),
  };
};

const gdcFetchCohortSize = async (
  portalFilters: Partial<PortalFilters>,
): Promise<number> => {
  const payload = {
    size: 0,
    case_filters: buildGdcFiltersFromPortalFilters(portalFilters),
  };
  const res = await fetch("https://api.gdc.cancer.gov/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  return body?.data?.pagination?.total;
};

export interface CohortSizeResponse {
  readonly aggregation: "Count of the clinical filters";
  readonly count: number;
  readonly data: ReadonlyArray<any>;
  readonly filters: Partial<EnclaveFilters>;
  readonly warning: string;
}

/**
 *   /api/v1/aggregations/cohort:
 */
export const fetchCohortSize = async (
  portalFilters: Partial<PortalFilters>,
): Promise<CohortSizeResponse> => {
  const cohortSize = await gdcFetchCohortSize(portalFilters);

  return {
    aggregation: "Count of the clinical filters",
    count: cohortSize,
    data: [
      {
        columns: [
          {
            isCaseSensitive: false,
            isCurrency: false,
            isSigned: true,
            label: "pt_count",
            length: 0,
            name: "pt_count",
            nullable: 1,
            precision: 19,
            scale: 0,
            schemaName: "",
            tableName: "",
            typeName: "int8",
          },
        ],
        data: [
          [
            {
              longValue: cohortSize,
            },
          ],
        ],
      },
    ],
    filters: buildEnclaveFiltersFromPortalFilters(portalFilters),
    warning:
      "\nThis warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes (1) this computer network, (2) all computers connected to this network, and (3) all devices and storage media attached to this network or to a computer on this network.\nThis system is provided for Government-authorized use only.\nUnauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.\nPersonal use of social media and networking sites on this system is limited as to not interfere with official work duties and is subject to monitoring.\nBy using this system, you understand and consent to the following:\nThe Government may monitor, record, and audit your system usage, including usage of personal devices and email systems for official duties or to conduct HHS business. Therefore, you have no reasonable expectation of privacy regarding any communication or data transiting or stored on this system. At any time, and for any lawful Government purpose, the government may monitor, intercept, and search and seize any communication or data transiting or stored on this system.\nAny communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.\n",
  };
};

export interface RedshiftStringValue {
  stringValue: string;
}

export interface RedshiftLongValue {
  longValue: number;
}

export type RedshiftValue = RedshiftStringValue | RedshiftLongValue;
export interface AggregationsTopResponse {
  readonly aggregation: "Redshift Top N";
  readonly count: number;
  readonly data: ReadonlyArray<{
    readonly columns: ReadonlyArray<any>;
    readonly data: ReadonlyArray<RedshiftValue>;
    readonly mutation_frequency: Record<string, number>;
  }>;
  readonly filters: object;
  readonly warning: string;
}

/**
 *   /api/v1/aggregations/top
 *
 * WARNING: This does not return the correct numbers. It should
 * be ok for fake data.
 */
export const fetchAggregationsTop = async (
  portalFilters: Partial<PortalFilters>,
  quantity: number,
): Promise<AggregationsTopResponse> => {
  const payload = {
    case_filters: buildGdcFiltersFromPortalFilters(portalFilters),
  };
  const res = await fetch(
    "https://api.gdc.cancer.gov/analysis/top_mutated_genes_by_project",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  const body = await res.json();
  const top_genes = body?.data?.hits?.map(
    (hit: { symbol: string; gene_id: string; _score: number }) => {
      const { symbol, gene_id, _score } = hit;
      return {
        symbol,
        gene_id,
        num_cases: _score,
      };
    },
  );

  const top_genes_data = top_genes.map(
    (top_gene: { symbol: string; gene_id: string; num_cases: number }) => {
      const { symbol, num_cases } = top_gene;
      return [
        {
          stringValue: symbol,
        },
        {
          longValue: Math.round(num_cases),
        },
      ];
    },
  );

  const total_num_cases = await gdcFetchCohortSize(portalFilters);

  const mutation_frequency = top_genes.reduce(
    (
      acc: Record<string, number>,
      top_gene: { symbol: string; gene_id: string; num_cases: number },
    ) => {
      const { symbol, num_cases } = top_gene;
      return {
        ...acc,
        [symbol]: num_cases / total_num_cases,
      };
    },
    {},
  );
  return {
    aggregation: "Redshift Top N",
    count: total_num_cases,
    data: [
      {
        columns: [
          {
            isCaseSensitive: true,
            isCurrency: false,
            isSigned: false,
            label: "hugo",
            length: 0,
            name: "hugo",
            nullable: 1,
            precision: 200,
            scale: 0,
            schemaName: "nci_db",
            tableName: "maf_cur",
            typeName: "varchar",
          },
          {
            isCaseSensitive: false,
            isCurrency: false,
            isSigned: true,
            label: "count",
            length: 0,
            name: "count",
            nullable: 1,
            precision: 19,
            scale: 0,
            schemaName: "",
            tableName: "",
            typeName: "int8",
          },
        ],
        data: top_genes_data,
        mutation_frequency,
      },
    ],
    filters: {
      n: quantity,
    },
    warning:
      "\nThis warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes (1) this computer network, (2) all computers connected to this network, and (3) all devices and storage media attached to this network or to a computer on this network.\nThis system is provided for Government-authorized use only.\nUnauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.\nPersonal use of social media and networking sites on this system is limited as to not interfere with official work duties and is subject to monitoring.\nBy using this system, you understand and consent to the following:\nThe Government may monitor, record, and audit your system usage, including usage of personal devices and email systems for official duties or to conduct HHS business. Therefore, you have no reasonable expectation of privacy regarding any communication or data transiting or stored on this system. At any time, and for any lawful Government purpose, the government may monitor, intercept, and search and seize any communication or data transiting or stored on this system.\nAny communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.\n",
  };
};

/**
 *   /api/v1/aggregations/mutation_frequency
 */

/**
 *   /api/v1/aggregations/top-mutated-alleles
 */

/**
 * /api/v1/aggregations/xor
 */

/**
 *   /api/v1/aggregations/mutation-landscape:
 */

/**
 *   /api/v1/aggregations:
 */
