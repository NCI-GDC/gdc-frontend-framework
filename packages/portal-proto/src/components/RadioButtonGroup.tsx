import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";

interface RadioSquareButtonGroupProps {
  readonly items: string[];
  readonly checkedItem: string;
  readonly onSelected: (v: string) => void;
}

/**
 * RadioButtonGroup a horizontal layout of button which act as a radio group
 * @param items - list of button labels as strings
 * @param checkedItem - initial selected button
 * @param onSelected - a function (string) to handle when the group's selected button changes
 */
const RadioButtonGroup: React.FC<RadioSquareButtonGroupProps> = ({
  items,
  checkedItem,
  onSelected,
}: RadioSquareButtonGroupProps) => {
  const [selected, setSelected] = useState(checkedItem);
  const handleSelected = (s) => {
    setSelected(s);
    onSelected(s);
  };
  const { current: fieldId } = useRef(nanoid());

  return (
    <div className="flex flex-col items-center mt-4 space-y-4 flex-shrink">
      <div className="flex items-center justify-center mb-3">
        <form>
          <div
            className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
            role="group"
          >
            {items.map((x, index) => {
              return (
                <div key={`${fieldId}_${index}`}>
                  <input
                    type="radio"
                    checked={x == selected}
                    name="radio_group_member"
                    id={`${fieldId}-${index}`}
                    className="peer hidden"
                    value={x}
                    onChange={() => handleSelected(x)}
                  />
                  <label
                    htmlFor={`${fieldId}-${index}`}
                    className={`rounded first:rounded-l last:rounded-r inline-block px-6 py-2.5 peer-checked:bg-accent-dark bg-accent-lighter text-accent-content-lightest font-medium text-xs leading-tight uppercase hover:bg-accent focus:bg-accent focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                  >
                    {x}
                  </label>
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RadioButtonGroup;
