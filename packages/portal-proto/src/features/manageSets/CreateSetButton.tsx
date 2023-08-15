import {
  Modals,
  selectCurrentModal,
  useCoreSelector,
  showModal,
  useCoreDispatch,
  useCreateGeneSetFromValuesMutation,
  useCreateSsmsSetFromValuesMutation,
} from "@gff/core";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import UserInputModal from "@/components/Modals/UserInputModal";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import { SubmitSaveSetButton } from "@/components/SaveSetButton";

const CreateGeneModal = () => {
  return (
    <UserInputModal modalTitle="Create Gene Set">
      <InputEntityList
        inputInstructions={
          "Enter one or more gene identifiers in the field below or upload a file to create a gene set."
        }
        textInputPlaceholder="e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637"
        entityType="genes"
        entityLabel="gene"
        identifierToolTip={
          <div>
            <p>
              - Gene identifiers accepted: Symbol, Ensembl, Entrez, HCNC,
              UniProtKB/Swiss-Prot, OMIM
            </p>
            <p>
              - Delimiters between gene identifiers: comma, space, tab or 1 gene
              identifier per line
            </p>
            <p>- File formats accepted: .txt, .csv, .tsv</p>
          </div>
        }
        hooks={{
          createSet: useCreateGeneSetFromValuesMutation,
        }}
        RightButton={SubmitSaveSetButton}
      />
    </UserInputModal>
  );
};

const CreateMutationModal = () => {
  return (
    <UserInputModal modalTitle="Create Mutation Set">
      <InputEntityList
        inputInstructions={
          "Enter one or more mutation identifiers in the field below or upload a file to create a mutation set."
        }
        textInputPlaceholder="e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57"
        entityType="ssms"
        entityLabel="mutation"
        identifierToolTip={
          <div>
            <p>- Mutation identifiers accepted: Mutation UUID, DNA Change</p>
            <p>
              - Delimiters between mutation identifiers: comma, space, tab or 1
              mutation identifier per line
            </p>
            <p>- File formats accepted: .txt, .csv, .tsv</p>
          </div>
        }
        hooks={{
          createSet: useCreateSsmsSetFromValuesMutation,
        }}
        RightButton={SubmitSaveSetButton}
      />
    </UserInputModal>
  );
};

const CreateSetButton: React.FC = () => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const dispatch = useCoreDispatch();

  return (
    <>
      {modal === Modals.GlobalGeneSetModal && <CreateGeneModal />}
      {modal === Modals.GlobalMutationSetModal && <CreateMutationModal />}
      <DropdownWithIcon
        TargetButtonChildren={<>Create Set</>}
        dropdownElements={[
          {
            title: "Genes",
            onClick: () =>
              dispatch(showModal({ modal: Modals.GlobalGeneSetModal })),
          },
          {
            title: "Mutations",
            onClick: () =>
              dispatch(showModal({ modal: Modals.GlobalMutationSetModal })),
          },
        ]}
      />
    </>
  );
};

export default CreateSetButton;
