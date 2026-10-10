const hearthView = {
  tab: 'room',
  slot: 'floor',
  search: '',
  filter: 'all',
  family: 'all',
  from: null,
  inert: [],
  rendered: -1,
  clock: 0,
};
function hearthOpen(tab = 'room') {
  if (!T('hearth') || T('hearth').classList.contains('open')) return;
  hearthView.from = document.activeElement;
  if (G.state === 'playing') pauseGame(true);
  clearInput();
  hearthDiscover();
  hearthView.tab = tab;
  hearthRefresh();
  for (const el of [...document.querySelectorAll('.ov.open'), T('cv'), T('hud')]) {
    if (el?.id !== 'hearth') {
      hearthView.inert.push([el, el.inert]);
      el.inert = true;
    }
  }
  show('hearth');
  initAudio();
  T('hearthClose').focus({ preventScroll: true });
  saveNow('hearth');
}
function hearthClose() {
  if (!T('hearth')?.classList.contains('open')) return;
  hide('hearth');
  for (const [el, inert] of hearthView.inert.splice(0)) el.inert = inert;
  clearInput();
  saveNow('hearth');
  (hearthView.from?.isConnected
    ? hearthView.from
    : T(G.state === 'menu' ? 'btnHearth' : 'btnResume')
  )?.focus({ preventScroll: true });
}
function hearthItemButton(name, selected, disabled, fn, detail = '') {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hearth-choice' + (selected ? ' selected' : '');
  b.disabled = disabled;
  b.setAttribute('aria-pressed', String(selected));
  const title = document.createElement('strong'),
    sub = document.createElement('small');
  title.textContent = name;
  sub.textContent = detail;
  b.append(title, sub);
  b.addEventListener('click', fn);
  return b;
}
function hearthCustomize() {
  const h = hearthData(),
    count = hearthCount(),
    list = T('hearthChoices');
  list.replaceChildren();
  for (const b of T('hearthSlots').children)
    b.setAttribute('aria-pressed', String(b.dataset.slot === hearthView.slot));
  for (const d of HEARTH_DECOR.filter((d) => d.slot === hearthView.slot))
    list.appendChild(
      hearthItemButton(
        d.name,
        h.layout[d.slot] === d.id,
        count < d.need,
        () => {
          hearthData().layout[d.slot] = d.id;
          hearthRevision++;
          hearthRefresh();
          saveNow('decor');
        },
        count < d.need
          ? 'Complete ' + d.need + ' challenges'
          : h.layout[d.slot] === d.id
            ? 'PLACED'
            : 'PLACE'
      )
    );
  for (const key of ['trail', 'shards']) {
    const select = T('hearth' + (key === 'trail' ? 'Trail' : 'Shards'));
    select.replaceChildren();
    for (const p of HEARTH_PALETTES) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + (count < p.need ? ' · ' + p.need + ' challenges' : '');
      opt.disabled = count < p.need;
      select.appendChild(opt);
    }
    select.value = h[key];
  }
  T('hearthMusic').value = h.music;
  const full = BLESSING_COMBOS.filter((c) =>
    HEARTH_CHALLENGES.filter((q) => q.combo === c.id).every((q) => h.completed[q.id])
  );
  T('hearthCabinet').textContent =
    full.length +
    ' / 36 relics · ' +
    achievementData().guardians.length +
    ' / 10 Guardian trophies';
  T('hearthRewardNext').textContent = HEARTH_PALETTES.find((p) => p.need > count)
    ? 'Next Ember finish: ' +
      HEARTH_PALETTES.find((p) => p.need > count).name +
      ' · ' +
      (HEARTH_PALETTES.find((p) => p.need > count).need - count) +
      ' more challenges'
    : 'Every Ember finish is unlocked.';
  const cabinet = T('hearthRelics');
  cabinet.replaceChildren();
  for (const c of BLESSING_COMBOS) {
    const earned = full.includes(c),
      b = document.createElement('button');
    b.className = 'hearth-relic' + (earned ? ' earned' : '');
    b.type = 'button';
    b.title =
      c.name + ' relic · ' + (earned ? 'Earned' : 'Complete all four ' + c.name + ' challenges');
    b.setAttribute('aria-label', b.title);
    const cv = document.createElement('canvas');
    cv.width = cv.height = 40;
    drawComboEmblem(cv.getContext('2d'), c.family, 20, 20, 27);
    b.appendChild(cv);
    b.addEventListener('click', () => {
      hearthView.search = c.name;
      T('hearthSearch').value = c.name;
      hearthView.filter = 'all';
      hearthView.family = 'all';
      T('hearthFamily').value = 'all';
      hearthView.tab = 'challenges';
      hearthRefresh();
    });
    cabinet.appendChild(b);
  }
}
function hearthRenderChallenges() {
  const h = hearthData(),
    list = T('hearthChallengeList'),
    search = hearthView.search.trim().toLowerCase();
  list.replaceChildren();
  let visible = 0;
  for (const c of BLESSING_COMBOS) {
    if (hearthView.family !== 'all' && c.family !== hearthView.family) continue;
    const names = c.cards.map((id) => POOL.find((o) => o.id === id).name);
    if (
      search &&
      !(c.name + ' ' + names.join(' ') + ' ' + COMBO_MASTERY[c.id][1])
        .toLowerCase()
        .includes(search)
    )
      continue;
    const goals = HEARTH_CHALLENGES.filter(
      (q) =>
        q.combo === c.id &&
        (hearthView.filter === 'all' ||
          (hearthView.filter === 'complete' ? h.completed[q.id] : !h.completed[q.id]))
    );
    if (!goals.length) continue;
    const group = document.createElement('section');
    group.className = 'hearth-challenge-group';
    const head = document.createElement('header');
    head.appendChild(buildEmblem(c.family));
    const copy = document.createElement('div'),
      title = document.createElement('h3'),
      ingredients = document.createElement('p');
    title.textContent = c.name;
    ingredients.textContent = names.join(' + ');
    copy.append(title, ingredients);
    head.append(copy);
    const stamp = document.createElement('span');
    stamp.className = 'hearth-relic-stamp';
    stamp.textContent = HEARTH_CHALLENGES.filter((q) => q.combo === c.id).every(
      (q) => h.completed[q.id]
    )
      ? 'RELIC EARNED'
      : '4 GOALS → RELIC';
    head.append(stamp);
    group.appendChild(head);
    for (const q of goals) {
      const done = h.completed[q.id],
        value = h.progress[q.id] || 0,
        row = document.createElement('article');
      row.className = 'hearth-goal' + (done ? ' completed' : '');
      row.tabIndex = 0;
      const body = document.createElement('div'),
        name = document.createElement('strong'),
        desc = document.createElement('p'),
        meter = document.createElement('div');
      name.textContent = {
        discover: 'Discover',
        mastery: 'Practice',
        floors: 'The Long Way',
        guardians: 'Three Bells',
      }[q.kind];
      desc.textContent = q.ds;
      meter.className = 'hearth-meter';
      const bar = document.createElement('i');
      bar.style.width = (value / q.target) * 100 + '%';
      meter.appendChild(bar);
      body.append(name, desc, meter);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = done
        ? '✓ COMPLETE'
        : h.tracked === q.id
          ? 'TRACKING'
          : value + ' / ' + q.target + ' · TRACK';
      button.disabled = !!done;
      button.setAttribute('aria-pressed', String(h.tracked === q.id));
      button.addEventListener('click', () => {
        hearthData().tracked = hearthData().tracked === q.id ? '' : q.id;
        hearthRevision++;
        hearthRenderChallenges();
        saveNow('challenge-goal');
      });
      row.append(body, button);
      group.appendChild(row);
      visible++;
    }
    list.appendChild(group);
  }
  T('hearthChallengeResults').textContent =
    visible +
    ' goals · Progress is kept between descents. Archive practice and Boss Rush do not count.';
  if (!visible) {
    const p = document.createElement('p');
    p.className = 'hearth-empty';
    p.textContent = 'No challenges match these filters.';
    list.appendChild(p);
  }
  for (const b of T('hearthChallengeFilters').children)
    b.setAttribute('aria-pressed', String(b.dataset.filter === hearthView.filter));
}
function hearthRenderVows() {
  const h = hearthData(),
    unlocked = hearthVowsUnlocked(),
    list = T('hearthVowList');
  list.replaceChildren();
  T('hearthVowIntro').textContent = unlocked
    ? 'Choose bindings for your next new descent. Every Guardian victory earns a seal for each active binding. Complete the campaign with a set to earn its crown. Your saved run keeps its original bindings.'
    : 'Defeat your first Guardian to unlock bindings. They restrict your abilities without changing the dungeon or removing your blessings.';
  for (const v of HEARTH_VOWS) {
    const card = document.createElement('article');
    card.className = 'hearth-vow' + (h.selectedVows.includes(v.id) ? ' selected' : '');
    const mark = document.createElement('span');
    mark.className = 'hearth-vow-mark';
    mark.textContent = v.mark;
    const name = document.createElement('h3');
    name.textContent = v.name;
    const ds = document.createElement('p');
    ds.textContent = v.ds;
    const seals = document.createElement('div');
    seals.className = 'hearth-seals';
    for (const g of GUARDIAN_ROSTER) {
      const s = document.createElement('span'),
        earned = h.vowSeals[v.id]?.[g.key];
      s.textContent = '◆';
      s.className = earned ? 'earned' : '';
      s.title = g.name + (earned ? ' · sealed' : '');
      s.setAttribute('aria-label', s.title);
      seals.appendChild(s);
    }
    const button = hearthItemButton(
      h.selectedVows.includes(v.id) ? 'BOUND' : 'BIND',
      h.selectedVows.includes(v.id),
      !unlocked,
      () => {
        const chosen = hearthData().selectedVows;
        hearthData().selectedVows = chosen.includes(v.id)
          ? chosen.filter((id) => id !== v.id)
          : [...chosen, v.id];
        hearthRevision++;
        hearthRenderVows();
        saveNow('bindings');
      },
      Object.keys(h.vowSeals[v.id] || {}).length + ' / 10 seals'
    );
    card.append(mark, name, ds, seals, button);
    list.appendChild(card);
  }
  const selected = h.selectedVows.length;
  T('hearthVowSummary').textContent = selected
    ? selected + ' / 6 BOUND · NEXT NEW DESCENT'
    : 'NO BINDINGS · ORDINARY DESCENT';
  T('hearthAllVows').disabled = T('hearthClearVows').disabled = !unlocked;
  const crowns = T('hearthCrowns');
  crowns.textContent = h.crowns.length
    ? 'Campaign crowns: ' +
      h.crowns
        .map((mask) =>
          HEARTH_VOWS.filter((v, i) => mask & (1 << i))
            .map((v) => v.mark)
            .join(' + ')
        )
        .join(' · ')
    : 'Six-binding campaign crown: the gold crest above your fireplace.';
}
function hearthRefresh() {
  hearthView.rendered = hearthRevision;
  const count = hearthCount();
  T('hearthProgress').textContent = count + ' / ' + HEARTH_CHALLENGES.length + ' challenges';
  T('hearthProgressBar').style.width = (count / HEARTH_CHALLENGES.length) * 100 + '%';
  for (const b of T('hearthTabs').children)
    b.setAttribute('aria-pressed', String(b.dataset.tab === hearthView.tab));
  for (const tab of ['room', 'challenges', 'vows'])
    T(
      'hearth' +
        (tab === 'room' ? 'RoomPanel' : tab === 'challenges' ? 'ChallengesPanel' : 'VowsPanel')
    ).hidden = hearthView.tab !== tab;
  if (hearthView.tab === 'room') hearthCustomize();
  if (hearthView.tab === 'challenges') hearthRenderChallenges();
  if (hearthView.tab === 'vows') hearthRenderVows();
}
function installHearth() {
  const button = document.createElement('button');
  button.id = 'btnHearth';
  button.type = 'button';
  button.className = 'btn hearth-menu';
  button.innerHTML =
    '<span aria-hidden="true">♨</span> THE HEARTH <small>CHALLENGES · BINDINGS · REWARDS</small>';
  T('menuStats').before(button);
  on(button, 'click', () => hearthOpen());
  const pause = document.createElement('button');
  pause.id = 'btnPauseHearth';
  pause.className = 'btn';
  pause.textContent = 'THE HEARTH';
  T('btnPauseAchievements').after(pause);
  on(pause, 'click', () => hearthOpen());
  const overlay = document.createElement('div');
  overlay.id = 'hearth';
  overlay.className = 'ov';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'hearthTitle');
  overlay.innerHTML = `<section class="hearth-shell"><header class="hearth-heading"><div><small>A PLACE TO RETURN TO</small><h2 id="hearthTitle">The Hearth</h2></div><div class="hearth-total"><span id="hearthProgress"></span><div class="hearth-meter"><i id="hearthProgressBar"></i></div></div><button class="btn" id="hearthClose">BACK</button></header><nav id="hearthTabs"><button data-tab="room" type="button">YOUR HEARTH</button><button data-tab="challenges" type="button">COMBO CHALLENGES</button><button data-tab="vows" type="button">VOW BINDINGS</button></nav><div class="hearth-content"><section id="hearthRoomPanel"><div class="hearth-room-grid"><div class="hearth-scene"><canvas id="hearthCanvas" width="640" height="360" role="img" aria-label="Your Hearth: a stone fireplace, timber beams, windows, Guardian trophies, a cabinet of combination relics, and your revolving Ember."></canvas><div class="hearth-scene-caption"><span id="hearthCabinet"></span><button id="hearthBegin" type="button">BEGIN DESCENT ›</button></div><p id="hearthRewardNext"></p><div id="hearthRelics" aria-label="Combination relic cabinet"></div></div><aside class="hearth-workbench"><h3>Make it yours</h3><div id="hearthSlots"><button data-slot="floor">FLOOR</button><button data-slot="banner">BANNERS</button><button data-slot="lights">LIGHTS</button><button data-slot="shelf">SHELVES</button><button data-slot="rug">RUG</button><button data-slot="window">WINDOW</button></div><div id="hearthChoices"></div><label>Ember trail<select id="hearthTrail"></select></label><label>Revolving shards<select id="hearthShards"></select></label><label>Hearth music<select id="hearthMusic"></select></label><p>Rewards change your Hearth and your Ember’s appearance. Each mastered combination earns a cabinet relic.</p></aside></div></section><section id="hearthChallengesPanel" hidden><div class="hearth-tools"><input id="hearthSearch" type="search" placeholder="Search combinations or ingredients" aria-label="Search combo challenges"><select id="hearthFamily" aria-label="Effect family"><option value="all">Every effect family</option></select><div id="hearthChallengeFilters"><button data-filter="all">ALL</button><button data-filter="open">UNFINISHED</button><button data-filter="complete">COMPLETE</button></div></div><p id="hearthChallengeResults"></p><div id="hearthChallengeList"></div></section><section id="hearthVowsPanel" hidden><p id="hearthVowIntro"></p><div class="hearth-vow-actions"><strong id="hearthVowSummary"></strong><button class="btn" id="hearthAllVows">BIND ALL SIX</button><button class="btn" id="hearthClearVows">CLEAR</button></div><div id="hearthVowList"></div><p id="hearthCrowns"></p><p class="hearth-vow-note">Seals and crowns are permanent trophies. Bindings do not increase Essence rewards or apply to Archive practice and Boss Rush.</p></section></div></section>`;
  document.body.appendChild(overlay);
  const familyNames = {
    frost: 'Frost',
    storm: 'Storm',
    stone: 'Ground',
    tide: 'Tide',
    moon: 'Moon',
    blade: 'Blades',
    meteor: 'Meteors',
    moth: 'Moths',
    prism: 'Prism',
    stitch: 'Starstitch',
  };
  for (const [id, name] of Object.entries(familyNames)) {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = name;
    T('hearthFamily').appendChild(o);
  }
  for (const [id, name] of HEARTH_MUSIC) {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = name;
    T('hearthMusic').appendChild(o);
  }
  on(T('hearthClose'), 'click', hearthClose);
  on(T('hearthBegin'), 'click', () => {
    hearthClose();
    requestStart();
  });
  for (const b of T('hearthTabs').children)
    on(b, 'click', () => {
      hearthView.tab = b.dataset.tab;
      hearthRefresh();
    });
  for (const b of T('hearthSlots').children)
    on(b, 'click', () => {
      hearthView.slot = b.dataset.slot;
      hearthCustomize();
    });
  for (const [id, key] of [
    ['hearthTrail', 'trail'],
    ['hearthShards', 'shards'],
    ['hearthMusic', 'music'],
  ])
    on(T(id), 'change', () => {
      hearthData()[key] = T(id).value;
      hearthRevision++;
      saveNow('hearth-style');
    });
  on(T('hearthSearch'), 'input', () => {
    hearthView.search = T('hearthSearch').value;
    hearthRenderChallenges();
  });
  on(T('hearthFamily'), 'change', () => {
    hearthView.family = T('hearthFamily').value;
    hearthRenderChallenges();
  });
  for (const b of T('hearthChallengeFilters').children)
    on(b, 'click', () => {
      hearthView.filter = b.dataset.filter;
      hearthRenderChallenges();
    });
  on(T('hearthAllVows'), 'click', () => {
    if (hearthVowsUnlocked()) {
      hearthData().selectedVows = HEARTH_VOWS.map((v) => v.id);
      hearthRevision++;
      hearthRenderVows();
      saveNow('bindings');
    }
  });
  on(T('hearthClearVows'), 'click', () => {
    hearthData().selectedVows = [];
    hearthRevision++;
    hearthRenderVows();
    saveNow('bindings');
  });
  overlay.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        hearthClose();
      }
      if (e.key === 'Tab') {
        const items = controllerTargets(overlay),
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    true
  );
  const vow = document.createElement('small');
  vow.id = 'vowHud';
  vow.hidden = true;
  T('weaponHUD').appendChild(vow);
  const goal = document.createElement('small');
  goal.id = 'hearthTracked';
  goal.hidden = true;
  T('buildHud').appendChild(goal);
}
const hearthInit = init;
init = function () {
  hearthInit();
  installHearth();
};
const hearthBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return hearthBlocking() || T('hearth')?.classList.contains('open');
};
const hearthEsc = onEscKey;
onEscKey = function () {
  if (T('hearth')?.classList.contains('open')) return hearthClose();
  return hearthEsc();
};
const hearthInterfaceTick = hollowTick;
hollowTick = function (dt) {
  hearthInterfaceTick(dt);
  hearthView.clock += dt;
  if (T('hearth')?.classList.contains('open')) {
    if (hearthView.rendered !== hearthRevision) hearthRefresh();
    if (hearthView.tab === 'room' && hearthView.clock >= 1 / 24) {
      drawHearthRoom(T('hearthCanvas').getContext('2d'), save.motion ? 0 : G.tAll);
      hearthView.clock = 0;
    }
  }
};
const hearthBuildHud = buildHudRefresh;
buildHudRefresh = function () {
  hearthBuildHud();
  const h = hearthData(),
    goal = T('hearthTracked'),
    q = HEARTH_CHALLENGE_BY_ID[h.tracked];
  if (goal) {
    goal.hidden = !q;
    goal.textContent = q
      ? COMBO_BY_ID[q.combo].name + ' · ' + (h.progress[q.id] || 0) + ' / ' + q.target
      : '';
  }
  if (buildJournal.notices[0]?.startsWith('Challenge complete'))
    T('buildNotice').textContent = buildJournal.notices[0];
};
const hearthRecordedTrack = tseRecordedTrack;
tseRecordedTrack = function () {
  return T('hearth')?.classList.contains('open') ? hearthData().music : hearthRecordedTrack();
};
const hearthReset = resetEverything;
resetEverything = function () {
  hearthClose();
  hearthDirty = false;
  hearthRoomKey = '';
  const out = hearthReset();
  hearthRevision++;
  return out;
};
