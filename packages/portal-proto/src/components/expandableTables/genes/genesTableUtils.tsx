import { GeneAffectedCases } from "./GeneAffectedCases";
import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import _ from "lodash";
import { animated } from "react-spring";
// import SwitchSpring from "../shared/SwitchSpring";
// import PercentageBar from "../shared/PercentageBar";
import CheckboxContainer from "../shared/CheckboxContainer";
import SwitchSpring from "../shared/SwitchSpring";

interface SingleGene {
  biotype: string;
  case_cnv_gain: number;
  case_cnv_loss: number;
  cnv_case: number;
  cytoband: string[];
  gene_id: string;
  id: string;
  is_cancer_gene_census: boolean;
  name: string;
  numCases: number;
  ssm_case: number;
  symbol: string;
}

interface TableColumnState {
  id: string;
  columnName: string;
  visible: boolean;
}

export const SurvivalIcon = () => {
  return (
    <svg
      viewBox="0 0 2048 1536"
      style={{
        height: "0.8em",
        fill: "currentcolor",
        flexBasis: 16,
      }}
    >
      <path d="m 1917.282,1250.0708 0,-435.00002 c 0,-14 -6.5,-23.83333 -19.5,-29.5 -13,-5.66667 -24.8333,-3.16667 -35.5,7.5 l -121,121.00002 -632.9999,-633.00002 c -6.6667,-6.66667 -14.3334,-10 -23,-10 -8.6667,0 -16.3334,3.33333 -23,10 l -233.00004,233 -416,-416 -192,192 585,585.00002 c 6.66667,6.6667 14.33333,10 23,10 8.66667,0 16.33333,-3.3333 23,-10 l 233.00004,-233.00002 463.9999,464.00002 -121,121 c -10.6667,10.6667 -13.1667,22.5 -7.5,35.5 5.6667,13 15.5,19.5 29.5,19.5 l 435,0 c 9.3333,0 17,-3 23,-9 6,-6 9,-13.6667 9,-23 z" />
      <path d="m 2048,1408 0,128 L 0,1536 0,0 l 127.99999,0 0,1408 z" />
    </svg>
  );
};

export const AnnotationsIcon = () => {
  return (
    <svg height={20} width={20} viewBox="0 0 950 742" version="1.1">
      <g>
        <path
          fill={"activeColor"}
          d="m454 741.41c-1.925-0.21141-9.125-0.88467-16-1.4961-72.81-6.47-142.63-33.6-209.45-81.37-22.41-16.02-39.66-29.85-47.19-37.83-10.72-11.37-17.33-27.84-17.33-43.21 0-12.912 5.8332-29.751 13.581-39.207l3.52-4.29h-11.34c-73.582 0-139.01-46.17-161.8-114.18-5.1297-15.32-7.0778-26.81-7.6811-45.32-0.66091-20.28 0.9613-33.58 6.2651-51.36 4.746-15.91 15.305-36.89 25.23-50.14 10.256-13.69 26.887-29.59 40.703-38.92 20.925-14.13 60.683-46.43 121.99-99.11 51.27-44.048 74.79-62.763 100.5-79.947 43.97-29.399 79.92-44.465 124.6-52.22 11.48-1.9928 16.37-2.2433 44.4-2.2714 32.14-0.03224 43.97 0.7572 68 4.5387 76.5 12.037 143.44 43.406 215.5 100.99 15.663 12.516 22.416 19.939 27.475 30.202 9.9869 20.262 9.1358 41.889-2.4025 61.05l-3.42 5.69 12.677 0.0183c45.514 0.0658 88.348 17.967 120.68 50.435 24.53 24.634 39.736 54.054 45.518 88.066 1.9141 11.259 2.1354 15.369 1.6685 30.981-0.60217 20.133-2.3048 29.852-8.3087 47.429-11.463 33.559-32.508 60.429-68.833 87.888-33.956 25.668-63.979 50.18-111.01 90.631-55.096 47.39-79.239 66.89-104.12 84.093-46.222 31.963-84.777 48.673-130.45 56.537-10.365 1.7847-17.279 2.1952-40.969 2.4327-15.675 0.15711-30.075 0.11268-32-0.0987zm-140-232.14v-51.732l-2.6672 3.9821c-12.258 18.301-33.033 37.21-54.556 49.655l-8.7227 5.0439 7.7227 3.7388c4.3723 2.1167 12.929 7.8693 19.723 13.26 13.832 10.974 36.647 27.761 37.75 27.775 0.4125 0.005 0.75-23.27 0.75-51.722zm343.18 9.5585 21.196-18.174-4.382-3.5764c-14.4-11.75-25.64-23.44-34.13-35.49l-4.87-6.9v41.157c0 22.63 0.22 41.15 0.49 41.15 0.26916 0 10.028-8.1781 21.686-18.174zm-477.04-114.27c8.7167-1.8476 14.017-4.6505 20.641-10.915 7.4506-7.0464 10.429-13.19 10.976-22.642 0.3477-6.0068 0.002-8.6441-1.7343-13.247-3.1398-8.3207-10.406-15.843-19.778-20.475-6.9646-3.4421-8.3702-3.7675-17.658-4.0875-7.8695-0.27118-11.412 0.0703-16.091 1.5513-7.1887 2.2753-19.104 10.983-22.929 16.758-11.474 17.321-3.8039 39.945 16.814 49.593 10.468 4.8985 18.552 5.8395 29.759 3.4641zm610.74-1.6169c11.823-2.7257 23.157-11.525 27.911-21.67 3.8775-8.2746 3.8517-19.381-0.0636-27.384-3.0765-6.2881-11.246-14.577-17.524-17.78-21.497-10.967-49.616-2.9544-59.794 17.038-3.5303 6.9345-4.3986 17.385-2.0337 24.477 3.518 10.55 14.298 20.614 26.081 24.352 6.7217 2.1319 18.438 2.5777 25.423 0.96745zm-477.11-181.39-0.27-19.46l-20 17.08c-11 9.3943-20 17.394-20 17.777 0 0.3829 4.0581 4.0737 9.0179 8.2018 9.7838 8.1431 17.54 16.388 25.741 27.361l5.2413 7.0135 0.27114-19.264c0.14913-10.595 0.14913-28.017 0-38.717zm345.39 29.874c9.8182-9.4886 20.331-17.69 30.117-23.494l5.7787-3.4275-5.8185-2.7738c-3.2002-1.5256-12.101-7.7211-19.779-13.768-13.78-10.85-32.97-24.96-33.95-24.96-0.28 0-0.51 21.84-0.51 48.54v48.543l7.384-9.7928c4.0612-5.386 11.611-13.878 16.778-18.872z"
        />
        <path
          fill={"white"}
          d="m455.5 740.96c-90.82-6.28-162.97-34.32-242-94.03-30.11-22.75-35.69-28.25-42.06-41.43-4.66-9.66-6.44-17.36-6.44-27.9 0-14.788 4.2297-27.431 13.185-39.412l3.9678-5.3083-5.8264 0.63222c-7.6532 0.83044-28.889-0.98107-41.408-3.5323-24.87-5.07-47.678-15.26-68.91-30.81-9.913-7.25-28.092-25.72-35.142-35.69-14.573-20.61-23.95-42.91-28.49-67.74-2.6165-14.32-2.371-41.01 0.5119-55.67 8.6971-44.2 33.703-81.55 71.488-106.75 18.418-12.29 55.022-41.97 112.63-91.33 42.61-36.51 59.68-50.704 76.87-63.94 78.66-60.553 140.97-82.192 222.13-77.14 23.13 1.439 40 3.3791 57.71 6.635 72.87 13.396 139.31 46.359 210.07 104.2 14.504 11.859 21.765 22.518 25.686 37.707 1.9761 7.655 1.9729 22.444-0.007 30.08-1.7803 6.8675-7.1174 18.935-9.1033 20.583-2.7273 2.2635-1.1625 2.8774 7.3984 2.9027 36.422 0.10739 70.046 10.244 99.825 30.094 15.043 10.027 34.445 29.401 44.269 44.204 33.033 49.774 36.997 110.37 10.645 162.7-12.456 24.735-31.405 45.845-61.42 68.426-34.001 25.58-56.529 44.006-115.25 94.263-21.08 18.05-44.41 37.77-51.83 43.83-70.717 57.728-121.18 83.523-181 92.514-15.845 2.3816-47.659 3.2815-67.5 1.9092zm52.076-35.02c43.29-4.22 85.71-21.38 131.42-53.19 23.381-16.267 39.135-29.044 102-82.723 56.053-47.862 78.152-65.871 112.5-91.681 18.633-14.001 31.461-26.947 41.202-41.579 21.602-32.449 26.954-72.229 14.736-109.53-14.974-45.711-55.856-80.083-105.72-88.88-12.196-2.1518-35.251-2.1518-47.447 0-40.309 7.1121-75.109 31.105-95.327 65.723-24.928 42.683-21.601 98.08 8.3159 138.45 15.353 20.718 41.771 39.843 64.985 47.044 3.1625 0.98102 5.75 2.1167 5.75 2.5238 0 0.40705-5.7354 5.6124-12.745 11.567-7.0099 5.955-25.347 21.631-40.75 34.835-37.41 32.09-69.9 58.51-71.94 58.51-0.31 0-0.56-105.3-0.56-234s0.26207-234 0.58237-234c1.1875 0 22.291 12.472 33.418 19.749 13.017 8.514 30.21 21.081 43.5 31.795 13.114 10.573 16.178 11.955 26.5 11.955 8.9818 0 14.405-1.8677 19.87-6.8426 8.6101-7.8389 11.8-22.509 7.3188-33.657-2.66-6.6-11.07-14.27-36.19-32.98-65.39-48.699-126.44-74.372-196.31-82.553-89.07-10.43-144.86 5.498-222.19 63.429-15.461 11.582-38.624 30.715-76.931 63.544-61.536 52.736-98.148 82.464-119.01 96.631-26.831 18.221-44.925 41.83-53.978 70.43-4.6109 14.567-5.9244 23.349-5.8336 39 0.15454 26.613 8.7937 52.735 24.486 74.038 10.336 14.031 27.694 29.191 43.766 38.223 20.663 11.612 50.706 18.367 74.835 16.826 47.313-3.0226 87.381-27.013 111.14-66.543 17.526-29.161 22.008-69.323 11.372-101.92-1.3681-4.1932-4.256-11.399-6.4174-16.013-14.162-30.231-43.093-56.248-75.207-67.633-4.2775-1.5164-7.6525-2.8534-7.5-2.9711 0.15251-0.11772 14.689-12.543 32.304-27.611 40.83-34.95 48.62-41.54 61.47-52.01 12.16-9.91 33.37-25.91 34.34-25.91 0.36 0 0.66 107.32 0.66 238.5s-0.29863 238.5-0.66362 238.5c-1.485 0-22.188-11.468-33.619-18.623-14.965-9.3666-31.355-21.063-48.357-34.509-7.0733-5.5939-14.835-11.051-17.247-12.127-18.288-8.1551-39.246 4.5845-40.872 24.844-0.9715 12.103 3.4604 19.67 18.5 31.585 74.876 59.321 136.17 87.476 211.87 97.318 25.991 3.3794 58.052 4.3862 77.967 2.4483zm-72.08-61.5c-11.26-1.5269-30.838-5.2689-34.25-6.546l-2.25-0.84228v-266.44-266.44l7.75-2.5346c10.562-3.4543 18.354-5.3453 27.25-6.6131 4.125-0.58791 8.9625-1.3025 10.75-1.5881l3.25-0.51912v276.55c0 220.62-0.25276 276.52-1.25 276.44-0.6875-0.0567-5.75-0.71329-11.25-1.4592zm71.5-273.45v-275.27l5.8434 0.61076c7.6071 0.7951 29.068 5.0051 36.408 7.1425l5.7519 1.6747-0.25187 264.04-0.25186 264.04-7.4569 2.9591c-8.3551 3.3155-27.087 8.3566-34.907 9.3939l-5.13 0.69v-275.27zm-345.26 67.784c-25.109-2.0914-49.224-17.986-60.027-39.566-6.1286-12.242-8.1405-21.626-7.4211-34.612 1.18-21.3 9.3789-36.208 27.433-49.881 17.678-13.387 27.872-16.983 48.279-17.027 15.227-0.0329 23.019 1.6781 35.5 7.7944 16.097 7.8887 27.503 19.082 34.668 34.022 16.356 34.105 1.7368 73.704-33.74 91.39-13.651 6.8054-27.749 9.2911-44.692 7.8799zm22.173-34.665c11.799-3.6723 21.097-11.559 25.92-21.985 3.6914-7.9798 3.6706-18.305-0.053-26.356-5.3519-11.572-17.997-20.611-32.249-23.052-7.9871-1.3681-19.326 0.027-25.691 3.161-7.5492 3.7171-17.084 12.231-20.337 18.159-2.7391 4.9922-3 6.2938-3 14.968 0 11.538 2.1624 16.835 10.002 24.5 11.517 11.261 29.675 15.502 45.407 10.605zm582.92 32.94c-30.75-5.63-55.05-27.22-61.37-54.53-10.37-44.8 25.57-86.51 74.54-86.51 35.743 0 66.34 22.541 74.655 55 2.1746 8.4891 2.1722 23.526-0.005 32-6.2874 24.47-26.694 44.612-52.677 51.992-8.3625 2.3754-27.338 3.4839-35.142 2.0529zm28.402-34.952c10.096-3.4752 19.212-11.218 23.896-20.298 3.3148-6.4248 3.749-18.481 0.93424-25.942-2.4884-6.5965-8.1344-13.387-14.805-17.805-12.102-8.0161-31.412-9.4623-44.482-3.3316-17.422 8.1721-26.757 25.29-22.318 40.927 2.9701 10.463 10.6 19.306 21.41 24.814 9.237 4.7065 24.404 5.4078 35.365 1.6352zm-481.46 81.89-0.27-26.01l-6.5 8.631c-12.763 16.948-33.838 35.077-53.34 45.886l-6.8399 3.7909 7.8399 3.7052c4.312 2.0379 9.8649 5.2666 12.34 7.175 2.475 1.9084 9.675 7.5147 16 12.458 6.325 4.9437 15.775 12.034 21 15.757l9.5 6.7682 0.2666-26.068c0.14664-14.338 0.14664-37.776 0-52.086zm345.53 33.524c15.597-13.276 19.519-17.092 18.5-18.001-0.71145-0.63433-4.8935-4.1047-9.2935-7.712-10.928-8.9596-23.217-22.458-31.698-34.819-1.6094-2.3458-1.7003-0.29825-1.75 39.45l-0.06 41.93 2.25-1.9974c1.2375-1.0986 11.157-9.5789 22.044-18.845zm-345.75-315.28c-0.45723-0.45722-9.0368 6.674-30.795 25.596l-10.74 9.3401 5.1177 4.0453c12.261 9.692 29.186 27.764 34.621 36.967 1.6775 2.8406 1.7501 1.5256 2.0024-36.266 0.14396-21.568 0.0509-39.425-0.20676-39.682zm337.72 57.92c10.919-12.34 27.823-26.19 40.484-33.171l4.2567-2.3469-7.047-3.7082c-3.8758-2.0395-9.3914-5.5694-12.257-7.8442-9.5782-7.6041-32.154-24.669-36.96-27.937l-4.75-3.2306v49.705 49.705l4.8806-6.9068c2.6843-3.7988 7.8106-10.218 11.392-14.265z"
        />
      </g>
    </svg>
  );
};

export const GTableHeader = ({
  twStyles,
  title,
}: {
  twStyles: string;
  title: string;
}): JSX.Element => {
  return (
    <>
      <div className={twStyles}>{_.startCase(title)}</div>
    </>
  );
};

export const GTableCell = ({
  row,
  accessor,
}: {
  row: any;
  accessor: string;
}): JSX.Element => {
  return (
    <div>
      <>
        {row.getCanExpand() ? <></> : null}{" "}
        <animated.div className={`ml-3.5 text-center text-xs`}>
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </animated.div>
      </>
    </div>
  );
};

export const createTableColumn = (
  accessor: string,
  width: number,
  partitionWidth: any,
  visibleColumns: TableColumnState[],
  selectedGenes: any, // todo: add type,
  selectGene: (geneId: string) => any,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => any,
) => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <div>
                  <div className={`content-center`}>
                    {row.getCanExpand() && (
                      <CheckboxContainer
                        isActive={row.original["select"] in selectedGenes}
                        select={row}
                        handleCheck={selectGene}
                        width={width / visibleColumns.length}
                        wSpring={partitionWidth}
                      />
                    )}
                  </div>
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "survival":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row, getValue }) => {
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={true}
                      icon={<SurvivalIcon />}
                      selected={{}}
                      handleSwitch={handleSurvivalPlotToggled}
                    />
                  )}
                  {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                    <div className={`relative`}>
                      <GeneAffectedCases
                        geneId={row.value}
                        width={width}
                        opening={row.getCanExpand()}
                      ></GeneAffectedCases>
                    </div>
                  )}
                </>
              );
            },
          },
        ],
      };
    case "annotations":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`w-max mx-auto`}
                >
                  {row.getCanExpand() && (
                    <div className={`block m-auto w-max`}>
                      <AnnotationsIcon />
                    </div>
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "SSMSAffectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    <GTableCell row={row} accessor={accessor} />
                    {row.getCanExpand() && (
                      <div className={`text-center`}>
                        <button
                          {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: "pointer" },
                          }}
                        >
                          <ToggleSpring
                            isExpanded={row.getIsExpanded()}
                            icon={
                              <MdKeyboardArrowDown size="small" color="white" />
                            }
                            twStyles={`bg-red-500 rounded-md h-3 w-3`}
                          />
                        </button>
                      </div>
                    )}
                  </>
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "CNVGain":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <GTableCell row={row} accessor={accessor} />
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "CNVLoss":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <GTableCell row={row} accessor={accessor} />
                  )}
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    default:
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <>
                    <GTableCell row={row} accessor={accessor} />
                    <>
                      {!row.getCanExpand() &&
                        visibleColumns[0].id === accessor && (
                          <div className={`relative`}>
                            <GeneAffectedCases
                              geneId={row.value}
                              width={width}
                              opening={row.getCanExpand()}
                            ></GeneAffectedCases>
                          </div>
                        )}
                    </>
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
  }
};

export const getGene = (
  g: SingleGene,
  selectedSurvivalPlot: Record<string, string>,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  genesTotal: number,
) => {
  return {
    select: g.gene_id,
    geneID: g.gene_id,
    survival: {
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    symbol: g.symbol,
    name: g.name,
    SSMSAffectedCasesInCohort:
      g.cnv_case > 0
        ? `${g.cnv_case + " / " + filteredCases} (${(
            (100 * g.cnv_case) /
            filteredCases
          ).toFixed(2)}%)`
        : `0`,
    SSMSAffectedCasesAcrossTheGDC:
      g.ssm_case > 0
        ? `${g.ssm_case + " / " + cases} (${(
            (100 * g.ssm_case) /
            cases
          ).toFixed(2)}%)`
        : `0`,
    CNVGain:
      g.cnv_case > 0
        ? `${g.case_cnv_gain + " / " + g.cnv_case} (${(
            (100 * g.case_cnv_gain) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      g.cnv_case > 0
        ? `${g.case_cnv_loss + " / " + g.cnv_case} (${(
            (100 * g.case_cnv_loss) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    genesTotal,
  };
};

export const convertGeneFilter = (geneId: string) => {
  return {
    op: "and",
    content: [
      {
        content: {
          field: "genes.gene_id",
          value: [geneId],
        },
        op: "in",
      },
      {
        op: "NOT",
        content: {
          field: "cases.gene.ssm.observation.observation_id",
          value: "MISSING",
        },
      },
    ],
  };
};
