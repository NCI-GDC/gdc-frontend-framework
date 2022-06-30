import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphQLQuery = ` 
query FilesTable(
  $size: Int
  $offset: Int
  $sort: [Sort]
  $filters: FiltersArgument
) {
  viewer {
    repository {
      files {
        hits(first: $size, offset: $offset, sort: $sort, filters: $filters) {
          total
          edges {
            node {
              id
              file_id
              file_name
              file_size
              access
              state
              acl
              data_category
              data_format
              platform
              data_type
              experimental_strategy
              cases {
                hits(first: 1) {
                  total
                  edges {
                    node {
                      case_id
                      project {
                        project_id
                        id
                      }
                      id
                    }
                  }
                }
              }
              annotations {
                hits(first: 0) {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const fetchFilesTable = createAsyncThunk<
  GraphQLApiResponse,
  {
    cart: string[];
    size: number;
    offset: number;
    sort: { field: string; order: string }[];
  },
  { dispatch: CoreDispatch; state: CoreState }
>("cart/filesTable", async ({ cart, size, offset, sort }) => {
  const graphQLFilters = {
    size,
    offset,
    sort,
    filters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart,
          },
        },
      ],
    },
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

export interface CartSummary {
  data: any;
  status: DataStatus;
}

const initialState: CartSummary = {
  data: [],
  status: "uninitialized",
};

const slice = createSlice({
  name: "filesTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFilesTable.fulfilled, (state, action) => {
      const response = action.payload;
      state.status = "fulfilled";
      state.data = response.data?.viewer.repository?.files.hits.edges || [];
    });
  },
});

export const filesTableReducer = slice.reducer;

export const selectFilesTableData = (
  state: CoreState,
): CoreDataSelectorResponse<any> => {
  return {
    data: state.cart.filesTable.data,
    status: state.cart.filesTable.status,
  };
};

export const useCartFilesTable = createUseCoreDataHook(
  fetchFilesTable,
  selectFilesTableData,
);
