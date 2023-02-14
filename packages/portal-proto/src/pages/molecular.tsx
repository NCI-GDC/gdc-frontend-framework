import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const MolecularPage: NextPage = () => {
  return (
    <UserFlowVariedPages headerElements={[]}>
      <div className="flex flex-col gap-y-4 p-4">
        <div>
          This page demonstrates the cohort builder re-organization suggested
          during the July 27, 2021 tech meeting.
          <p />
        </div>
        <div>
          <Tabs>
            <TabList>
              <Tab>Clinical</Tab>
              <Tab>Biospecimen</Tab>
              <Tab>Molecular</Tab>
            </TabList>

            <TabPanel>[insert clinical facets here]</TabPanel>
            <TabPanel>[insert biospecimen facets here]</TabPanel>
            <TabPanel>
              <Tabs>
                <TabList>
                  <Tab>Downloadable</Tab>
                  <Tab>Visualizable</Tab>
                </TabList>

                <TabPanel>[insert file facets here]</TabPanel>
                <TabPanel>
                  <Tabs>
                    <TabList>
                      <Tab>Mutations</Tab>
                      <Tab>Copy Number</Tab>
                      <Tab>Expression</Tab>
                    </TabList>

                    <TabPanel>
                      <Tabs>
                        <TabList>
                          <Tab>Genes</Tab>
                          <Tab>Mutations</Tab>
                        </TabList>

                        <TabPanel>[insert gene filters here]</TabPanel>
                        <TabPanel>[insert mutations filters here]</TabPanel>
                      </Tabs>
                    </TabPanel>
                    <TabPanel>[insert copy number filters here]</TabPanel>
                    <TabPanel>[insert expression filters here]</TabPanel>
                  </Tabs>
                </TabPanel>
              </Tabs>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default MolecularPage;
