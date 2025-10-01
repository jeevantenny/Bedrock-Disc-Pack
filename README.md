# JJJ Disc Pack

**For Minecraft Bedrock Edition version 1.21.100 and later**  
***Pack Version 1.1.2***

This addon adds a few vanilla music by C418 as music discs. This pack can be used as a template to add more music discs to the game. This pack was inspired by the Edd's More Music Discs addon but no code was directly copied over (it was used as a base on how to structure my own code.)

Disclaimer: I haven't got the chance to test out this version of the pack yet.




## Content Added
### Blocks
- New jukebox block that can play vanilla and custom discs.

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



## Adding new discs
1. Add disc texture in directory ['disc_business_RP/textures/items/jjj_custom_discs'](./discy_business_RP/textures/items/jjj_custom_discs/info.md). Preferably 16x16 but other sizes can work.
2. Add OGG Verbose audio file to ['disc_business_RP/sounds/music/game/records'](./discy_business_RP/sounds//music/game/records/info.md).
3. In the root folder find and run 'add_new_disc.py'.
4. Follow command line instructions.

After confirming new disc addition, and everything has been done correctly, the music disc should be ready to use in the pack (or at least that's the intension).




## Added Vanilla Music Discs
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Mice on Venus  
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Sweden  
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_alpha.png)
C418 - Wet Hands  
![](./discy_business_RP/textures/items/jjj_custom_discs/alpha.png)
C418 - Alpha  
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - Aria Math  
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - Dead Voxels  
![](./discy_business_RP/textures/items/jjj_custom_discs/volume_beta.png)
C418 - The End




## Added Custom Music Discs