import { clickRefUntilRefFound, ensureStateChange } from "./execution";
import { pncRefs } from "../reference";

async function transitionNeuralSearch() {
  await ensureStateChange(pncRefs.get("00_transitions/open_navmenu")!);
  await ensureStateChange(pncRefs.get("00_transitions/neural_search")!);
}

async function pnc() {
  await clickRefUntilRefFound(
    pncRefs.get("04_basic_search/neural_search_next_banner")!,
    pncRefs.get("04_basic_search/basic_search")!
  );

  await ensureStateChange(pncRefs.get("04_basic_search/basic_search_10")!);
}

pnc();

// More execution type functions needed
// Click until image found exists - Navigating Neural Search Tabs
// Click and drag - Factory Production
