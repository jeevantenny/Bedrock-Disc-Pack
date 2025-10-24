import {
    world,
    Block,
    Player,
    GameMode,
    EntityEquippableComponent,
    EquipmentSlot,
    ItemStack,
    BlockPermutation
} from "@minecraft/server";


import { debug, debugMessage } from "./utils";

import {
    dummyDiscName,
    enchantedDiscName,
    enchantedDisc,
    DiscData,
    DiscIds,
    namespaceToId,
    chooseRandomInArray,
    getFoundDiscIds,
    clearFoundDiscs,
    getAvailableDiscIds
} from "./music_discs";




/**
 * A shortcut for getting the names of the states of jjj:jukebox
 */
const jbStates = {
    playingDisc: "jjj:playing_disc",
    discIdA: "jjj:disc_id_a",
    discIdB: "jjj:disc_id_b",
    playingEnchantedDisc: "jjj:playing_enchanted_disc"
}



/**
 * This class will be used to control behavior of the jukebox.
 * @blockTypeId jjj:jukebox
 */
export class JukeboxController {

    /**
     * Called when the block is interacted by a player.
     * @param {Block} block
     * @param {Player} player
     */
    static onInteract(block, player) {

        if (player.isSneaking) {
            return;
         }

        if (!this.isPlayingDisc(block)) {
            const playerMainhand = player.getComponent(EntityEquippableComponent.componentId).getEquipmentSlot(EquipmentSlot.Mainhand);
            if (playerMainhand === undefined) {
                return;
            }

            const heldItem = playerMainhand.getItem();
            if (heldItem === undefined) {
                return;
            }


            if (namespaceToId[heldItem.typeId] !== undefined || heldItem.typeId === enchantedDiscName) {
                const discInserted = this.insertDisc(block, heldItem.typeId);
                
                if (discInserted && player.getGameMode() !== GameMode.Creative) {
                    playerMainhand.setItem();
                    // Takes the item from the player if they are not in creative mode.
                }
            }
            else if (heldItem.typeId === dummyDiscName) {
                clearFoundDiscs();
                this.__actionBarMessage(block, "Cleared list of found discs", 'i', [player]);
                debugMessage(`Found discs: ${getFoundDiscIds()}`);
                debugMessage(`Available discs: ${getAvailableDiscIds("chest")}`);
            }
            else if (debug && heldItem.typeId === "minecraft:stick") {
                this.showDiscCollectAmount(block, player)
                debugMessage(`Found discs: ${getFoundDiscIds().length}`);
                debugMessage(`Available chest discs: ${getAvailableDiscIds("chest").length}`);
                debugMessage(`Available creeper discs: ${getAvailableDiscIds("creeper").length}`);
            }
            

            
        }

        else {
            const { itemId } = this.ejectDisc(block);

            if (world.gameRules.doTileDrops) {
                this.releaseDiscItem(block, itemId);
            }
        }

        if (debug && this.isPlayingDisc()) {
            const disc = this.getCurrentDisc()
            debugMessage(`Playing Disc: ${disc}`);
            if (disc) {
                debugMessage(`Song Id: ${disc.songId}`);
            }
        }

        return;
    }



    /**
     * Called when the block is destroyed.
     * @param {Block} block
     * @param {BlockPermutation} destroyPermutation
     */
    static onBreak(block, destroyPermutation) {
        if (destroyPermutation.getState(jbStates.playingDisc)) {
            const disc = this.ejectDiscWhenBroken(block, destroyPermutation);

            if (world.gameRules.doTileDrops && disc) {
                this.releaseDiscItem(block, disc.itemId);
            }
        }
    }



    /**
     * Called when the block ticks.
     * @param {Block} block 
     */
    static onTick(block) {

    }



    /**
     * Inserts a music disc into the jukebox and plays it.
     * 
     * Returns wether the disc inserted successfully.
     * @param {Block} block 
     * @param {string} discName
     * @param {Player} player
     * @returns {bool}
     */
    static insertDisc(block, discName) {
        let discId
        if (discName === enchantedDiscName) {
            const foundDiscs = getFoundDiscIds()
            if (foundDiscs.length !== 0) {
                discId = chooseRandomInArray(foundDiscs);
            }
            else {
                this.__actionBarMessage(block, "You have not found any discs yet", 'i')
                return false;
            }
        }
        else {
            discId = namespaceToId[discName];
        }

        if (discId !== undefined) {

            this.__setDiscId(block, discId);
            this.__setPlaying(block, true);
            
            if (discName === enchantedDiscName) {
                this.__setEnchantedDisc(block, true);
            }

            const { songId } = DiscIds[discId];
            this.__stopSong(block, songId);
            try {
                this.__playSong(block, songId);
            }
            catch {
                return true;
            }

            const disc = DiscIds[discId];
            let playerMessage = `Now Playing: §${disc.displayColorCode}${disc.artist} - ${disc.songName}`;
            if (!disc.artist) {
                playerMessage = `Now Playing: §${disc.displayColorCode}${disc.songName}`;
            }
            
            this.__actionBarMessage(block, playerMessage, '7');
            return true;
        }
        
        else {
            return false;
        }

    }



    /**
     * Remove the current disc that is playing.
     * @param {Block} block
     * @return {DiscData | null} The id of the disc that has been ejected
     */
    static ejectDisc(block) {
        const disc = this.getCurrentDisc(block);
        if (disc !== null) {
            this.__setDiscId(block, 0);
            this.__setPlaying(block, false);
            this.__stopSong(block, disc.songId);
            if (this.__getEnchantedDisc(block)) {
                this.__setEnchantedDisc(block, false);
                return enchantedDisc;
            }
        }

        return disc;
    }



    /**
     * Remove the current disc that is playing when the jukebox is broken.
     * @param {Block} block
     * @param {BlockPermutation} destroyPermutation
     * @return {DiscData | null}
     */
    static ejectDiscWhenBroken(block, destroyPermutation) {
        if (destroyPermutation.getState(jbStates.playingDisc)) {
            const discId = destroyPermutation.getState(jbStates.discIdA) + destroyPermutation.getState(jbStates.discIdB)*16;
            const disc = DiscIds[discId];
            this.__stopSong(block, disc.songId);
            
            if (destroyPermutation.getState(jbStates.playingEnchantedDisc)) {
                return enchantedDisc;
            }
            else {
                return disc;
            }
        }
        else {
            return null;
        }
    }




    /**
     * Summons an item entity of the music disc at the jukebox.
     * @param {Block} block 
     * @param {String} discName 
     */
    static releaseDiscItem(block, discName) {
        const { dimension, } = block;
        const discItemStack = new ItemStack(discName, 1);

        dimension.spawnItem(discItemStack, block.center());
    }



    /**
     * Returns the name id of the current disc playing.
     * Returns 
     * @param {Block} block
     * @returns {DiscData | null}
     */
    static getCurrentDisc(block) {
        if (!this.isPlayingDisc(block)) {
            return null;
        }

        const discId = this.__getDiscId(block);

        if (discId !== 0) {
            return DiscIds[discId];
        }
        else {
            return null;
        }
    }



    /**
    * Returns whether the jukebox is currently playing a music disc.
     * @param {Block} block
     * @returns {boolean}
     */
    static isPlayingDisc(block) {
        return block.permutation.getState(jbStates.playingDisc);
    }

    

    /**
     * Shows the number of found music discs to the player.
     * 
     * This method was made by AI.
     * @param {Block} block
     * @param {Player} player
     */
    static showDiscCollectAmount(block, player) {
        const totalCount = getFoundDiscIds().length;
        const collectedCount = Object.keys(DiscIds).length;
        let displayColor;
        if (collectedCount === totalCount) {
            displayColor = '6';
        }
        else {
            displayColor = 'i';
        }

        this.__actionBarMessage(block, `${totalCount}/${collectedCount} Music Discs Collected`, displayColor, [player]);
    }











    /**
     * Returns a list of player objects that are within a certain range of the jukebox.
     * @param {Block} block
     * @param {Number} range 
     * @returns {Player[]}
     */
    static __getPlayersInRange(block, range) {
        return block.dimension.getEntities(
            { location: block.center(), maxDistance: range, type: "minecraft:player" }
        );
    }





    /**
     * Plays the song for a music disc.
     * @param {Block} block 
     * @param {String} songId 
     */
    static __playSong(block, songId) {
        block.dimension.playSound(songId, block.center(), { volume: 6 });
    }



    /**
     * Stops the song that is currently playing.
     * @param {Block} block 
     * @param {String} songId
     */
    static __stopSong(block, songId) {
        for (const player of this.__getPlayersInRange(block, 128)) {
            if (player.isValid) {
                player.runCommand(`stopsound @s ${songId}`);
            }
        }
    }



    /**
     * Gets the disc id of the current disc that is in the Jukebox. Returns 0 if
     * there is no disc.
     * @param {Block} block
     * @returns {number}
     */
    static __getDiscId(block) {
        return block.permutation.getState(jbStates.discIdA) + block.permutation.getState(jbStates.discIdB)*16;
        
    }



    /**
     * Sets the disc id of the Jukebox. This will relate to what disc the jukebox
     * is currently playing.
     * @param {Block} block
     * @param {Number | String} discId
     */
    static __setDiscId(block, discId) {
        block.setPermutation(block.permutation.withState(jbStates.discIdA, discId%16));
        block.setPermutation(block.permutation.withState(jbStates.discIdB, Math.floor(discId/16)));
    }



    
    /**
     * Sets a value for the jjj:playing_disc block state.
     * @param {Block} block 
     * @param {boolean} value 
     */
    static __setPlaying(block, value) {
        block.setPermutation(block.permutation.withState(jbStates.playingDisc, value));
    }


    /**
     * Sets the value for if the disc if playing an Enchanted Music Disc.
     * @param {Block} block 
     * @param {boolean} value 
     */
    static __setEnchantedDisc(block, value) {
        block.setPermutation(block.permutation.withState(jbStates.playingEnchantedDisc, value));
    }


    /**
     * Returns weather an Enchanted Music Disc is playing.
     * @param {Block} block 
     * @returns {bool}
     */
    static __getEnchantedDisc(block) {
        return block.permutation.getState(jbStates.playingEnchantedDisc);
    }



    /**
     * Sets an action bar message to all players in range or a specific list of players.
     * @param {String} message 
     * @param {String} color 
     * @param {Player[] | null} player 
     */
    static __actionBarMessage(block, message, color='d', players=null) {
        let _players;
        if (players === null) {
            _players = this.__getPlayersInRange(block, 64);
        }
        else {
            _players = players;
        }

        for (const player of _players) {
            player.onScreenDisplay.setActionBar(`§${color}${message}`);
        }
    }
}