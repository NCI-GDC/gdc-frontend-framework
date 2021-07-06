import { createGdcApp } from "@gff/core";

const Demo = () => (
  <div>
    Demo App 2
  </div>
);

export default createGdcApp({
  App: Demo,
  name: "Demonstration Application 2",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
});
