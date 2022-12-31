import { ensureStateChange } from "./execution";
import { pncRefs } from "../reference";

async function pnc() {
  await ensureStateChange(pncRefs.get("00_transitions/open_navmenu")!);
  await ensureStateChange(pncRefs.get("00_transitions/neural_search")!);
}

pnc();
