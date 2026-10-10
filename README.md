# The Seventh Ember

The Seventh Ember is a modular browser roguelike with a fifty-floor campaign, permanent progression, Guardian encounters, and an Endless mode. Its interface uses one ember-gold visual system with distinct regional accents across the descent. The current progression epoch rejects older backups whose balance data is no longer compatible.

## Project map

- `index.html` contains the accessible page and interface structure.
- `styles/` separates the foundation, HUD, overlays, menus, and campaign presentation.
- `src/core/` owns startup, shared state, input wiring, saves, audio foundations, and the final boot call.
- `src/game/` owns run flow, the campaign finale, Endless Mode, and Guardian modes.
- `src/world/` owns dungeon generation, regional hazards, Resting Flames, and special room encounters.
- `src/render/` owns sprites, environment art, the Ember, and the world interface.
- `src/chapters/`, `src/enemies/`, and `src/bosses/` contain encounter-specific behavior.
- `src/progression/` contains blessings, rarity, forms, and the permanent skill tree.
- `src/story/` contains the Living Archive state, the dialogue collection, and fifty silent memories.
- `assets/music/` contains twenty-eight recorded pieces, with longer arrangements and continuous loop boundaries. Regional alternates, memories, Guardian encounters, and Endless use separate selections. Hosted playback uses looping audio buffers and keeps a small cache; local files use the browser media transport.
- `src/input/`, `src/combat/`, `src/audio/`, and `src/interface/` contain focused supporting systems.

`src/audio/recorded-score.js` is the music transport. `effects.js` and `scene-effects.js` handle sound effects and remembered-room cues. The public music directory contains only the current OGG loops and their metadata and credits; editing masters are kept outside the game.

Scripts load in dependency order at the bottom of `index.html`. Each directory owns a distinct part of the game while sharing the same browser runtime.

The Living Archive records actions and discoveries. Echo rooms remain enemy-free, restore their surroundings, and tell their stories through staged actions. Players can move inside a memory, watch it finish, leave early, or replay it from the Memories menu. Conversations with Wick and the Guardians are kept separately in `src/story/story-copy.js`.

The Achievements screen tracks 115 milestones across seven categories. Recorded progress receives credit when a save loads, and achievements are included in exported backups.

The Hearth contains room customization and optional Vow Bindings. Furnishings, Ember trails, and revolving shard finishes are freely selectable. Guardian trophies, binding seals, and campaign crowns reflect saved victories. Blessing combinations work independently of the Hearth and remain listed in the Build screen.

## Running the game

Open `index.html` in a modern browser or serve this directory with any static web server. GitHub Pages can host the directory directly.

## Source style

JavaScript, CSS, and HTML use the formatting settings in `.prettierrc.json`. Keep names descriptive, retain stored IDs when refactoring, and put shared behavior in the module that owns it. The formatter is a development tool; the game has no runtime dependency on it.

## Release direction

Keep editable source in a private repository before commercial release. A later build step can bundle and minify these files for the public web version and package the same build as a desktop application for Steam.

## Publishing a player update

Every published update must add one immutable entry to `src/core/changelog.js` with a version number higher than the previous entry. Players automatically see only entries newer than the newest one they have dismissed. Keep older entries unchanged so returning players never receive the same notes twice.
