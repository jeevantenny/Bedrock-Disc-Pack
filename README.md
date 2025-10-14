# Bedrock Music Disc Pack

**For Minecraft Bedrock Edition version 1.21.100 and later**  
***Pack Version 1.1.2***

This addon adds a few vanilla music by C418 as music discs. This pack can be used as a template to add more music discs to the game. This pack was inspired by the [Edd's More Music Discs addon](https://mcpedl.com/edds-more-music-discs/) but no code was directly copied over (it was used as a base on how to structure my own code.)

All Assets in the pack are original.

Disclaimer: I haven't got the chance to test out this version of the pack yet. Let me know if it breaks...




## Content Added
### Blocks
- New jukebox block that can play vanilla and custom discs (This replaces vanilla jukebox, looks exactly the same but has green text).

### Items
- Adds 7 vanilla music discs.
- Adds Enchanted Music Disc (plays a random disc that a player has discovered in the world).

### Loot tables
- Modified vanilla loot tables so that custom discs and vanilla discs can be found in more structures.
- There is a 1-3% chance for chests to have an Enchanted Music Disc.
- Creepers can drop a selection of the custom discs.
- Creepers have a 5% chance of dropping two music discs.
- Music disc drops on defeating the Ender Dragon for the first time (C418 - Alpha).

### Recipes
- Modified vanilla recipe for jukebox so that it crafts the new jukebox instead.
- Vanilla and new Jukebox can be converted between each other using a crafting grid.



## Adding new discs
<!-- The python script I used to add discs is a bit rudimentary but worked well for what I needed. I might make a better script do add discs in the future.

1. Add disc texture in directory ['disc_pack_RP/textures/items/jjj_custom_discs'](./disc_pack_RP/textures/items/jjj_custom_discs/). Preferably 16x16 but other sizes can work.
2. Add OGG Verbose audio file to ['disc_pack_RP/sounds/music/game/records'](./disc_pack_RP/sounds//music/game/records/).
3. In the root folder find and run 'add_new_disc.py'.
4. Follow command line instructions. -->

Find and run 'add_disc_gui.py' in the root directory. Provide a name and Author for the disc and upload the relevant files then click 'Add Music Disc'.

After confirming the new disc addition the music disc should be ready to use in the pack.




## Added Vanilla Music Discs
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Mice on Venus  
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Sweden  
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Wet Hands  
![](./disc_pack_RP/textures/items/jjj_custom_discs/alpha.png)
C418 - Alpha  
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - Aria Math  
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - Dead Voxels  
![](./disc_pack_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - The End




## Added Custom Music Discs