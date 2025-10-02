import { debugMessage } from "./utils";
import "./custom_components";

import "./runtime_events/index";





world.afterEvents.worldLoad.subscribe((data) => {
    debugMessage("All scripts successfully loaded!");
})