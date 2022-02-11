import React from "react";
import Image from "next/image";
import { AppRegistrationEntry } from "./utils"

export interface AnalysisCardProps extends AppRegistrationEntry {
  applicable: boolean;
  readonly onClick?: (x) => void;
}

const AnalysisCard : React.FC<AnalysisCardProps> = ( entry: AnalysisCardProps ) => {
  return (

    <div className="flex flex-col items-center mx-4 border-2 shadow-lg">
      <div className="font-heading text-lg mb-2">{entry.name}</div>
      <button onClick={() => entry.onClick(entry.id)} >
        <div className="flex flex-row items-center">
            <Image
              className="m-auto"
              src={`/user-flow/${entry.icon}`}
              height="200" width="200"
            />
        </div>
      </button>
    </div>

  )
}

export default AnalysisCard;
