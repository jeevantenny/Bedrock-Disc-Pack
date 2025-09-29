import { world } from "@minecraft/server";
import { debugMessage } from "./utils";



/**
 * Stores the information regarding a music disc.
 */
export class DiscData {
    /**
     * @param {String} itemId 
     * @param {String} songId 
     * @param {String} songName 
     * @param {String | null} artist 
     * @param {string}
     */
    constructor(
        itemId, songId, songName = "Untitled", artist=null, displayColorCode="d", randomChestLoot=true, creeperLoot=true
    ) {
        this.itemId = itemId;
        this.songId = songId;
        this.songName = songName;
        this.artist = artist;
        this.displayColorCode = displayColorCode
        this.randomChestLoot = randomChestLoot;
        this.creeperLoot = creeperLoot;
    }
}





export const enchantedDiscName = "jjj:enchanted_music_disc";
export const dummyDiscName = "jjj:dummy_disc";

export const enchantedDisc = new DiscData(enchantedDiscName, "invalid");

const discLootLog = "disc_loot_log";


    







/**
 * List of all music discs and their information linked
 * with their disc id number.
 */
export const DiscIds = {
    1: new DiscData("minecraft:music_disc_cat", "record.cat", "Cat", "C418", "a"),
    2: new DiscData("minecraft:music_disc_blocks", "record.blocks", "Blocks", "C418", "v"),
    3: new DiscData("minecraft:music_disc_chirp", "record.chirp", "Chirp", "C418", "c", false),
    4: new DiscData("minecraft:music_disc_far", "record.far", "Far", "C418", "a", false),
    5: new DiscData("minecraft:music_disc_5", "record.5", "5", "C418", "8", false, false),
    6: new DiscData("minecraft:music_disc_mall", "record.mall", "Mall", "C418", "u", false),
    7: new DiscData("minecraft:music_disc_mellohi", "record.mellohi", "Mellohi", "C418", "d"),
    8: new DiscData("minecraft:music_disc_stal", "record.stal", "Stal", "C418", "8", false),
    9: new DiscData("minecraft:music_disc_strad", "record.strad", "Strad", "C418", "f", false),
    10: new DiscData("minecraft:music_disc_ward", "record.ward", "Ward", "C418", "2", false),
    11: new DiscData("minecraft:music_disc_11", "record.11", "11", "C418", "8", false),
    12: new DiscData("minecraft:music_disc_wait", "record.wait", "Wait", "C418", "s"),
    13: new DiscData("minecraft:music_disc_13", "record.13", "13", "C418", "e"),
    14: new DiscData("minecraft:music_disc_otherside", "record.otherside",  "Otherside", "Lena Raine", "s", true, false),
    15: new DiscData("minecraft:music_disc_pigstep", "record.pigstep", "Pigstep", "Lena Raine", "p", false, false),
    16: new DiscData("minecraft:music_disc_relic", "record.relic", "Relic", "Aaron Cherof", "3", false, false),
    17: new DiscData("minecraft:music_disc_creator", "record.creator", "Creator", "Lena Raine", "s", false, false),
    18: new DiscData("minecraft:music_disc_creator_music_box", "record.creator_music_box", "Creator (Music Box)", "Lena Raine", "n", false, false),
    19: new DiscData("minecraft:music_disc_precipice", "record.precipice", "Precipice", "Aaron Cherof", "3", false, false),
    20: new DiscData("minecraft:music_disc_tears", "record.tears", "Tears", "Amos Roddy", "f", false, false),
    21: new DiscData("minecraft:music_disc_lava_chicken", "record.lava_chicken", "Lava Chicken", "Hyper Potions", "4", false, false),

    22: new DiscData("jjj:custom_disc_alpha", "record.alpha", "Alpha", "C418", "g", false, false),
    23: new DiscData("jjj:custom_disc_aria_math", "record.aria_math", "Aria Math", "C418", "v", true, false),
    24: new DiscData("jjj:custom_disc_dead_voxels", "record.dead_voxels", "Dead Voxels", "C418", "v", true, false),
    25: new DiscData("jjj:custom_disc_mice_on_venus", "record.mice_on_venus", "Mice on Venus", "C418", "2", false),
    26: new DiscData("jjj:custom_disc_sweden", "record.sweden", "Sweden", "C418", "2", false),
    27: new DiscData("jjj:custom_disc_the_end", "record.the_end", "The End", "C418", "u", false, false),
    28: new DiscData("jjj:custom_disc_wet_hands", "record.wet_hands", "Wet Hands", "C418", "2", false)
}
                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                      


/**
 * Used to convert item namespaces to disc ids.
 */
export const namespaceToId = {}


/**
 * Contains all the disc Ids for each kind of disc loot.
 */
export const lootDiscIds = {
    "chest": [],
    "creeper": []
}


for (const discId in DiscIds) {
    const { itemId, creeperLoot, randomChestLoot } = DiscIds[discId];
    const discIdNum = Number(discId)
    namespaceToId[itemId] = discIdNum;
    if (randomChestLoot) {
        lootDiscIds.chest.push(discIdNum);
    }
    if (creeperLoot) {
        lootDiscIds.creeper.push(discIdNum);
    }
}








/**
 * Chooses random element from array.
 * @param {any[]} array 
 * @returns {any}
 */
export function chooseRandomInArray(array) {
    return array[Math.floor(Math.random()*array.length)]
}







/**
 * Returns the list of Ids of all music discs that are available
 * for loot.
 * @param {"chest" | "creeper"} lootType
 * @returns {Number[]}
 */
export function getAvailableDiscIds(lootType) {
    const foundDiscIds = getFoundDiscIds();
    const lootPool = lootDiscIds[lootType];
    

    return lootPool.filter(function(id) {
        return (!foundDiscIds.includes(id));
    })
}


/**
 * Chooses the name of a random available disc. If no discs are available then
 * all found discs are cleared and a new disc is chosen.
 * @param {"chest" | "creeper"} lootType
 * @returns {String}
 */
export function chooseDiscForLoot(lootType) {
    if (lootType !== "chest" && lootType !== "creeper"){
        throw `ValueError: Invalid loot type '${lootType}'`;
    }

    const availableDiscIds = getAvailableDiscIds(lootType);
    let discId;
    if (availableDiscIds.length === 0) {
        discId = chooseRandomInArray(lootDiscIds[lootType])
    }
    else {
        discId = chooseRandomInArray(availableDiscIds);
    }

    return DiscIds[discId].itemId;
}



/**
 * Returns the disc Ids of the music discs that have been found.
 * @returns {Number[]}
 */
export function getFoundDiscIds() {
    try {
        return Array.from(new Set(JSON.parse(world.getDynamicProperty(discLootLog))));
    }
    catch (e) {
        debugMessage(e);
        return [];
    }
}



/**
 * Marks a music disc as being found to avoid it appearing in loot
 * chests again if there are other discs that are yet to be found.
 * @param {String} discName 
 */
export function setDiscAsFound(discName) {
    const discId = namespaceToId[discName];
    if (discId !== undefined) {
        let foundDiscs = getFoundDiscIds();
        if (foundDiscs.includes(discId)) {
            return;
        }

        foundDiscs.push(discId);
        world.setDynamicProperty(discLootLog, `[${foundDiscs}]`); // TODO: remove .toString()
    }
    else {
        throw `NameError: Invalid discName '${discName}. Could not set being as found.'`
    }
}


/**
 * Clears all discs that have been found.
 */
export function clearFoundDiscs() {
    world.setDynamicProperty(discLootLog, "[]");
}