// The Datadog inject tool fails on the Turbopack runtime chunks. Those
// chunks are bundler internals, not app code, so drop their sourcemap
// references to make injection skip them and exit cleanly.
import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".next", "static", "chunks");

for (const f of readdirSync(dir)) {
  if (!f.startsWith("turbopack-") || !f.endsWith(".js")) continue;
  const path = join(dir, f);
  const src = readFileSync(path, "utf8");
  const ref = src.match(/sourceMappingURL=(\S+)/)?.[1];
  writeFileSync(path, src.replace(/\n*\/\/# sourceMappingURL=\S+/, ""));
  if (ref?.endsWith(".js.map") && existsSync(join(dir, ref))) {
    unlinkSync(join(dir, ref));
  }
}
