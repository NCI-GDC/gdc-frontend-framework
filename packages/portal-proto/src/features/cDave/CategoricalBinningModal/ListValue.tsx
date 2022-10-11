import { createKeyboardAccessibleFunction } from "src/utils";
import { pickBy } from "lodash";

interface ListValueProps {
  readonly name: string;
  readonly count: number;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
}

const ListValue: React.FC<ListValueProps> = ({
  name,
  count,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
}: ListValueProps) => {
  const updateSelectedValues = (name: string, count: number) => {
    if (Object.keys(selectedValues).includes(name)) {
      setSelectedValues(pickBy(selectedValues, (_, k) => k !== name));
    } else {
      setSelectedValues({ ...selectedValues, [name]: count });
    }
  };

  return (
    <li
      className={`${
        selectedValues?.[name] ? "bg-accent-warm-light" : ""
      } cursor-pointer list-inside`}
    >
      <div
        onClick={() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        }}
        onKeyPress={createKeyboardAccessibleFunction(() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        })}
        tabIndex={0}
        role="button"
        className="inline"
      >
        {name} ({count.toLocaleString()})
      </div>
    </li>
  );
};

export default ListValue;
