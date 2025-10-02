import { world, ItemStack, BlockInventoryComponent, system } from "@minecraft/server";

import { dummyDiscName, enchantedDiscName, chooseDiscForLoot, setDiscAsFound, namespaceToId, getFoundDiscIds, DiscIds } from "../music_discs";
import { debugMessage } from "../utils";





/**
 * Replaces any dummy discs in inventory with a random disc from
 * the chest loot pool (if inventory is defined).
 * 
 * Sets any music discs in the inventory of and the ones newly added as found.
 * @param {BlockInventoryComponent} inventory 
 */
function scanInventory(inventory) {
    if (inventory === undefined || inventory.container === undefined) {
        return;
    }


    const { container } = inventory;
    let used_enchanted_disc = false;

    let item;
    for (let slot_index = 0; slot_index < container.size; slot_index++) {
        item = container.getItem(slot_index);

        if (item !== undefined) {
            let itemName;
            if (item.typeId === dummyDiscName) {
                if (!used_enchanted_disc && Math.random() < 0.01) {
                    itemName = enchantedDiscName;
                    used_enchanted_disc = true;
                }
                else {
                    itemName = chooseDiscForLoot("chest");
                }

                container.setItem(slot_index, new ItemStack(itemName, 1));
            }
            else {
                itemName = item.typeId
            }
            
            if (namespaceToId[itemName] !== undefined) {
                setDiscAsFound(itemName);
            }
        }

    }
}



// Replaces dummy disc item in chest or barrel with random disc loot.
world.afterEvents.playerInteractWithBlock.subscribe((data) => {
    const { block } = data;

    if (block.typeId === "minecraft:chest" || block.typeId === "minecraft:barrel") {
        scanInventory(block.getComponent("minecraft:inventory"));
    }
})



// Replaces dummy disc item in chest minecart with random disc loot.
world.afterEvents.playerInteractWithEntity.subscribe((data) => {
    const targetEntity = data.target;

    if (targetEntity.typeId === "minecraft:chest_minecart") {
        scanInventory(targetEntity.getComponent("minecraft:inventory"));
    }
})







const skeletonTypes = [
    "minecraft:skeleton",
    "minecraft:stray",
    "minecraft:bogged"
]


// Summons disc items entity using random disc loot when a creeper is killed by skeleton.
world.afterEvents.entityDie.subscribe((data) => {
    const { deadEntity, damageSource } = data;

    if (world.gameRules.doMobLoot && deadEntity.typeId === "minecraft:creeper") {
        const { damagingEntity, damagingProjectile } = damageSource;
        if (damagingEntity !== undefined && skeletonTypes.includes(damagingEntity.typeId) && damagingProjectile !== undefined) {
            
            const discCount = 1+(Math.random() < 0.05);
            for (let i=0; i<discCount; i++) {
                const discName = chooseDiscForLoot("creeper");
                const discItemStack = new ItemStack(discName, 1);
                deadEntity.dimension.spawnItem(discItemStack, deadEntity.location);
                setDiscAsFound(discName);
            }
        }
    }
})



const endDiscId = 105

// Drops 'Alpha' disc when Ender Dragon is Killed.
world.afterEvents.entityDie.subscribe((data) => {
    const { deadEntity } = data;

    if (deadEntity.typeId === "minecraft:ender_dragon" && !getFoundDiscIds().includes(endDiscId)) { // && !getFoundDiscIds().includes(endDiscId.toString())) {
        const discName = DiscIds[endDiscId].itemId;
        const discItemStack = new ItemStack(discName, 1);
        const { dimension } = deadEntity
        debugMessage(deadEntity.dimension.id);
        
        let itemLocation;
        if (dimension.id === "minecraft:the_end") {
            const y_coord = dimension.getTopmostBlock({'x': 0, 'z': 0}).location.y + 5;
            debugMessage(y_coord);
            itemLocation = {'x': 0.5, 'y': y_coord, 'z': 0.5};
            
        }
        else {
            itemLocation = deadEntity.location;
        }

        system.runTimeout(() => {
            const itemEntity = dimension.spawnItem(discItemStack, itemLocation);
            setDiscAsFound(discName);
            itemEntity.clearVelocity();
            dimension.spawnParticle("jjj:disc_appear_particle", itemLocation);
            dimension.playSound("fall.amethyst_cluster", itemLocation, { volume: 6 })
        }, 230)
    }
})