import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import StyleGuideApp from "../features/styleguide/StyleGuideApp";

const StyleGuidePage: NextPage = () => {
  return (
    <SimpleLayout>
      <StyleGuideApp />
    </SimpleLayout>
  );
};

export default StyleGuidePage;
