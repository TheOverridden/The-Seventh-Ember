const hearthView = {
  tab: 'room',
  slot: 'floor',
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
  hearthView.tab = tab === 'vows' ? 'vows' : 'room';
  hearthRefresh();
  T('hearth').querySelector('.hearth-content').scrollTop = 0;
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
    list = T('hearthChoices');
  list.replaceChildren();
  for (const b of T('hearthSlots').children)
    b.setAttribute('aria-pressed', String(b.dataset.slot === hearthView.slot));
  for (const d of HEARTH_DECOR.filter((d) => d.slot === hearthView.slot))
    list.appendChild(
      hearthItemButton(
        d.name,
        h.layout[d.slot] === d.id,
        false,
        () => {
          hearthData().layout[d.slot] = d.id;
          hearthRevision++;
          hearthRefresh();
          saveNow('decor');
        },
        h.layout[d.slot] === d.id ? 'PLACED' : 'PLACE'
      )
    );
  for (const key of ['trail', 'shards']) {
    const select = T('hearth' + (key === 'trail' ? 'Trail' : 'Shards'));
    select.replaceChildren();
    for (const p of HEARTH_PALETTES) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    }
    select.value = h[key];
  }
  T('hearthMusic').value = h.music;
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
  for (const b of T('hearthTabs').children)
    b.setAttribute('aria-pressed', String(b.dataset.tab === hearthView.tab));
  T('hearthRoomPanel').hidden = hearthView.tab !== 'room';
  T('hearthVowsPanel').hidden = hearthView.tab !== 'vows';
  T('hearthBegin').textContent = G.state === 'paused' ? 'RESUME DESCENT ›' : 'BEGIN DESCENT ›';
  if (hearthView.tab === 'room') {
    hearthCustomize();
    drawHearthRoom(T('hearthCanvas').getContext('2d'), save.motion ? 0 : G.tAll);
  } else hearthRenderVows();
}
function installHearth() {
  const button = document.createElement('button');
  button.id = 'btnHearth';
  button.type = 'button';
  button.className = 'btn hearth-menu';
  button.innerHTML =
    '<span aria-hidden="true">♨</span> THE HEARTH <small>ROOM · EMBER · BINDINGS</small>';
  T('menuStats').before(button);
  on(button, 'click', () => hearthOpen());
  const pause = document.createElement('button');
  pause.id = 'btnPauseHearth';
  pause.type = 'button';
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
  overlay.innerHTML = `<section class="hearth-shell">
    <header class="hearth-heading"><div><small>A PLACE TO RETURN TO</small><h2 id="hearthTitle">The Hearth</h2></div><button class="btn" id="hearthClose" type="button">BACK</button></header>
    <nav id="hearthTabs"><button data-tab="room" type="button">YOUR HEARTH</button><button data-tab="vows" type="button">VOW BINDINGS</button></nav>
    <div class="hearth-content">
      <section id="hearthRoomPanel"><div class="hearth-room-grid">
        <div class="hearth-scene"><canvas id="hearthCanvas" width="640" height="360" role="img" aria-label="Your Hearth: a stone fireplace, timber beams, windows, Guardian trophies, and your revolving Ember."></canvas><div class="hearth-scene-caption"><button id="hearthBegin" type="button">BEGIN DESCENT ›</button></div></div>
        <aside class="hearth-workbench"><h3>Make it yours</h3><div id="hearthSlots"><button data-slot="floor" type="button">FLOOR</button><button data-slot="banner" type="button">BANNERS</button><button data-slot="lights" type="button">LIGHTS</button><button data-slot="shelf" type="button">SHELVES</button><button data-slot="rug" type="button">RUG</button><button data-slot="window" type="button">WINDOW</button></div><div id="hearthChoices"></div><label>Ember trail<select id="hearthTrail"></select></label><label>Revolving shards<select id="hearthShards"></select></label><label>Hearth music<select id="hearthMusic"></select></label></aside>
      </div></section>
      <section id="hearthVowsPanel" hidden><p id="hearthVowIntro"></p><div class="hearth-vow-actions"><strong id="hearthVowSummary"></strong><button class="btn" id="hearthAllVows" type="button">BIND ALL SIX</button><button class="btn" id="hearthClearVows" type="button">CLEAR</button></div><div id="hearthVowList"></div><p id="hearthCrowns"></p><p class="hearth-vow-note">Seals and crowns are permanent trophies. Bindings do not increase Essence rewards or apply to Archive practice and Boss Rush.</p></section>
    </div>
  </section>`;
  document.body.appendChild(overlay);
  for (const [id, name] of HEARTH_MUSIC) {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = name;
    T('hearthMusic').appendChild(o);
  }
  on(T('hearthClose'), 'click', hearthClose);
  on(T('hearthBegin'), 'click', () => {
    hearthClose();
    if (G.state === 'paused' && G.run && !G.dead) pauseGame(false);
    else requestStart();
  });
  for (const b of T('hearthTabs').children)
    on(b, 'click', () => {
      hearthView.tab = b.dataset.tab;
      hearthRefresh();
      T('hearth').querySelector('.hearth-content').scrollTop = 0;
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
