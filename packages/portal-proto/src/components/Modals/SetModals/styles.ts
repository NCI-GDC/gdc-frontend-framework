import tw from "tailwind-styled-components";

export const modalStyles = {
  root: "z-[400]",
  modal: "p-0",
  title:
    "mt-4 ml-4 uppercase text-primary-darkest text-xl font-medium font-heading",
  close: "mt-4 mr-6 bg-base-lightest text-primary-darkest",
};

export const tabStyles = {
  tab: "text-base-content-lighter font-heading data-[active]:font-bold data-[active]:border-4 data-[active]:border-primary-darkest data-[active]:text-base-content-darkest",
  tabsList: "border-b-1",
  tabLabel: "flex items-center",
};

export const ButtonContainer = tw.div`bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky`;
