/* Fatewoven Gift Strategist - client-side planner, no dependencies. */
(() => {
  'use strict';

  const DATA = window.GIFT_DATA;
  if (!DATA || !Array.isArray(DATA.characters)) {
    document.body.innerHTML = '<main style="padding:2rem;color:#fff;font-family:sans-serif">Gift reference data could not be loaded. Ensure data.js is next to index.html.</main>';
    return;
  }

  const STORAGE_KEY = 'fatewoven-gift-strategist-v1';
  const characters = DATA.characters.map((c) => ({
    ...c,
    loved: Array.isArray(c.loved) ? [...new Set(c.loved)] : [],
    reallyLiked: Array.isArray(c.reallyLiked) ? [...new Set(c.reallyLiked)].filter((item) => !(Array.isArray(c.loved) && c.loved.includes(item))) : []
  }));
  const characterByName = new Map(characters.map((c) => [c.name, c]));
  const characterNames = characters.map((c) => c.name);
  const routeLabels = { cai: 'Cai', dietrich: 'Dietrich', theodora: 'Theodora', leda: 'Leda' };
  const routeRenown = DATA.routeRenown || {};
  const allReferenceCharacters = [
    ...characters,
    ...(DATA.charactersWithoutPreferences || []).map((name) => ({ name, loved: [], reallyLiked: [], source: 'No preference data in snapshot' }))
  ];
  // Some community reports use category labels instead of actual gift names.
  // Those labels remain visible in the reference card, but aren't inventory items.
  const categoryOnlyLabels = new Set(['Ghosh', 'Coffee']);
  const itemNames = [...new Set([...characters.flatMap((c) => [...c.loved, ...c.reallyLiked]), ...(Array.isArray(DATA.catalogExtras) ? DATA.catalogExtras : [])])]
    .filter((name) => !categoryOnlyLabels.has(name))
    .sort((a, b) => a.localeCompare(b));
  const itemSet = new Set(itemNames);
  const preferenceItems = (c) => [...new Set([...c.loved, ...c.reallyLiked])].filter((item) => itemSet.has(item));
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const initialOrder = [...characterNames].sort((a, b) => a.localeCompare(b));
  const initialState = {
    order: initialOrder,
    active: [...characterNames],
    inventory: Object.fromEntries(itemNames.map((name) => [name, 0])),
    routePreset: ''
  };
  let state = loadState();
  let currentPlan = [];
  let plannedCounts = {};
  let draggingName = null;
  let toastTimeout = null;
  let hideUnassignedRows = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredCloneSafe(initialState);
      const parsed = JSON.parse(raw);
      const validOrder = Array.isArray(parsed.order) ? parsed.order.filter((name, i, all) => characterByName.has(name) && all.indexOf(name) === i) : [];
      const order = [...validOrder, ...initialOrder.filter((name) => !validOrder.includes(name))];
      const validActive = Array.isArray(parsed.active) ? parsed.active.filter((name) => characterByName.has(name)) : initialState.active;
      const inventory = { ...initialState.inventory };
      if (parsed.inventory && typeof parsed.inventory === 'object') {
        itemNames.forEach((name) => {
          const value = Number(parsed.inventory[name]);
          inventory[name] = Number.isFinite(value) ? Math.max(0, Math.min(999, Math.floor(value))) : 0;
        });
      }
      const routePreset = Object.prototype.hasOwnProperty.call(routeLabels, parsed.routePreset) ? parsed.routePreset : '';
      return { order, active: [...new Set(validActive)], inventory, routePreset };
    } catch (error) {
      console.warn('Could not load saved gift planner state:', error);
      return structuredCloneSafe(initialState);
    }
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Could not save gift planner state:', error);
      toast('Browser storage is unavailable. Export a backup to keep your changes.');
    }
  }

  function byName(name) { return characterByName.get(name); }
  function activeCharacters() { return state.order.filter((name) => state.active.includes(name)).map(byName).filter(Boolean); }
  function countTotalInventory() { return itemNames.reduce((sum, item) => sum + (state.inventory[item] || 0), 0); }
  function countAvailableMatches(character) {
    return preferenceItems(character).filter((item) => (state.inventory[item] || 0) > 0).length;
  }
  function canonicalCandidates(character) {
    const loved = character.loved.filter((item) => itemSet.has(item));
    const lovedSet = new Set(loved);
    const reallyLiked = character.reallyLiked.filter((item) => itemSet.has(item) && !lovedSet.has(item));
    return { loved, reallyLiked };
  }

  // Maximum cardinality bipartite matching (each character receives one item;
  // each inventory unit can be assigned once). Used to preserve the maximum
  // number of gift recipients while applying priority/tier preferences.
  function maxMatchCount(people, inventory) {
    if (!people.length) return 0;
    const capacityByItem = new Map();
    const ownersByItem = new Map();
    itemNames.forEach((item) => {
      const capacity = Math.min(Math.max(0, Number(inventory[item]) || 0), people.length);
      if (capacity > 0) {
        capacityByItem.set(item, capacity);
        ownersByItem.set(item, []);
      }
    });
    if (!capacityByItem.size) return 0;
    const candidates = people.map((person) => [...new Set([...person.loved, ...person.reallyLiked])].filter((item) => capacityByItem.has(item)));
    // This is a capacitated augmenting-path matcher: an item may own several
    // character matches, up to the quantity in inventory, without materializing
    // a separate graph node for every copy of the same gift.
    function tryAssign(personIndex, seenItems) {
      for (const item of candidates[personIndex]) {
        if (seenItems.has(item)) continue;
        seenItems.add(item);
        const owners = ownersByItem.get(item);
        const capacity = capacityByItem.get(item);
        if (owners.length < capacity) {
          owners.push(personIndex);
          return true;
        }
        for (let slot = 0; slot < owners.length; slot += 1) {
          const currentOwner = owners[slot];
          if (tryAssign(currentOwner, seenItems)) {
            owners[slot] = personIndex;
            return true;
          }
        }
      }
      return false;
    }
    let matched = 0;
    for (let i = 0; i < people.length; i += 1) {
      if (tryAssign(i, new Set())) matched += 1;
    }
    return matched;
  }

  function buildPlan() {
    const people = activeCharacters();
    const originalCounts = { ...state.inventory };
    const inventory = { ...originalCounts };
    let remainingTarget = maxMatchCount(people, inventory);
    const allocations = [];

    people.forEach((person, index) => {
      const priority = index + 1;
      if (remainingTarget <= 0) {
        allocations.push({ character: person, priority, gift: null, tier: null, reason: 'No preferred gift remains to assign while preserving the best overall plan.' });
        return;
      }
      const future = people.slice(index + 1);
      const { loved, reallyLiked } = canonicalCandidates(person);
      const candidateGroups = [
        { tier: 'Loved', items: loved },
        { tier: 'Really liked', items: reallyLiked }
      ];
      let allocation = null;

      for (const group of candidateGroups) {
        // Use a gift that is scarce among later characters before a broadly useful
        // gift. Both are equally good for this character's tier, but scarcity-aware
        // selection helps preserve options for the rest of the roster.
        const sortedItems = group.items.filter((item) => (inventory[item] || 0) > 0).sort((a, b) => {
          const futureUses = (item) => future.reduce((n, candidate) => n + (candidate.loved.includes(item) || candidate.reallyLiked.includes(item) ? 1 : 0), 0);
          return futureUses(a) - futureUses(b) || a.localeCompare(b);
        });
        for (const gift of sortedItems) {
          const trialInventory = { ...inventory, [gift]: inventory[gift] - 1 };
          const achievable = 1 + maxMatchCount(future, trialInventory);
          if (achievable >= remainingTarget) {
            inventory[gift] -= 1;
            allocation = { character: person, priority, gift, tier: group.tier, reason: group.tier === 'Loved'
              ? 'Best reaction available for this priority while preserving the maximum recipient count.'
              : 'No Loved gift could be assigned here without reducing the maximum recipient count.' };
            remainingTarget -= 1;
            break;
          }
        }
        if (allocation) break;
      }

      if (!allocation) {
        allocation = { character: person, priority, gift: null, tier: null, reason: 'Skipped so later priorities can use the available items in the largest possible plan.' };
      }
      allocations.push(allocation);
    });
    currentPlan = allocations;
    plannedCounts = {};
    currentPlan.forEach((row) => { if (row.gift) plannedCounts[row.gift] = (plannedCounts[row.gift] || 0) + 1; });
    return { allocations, originalCounts, remainingInventory: inventory };
  }

  function renderStats() {
    const enabled = activeCharacters();
    const { allocations } = buildPlan();
    const planned = allocations.filter((row) => row.gift);
    document.getElementById('statInventory').textContent = countTotalInventory();
    document.getElementById('statTargets').textContent = enabled.length;
    document.getElementById('statPlanned').textContent = planned.length;
    document.getElementById('statLoved').textContent = planned.filter((row) => row.tier === 'Loved').length;
    document.getElementById('rosterCount').textContent = `${enabled.length} active / ${characters.length}`;
    document.getElementById('inventoryItemCount').textContent = `${itemNames.length} item types`;
    document.getElementById('inventoryItemCountLarge').textContent = `${itemNames.length} item types`;
    document.getElementById('inventoryFooterTotal').textContent = countTotalInventory();
    document.getElementById('inventoryFooterTotalLarge').textContent = countTotalInventory();
    document.getElementById('guideCharacterCount').textContent = `${allReferenceCharacters.length} characters`;
  }

  function renderRoster() {
    const list = document.getElementById('rosterList');
    const filter = document.getElementById('characterSearch').value.trim().toLocaleLowerCase();
    const ordered = state.order.filter((name) => !filter || name.toLocaleLowerCase().includes(filter));
    list.innerHTML = ordered.map((name) => {
      const person = byName(name);
      const matchCount = countAvailableMatches(person);
      const enabled = state.active.includes(name);
      const originalPriority = state.order.indexOf(name) + 1;
      const summary = `${person.loved.length} Loved · ${person.reallyLiked.length} Really liked`;
      const routeRequirement = state.routePreset ? (routeRenown[state.routePreset] || {})[name] : undefined;
      const routeInfo = !state.routePreset ? '' : Number.isFinite(routeRequirement)
        ? `<span class="route-renown">${routeRequirement === 0 ? '· Auto recruit' : `· Renown ${routeRequirement}`}</span>`
        : '<span class="route-renown route-unlisted">· Not listed</span>';
      return `<li class="roster-item${enabled ? '' : ' roster-disabled'}" draggable="true" data-character="${escapeHTML(name)}">
        <button class="drag-grip" type="button" aria-label="Drag to reorder ${escapeHTML(name)}" title="Drag to reorder">⠿</button>
        <div class="roster-person">
          <div class="roster-main">
            <div class="roster-name-line"><span class="priority-number">${String(originalPriority).padStart(2, '0')}</span><span class="character-name">${escapeHTML(name)}</span></div>
            <span class="character-flair">${escapeHTML(summary)} ${routeInfo}</span>
          </div>
          <span class="priority-stepper"><button type="button" data-move-character="${escapeHTML(name)}" data-move-direction="-1" aria-label="Move ${escapeHTML(name)} up" title="Move up" ${originalPriority === 1 ? 'disabled' : ''}>↑</button><button type="button" data-move-character="${escapeHTML(name)}" data-move-direction="1" aria-label="Move ${escapeHTML(name)} down" title="Move down" ${originalPriority === state.order.length ? 'disabled' : ''}>↓</button></span>
        </div>
        <div class="match-count"><b>${matchCount}</b><br>available</div>
        <label class="toggle-cell"><span class="sr-only">Include ${escapeHTML(name)} in plan</span><input type="checkbox" data-toggle-character="${escapeHTML(name)}" ${enabled ? 'checked' : ''}></label>
      </li>`;
    }).join('');
    document.getElementById('noCharacterResults').hidden = ordered.length !== 0;
    document.querySelectorAll('[data-route-preset]').forEach((button) => {
      const activePreset = button.dataset.routePreset === state.routePreset;
      button.classList.toggle('is-active', activePreset);
      button.setAttribute('aria-pressed', String(activePreset));
    });
  }

  function inventoryRowHTML(item) {
    const count = state.inventory[item] || 0;
    const useCount = plannedCounts[item] || 0;
    const favoredBy = characters.reduce((n, c) => n + (c.loved.includes(item) || c.reallyLiked.includes(item) ? 1 : 0), 0);
    const preferenceSummary = favoredBy ? `Preferred by ${favoredBy} ${favoredBy === 1 ? 'character' : 'characters'}` : 'No preference entry in snapshot';
    return `<div class="inventory-row${useCount ? ' item-planned' : ''}" data-item-row="${escapeHTML(item)}">
      <div><span class="item-name">${escapeHTML(item)}</span><span class="item-sub">${preferenceSummary}${useCount ? ` · ${useCount} ${useCount === 1 ? 'unit' : 'units'} planned` : ''}</span></div>
      <div class="quantity-control"><button type="button" data-quantity="-1" data-item="${escapeHTML(item)}" aria-label="Remove one ${escapeHTML(item)}">−</button><input type="number" min="0" max="999" step="1" value="${count}" inputmode="numeric" data-inventory-input="${escapeHTML(item)}" aria-label="Quantity of ${escapeHTML(item)}"><button type="button" data-quantity="1" data-item="${escapeHTML(item)}" aria-label="Add one ${escapeHTML(item)}">+</button></div>
    </div>`;
  }

  function filterItems(searchValue, filterValue) {
    const needle = (searchValue || '').trim().toLocaleLowerCase();
    return itemNames.filter((item) => {
      if (needle && !item.toLocaleLowerCase().includes(needle)) return false;
      if (filterValue === 'stocked' && !(state.inventory[item] > 0)) return false;
      if (filterValue === 'planned' && !(plannedCounts[item] > 0)) return false;
      return true;
    });
  }

  function renderInventoryList(listId, searchId, filterId, emptyId) {
    const list = document.getElementById(listId);
    const items = filterItems(document.getElementById(searchId).value, document.getElementById(filterId).value);
    list.innerHTML = items.map(inventoryRowHTML).join('');
    if (emptyId) document.getElementById(emptyId).hidden = items.length > 0;
  }

  function renderInventory() {
    renderInventoryList('inventoryList', 'itemSearch', 'inventoryFilter', 'noItemResults');
    renderInventoryList('inventoryListLarge', 'itemSearchLarge', 'inventoryFilterLarge', null);
  }

  function tierMarkup(items, tier) {
    if (!items.length) return '<span class="empty-tier">No entries in this snapshot.</span>';
    return `<div class="preference-tags">${items.map((item) => `<span class="gift-tag ${tier === 'Loved' ? 'love' : ''}">${escapeHTML(item)}</span>`).join('')}</div>`;
  }

  function renderGuide() {
    const needle = document.getElementById('guideSearch').value.trim().toLocaleLowerCase();
    const results = allReferenceCharacters.filter((c) => {
      if (!needle) return true;
      return c.name.toLocaleLowerCase().includes(needle) || [...(c.loved || []), ...(c.reallyLiked || [])].some((item) => item.toLocaleLowerCase().includes(needle));
    });
    document.getElementById('guideList').innerHTML = results.map((c) => {
      const loved = c.loved || [];
      const liked = c.reallyLiked || [];
      const supplement = c.source && c.source !== 'No preference data in snapshot';
      const note = c.note ? `<p class="character-note">${escapeHTML(c.note)}</p>` : '';
      return `<article class="guide-card"><div class="guide-card-head"><div><h3>${escapeHTML(c.name)}</h3><div class="guide-subtitle">${loved.length} Loved · ${liked.length} Really liked</div></div>${supplement ? '<span class="supplement-label">Supplemental</span>' : ''}</div>
        <section class="preference-block"><div class="preference-title"><span class="legend-dot love-dot"></span> Loved</div>${tierMarkup(loved, 'Loved')}</section>
        <section class="preference-block"><div class="preference-title"><span class="legend-dot like-dot"></span> Really liked</div>${tierMarkup(liked, 'Really liked')}</section>${note}</article>`;
    }).join('');
  }

  function renderPlan() {
    const { allocations } = buildPlan();
    const assigned = allocations.filter((row) => row.gift);
    const loved = assigned.filter((row) => row.tier === 'Loved');
    const reallyLiked = assigned.filter((row) => row.tier === 'Really liked');
    const unused = countTotalInventory() - assigned.length;
    document.getElementById('planSummary').innerHTML = `
      <div class="summary-chip good"><span>Recipients reached</span><strong>${assigned.length} / ${allocations.length}</strong></div>
      <div class="summary-chip good"><span>Loved gifts assigned</span><strong>${loved.length}</strong></div>
      <div class="summary-chip liked"><span>Really liked assigned</span><strong>${reallyLiked.length}</strong></div>
      <div class="summary-chip"><span>Gifts left over</span><strong>${unused}</strong></div>`;
    const visibleAllocations = hideUnassignedRows ? allocations.filter((row) => row.gift) : allocations;
    document.getElementById('planRows').innerHTML = visibleAllocations.map((row) => {
      const note = row.gift ? row.reason : 'No suitable gift available in your inventory.';
      const gift = row.gift ? `<span class="gift-icon">✦</span><span class="gift-name">${escapeHTML(row.gift)}</span>` : '<span class="no-gift">No gift assigned</span>';
      const tier = row.tier === 'Loved' ? '<span class="tier-badge">✦ Loved</span>' : row.tier === 'Really liked' ? '<span class="tier-badge really">✧ Really liked</span>' : '<span class="empty-tier">—</span>';
      return `<tr><td class="priority-cell">${String(row.priority).padStart(2, '0')}</td><td><span class="plan-character">${escapeHTML(row.character.name)}</span></td><td>${gift}</td><td>${tier}</td><td class="note-cell">${escapeHTML(note)}</td></tr>`;
    }).join('') || (hideUnassignedRows && allocations.length
      ? '<tr class="filtered-empty-row"><td colspan="5">No assigned gifts to show. Use “Show all rows” to reveal unassigned characters.</td></tr>'
      : '');
    const unassignedToggle = document.getElementById('toggleUnassigned');
    unassignedToggle.textContent = hideUnassignedRows ? 'Show all rows' : 'Hide unassigned';
    unassignedToggle.setAttribute('aria-pressed', String(hideUnassignedRows));
    unassignedToggle.title = hideUnassignedRows ? 'Show all characters, including those without an assigned gift' : 'Hide rows where no gift is assigned';
    const applyButton = document.getElementById('applyAllocation');
    applyButton.disabled = assigned.length === 0;
    applyButton.title = assigned.length
      ? `Confirm and deduct the ${assigned.length} gifts currently allocated in this plan`
      : 'No assigned gifts to deduct';
    const emptyState = document.getElementById('emptyPlan');
    const noInventory = countTotalInventory() === 0;
    const noTargets = allocations.length === 0;
    emptyState.hidden = !noInventory && !noTargets;
    emptyState.querySelector('h3').textContent = noTargets ? 'Choose your priorities' : 'Your ledger is waiting';
    emptyState.querySelector('p').textContent = noTargets
      ? 'Select one or more characters in the priority list to build a plan.'
      : 'Add inventory counts to see which gifts can raise support this week.';
    // A zero-inventory plan or an empty target list should show the helpful empty
    // message rather than a wall of unassigned rows.
    document.querySelector('.plan-table-wrap').hidden = noInventory || noTargets;
    document.getElementById('planSummary').hidden = noTargets;
  }

  function renderAll() {
    renderStats();
    renderRoster();
    renderInventory();
    renderPlan();
  }

  function setInventory(item, value) {
    if (!itemSet.has(item)) return;
    const count = Number(value);
    state.inventory[item] = Number.isFinite(count) ? Math.max(0, Math.min(999, Math.floor(count))) : 0;
    saveState();
    renderAll();
  }

  function toast(message) {
    const element = document.getElementById('toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => element.classList.remove('visible'), 2600);
  }

  function moveCharacter(name, direction) {
    const currentIndex = state.order.indexOf(name);
    const neighborIndex = currentIndex + direction;
    if (currentIndex < 0 || neighborIndex < 0 || neighborIndex >= state.order.length) return;
    [state.order[currentIndex], state.order[neighborIndex]] = [state.order[neighborIndex], state.order[currentIndex]];
    state.routePreset = '';
    saveState();
    renderAll();
  }

  function setupTabs() {
    document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('is-visible', panel.id === `panel-${button.dataset.tab}`));
      if (button.dataset.tab === 'inventory') renderInventory();
      if (button.dataset.tab === 'guide') renderGuide();
    }));
  }

  function setupRoster() {
    document.getElementById('characterSearch').addEventListener('input', renderRoster);
    document.getElementById('rosterList').addEventListener('change', (event) => {
      const input = event.target.closest('[data-toggle-character]');
      if (!input) return;
      const name = input.dataset.toggleCharacter;
      if (input.checked && !state.active.includes(name)) state.active.push(name);
      if (!input.checked) state.active = state.active.filter((item) => item !== name);
      saveState();
      renderAll();
    });
    document.getElementById('rosterList').addEventListener('click', (event) => {
      const moveButton = event.target.closest('[data-move-character]');
      if (moveButton) moveCharacter(moveButton.dataset.moveCharacter, Number(moveButton.dataset.moveDirection));
    });
    document.querySelectorAll('[data-route-preset]').forEach((button) => button.addEventListener('click', () => {
      const route = button.dataset.routePreset;
      const requirements = routeRenown[route] || {};
      const requirementFor = (name) => Number.isFinite(requirements[name]) ? requirements[name] : Number.POSITIVE_INFINITY;
      state.order.sort((a, b) => requirementFor(a) - requirementFor(b) || a.localeCompare(b));
      state.routePreset = route;
      saveState();
      renderAll();
      toast(`${routeLabels[route]} route preset applied: lowest Renown first.`);
    }));
    const list = document.getElementById('rosterList');
    list.addEventListener('dragstart', (event) => {
      const row = event.target.closest('.roster-item');
      if (!row) return;
      draggingName = row.dataset.character;
      row.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', draggingName);
      }
    });
    list.addEventListener('dragover', (event) => {
      event.preventDefault();
      const row = event.target.closest('.roster-item');
      list.querySelectorAll('.drag-over').forEach((item) => item.classList.remove('drag-over'));
      if (row && row.dataset.character !== draggingName) row.classList.add('drag-over');
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });
    list.addEventListener('drop', (event) => {
      event.preventDefault();
      const target = event.target.closest('.roster-item');
      const targetName = target && target.dataset.character;
      if (!draggingName || !targetName || draggingName === targetName) return;
      const from = state.order.indexOf(draggingName);
      if (from < 0 || !state.order.includes(targetName)) return;
      const rect = target.getBoundingClientRect();
      const dropAfter = event.clientY >= rect.top + rect.height / 2;
      state.order.splice(from, 1);
      const targetIndex = state.order.indexOf(targetName);
      const insertAt = targetIndex + (dropAfter ? 1 : 0);
      state.order.splice(insertAt, 0, draggingName);
      state.routePreset = '';
      draggingName = null;
      saveState();
      renderAll();
    });
    list.addEventListener('dragend', () => {
      draggingName = null;
      list.querySelectorAll('.dragging,.drag-over').forEach((item) => item.classList.remove('dragging', 'drag-over'));
    });
    document.getElementById('selectAllCharacters').addEventListener('click', () => {
      state.active = [...characterNames]; saveState(); renderAll(); toast('All characters with preference data selected.');
    });
    document.getElementById('selectNoCharacters').addEventListener('click', () => {
      state.active = []; saveState(); renderAll(); toast('No characters are currently selected.');
    });
    document.getElementById('resetOrder').addEventListener('click', () => {
      state.order = [...initialOrder]; state.routePreset = ''; saveState(); renderAll(); toast('Character order reset to A–Z.');
    });
  }

  function setupInventory() {
    const lists = ['inventoryList', 'inventoryListLarge'];
    lists.forEach((listId) => {
      document.getElementById(listId).addEventListener('click', (event) => {
        const button = event.target.closest('[data-quantity]');
        if (!button) return;
        const item = button.dataset.item;
        setInventory(item, (state.inventory[item] || 0) + Number(button.dataset.quantity));
      });
      document.getElementById(listId).addEventListener('change', (event) => {
        const input = event.target.closest('[data-inventory-input]');
        if (!input) return;
        setInventory(input.dataset.inventoryInput, input.value);
      });
    });
    [['itemSearch', 'inventoryFilter', 'inventoryList', 'noItemResults'], ['itemSearchLarge', 'inventoryFilterLarge', 'inventoryListLarge', null]].forEach(([searchId, filterId, listId, emptyId]) => {
      document.getElementById(searchId).addEventListener('input', () => renderInventoryList(listId, searchId, filterId, emptyId));
      document.getElementById(filterId).addEventListener('change', () => renderInventoryList(listId, searchId, filterId, emptyId));
    });
    const clear = () => {
      itemNames.forEach((item) => { state.inventory[item] = 0; });
      saveState(); renderAll(); toast('All inventory counts cleared.');
    };
    document.getElementById('clearInventory').addEventListener('click', clear);
    document.getElementById('clearInventoryLarge').addEventListener('click', clear);
  }

  function planAsText() {
    const { allocations } = buildPlan();
    const rows = allocations.filter((row) => row.gift);
    const lines = [
      'FATEWOVEN GIFT STRATEGIST — GIFT PLAN',
      `Recipients: ${rows.length}/${allocations.length} · Loved: ${rows.filter((row) => row.tier === 'Loved').length} · Really liked: ${rows.filter((row) => row.tier === 'Really liked').length}`,
      ''
    ];
    if (!rows.length) lines.push('No gifts can be assigned from the current inventory.');
    rows.forEach((row) => lines.push(`${String(row.priority).padStart(2, '0')}. ${row.character.name} — ${row.gift} [${row.tier}]`));
    const skipped = allocations.filter((row) => !row.gift);
    if (skipped.length) {
      lines.push('', 'Not assigned:');
      skipped.forEach((row) => lines.push(`- ${row.character.name} — no preferred gift available`));
    }
    lines.push('', 'Fan-made helper; verify uncertain preferences with the linked source guide.');
    return lines.join('\n');
  }

  function setupPlanControls() {
    document.getElementById('toggleUnassigned').addEventListener('click', () => {
      hideUnassignedRows = !hideUnassignedRows;
      renderPlan();
    });

    const modal = document.getElementById('allocationModal');
    const modalStats = document.getElementById('allocationModalStats');
    const deductionList = document.getElementById('allocationDeductionList');
    const itemTypeCount = document.getElementById('allocationItemTypeCount');
    const confirmButton = document.getElementById('confirmAllocationModal');
    let pendingAllocation = null;

    function closeAllocationModal() {
      pendingAllocation = null;
      if (modal.open) modal.close('cancel');
    }

    function appendModalStat(label, value, modifier) {
      const chip = document.createElement('div');
      chip.className = `allocation-modal-stat${modifier ? ` ${modifier}` : ''}`;
      const number = document.createElement('strong');
      number.textContent = String(value);
      const caption = document.createElement('span');
      caption.textContent = label;
      chip.append(number, caption);
      modalStats.appendChild(chip);
    }

    function showAllocationModal(assigned, deductions, lovedCount, reallyLikedCount) {
      pendingAllocation = {
        assignedCount: assigned.length,
        deductions: { ...deductions },
        lovedCount,
        reallyLikedCount
      };
      modalStats.replaceChildren();
      appendModalStat('Gifts to deduct', assigned.length, 'allocation-stat-total');
      appendModalStat('Loved', lovedCount, 'allocation-stat-loved');
      appendModalStat('Really liked', reallyLikedCount, 'allocation-stat-liked');

      const entries = Object.entries(deductions).sort(([a], [b]) => a.localeCompare(b));
      itemTypeCount.textContent = `${entries.length} ${entries.length === 1 ? 'item type' : 'item types'}`;
      deductionList.replaceChildren();
      entries.forEach(([item, quantity]) => {
        const row = document.createElement('li');
        row.className = 'allocation-deduction-item';
        const name = document.createElement('span');
        name.className = 'allocation-deduction-name';
        name.textContent = item;
        const amount = document.createElement('span');
        amount.className = 'allocation-deduction-quantity';
        amount.textContent = `−${quantity}`;
        amount.setAttribute('aria-label', `Deduct ${quantity}`);
        row.append(name, amount);
        deductionList.appendChild(row);
      });

      confirmButton.disabled = false;
      if (typeof modal.showModal === 'function') {
        modal.showModal();
        document.getElementById('cancelAllocationModal').focus();
      } else {
        // A small compatibility fallback for browsers without HTMLDialogElement.showModal.
        toast('Your browser does not support the inventory confirmation dialog. Please update it and try again.');
        pendingAllocation = null;
      }
    }

    document.getElementById('applyAllocation').addEventListener('click', () => {
      // Build at click time so the modal always reflects the current order and stock,
      // independently of the display-only Hide unassigned filter.
      const { allocations } = buildPlan();
      const assigned = allocations.filter((row) => row.gift);
      if (!assigned.length) {
        toast('There are no allocated gifts to deduct.');
        renderAll();
        return;
      }

      const deductions = {};
      assigned.forEach((row) => {
        deductions[row.gift] = (deductions[row.gift] || 0) + 1;
      });

      // Never show a confirmation if the plan exceeds the current stock.
      const invalid = Object.entries(deductions).find(([item, quantity]) => (state.inventory[item] || 0) < quantity);
      if (invalid) {
        toast(`Inventory changed for ${invalid[0]}. Rebuild the plan before applying it.`);
        renderAll();
        return;
      }

      const lovedCount = assigned.filter((row) => row.tier === 'Loved').length;
      const reallyLikedCount = assigned.filter((row) => row.tier === 'Really liked').length;
												  
											   
																
					
					   
																											   
		   
      showAllocationModal(assigned, deductions, lovedCount, reallyLikedCount);
    });
		   
						   
				  
		   
				   
				   

    document.getElementById('cancelAllocationModal').addEventListener('click', closeAllocationModal);
    document.getElementById('closeAllocationModal').addEventListener('click', closeAllocationModal);
    modal.addEventListener('click', (event) => {
      // A click on the dialog backdrop (outside its card) dismisses without changes.
      if (event.target === modal) closeAllocationModal();
    });
    modal.addEventListener('cancel', () => {
      // Escape dismisses the custom modal without applying anything.
      pendingAllocation = null;
    });
    modal.addEventListener('close', () => {
      pendingAllocation = null;
    });

    confirmButton.addEventListener('click', () => {
      if (!pendingAllocation) return;
      const pending = pendingAllocation;

      // Validate one final time immediately before changing inventory.
      const invalid = Object.entries(pending.deductions)
        .find(([item, quantity]) => (state.inventory[item] || 0) < quantity);
      if (invalid) {
        closeAllocationModal();
        toast(`Inventory changed for ${invalid[0]}. Rebuild the plan before applying it.`);
        renderAll();
        return;
      }

      Object.entries(pending.deductions).forEach(([item, quantity]) => {
        state.inventory[item] = Math.max(0, (state.inventory[item] || 0) - quantity);
      });
      const deductedCount = pending.assignedCount;
      pendingAllocation = null;
      if (modal.open) modal.close('applied');
      saveState();
      renderAll();
      toast(`Inventory updated: ${deductedCount} ${deductedCount === 1 ? 'gift deducted' : 'gifts deducted'}.`);
    });
  }

  function setupExports() {
    document.getElementById('copyPlan').addEventListener('click', async () => {
      const text = planAsText();
      try {
        await navigator.clipboard.writeText(text);
        toast('Gift plan copied to clipboard.');
      } catch (error) {
        const area = document.createElement('textarea');
        area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area); area.select();
        const success = document.execCommand('copy'); area.remove();
        toast(success ? 'Gift plan copied to clipboard.' : 'Clipboard unavailable; use Export CSV instead.');
      }
    });
    document.getElementById('downloadCsv').addEventListener('click', () => {
      const { allocations } = buildPlan();
      const csvRows = [['Priority', 'Character', 'Gift', 'Reaction', 'Allocation note']];
      allocations.forEach((row) => csvRows.push([row.priority, row.character.name, row.gift || '', row.tier || '', row.gift ? row.reason : 'No suitable gift available in your inventory.']));
      const csv = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
      downloadFile('fatewoven-gift-plan.csv', '\ufeff' + csv, 'text/csv;charset=utf-8');
      toast('CSV gift plan exported.');
    });
    document.getElementById('exportBackup').addEventListener('click', () => {
      const backup = { app: 'Fatewoven Gift Strategist', version: 1, savedAt: new Date().toISOString(), order: state.order, active: state.active, inventory: state.inventory, routePreset: state.routePreset };
      downloadFile('fatewoven-gift-backup.json', JSON.stringify(backup, null, 2), 'application/json');
      toast('Backup file exported.');
    });
    const fileInput = document.getElementById('backupFile');
    document.getElementById('importBackup').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = JSON.parse(String(reader.result));
          if (!backup || typeof backup !== 'object' || !backup.inventory || typeof backup.inventory !== 'object') throw new Error('Invalid backup format');
          const incomingOrder = Array.isArray(backup.order) ? backup.order.filter((name, i, all) => characterByName.has(name) && all.indexOf(name) === i) : [];
          const inventory = { ...initialState.inventory };
          itemNames.forEach((item) => {
            const raw = Number(backup.inventory[item]);
            inventory[item] = Number.isFinite(raw) ? Math.max(0, Math.min(999, Math.floor(raw))) : 0;
          });
          const active = Array.isArray(backup.active) ? [...new Set(backup.active.filter((name) => characterByName.has(name)))] : [...characterNames];
          state = {
            order: [...incomingOrder, ...initialOrder.filter((name) => !incomingOrder.includes(name))],
            active,
            inventory,
            routePreset: Object.prototype.hasOwnProperty.call(routeLabels, backup.routePreset) ? backup.routePreset : ''
          };
          saveState(); renderAll(); toast('Backup imported.');
        } catch (error) {
          toast('That file could not be read as a gift planner backup.');
        }
        fileInput.value = '';
      };
      reader.onerror = () => { toast('Could not read that backup file.'); fileInput.value = ''; };
      reader.readAsText(file);
    });
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = filename; anchor.style.display = 'none';
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  document.getElementById('guideSearch').addEventListener('input', renderGuide);
  setupTabs();
  setupRoster();
  setupInventory();
  setupPlanControls();
  setupExports();
  renderAll();
  renderGuide();
})();
