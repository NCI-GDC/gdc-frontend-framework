import type { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Link from 'next/link'

const ExamplesPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div>Prototypes:</div>
        <Link href="/apps">Apps</Link>
        <Link href="/facets">Facets</Link>
      </div>
    </SimpleLayout>
  );
};

export default ExamplesPage;
