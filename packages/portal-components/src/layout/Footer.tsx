import React from "react";

export interface FooterProps {
  readonly text?: string;
}

const Footer: React.FC<FooterProps> = ({ text }: FooterProps) => {
  return (
    <footer className="flex flex-col bg-blue-500 justify-center text-center px-4 py-10 text-white text-sm">
      <div className="grid grid-cols-footer-small lg:grid-cols-footer-large lg:gap-6 mx-auto text-left w-full max-w-screen-lg gap-y-7 pb-5 border-b border-[#5D7A8D]">
        {text}
      </div>
    </footer>
  );
};

export default Footer;
