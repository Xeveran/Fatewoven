# Fatewoven Gift Strategist

A fan-made, single-page gift planning app for **Fire Emblem: Fortune's Weave**. It runs entirely in the browser with no build tools, backend, API key, or third-party JavaScript required.

## How to use

1. In **Inventory**, enter how many of each gift you currently own. Counts accept whole numbers from 0 to 999.
2. In **Gift Plan**, drag characters into your preferred priority order. The first row is the highest priority. Uncheck anyone you do not want to plan for this week.
3. Use the four **Route priority presets** to sort the character list by the route's Renown requirement from lowest to highest, or drag/reorder the list manually. Automatic recruits sort first; characters without a route requirement listed in the reference sort last.
4. Review the **Weekly gift itinerary**. Use **Copy plan** or **Export CSV** to take the recommendation into the game.
5. Use **Export backup** to save your character order, selected characters, active route preset, and inventory as a JSON file. Use **Import backup** to restore it in this or another browser.

Your state is saved in `localStorage` in the current browser. It does not automatically sync across browsers or devices. Export a backup before clearing browser data.

## How the optimizer works

- Only gifts tagged **Loved** or **Really liked** in the bundled data are candidates. A Loved match is preferred to a Really liked match.
- It first calculates the maximum number of selected characters that can receive a preferred gift from the current inventory.
- It then walks the character priority order, choosing a Loved gift whenever a choice can preserve that maximum recipient count. If not, it considers Really liked gifts. When multiple gifts serve the same tier, it tends to save items useful to fewer remaining characters.
- Each character gets at most one gift in a plan, and each inventory unit is allocated at most once. The page assumes one gift per character for the planning period.

This is a priority-first optimization for *recipient count, then each character's tier in priority order*. It is not a claim about undisclosed in-game support point values beyond the Loved/Really liked tier ordering.

## Gift data notes

The preference data are an offline snapshot for convenient use, not live-scraped content. Direct retrieval of the original Game8 page was blocked during preparation, so the bundled snapshot combines a public Game8-derived export with a limited number of supplemental community reports. Supplemental rows are labelled in the in-app reference, and a few entries are explicitly noted as partial, generic, or uncertain. Some characters in the known roster are included in the reference without gift preferences because no reliable preference pair was available in the snapshot. Those characters are not selectable for optimization until data are added.

The current bundle contains 50 character preference records and 103 named inventory items. The item catalogue is assembled from distinct, named Loved/Really liked items in the bundled data plus five inventory-only names found in supplemental reports. Broad labels such as `Coffee` and `Ghosh` are not treated as inventory item names. A separate published reference reports 104 documented gift items, so this build should be treated as a useful working catalogue—not a verified exhaustive list. Inventory-only items without a preference mapping can be tracked but will not be recommended by the optimizer. Check the latest guides before relying on uncertain entries.

Sources:

- [Game8 — Fire Emblem: Fortune's Weave gift preferences](https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690)
- [Public Game8-derived character index](https://fire-emblem-fortunes-weave.turam.dev/)
- [RaiderKing — All Loved Gifts guide](https://raiderking.com/fire-emblem-fortunes-weave-all-loved-gifts-guide/)
- [LUM.GG — route-specific recruitment requirements](https://lum.gg/fire-emblem-fortunes-weave/recruitment), used for Renown priority presets. Automatic route recruits are represented as Renown 0; characters not listed on a route are sorted after those with a documented numeric requirement.

## Files

- `index.html` — page markup
- `styles.css` — dark navy, crimson, and gold fantasy-inspired theme
- `data.js` — bundled character gift preferences
- `app.js` — planner, allocation algorithm, persistence, import/export, drag-and-drop sorting, and route presets

This project is a fan-made companion and is not affiliated with Nintendo or Intelligent Systems. Game, character, and item names belong to their respective owners.
