import { world, GameMode, Player } from "@minecraft/server";





const wardenBossMusic = "record.dark_souls_warden"

// Warden Boss Music
world.afterEvents.entitySpawn.subscribe((data) => {
    const { entity } = data;

    if (entity.typeId === "minecraft:warden") {
        entity.dimension.playSound(wardenBossMusic, entity.location, { volume: 10 });
        for (const player of entity.dimension.getPlayers()) {
            player.runCommand("camerashake add @s 0.2 7.0");
        }
    }
})


world.afterEvents.entityDie.subscribe((data) => {
    const { deadEntity } = data;

    if (deadEntity.typeId === "minecraft:warden") {
        deadEntity.dimension.runCommand(`stopsound @a "${wardenBossMusic}"`)
    }
})











// Pigman Boss Music

const pigmanBossMusic = "record.coconut_mall_pigman"
let coconutMalledPlayers = []




world.afterEvents.entityHurt.subscribe((data) => {
    const { hurtEntity, damageSource } = data;

    if (
        hurtEntity.typeId === "minecraft:zombie_pigman"
        && damageSource.damagingEntity !== undefined
        && damageSource.damagingEntity.typeId === "minecraft:player"
    ) {
        /**
         * @type {Player}
         */
        const player = damageSource.damagingEntity;
        const dimension = player.dimension;

        if (
            player.getGameMode() !== GameMode.Creative
            && !coconutMalledPlayers.includes(player)
            && dimension.getEntities({location: hurtEntity.location, maxDistance: 20, type: "minecraft:zombie_pigman"}).length > 8
        ) {
            player.runCommand(`playsound "${pigmanBossMusic}" @s`);
            coconutMalledPlayers.push(player);
        }
    }
})




/**
 * Stops playing pigman boss music to player if it is
 * already playing for them.
 * @param {Player} player 
 */
function stopPigmanBossMusic(player) {
    if (coconutMalledPlayers.includes(player)) {
        player.runCommand(`stopsound @s "${pigmanBossMusic}"`);
        const index = coconutMalledPlayers.indexOf(player);
        coconutMalledPlayers.splice(index, 1);
    }

}




world.afterEvents.entityDie.subscribe((data) => {
    stopPigmanBossMusic(data.deadEntity);
})



world.afterEvents.playerDimensionChange.subscribe((data) => {
    stopPigmanBossMusic(data.player)
})