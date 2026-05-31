import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  INITIAL_DISEASES,
  INITIAL_VACCINES,
  INITIAL_OUTBREAKS,
  INITIAL_SOURCES,
  INITIAL_NEWS,
} from "../src/initialData";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "seed_data.json");
fs.writeFileSync(
  out,
  JSON.stringify(
    {
      diseases: INITIAL_DISEASES,
      vaccines: INITIAL_VACCINES,
      outbreaks: INITIAL_OUTBREAKS,
      sources: INITIAL_SOURCES,
      news: INITIAL_NEWS,
    },
    null,
    2
  )
);
console.log(`Wrote ${out}`);
