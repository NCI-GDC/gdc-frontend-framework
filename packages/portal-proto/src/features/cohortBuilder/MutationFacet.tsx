import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";

interface MutationFacetProps {
  readonly field: string;
  readonly description?: string;
  readonly type?: string;
}

interface MutationFacetDataProps extends MutationFacetProps {
  readonly data: Record<string, any>[];
}

const MutationFacetHeader: React.FC<MutationFacetProps> = ({
  field,
  type = "Mutations",
}: MutationFacetProps) => {
  return (
    <div>
      <div className="flex items-center border-2 justify-between flex-wrap bg-nci-gray-lighter p-1.5">
        {field}
        <div className="flex-none text-right w-24">{type}</div>
      </div>
    </div>
  );
};

export const MutationFacet: React.FC<MutationFacetDataProps> = ({
  data,
  field,
  description,
  type,
}: MutationFacetDataProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  return (
    <div className=" flex flex-col border-2 border-b-0 bg-base-lightest relative">
      <CollapsibleContainer
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
        Top={() => <MutationFacetHeader {...{ field, description, type }} />}
      >
        {data.map(({ value, count }) => {
          return (
            <div
              key={`${field}-${value}`}
              className="flex flex-row gap-x-1 px-2 text-sm "
            >
              <div className="flex-none">
                <input type="checkbox" value={`${field}:${value}`} />
              </div>
              <div className="flex-grow truncate ...">{value}</div>
              <div className="flex-none text-right w-24 pr-6">
                {count.toLocaleString()}
              </div>
            </div>
          );
        })}
      </CollapsibleContainer>
    </div>
  );
};

export default MutationFacet;
