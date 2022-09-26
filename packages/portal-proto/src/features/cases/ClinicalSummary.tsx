import { Button, Menu, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { MdOutlineFileDownload as DownloadIcon } from "react-icons/md";

export const ClinicalSummary = () => {
  const [activeTab, setActiveTab] = useState<string | null>("demographic");
  return (
    <div className="flex flex-col gap-2 mt-5">
      <div className="flex justify-between">
        <Text size="xl" weight={500}>
          Clinical
        </Text>
        <Menu width="target">
          <Menu.Target>
            <Button className="px-1.5 min-h-7 w-28 border-base-lightest border rounded text-primary-content-lightest bg-primary hover:bg-primary-darker">
              <DownloadIcon size="1.25em" />
              Download
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<DownloadIcon size="1.25em" />}>TSV</Menu.Item>
            <Menu.Item icon={<DownloadIcon size="1.25em" />}>JSON</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div>
        <Tabs
          color="gray"
          variant="pills"
          defaultValue="gallery"
          value={activeTab}
          onTabChange={setActiveTab}
          keepMounted={false}
        >
          <Tabs.List>
            <Tabs.Tab value="demographic" aria-label="Demographic">
              Demographic
            </Tabs.Tab>
            <Tabs.Tab value="diagnoses" aria-label="Diagnoses and Treatments`">
              Diagnoses (1) &gt; Treatments (5)
            </Tabs.Tab>
            <Tabs.Tab value="family" aria-label="Family Histories">
              Family Histories
            </Tabs.Tab>
            <Tabs.Tab value="exposures" aria-label="Exposures">
              Exposures
            </Tabs.Tab>
            <Tabs.Tab value="followups" aria-label="Follow Ups">
              Follow-Ups (3) &gt; Molecular Tests (21)
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="demographic" pt="xs">
            Gallery tab content
          </Tabs.Panel>

          <Tabs.Panel value="diagnoses" pt="xs">
            Messages tab content
          </Tabs.Panel>

          <Tabs.Panel value="family" pt="xs">
            Settings tab content
          </Tabs.Panel>

          <Tabs.Panel value="exposures" pt="xs">
            Settings tab content
          </Tabs.Panel>

          <Tabs.Panel value="followups" pt="xs">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};
