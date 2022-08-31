import { Image } from "@/components/Image";

const NullApp: React.FC = () => {
  return (
    <div className=" flex flex-col bg-base-lighter items-center justify-center  w-100 h-screen/2 m-4 rounded-lg shadow-lg">
      <div className="w-[320] justify-center font-medium font-montserrat text-2xl text-base-contrast-lighter">
        This application is not available.
      </div>
      <Image
        src="/user-flow/icons/apps/construction.svg"
        height={320}
        width={320}
      />
    </div>
  );
};

export default NullApp;
