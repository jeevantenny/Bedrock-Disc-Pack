import { system, world, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

import { JukeboxController } from "../jukebox_controller";




// Makes sure the disc item drops if a jukebox is destroyed by an explosion while 
// playing a disc.
world.afterEvents.blockExplode.subscribe((data) => {
    const { block, explodedBlockPermutation } = data;

    if (explodedBlockPermutation.type.id === "jjj:jukebox") {
        JukeboxController.onBreak(block, explodedBlockPermutation);
    }
})




world.beforeEvents.playerInteractWithBlock.subscribe((data) => {
    const { block, player } = data;


    if (block.typeId === "jjj:jukebox" && player.isSneaking) {
        system.run(() => { JukeboxController.showDiscCollectAmount(block, player); })
    }
})