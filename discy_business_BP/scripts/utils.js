import { world } from "@minecraft/server";


export const debug = false;

/**
 * Outputs a message to the chat for all players when in debug mode.
 * @param {*} message 
 */
export function debugMessage(message) {
    if (debug) {
        world.sendMessage(`§b${message}`);
    }
}