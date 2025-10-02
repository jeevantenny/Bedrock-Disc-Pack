import { system } from "@minecraft/server";

import { JukeboxController } from "./jukebox_controller";


system.beforeEvents.startup.subscribe((data) => {
    data.blockComponentRegistry.registerCustomComponent(
        "jjj:jukebox",
        {
            onPlayerInteract: (interactData) => {
                JukeboxController.onInteract(interactData.block, interactData.player);
            },
            onPlayerBreak: (breakData) => {
                JukeboxController.onBreak(breakData.block, breakData.brokenBlockPermutation);
            },
            onTick: (tickData) => {
                JukeboxController.onTick(tickData.block);
            }
        }
    )
})