import { createGdcApp } from "@gff/core";

const Demo = () => <div>Demo App 1</div>;

export default createGdcApp({
  App: Demo,
  name: "Demonstration Application 1",
  version: "v1.0.0",
  requiredEntityTypes: ["case"],
});
