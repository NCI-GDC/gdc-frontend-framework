import React from "react";

interface Item {
  project?: string | undefined;
  numerator: number;
  denominator: number;
}

interface RatioSpringProps {
  item: Item;
  index: number;
  orientation: string;
}

const RatioSpring: React.FC<RatioSpringProps> = ({
  item,
  index,
  orientation,
}: RatioSpringProps) => {
  const { numerator, denominator, project } = item;
  const [n, d] = [
    denominator === 0 ? 0 : numerator,
    denominator === 0 ? 1 : denominator,
  ];
  return (
    <>
      <ul className={`p-1 text-xs`}>
        {numerator === 0 ? (
          orientation === "vertical" && <div className={`w-max m-auto`}>0</div>
        ) : (
          <li key={`subrow-item-${index}`} className={`list-none`}>
            <div className={`flex flex-row m-auto w-fit`}>
              {project && (
                <div className={`font-bold text-black mx-0.5`}>{project}:</div>
              )}{" "}
              <div className={`text-activeColor mx-1`}>
                {numerator.toLocaleString("en-US")}
              </div>
              <div className={`text-black mx-0.5`}> / </div>
              <div className={`text-activeColor`}>
                {denominator.toLocaleString("en-US")}
              </div>
              {orientation === "horizontal" && (
                <div className={`ml-1`}>({((n * 100) / d).toFixed(2)}%)</div>
              )}
            </div>
            {orientation === "vertical" && (
              <div className={`w-max mx-auto`}>
                ({((n * 100) / d).toFixed(2)}%)
              </div>
            )}
          </li>
        )}
      </ul>
    </>
  );
};

export default RatioSpring;
