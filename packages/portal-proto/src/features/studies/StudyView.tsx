import { Image } from "@/components/Image";
export const StudyView: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex-grow overflow-y-auto">
        <Image
          src="/user-flow/studies-mock-up.png"
          layout="responsive"
          height="1064"
          width="1172"
        ></Image>
      </div>
    </div>
  );
};
