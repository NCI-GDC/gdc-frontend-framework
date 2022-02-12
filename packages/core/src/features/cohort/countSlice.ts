import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAcess";
import { CoreState } from "../../store";
import { castDraft } from "immer";
import { CasesState } from "../cases/casesSlice";

export interface CountsState {
  readonly caseCounts: number;
  readonly fileCounts: number;
  readonly genesCounts: number;
  readonly mutationCounts: number;
}

const initialState: CountsState = {
  caseCounts: -1,
  fileCounts: -1,
  genesCounts: -1,
  mutationCounts: -1,
};

const GRAPHQL_QUERY = `
  query exploreCase_relayQuery($filters: FiltersArgument) {
  viewer {
    repository {
      cases {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      files {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    },
    explore {
      cases {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      genes {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      ssms {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}`;
