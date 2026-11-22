# Bone Knight

An original browser fantasy game starring **Yips**, a little skeleton in an oversized helmet with a small longsword. Chapter One, **The Pinewood Witch**, begins at a notice board in Bramblewick's tavern.

## Play

[Open Bone Knight](https://vorontzov.github.io/Bone-Knight/)

Run `npm start`, then open **http://127.0.0.1:4173** in your browser. No installation or build step is needed. Node.js 20 or later is required for the local server. The `dist` folder can also be placed on any static web host.

The home screen has actual tavern screenshots. Choose **Start game** to open the separate Chapters page, then choose **Chapter One**. Saved progress is continued automatically. To return to the home screen while playing, press **Esc**, then **Save & title screen**.

| Control | Action |
| --- | --- |
| WASD / arrow keys | Walk or dodge |
| E / Enter | Talk, inspect, open doors, advance dialogue, or attack on your turn |
| H | Hop into or climb out of the town fountain |
| I | Open or close Yips’s pack |
| M | Open or close the area map |
| Esc | Pause / close map |
| Shift | Precise movement in battle |

Every on-screen action control can be clicked, including interaction prompts, the sword attack, dialogue choices, map travel, and pause. Combat uses an ivory bone avatar with pixel trails, sword slashes, impact sparks, and expanding potion fire.

Touch controls are available on devices with coarse pointers; landscape orientation gives the best view.

## Chapter One

- Eight connected areas, including the new Moss & Mallow herbalist and Button & Thread tailor interiors.
- Four cottages and six businesses around a freely explorable square, surrounded by a moat with a bridge.
- Press **H** beside the fountain to meet a hooded stranger and receive a burger. Tell Bram about it at the tavern. The gift can only be collected once.
- Buy food from Bram, remedies from Mallow, and wearable scarves from Tilda. Start with 18 coins and collect 4 more from each defeated wolf. Food heals between battles; scarves change Yips’s appearance. Open the pack with **I**.
- A winding forest journey with eight wolves, rest lanterns, signs, side clearings, original dialogue, and environmental details. Designed for roughly 15–20 minutes on a first playthrough; individual times vary.
- Yips has **25 HP** and deals **3 damage** per sword strike. Wolves have **15 HP** and make four telegraphed scratch attempts before each attack opening. The witch has **30 HP**; each potion warns for **five seconds** and deals **5 damage** if it catches you.
- Each speaking character has its own synthesized voice. There are no external art, font, sound, or runtime dependencies.
- Maps share the exact geometry used for movement and collisions. Fast travel stays locked through the quest, opens after the witch, and remains available in free play.
- Return to Bram for **one emerald**. Completing the chapter unlocks free play. The quest and reward cannot be repeated on the same save.

Progress is stored locally in this browser, not in an online account. Clearing browser storage or using another browser starts a separate save. Rest lanterns restore health, and defeat offers a full-health retry of the encounter.

## Development and checks

`npm test` runs combat, progression, persistence, collision, and route-reachability tests. `npm run check` checks JavaScript syntax. The production files are in `dist/`; `test/preview-fixtures.mjs` is an isolated local UI test server, never included in the static site.

The world, pixel illustrations, bitmap lettering, characters, and writing are original to this project. Its dodge-box battle format was inspired by [Undertale](https://undertale.com/about/); no Undertale assets or code are included.
