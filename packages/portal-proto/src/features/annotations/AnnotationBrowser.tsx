import AnnotationFilterPanel from "./AnnotationFilterPanel";
import AnnotationTable from "./AnnotationTable";

const AnnotationBrowser = () => {
  return (
    <div className="flex flex-col m-4">
      <h1 className="uppercase text-primary-darkest text-2xl font-montserrat pb-4">
        Browse Annotations
      </h1>
      <hr />
      <div className="flex flex-row">
        <div className="flex flex-col gap-y-2 mt-1 w-1/4">
          <AnnotationFilterPanel />
        </div>
        <div className="grow overflow-hidden mt-10">
          <AnnotationTable />
        </div>
      </div>
    </div>
  );
};

export default AnnotationBrowser;
