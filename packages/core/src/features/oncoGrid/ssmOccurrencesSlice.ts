import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGdcEntities } from "../gdcapi/gdcapi";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAcess";
import { CoreState } from "../../store";
import { createUseCoreDataHook } from "../..";

export interface SSMOccurrencesState {
  readonly status: DataStatus;
  readonly data: any;
  readonly error?: string;
}

const initialState: SSMOccurrencesState = {
  data: [],
  status: "uninitialized",
};

export const fetchSSMOccurrences = createAsyncThunk(
  "cases/fetchCases",
  async () => {
    return fetchGdcEntities("ssm_occurrences", {
      fields: [
        "ssm.consequence.transcript.consequence_type",
        "ssm.consequence.transcript.annotation.vep_impact",
        "ssm.consequence.transcript.is_canonical",
        "ssm.consequence.transcript.gene.gene_id",
        "ssm.ssm_id,case.case_id",
      ],
      from: 0,
      size: 10000,
      filters: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.case_id",
              value: [
                "53e8e07e-18f9-4c9b-9783-a5b67ceddcf7",
                "4abbd258-0f0c-4428-901d-625d47ad363a",
                "95eefb47-3f96-4a6d-8773-4d22843f0a6a",
                "ac9ec63a-c3b6-4d0c-b1a9-7c72dbad456c",
                "1b685c46-57b3-4052-b5b9-1f704809bf04",
                "4db38349-28d2-4af5-a12f-3d861937b0e0",
                "435b57e7-5cd4-486a-b3d4-ccb1ef160d52",
                "fcd9e1c4-bddb-4856-844c-03df48fba499",
                "286c112d-7b73-40a1-b23c-99911388fdef",
                "30bc72d5-07b5-48d2-b025-bba9bcf2f09f",
                "3559f697-8fec-4f36-962c-632272fe9c9c",
                "dcfbe781-a92a-45b5-b80a-e3bb3bdc0d9a",
                "1c7b41fc-daa7-4a6e-b553-aff73e8ebac6",
                "5aeac31a-176a-4f93-a376-a93a670821bb",
                "3a3fc890-1985-4353-861b-dc3abfb364b1",
                "8feb0e8f-d09b-437d-8651-0cdecfe776bf",
                "508bf716-46f9-44dc-8e39-09261dfb073e",
                "ec2040a3-788b-4f2c-a093-c5c4b3dc4b6c",
                "4549bff6-6886-4102-a1de-02691b664c52",
                "4c2e6abf-02e1-4ef7-a0be-6a6d4069581d",
                "38a3ea92-8965-4bda-9dbd-144832975cdd",
                "43e228ae-c890-444f-afbd-49385562e33a",
                "10eb7dfa-d43d-479f-8c46-c0424207f958",
                "53707bb3-426a-43cb-830f-3eeed930295f",
                "ffef8d1d-f99d-4cc0-9f49-46488bfca131",
                "a8def1a0-a136-47f4-9ad9-60ebcf9b726b",
                "268c01b3-d2ce-44c0-a2fe-ea846a1253cc",
                "61935424-44d0-4211-81c1-c925e436eac5",
                "b669039b-722d-4088-8a59-70e82e1857d5",
                "bf632368-8ce7-4b4b-8842-d1b1801e62ef",
                "a0d35a25-3500-46f3-874f-1a0820200473",
                "b19425ab-a82f-4c2a-bf58-d1bd30511d74",
                "585a1f31-3804-43ca-81e9-4e571fe03642",
                "51de7e94-e2fa-420b-9aa2-3637d17fc6ea",
                "b045f24b-f822-4df9-9ffa-47308edcec8c",
                "cf77afe9-3785-45d4-ba2a-61c9cb706225",
                "23e1d96e-6175-4145-8267-8f0a88f54c4d",
                "296336a2-8f88-4a26-8c34-7cdf22dd8f9c",
                "f77d7256-2ccf-42a7-9b30-332ac24ca812",
                "53245616-e095-4616-89bb-6062669122da",
                "cb005c69-7301-41ce-b534-c9751f1436c5",
                "6385194a-d75b-4bd3-9e70-9aa36250d5b9",
                "e5bc45ce-8a14-40b5-b9b5-ce45609fef3a",
                "ab76544e-df6a-4b05-9317-054812474d4c",
                "2270d09e-a8be-4b7d-9520-a4bb1cd053c0",
                "ec7a9d74-8b3f-4747-8926-1739a016ab2b",
                "37bac6ba-be93-42cc-892b-efd0bdb850bd",
                "02af18ee-ab8e-4ac3-b22e-dec80c201058",
                "31ceaaeb-8186-4d4f-8981-d192368ad39a",
                "1b35d083-f7c9-47d2-9a9e-718788f9e39a",
                "7e70a318-3acc-42f3-8287-158a2199f0bc",
                "0712566e-3371-4715-95f1-5b792e72d758",
                "16bde24f-61b8-458d-aca3-df4806abbd1b",
                "f17e446a-c145-45be-8335-a856acb0b9b8",
                "dcd5860c-7e3a-44f3-a732-fe92fe3fe300",
                "de287a25-981d-49f8-81af-fe0300e4cd31",
                "48ab48a5-30e7-4f2e-8d0f-9bad7b8dc7db",
                "0cb21fb0-520f-4105-99ec-697a335115b5",
                "e457344d-76fb-46bf-b362-61a6e811d131",
                "27988b3e-cde1-4f4b-82a1-6d8ad08db8e9",
                "14db56ef-ec5e-4775-a229-5d83e58e027c",
                "84b96f93-6273-4101-a259-9602000ae491",
                "f5407aed-7150-41dd-82f0-f28975ee028a",
                "7427f9e8-1140-45fd-9613-78b72b13a7ba",
                "ca8dbbfd-8928-4e25-94c6-b875de631bbd",
                "f79b2d7a-4ad1-46ec-98f0-8ae788fec63d",
                "588abaea-ab16-42f4-9457-5901ee791b5f",
                "ff82548a-f1bb-4daa-a8f7-b3831b5843ad",
                "df5ab6cc-6f68-4b6b-95e2-954c6b57ba9c",
                "33e989b9-fac4-47d8-b429-269044ac772a",
                "f3315152-5d90-42db-80c9-6814eced11e4",
                "01c815ba-7bda-4f7e-865c-0c5776febf2c",
                "af915978-c5e1-4dd4-ab0e-d2be5ac0ae4f",
                "7dcf550c-90ce-4f63-aecd-0e46897e2a3e",
                "397b2672-d014-4b57-88dd-17e66ff8be4d",
                "db246424-3979-4f23-b316-8d30c449ee15",
                "d438c58e-f038-47a3-8e62-485a5aca9695",
                "33a9f48e-75e5-4ec5-8e4a-7c6d91a98656",
                "49f961af-1126-431d-93cd-18941c1738f3",
                "0d4d23ba-066b-4244-a3a5-922cdcaaa28f",
                "29ed984c-74b5-4016-a649-c32e5d1d9869",
                "7ad0617e-bc4a-4869-8419-744f04d9b7a3",
                "c0b684d1-b96c-4420-9285-172402b7b123",
                "2db3c23d-c591-4ea0-b0a8-ed9c4343c80e",
                "97094aed-69f7-4f4e-a87e-533979e11514",
                "119b1761-a5b4-42b6-9971-ece11fb0e0f6",
                "35c295c2-37d1-44b2-87a3-1039645e5bae",
                "d383008a-a1bf-4689-b243-3c464c79b818",
                "a7d07151-5fc8-4c2a-a1cd-e7c7a2a9a7a7",
                "bd2a14e7-bb30-48d0-a585-7fbab767d4cf",
                "7b7d2d2b-abe6-4f32-add0-3715096995d1",
                "22618073-4ef0-4c3a-97b9-90ba1caa1d72",
                "e394e9ec-7288-4ede-9ef8-41b631d100dd",
                "fa2d4258-3ee4-4d53-8ef2-9700b5cf38d6",
                "e3dcde4e-5def-4b89-97b4-047b8288919b",
                "c82bbe23-0264-45a7-b1a6-82b4654108c8",
                "beab616a-256e-48f3-a458-028897a6138c",
                "7f6898e2-a840-4ad1-80f7-783f8b766fcc",
                "43476c88-86bc-4a65-9327-f0d24a41c971",
                "2c0a725a-e829-4d84-89d9-d0d47f6cfa37",
                "eeb42912-0c7a-46bb-bd95-369b2b425727",
                "db3a4986-55d5-4ecc-be73-59725dce3c33",
                "0a4b780e-8143-4118-ad98-fd2a2a6678c3",
                "028632ed-d75a-49bb-b579-41962ba502fe",
                "93690a96-421c-4c59-85ba-fa6dd538c721",
                "9817ec15-605a-40db-b848-2199e5ccbb7b",
                "dde0b2be-ea43-4de7-8feb-ccdc073c6978",
                "c0607363-1082-4ce9-a642-e9b2b903ae88",
                "5e7074a6-5011-4dc5-950c-41365dbc6d09",
                "0878e44d-bdc8-4d5f-9bf4-31101f14f797",
                "b09e872a-e837-49ec-8a27-84dcdcabf347",
                "13d12179-3182-4f41-85a2-90fd50e51480",
                "19d1a5fc-3ce9-4e43-a364-a4150bcf911b",
                "aa2c5d29-2764-4804-9181-5870c0956904",
                "4c6c8d3d-e4a3-490a-9211-cfbe7e6ee25b",
                "fe2e89f7-8f4d-420a-a551-4877cf0fd1d3",
                "c21d2c68-920f-4526-b754-286579c049f3",
                "46e51eb2-0c5e-457b-af1a-8bac1b8a8bea",
                "eecaa5cd-0b69-4af2-a782-035025f207b6",
                "5fa8593c-ca74-4651-8ede-7ab38a35107a",
                "605baa86-79e3-484d-82d2-4de27d405ba1",
                "0c947786-b0a8-4e14-beaf-64ed292fc79d",
                "d2f329b3-5b44-414b-bccd-7b2d1345d21e",
                "e934d5aa-b172-4aec-8d9c-66445a714864",
                "ce00896a-f7d2-4123-bb95-24cb6e53fc32",
                "ef608754-3f87-458e-9bcf-4434c54c8c9e",
                "26a12266-c6d8-42f9-bd4e-5093d827ac9a",
                "14c03068-8930-472a-9fd1-49c9fd4db47d",
                "16286ebd-6811-4e53-b4d5-82e1e825bc7a",
                "30ad857e-34d5-4ae1-8ca1-e962d10d6440",
                "ceb45393-54ee-4801-8c6f-c0aa66e37e60",
                "d7ebd11a-1339-4b28-be90-a788d2cfa706",
                "44b5453a-3009-43b9-bc34-71a11a6d5e63",
                "fc4ae4f8-f66b-4137-9821-e579b339cbf6",
                "95520295-90d3-4b4e-86b6-4bd856723315",
                "ded3feb2-1079-4520-a7ca-f5b5fc73d7c5",
                "93eb458f-2b57-498b-a356-9b5540cc545c",
                "59cebae6-632d-4632-b695-c48ae46b2e67",
                "5e55cf3e-9f95-4b8c-8212-b540da3047cb",
                "0547cdfa-c488-4da0-9bb5-4cc63a637179",
                "32398808-c46a-41bf-a0a8-e08723b40ea2",
                "0f008098-d8aa-46dc-8445-cca59838c582",
                "98760b3e-3075-4444-9a01-8f11935069d4",
                "97943d87-fed7-4f14-a0a7-c5bfee64c392",
                "585a8d2e-cd09-4a61-b7c9-e8f70ce39e69",
                "c3096984-bd11-44a0-8ee0-47f07ad04d81",
                "cc22913d-2dda-48bb-82aa-9960b73f3e44",
                "f89bbd17-c732-4847-b71c-a8627a702747",
                "36c14e9d-1863-4c55-bbbb-f8c9dd418932",
                "81ca3541-79df-479f-bc55-3840386bf064",
                "0e9c36fd-2d5d-48da-8364-f8c5edc3d873",
                "ce6606f2-caa7-45bc-aa49-0649efc11634",
                "0f3e2f16-1c06-4128-af45-ee73de19ea69",
                "f07070c0-fd0a-4c19-ba1e-5f06b933cd7c",
                "08c73b36-ede5-4136-b73b-0e964d432f89",
                "a8b4284d-cbbb-43e3-897b-d04af4bfba74",
                "654c6f5c-3e5c-49f0-b53f-87cd9797d7c9",
                "776a5ffa-6bba-49a2-a4d8-54051c19cd70",
                "1286ac33-a466-4f58-900e-f6b13fe9c25a",
                "7b356c12-b226-4e58-be7f-44e50e3eefbe",
                "1272f46b-0d75-496b-8f06-cb659d9e22a7",
                "c46971a1-cbac-425d-bac2-f4142c92522e",
                "d781260c-f969-456e-bf16-044dc5b181a4",
                "7997f3d8-bff6-4808-8df0-d88d344d7c9e",
                "7b0d69ca-13a6-46e0-839c-e433bbede3ad",
                "16fc3677-0393-4ed1-ad3f-c8355f056369",
                "703d3e86-32f4-44ae-bd88-c02378fc2269",
                "a9904356-f050-4bd8-b48a-50b64f6dc3a1",
                "b54865b6-824e-4163-b759-21a6eacc98ce",
                "ca594f56-9c68-4b7e-84b2-669f1004e3a4",
                "57a2044d-20cc-4d02-b268-ce570a0fabe3",
                "75915370-0895-4933-8875-8a31c65c3d50",
                "6ff12a54-10da-4941-bfea-7b66e19b4be9",
                "d77e4dbc-b239-4742-8cb7-efd427010d13",
                "1c052cde-7a70-410b-a273-dbe39dd968f4",
                "3434b91a-c05f-460f-a078-7b1bb6e7085d",
                "3d9828ae-eb65-4d0a-8d7a-cc09e98b5e99",
                "bd69e879-9ee0-415d-90ef-ccddd9feaf92",
                "2db0fb62-64ce-457c-9e22-dd05ef59f684",
                "2ab0fb7b-ad2a-403d-9411-712974ccd878",
                "86cbca52-29bd-4b88-a203-e8b9a072bd4b",
                "a6f98ee5-9638-4ebe-804b-fba54aea9f90",
                "83d05b9a-f409-4169-bef9-e772d2cfbfaf",
                "db5ea0e6-4cac-4f18-8643-32afb1e0287d",
                "8fccff71-3710-4cb9-b8af-61707aebe5d8",
                "00781a96-4068-427c-a9c5-584d167c3dea",
                "3c3d4ef0-019a-423e-89b2-4ac5a7b567ab",
                "da112431-5579-4fd1-a230-9144b359b0e9",
                "edce7aac-1d8b-41cb-88e2-f50b8eeca4d8",
                "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
                "d07d0a56-a25e-426b-8384-9d49e6545527",
                "1200c8b7-a058-4c01-bbe2-04ec09a65245",
                "cb2af13b-cbed-4657-8fd4-fed8db375cba",
                "df15901c-2508-42c9-bf06-026efd89e51f",
                "8520654b-2192-46cf-9d72-1ddb885a7c55",
                "b16bb717-d1cf-4237-a554-43f3995b82f2",
                "b93221ba-2076-4dd4-9931-179571b7e16c",
                "29a48c93-bade-4346-a901-de35a6537337",
                "f74da4c6-4291-46d2-abd4-7d7f6ef03b00",
                "764c97c9-01d3-45cb-86bd-f8a52b5468da",
              ],
            },
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [
                "ENSG00000141510",
                "ENSG00000121879",
                "ENSG00000133703",
                "ENSG00000196159",
                "ENSG00000167548",
                "ENSG00000171862",
                "ENSG00000117713",
                "ENSG00000134982",
                "ENSG00000055609",
                "ENSG00000157764",
                "ENSG00000083857",
                "ENSG00000085224",
                "ENSG00000196712",
                "ENSG00000140836",
                "ENSG00000149311",
                "ENSG00000173821",
                "ENSG00000127914",
                "ENSG00000196367",
                "ENSG00000138413",
                "ENSG00000109670",
                "ENSG00000183454",
                "ENSG00000118058",
                "ENSG00000005339",
                "ENSG00000065526",
                "ENSG00000213281",
                "ENSG00000139618",
                "ENSG00000181555",
                "ENSG00000178568",
                "ENSG00000147889",
                "ENSG00000127329",
                "ENSG00000047936",
                "ENSG00000148400",
                "ENSG00000165671",
                "ENSG00000100393",
                "ENSG00000153201",
                "ENSG00000163939",
                "ENSG00000168036",
                "ENSG00000146648",
                "ENSG00000139687",
                "ENSG00000104517",
                "ENSG00000111642",
                "ENSG00000127616",
                "ENSG00000189079",
                "ENSG00000141027",
                "ENSG00000049618",
                "ENSG00000198795",
                "ENSG00000184634",
                "ENSG00000196498",
                "ENSG00000138336",
                "ENSG00000133392",
              ],
            },
          },
          {
            content: {
              field: "genes.is_cancer_gene_census",
              value: ["true"],
            },
            op: "in",
          },
          {
            op: "not",
            content: {
              field: "ssms.consequence.transcript.annotation.vep_impact",
              value: "missing",
            },
          },
          {
            op: "in",
            content: {
              field: "ssms.consequence.transcript.consequence_type",
              value: [
                "missense_variant",
                "frameshift_variant",
                "start_lost",
                "stop_lost",
                "stop_gained",
              ],
            },
          },
        ],
      },
    });
  },
);

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSSMOccurrences.fulfilled, (state) => {
        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchSSMOccurrences.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSSMOccurrences.rejected, (state, action) => {
        state.status = "rejected";

        if (action.error) {
          state.error = action.error.message;
        }

        return state;
      });
  },
});

export const ssmOccurrencesReducer = slice.reducer;

export const selectSsmOccurrencesState = (state: any) =>
  state.oncogrid.ssmOccurrences;

export const selectSsmOccurrencesData = (
  state: CoreState,
): CoreDataSelectorResponse<SSMOccurrencesState> => {
  return {
    data: state.oncogrid.ssmOccurrences.data,
    status: state.oncogrid.ssmOccurrences.status,
    error: state.oncogrid.ssmOccurrences.error,
  };
};

export const useOncoGridSsmOccurrences = createUseCoreDataHook(
  fetchSSMOccurrences,
  selectSsmOccurrencesData,
);