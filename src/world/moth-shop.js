const MOTH_GOODS = [
  {
    id: 'mend',
    name: 'Restitched Heart',
    cost: 4,
    icon: 'heart',
    desc: 'Fully heal and gain 24 maximum health for this descent.',
  },
  {
    id: 'map',
    name: 'Warm-Stone Atlas',
    cost: 3,
    icon: 'map',
    desc: 'Reveal this floor and the next two floors, including their portals.',
  },
  {
    id: 'blessing',
    name: 'Moth’s Cabinet',
    cost: 7,
    icon: 'cabinet',
    draft: 'epic',
    desc: 'Choose one of three Epic blessings. See the actual offers before paying.',
  },
  {
    id: 'temper',
    name: 'Tempered Memory',
    cost: 7,
    icon: 'temper',
    draft: 'temper',
    desc: 'Choose a carried blessing and raise it by two ranks, up to its limit.',
  },
  {
    id: 'vessel',
    name: 'Emberglass Vessel',
    cost: 8,
    icon: 'vessel',
    desc: 'Gain 60 maximum health and fully heal for this descent.',
  },
  {
    id: 'seventh',
    name: 'Cinder of the Seventh',
    cost: 10,
    icon: 'sun',
    draft: 'mythic',
    desc: 'Choose one of three Mythics. Requires all seven Marks; once per descent.',
  },
  {
    id: 'comboKit',
    name: 'Two-Part Spark',
    cost: 9,
    icon: 'kit',
    draft: 'combo',
    desc: 'Choose a combination and receive both ingredients at rank one. Owned ranks are kept.',
  },
  {
    id: 'omen',
    name: 'The Unlabelled Jar',
    cost: 13,
    icon: 'omen',
    draft: 'mythic',
    min: 25,
    desc: 'Choose one of three Mythics. Once per descent.',
  },
  {
    id: 'essence',
    name: 'Kept Ashes',
    cost: 6,
    icon: 'ashes',
    desc: 'Recover a large permanent Essence cache: 300 plus 12 per floor, before Skill Tree bonuses.',
  },
  {
    id: 'core',
    name: 'Furnace Pearl',
    cost: 9,
    icon: 'pearl',
    relic: true,
    desc: 'All ability damage increases by 35% for the rest of this descent.',
  },
  {
    id: 'bell',
    name: 'Cinder Bell',
    cost: 9,
    icon: 'bell',
    relic: true,
    desc: 'Every fourth Flare releases a 240% damage ring and destroys hostile shots within 145 pixels.',
  },
  {
    id: 'glass',
    name: 'Witchglass Spool',
    cost: 9,
    icon: 'glass',
    relic: true,
    desc: 'Every sixth direct Bolt hit releases three seeking glass needles, each dealing 150% damage and piercing twice.',
  },
  {
    id: 'cloak',
    name: 'Moth’s Spare Cloak',
    cost: 10,
    icon: 'cloak',
    relic: true,
    desc: 'Dashing leaves a moth-shaped decoy at your starting point. After one second it bursts for 300% damage.',
  },
  {
    id: 'sun',
    name: 'Dawn in a Tin',
    cost: 12,
    icon: 'sun',
    relic: true,
    desc: 'Once this descent, survive a fatal hit at 40% health and release a 600% damage sunburst.',
  },
  {
    id: 'thread',
    name: 'Silver Winding',
    cost: 8,
    icon: 'thread',
    relic: true,
    desc: 'Every third completed Rekindle releases eight piercing silver needles for 125% damage each.',
  },
  {
    id: 'cup',
    name: 'The Garden Cup',
    cost: 7,
    icon: 'cup',
    relic: true,
    desc: 'Healing from abilities and pickups is 50% stronger for the rest of this descent.',
  },
];
const MOTH_BY_ID = Object.fromEntries(MOTH_GOODS.map((g) => [g.id, g]));
function mothGoods() {
  if (!G.run) return null;
  return (
    G.run.mothGoods ||
    (G.run.mothGoods = {
      owned: [],
      hits: 0,
      flares: 0,
      reloads: 0,
      maps: 0,
      fields: [],
      usedSun: false,
    })
  );
}
function mothOwns(id) {
  return !!mothGoods()?.owned.includes(id);
}
function mothSeed(seed, salt) {
  let n = (seed ^ Math.imul(salt + 1, 2654435761)) >>> 0;
  n ^= n << 13;
  n ^= n >>> 17;
  n ^= n << 5;
  return n >>> 0;
}
function mothStockIds(s) {
  if (s.mothStock?.version === 1) return s.mothStock.ids;
  const pools = [
      MOTH_GOODS.filter(
        (g) =>
          g.draft &&
          g.id !== 'seventh' &&
          (!g.min || G.floor >= g.min) &&
          !secretItemOwned(s, g.id) &&
          mothDraftOptions(s, g).length
      ),
      MOTH_GOODS.filter((g) => g.relic && !mothOwns(g.id)),
    ],
    ids = ['mend', ['map', 'vessel', 'essence'][mothSeed(s.seed, 51) % 3]];
  for (let p = 0; p < pools.length; p++) {
    const candidates = [...pools[p]].sort(
      (a, b) => mothSeed(s.seed, MOTH_GOODS.indexOf(a)) - mothSeed(s.seed, MOTH_GOODS.indexOf(b))
    );
    for (const g of candidates.slice(0, 2)) ids.push(g.id);
  }
  if (ids.length < 6)
    for (const id of ['vessel', 'essence', 'map'])
      if (!ids.includes(id) && ids.length < 6) ids.push(id);
  if (
    secretMarkList().length === 7 &&
    !secretItemOwned(s, 'seventh') &&
    mothDraftOptions(s, MOTH_BY_ID.seventh).length
  )
    ids.push('seventh');
  s.mothStock = { version: 1, ids };
  return ids;
}
secretShopStock = function (s) {
  return mothStockIds(s)
    .map((id) => MOTH_BY_ID[id])
    .filter(Boolean);
};
const mothItemOwned = secretItemOwned;
secretItemOwned = function (s, id) {
  return mothItemOwned(s, id) || mothOwns(id) || (id === 'omen' && G.run?.mothOmenClaimed);
};
function mothDraftOptions(s, item) {
  if (s.mothDraft?.item === item.id) return s.mothDraft.options;
  let pool = [];
  if (item.draft === 'combo')
    pool = BLESSING_COMBOS.filter(
      (c) =>
        c.cards.some((id) => !G.run.up[id]) &&
        c.cards.every((id) => {
          const card = POOL.find((o) => o.id === id);
          return (
            (G.run.up[id] || 0) > 0 ||
            ((!card.minFloor || G.floor >= card.minFloor) &&
              (!card.unlock || armoryData()[card.unlock]))
          );
        })
    ).map((c) => c.id);
  else if (item.draft === 'temper')
    pool = POOL.filter((o) => (G.run.up[o.id] || 0) > 0 && G.run.up[o.id] < o.max).map((o) => o.id);
  else
    pool = eligibleSecretCards(item.draft === 'mythic' ? 3 : 2)
      .filter((o) => o.r === (item.draft === 'mythic' ? 3 : 2))
      .map((o) => o.id);
  return pool
    .sort(
      (a, b) =>
        mothSeed(s.seed + a.split('').reduce((n, c) => n + c.charCodeAt(0), 0), 7) -
        mothSeed(s.seed + b.split('').reduce((n, c) => n + c.charCodeAt(0), 0), 7)
    )
    .slice(0, 3);
}
function mothGrantCard(id, ranks = 1, ensure = false) {
  const o = POOL.find((c) => c.id === id);
  if (!o) return;
  const old = G.run.up[id] || 0;
  G.run.up[id] = Math.min(o.max, ensure ? Math.max(1, old) : old + ranks);
  if (id === 'hp') G.player.hp += 25 * (G.run.up[id] - old);
  addChip(o);
}
function mothApply(item, choice) {
  const run = secretRun(),
    goods = mothGoods(),
    forge = run.secretForge;
  if (item.draft === 'combo') {
    const combo = COMBO_BY_ID[choice];
    for (const id of combo.cards) mothGrantCard(id, 1, true);
  } else if (item.draft) mothGrantCard(choice, item.draft === 'temper' ? 2 : 1);
  if (item.id === 'mend' || item.id === 'vessel')
    forge.health = (forge.health || 0) + (item.id === 'mend' ? 24 : 60);
  if (item.id === 'map') {
    revealWholeFloor();
    goods.maps = 2;
  }
  if (item.id === 'essence') addEss(300 + G.floor * 12);
  if (item.relic && !goods.owned.includes(item.id)) goods.owned.push(item.id);
  if (item.id === 'core') forge.damage = (forge.damage || 0) + 0.35;
  if (item.id === 'seventh') run.secretCinderClaimed = true;
  if (item.id === 'omen') run.mothOmenClaimed = true;
  recalc();
  if (item.id === 'mend' || item.id === 'vessel') G.player.hp = G.player.maxHp;
  applyHearthBindings();
}
function mothPurchase(id, choice = null) {
  const s = currentSecret(),
    item = MOTH_BY_ID[id];
  if (
    G.state !== 'secret' ||
    !secretOverlay.classList.contains('open') ||
    s?.type !== 'shop' ||
    !item ||
    !mothStockIds(s).includes(id) ||
    secretItemOwned(s, id) ||
    secretRun().secretMarks < item.cost
  )
    return false;
  if (item.draft) {
    const options = mothDraftOptions(s, item);
    if (!options.includes(choice)) return false;
    const o = POOL.find((c) => c.id === choice);
    if (o && G.run.up[o.id] >= o.max) return false;
  }
  secretMarks(-item.cost);
  s.purchased.push(id);
  mothApply(item, choice);
  s.mothDraft = null;
  s.claimed = secretShopStock(s).every((o) => secretItemOwned(s, o.id));
  s.lastPurchase = id;
  s.lastPurchaseAt = G.tAll;
  toast(item.name, 'Purchased for ' + item.cost + ' Marks');
  sfx('secretBuy');
  achievementAdd('shopBuys');
  checkAchievements();
  saveNow('moth-purchase');
  renderSecretRoom();
  return true;
}
buySecretItem = function (id) {
  const s = currentSecret(),
    item = MOTH_BY_ID[id];
  if (G.state !== 'secret' || s?.type !== 'shop' || !item || secretItemOwned(s, id)) return;
  if (item.draft) {
    const options = mothDraftOptions(s, item);
    if (!options.length) {
      fieldNote('Nothing in that cabinet fits your build.', 2);
      return;
    }
    s.mothDraft = { item: id, options };
    renderSecretRoom();
    saveNow('moth-offers');
    return;
  }
  return mothPurchase(id);
};
function mothStockButton(item, s) {
  const bought = secretItemOwned(s, item.id),
    can = secretRun().secretMarks >= item.cost,
    button = document.createElement('button');
  button.className = 'secret-stock moth-stock' + (item.relic ? ' moth-exclusive' : '');
  button.type = 'button';
  button.disabled = bought || !can;
  const icon = document.createElement('canvas');
  icon.width = icon.height = 52;
  icon.className = 'moth-item-icon';
  drawMothItem(icon.getContext('2d'), 26, 27, item.icon, 1.3);
  const copy = document.createElement('span'),
    name = document.createElement('strong'),
    desc = document.createElement('small'),
    price = document.createElement('b');
  name.textContent = item.name;
  desc.textContent = item.desc;
  price.textContent = bought ? 'TAKEN' : item.cost + ' ◆';
  copy.append(name, desc);
  button.append(icon, copy, price);
  button.addEventListener('click', () => buySecretItem(item.id));
  return button;
}
const mothSecretChoices = secretChoiceButtons;
secretChoiceButtons = function (s) {
  if (s.type !== 'shop') return mothSecretChoices(s);
  const wrap = T('secretChoices');
  wrap.replaceChildren();
  const draft = s.mothDraft,
    item = MOTH_BY_ID[draft?.item];
  if (item) {
    const header = document.createElement('div');
    header.className = 'moth-draft-header';
    header.textContent = item.name + ' · Choose one · ' + item.cost + ' Marks';
    wrap.appendChild(header);
    for (const id of draft.options) {
      const card = POOL.find((c) => c.id === id),
        combo = COMBO_BY_ID[id];
      if (!card && !combo) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'moth-offer';
      const name = document.createElement('strong'),
        desc = document.createElement('small');
      name.textContent = combo ? combo.name : card.name;
      desc.textContent = combo
        ? combo.cards.map((id) => POOL.find((c) => c.id === id).name).join(' + ')
        : item.draft === 'temper'
          ? 'RANK ' +
            (G.run.up[id] || 0) +
            ' → ' +
            Math.min(card.max, (G.run.up[id] || 0) + 2) +
            ' · ' +
            card.ds
          : RARITY[card.r].n + ' · ' + card.ds;
      button.append(name, desc);
      button.disabled = secretRun().secretMarks < item.cost;
      button.addEventListener('click', () => mothPurchase(item.id, id));
      wrap.appendChild(button);
    }
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn';
    cancel.textContent = 'BACK TO THE COUNTER';
    cancel.addEventListener('click', () => {
      s.mothDraft = null;
      renderSecretRoom();
      saveNow('moth-offers');
    });
    wrap.appendChild(cancel);
    return;
  }
  for (const item of secretShopStock(s)) wrap.appendChild(mothStockButton(item, s));
  const note = document.createElement('p');
  note.className = 'moth-stock-note';
  note.textContent =
    'Exclusive goods last for this descent. Stock and offers stay the same when you leave and return.';
  wrap.appendChild(note);
};
const mothRenderRoom = renderSecretRoom;
renderSecretRoom = function () {
  const out = mothRenderRoom(),
    s = currentSecret();
  const height = s?.type === 'shop' ? 840 : 480;
  if (secretCanvas.height !== height) secretCanvas.height = height;
  secretOverlay.classList.toggle('moth-shop', s?.type === 'shop');
  if (s?.type === 'shop') {
    s.claimed = secretShopStock(s).every((o) => secretItemOwned(s, o.id));
    secretOverlay.style.setProperty('--secret-accent', '#bfa675');
    secretOverlay.style.setProperty('--secret-hot', '#ffe0a0');
    T('secretReward').textContent = s.claimed
      ? 'THE COUNTER IS EMPTY'
      : 'EXCLUSIVE GOODS · CHOSEN BLESSINGS · KEPT ASHES';
    T('secretLine').textContent = [
      '“That one’s not a paperweight. Learned that myself.”',
      '“I keep the good stuff below the stairs.”',
      '“You can look. Looking’s still free.”',
    ][s.entered % 3];
  }
  return out;
};
const mothSetupFloor = setupFloor;
setupFloor = function (f) {
  const old = G.floor,
    out = mothSetupFloor(f);
  if (G.run && !G.run.guardianMode) {
    mothGoods().fields = [];
    if (f === old + 1 && mothGoods().maps > 0) {
      revealWholeFloor();
      mothGoods().maps--;
    }
  }
  return out;
};
const mothDamageEnemy = damageEnemy;
damageEnemy = function (e, damage, a, crit, kb, kind = 'shot') {
  const hp = e?.hp,
    out = mothDamageEnemy(e, damage, a, crit, kb, kind);
  if (e?.hp < hp && kind === 'shot' && mothOwns('glass')) {
    const m = mothGoods();
    m.hits = (m.hits + 1) % 6;
    if (!m.hits)
      for (const turn of [-0.3, 0, 0.3])
        comboShot(e.x, e.y, a + turn, 1.5, 'mothGlass', {
          comboArt: 'prismChoir',
          r: 6,
          pierce: 2,
          seeking: 0.12,
          life: 1.5,
        });
  }
  return out;
};
const mothStrikeMelee = strikeMelee;
strikeMelee = function () {
  const out = mothStrikeMelee();
  if (mothOwns('bell')) {
    const m = mothGoods();
    m.flares = (m.flares + 1) % 4;
    if (!m.flares) {
      const p = G.player;
      blessingBurst(p.x, p.y, 145, p.dmg * 2.4, 'mothBell', '#f5d18f');
      G.ebul = G.ebul.filter((b) => d2(b.x, b.y, p.x, p.y) > 145 ** 2);
      sfx('secretMark');
    }
  }
  return out;
};
function mothFinishReload() {
  if (!mothOwns('thread')) return;
  const m = mothGoods();
  m.reloads = (m.reloads + 1) % 3;
  if (!m.reloads)
    for (let i = 0; i < 8; i++)
      comboShot(G.player.x, G.player.y, (i * TAU) / 8, 1.25, 'mothSilver', {
        comboArt: 'prismChoir',
        r: 5,
        pierce: 2,
        life: 1.25,
      });
}
const mothCombatTick = combatTick;
combatTick = function (dt) {
  const before = G.player?.reloadT || 0,
    out = mothCombatTick(dt);
  if (before > 0 && G.player?.reloadT === 0) mothFinishReload();
  return out;
};
const mothBeginReload = beginReload;
beginReload = function () {
  const before = G.player?.reloadT || 0,
    out = mothBeginReload();
  if (before > 0 && G.player?.reloadT === 0) mothFinishReload();
  return out;
};
const mothCardHeal = cardHeal;
cardHeal = function (amount, label) {
  return mothCardHeal(amount * (mothOwns('cup') ? 1.5 : 1), label);
};
const mothUpdatePicks = updatePicks;
updatePicks = function (dt) {
  const changed = [];
  if (mothOwns('cup'))
    for (const p of G.picks)
      if (p.kind === 'heart') {
        changed.push([p, p.val]);
        p.val *= 1.5;
      }
  try {
    return mothUpdatePicks(dt);
  } finally {
    for (const [p, val] of changed) p.val = val;
  }
};
const mothDie = die;
die = function () {
  if (G.player?.hp <= 0 && mothOwns('sun') && !mothGoods().usedSun) {
    const p = G.player;
    mothGoods().usedSun = true;
    p.hp = Math.max(1, p.maxHp * 0.4);
    p.hitCd = 3;
    blessingBurst(p.x, p.y, 230, p.dmg * 6, 'mothDawn', '#ffe7a5');
    sfx('mythic');
    toast('DAWN IN A TIN', 'The last light is spent.');
    saveNow('moth-dawn');
    return;
  }
  return mothDie();
};
const mothUpdate = update;
update = function (dt) {
  const p = G.player,
    dash = p?.dashT || 0,
    x = p?.x,
    y = p?.y,
    out = mothUpdate(dt);
  if (!p || !G.run || G.dead) return out;
  const m = mothGoods();
  if (dash <= 0 && p.dashT > 0 && mothOwns('cloak')) {
    m.fields.push({ x, y, t: 1, max: 1 });
    m.fields = m.fields.slice(-3);
  }
  for (const f of m.fields) {
    f.t -= dt;
    if (f.t <= 0) blessingBurst(f.x, f.y, 150, p.dmg * 3, 'mothDecoy', '#c3dfd4');
  }
  m.fields = m.fields.filter((f) => f.t > 0);
  return out;
};
const mothValidateCheckpoint = validateCheckpoint;
validateCheckpoint = function (raw) {
  const out = mothValidateCheckpoint(raw),
    m = out.run.mothGoods;
  if (m) {
    out.run.mothGoods = {
      owned: Array.isArray(m.owned)
        ? MOTH_GOODS.filter((g) => g.relic && m.owned.includes(g.id)).map((g) => g.id)
        : [],
      hits: Number.isInteger(m.hits) ? clamp(m.hits, 0, 5) : 0,
      flares: Number.isInteger(m.flares) ? clamp(m.flares, 0, 3) : 0,
      reloads: Number.isInteger(m.reloads) ? clamp(m.reloads, 0, 2) : 0,
      maps: Number.isInteger(m.maps) ? clamp(m.maps, 0, 2) : 0,
      usedSun: m.usedSun === true,
      fields: Array.isArray(m.fields)
        ? m.fields
            .filter((f) => f && [f.x, f.y, f.t].every(Number.isFinite) && f.t > 0 && f.t <= 1)
            .slice(-3)
        : [],
    };
  }
  const s = out.world.secretRoom;
  if (s?.mothStock) {
    s.mothStock = {
      version: 1,
      ids: Array.isArray(s.mothStock.ids)
        ? [...new Set(s.mothStock.ids.filter((id) => MOTH_BY_ID[id]))].slice(0, 7)
        : [],
    };
  }
  if (s?.mothDraft) {
    const item = MOTH_BY_ID[s.mothDraft.item],
      opts = s.mothDraft.options;
    if (!item?.draft || !Array.isArray(opts)) s.mothDraft = null;
    else
      s.mothDraft = {
        item: item.id,
        options: opts
          .filter((id) =>
            item.draft === 'combo' ? COMBO_BY_ID[id] : POOL.some((o) => o.id === id)
          )
          .slice(0, 3),
      };
  }
  return out;
};
