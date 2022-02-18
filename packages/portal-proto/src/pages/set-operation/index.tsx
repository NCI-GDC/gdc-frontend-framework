import { useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { MdSave as SaveIcon, MdDownload as DownloadIcon } from "react-icons/md";
import { pickBy } from 'lodash';
import { SimpleLayout } from "../../features/layout/Simple";
const VennDiagram = dynamic(() => import("../../features/charts/VennDiagram"), { ssr: false });
import demoData from "./demo_data.json";

const setOperationsConfig = [
  { label: "( S1 ∩ S2 ∩ S3 )", key: "S1_intersect_S2_intersect_S3", tableOrder: 0, chartOrder: 6 },
  { label: "( S1 ∩ S2 ) - ( S3 )", key: "S1_intersect_S2_minus_S3", tableOrder: 1, chartOrder: 3 },
  { label: "( S2 ∩ S3 ) - ( S1 )", key: "S2_intersect_S3_minus_S1", tableOrder: 2, chartOrder: 5 },
  { label: "( S1 ∩ S3 ) - ( S2 )", key: "S1_intersect_S3_minus_S2", tableOrder: 3, chartOrder: 4 },
  { label: "( S1 ) - ( S2 ∪ S3 )", key: "S1_minus_S2_union_S3", tableOrder: 4, chartOrder: 0 },
  { label: "( S2 ) - ( S1 ∪ S3 )", key: "S2_minus_S1_union_S3", tableOrder: 5, chartOrder: 1 },
  { label: "( S3 ) - ( S1 ∪ S2 )", key: "S3_minus_S1_union_S2", tableOrder: 6, chartOrder: 2 },
];

const IndexPage: NextPage = () => {
  const [selectedSets, setSelectedSets] = useState(Object.fromEntries(setOperationsConfig.map(set => ([set.key, false]))));

  const tableData = setOperationsConfig.sort((a, b) => a.tableOrder - b.tableOrder).map(set => ({
    ...set,
    value: demoData.set_operations.find(entry => Object.keys(entry)[0] === set.key)[set.key].data?.viewer?.explore?.ssms?.hits?.total,
  }));

  const chartData = setOperationsConfig.sort((a, b) => a.chartOrder - b.chartOrder).map((set, idx) => ({
    key: set.key,
    value: demoData.set_operations.find(entry => Object.keys(entry)[0] === set.key)[set.key].data?.viewer?.explore?.ssms?.hits?.total,
    highlighted: selectedSets[set.key], 
  }));

  const totalSelectedSets = () => {
    const selectedRows = Object.keys(pickBy(selectedSets, v => v));
    if (selectedRows.length === 0 ) {
      return 0;
    }
    else {
      return selectedRows.map(key => tableData.find(entry => entry.key === key).value).reduce((a, b) => a + b);
    }
  };

  const onClickHandler = (clickedRegion : string) => {
    console.log(clickedRegion);
    setSelectedSets({...selectedSets, [clickedRegion]: !selectedSets[clickedRegion]});
  };

  return (
    <SimpleLayout>
      <div className="flex flex-col">
        <div>
          <h1 className="text-2xl">Set Operations</h1>
          <p>Demo showing high impact mutations overlap in Bladder between Mutect, Varscan and Muse pipelines.</p>
        </div>
        <div className="flex flex-row pt-2">
          <VennDiagram
            labels={["S<sub>1</sub>", "S<sub>2</sub>", "S<sub>3</sub>"]}
            chartData={chartData}
            onClickHandler={onClickHandler}
          />
          <div className="w-full ml-2">
            <table className="bg-white w-full text-left text-nci-gray-darker">
              <thead>
                <tr className="bg-nci-gray-lightest">
                  <th>Alias</th>
                  <th>Item Type</th>
                  <th>Name</th>
                  <th># Items</th>
                </tr>
              </thead>
              <tbody>
                {demoData.summary.map((item, idx) => (
                  <tr key={item.alias} className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}>
                    <td>{item?.alias}</td>
                    <td>{item?.type}</td>
                    <td>{item?.names.join(", ")}</td>
                    <td>{item?.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="bg-white w-full text-left text-nci-gray-darker mt-8">
              <thead>
                <tr className="bg-nci-gray-lightest">
                  <th>Select</th>
                  <th>Set Operation</th>
                  <th># Items</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, idx) => (
                  <tr key={item.key} className={selectedSets[item.key] ? "bg-gdc-yellow-lightest" : (idx % 2 ? null : "bg-gdc-blue-warm-lightest")}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSets[item.key]}
                        onChange={e => setSelectedSets({...selectedSets, [e.target.value]: !selectedSets[e.target.value] })}
                        value={item.key}/>
                    </td>
                    <td>
                      {item.label}
                    </td>
                    <td>
                      {item.value}
                    </td>
                    <td className="flex">
                      <SaveIcon /><DownloadIcon />  
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-b border-black border-solid">
                  <td className="font-bold">Union of selected sets:</td>
                  <td>{totalSelectedSets()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default IndexPage;
