import React, { useState } from "react";
import { MantineProvider } from "@mantine/core";
import AnalysisCard from "./AnalysisCard";
import CoreToolCard from "./CoreToolCard";
import { AppRegistrationEntry } from "./types";

interface AnalysisGridProps {
  readonly registeredApps: AppRegistrationEntry[];
  readonly recommendedApps: string[];
  readonly CountHookRegistry: any;
}

const AnalysisGrid: React.FC<AnalysisGridProps> = ({
  registeredApps,
  recommendedApps,
  CountHookRegistry,
}: AnalysisGridProps) => {
  const initialApps = registeredApps.reduce<
    Record<string, AppRegistrationEntry>
  >((obj, item) => ((obj[item.id] = item), obj), {});
  const allOtherApps = Object.keys(initialApps).filter(
    (x) => !recommendedApps.includes(x),
  );

  const [activeApps] = useState([...allOtherApps]); // set of active apps i.e. not recommended but filterable/dimmable
  const [activeAnalysisCard, setActiveAnalysisCard] = useState<number | null>(
    null,
  );
  const registry = CountHookRegistry.getInstance();

  return (
    <MantineProvider>
      <div className="flex flex-col font-heading mb-4">
        <div data-tour="analysis_tool_management" className="flex items-center">
          <h1 className="sr-only">Tools</h1>
          <div data-tour="most_common_tools" className="m-4">
            <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
              Core Tools
            </h2>
            <div className="flex gap-4 lg:gap-6 flex-wrap">
              {recommendedApps
                .map((k) => initialApps[k])
                .map((x: AppRegistrationEntry) => {
                  return (
                    <div
                      key={x.name}
                      className="basis-tools-sm md:basis-tools-md lg:basis-coretools"
                      data-testid={`button-core-tools-${x.name}`}
                    >
                      <CoreToolCard entry={{ ...{ applicable: true, ...x } }} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="m-4">
          <h2 className="text-primary-content-darkest font-bold uppercase text-xl mb-2">
            Analysis Tools
          </h2>

          <div className="flex gap-4 lg:gap-6 flex-wrap">
            {activeApps
              .map((k) => initialApps[k])
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              )
              .map((x: AppRegistrationEntry, idx: number) => {
                const countHook = registry.getHook(x.countsField);
                return (
                  <div
                    key={x.name}
                    className="min-w-0 basis-tools-sm md:basis-tools-md lg:basis-tools"
                  >
                    <AnalysisCard
                      entry={{ ...{ applicable: true, ...x } }}
                      descriptionVisible={activeAnalysisCard === idx}
                      setDescriptionVisible={() =>
                        setActiveAnalysisCard(
                          idx === activeAnalysisCard ? null : idx,
                        )
                      }
                      useApplicationDataCounts={countHook}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};

export default AnalysisGrid;
