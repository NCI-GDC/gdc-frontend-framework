import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";

const ExpandRowComponent = ({
  isRowExpanded,
  value,
  isColumnExpanded = true,
  title,
}: {
  isRowExpanded: boolean;
  value: string[];
  isColumnExpanded?: boolean;
  title: string;
}): JSX.Element => (
  <>
    {value.length === 0 ? (
      "--"
    ) : value?.length === 1 ? (
      value
    ) : (
      <div
        aria-label="Expand section"
        className="flex items-center text-primary cursor-pointer gap-2"
      >
        {isRowExpanded && isColumnExpanded ? (
          <UpIcon size="1.25em" className="text-accent" data-testid="up-icon" />
        ) : (
          <DownIcon
            size="1.25em"
            className="text-accent"
            data-testid="down-icon"
          />
        )}
        <span
          className={`whitespace-nowrap ${
            isRowExpanded && isColumnExpanded && "font-bold"
          }`}
        >
          {value.length.toLocaleString().padStart(6)} {title}
        </span>
      </div>
    )}
  </>
);

export default ExpandRowComponent;
