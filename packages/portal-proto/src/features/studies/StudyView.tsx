import Image from "next/image";

export const StudyView: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex-grow overflow-y-auto">
        <Image
          src="/user-flow/studies-mock-up.png"
          layout="responsive"
          width="100%"
          height="100%"
        ></Image>
      </div>
    </div>
  );
};
