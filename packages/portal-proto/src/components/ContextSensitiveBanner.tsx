import { FaExclamationCircle } from "react-icons/fa";

export const ContextSensitiveBanner = (): JSX.Element => (
  <div className="flex h-12 border border-warningColor mb-6">
    <div className="flex h-full w-12 bg-warningColor justify-center items-center">
      <FaExclamationCircle color="white" className="h-6 w-6" />
    </div>
    <div className="bg-[#FFAD0D33] h-full w-full flex items-center pl-4">
      <span className="text-sm">
        Viewing subset of the GDC based on your current cohort and Mutation
        Frequency filters.
      </span>
    </div>
  </div>
);
