export const UserFlowFewestPages: React.FC<unknown> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <header className="flex-none">
        <Header />
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
};

const Header: React.FC<unknown> = () => {
  return (
    <div className="p-4">
      <div className="flex flex-row divide-x divide-gray-300">
        <div className="px-2">Home</div>
        <div className="px-2">Exploration</div>
      </div>
    </div>
  );
};

const Footer: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col bg-gray-200 justify-center text-center p-4">
      <div>Site Home | Policies | Accessibility | FOIA | Support</div>
      <div>
        U.S. Department of Health and Human Services | National Institutes of
        Health | National Cancer Institute | USA.gov
      </div>
      <div>NIH... Turning Discovery Into Health ®</div>
    </div>
  );
};
