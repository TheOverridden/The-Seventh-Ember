const TILE=36;
const BASE={hp:100,dmg:12,rate:2.5,speed:208,magnet:96,crit:.05,bulletSpd:530,dashCd:2.6};
const RARITY=[{n:'COMMON',c:'#9db4d0'},{n:'RARE',c:'#b06cff'},{n:'EPIC',c:'#ffcf6b'}];
const POOL=[
 {id:'dmg',   r:0,max:99,w:10,icon:'sword',       name:'Sharpened Embers', ds:'+18% damage'},
 {id:'rate',  r:0,max:14,w:10,icon:'zap',         name:'Rapid Conjuring',  ds:'+15% casting rate'},
 {id:'speed', r:0,max:9, w:9, icon:'wind',        name:'Boots of Swiftness',ds:'+10% move speed'},
 {id:'hp',    r:0,max:99,w:10,icon:'heart',       name:'Vital Heart',      ds:'+25 max HP and restore 25 HP'},
 {id:'proj',  r:1,max:3, w:5, icon:'copy',        name:'Split Sigil',      ds:'+1 projectile per volley'},
 {id:'pierce',r:1,max:3, w:5, icon:'target',      name:'Piercing Light',   ds:'Bullets pierce +1 enemy'},
 {id:'crit',  r:0,max:7, w:6, icon:'eye',         name:"Hunter's Eye",     ds:'+8% critical chance (crits deal 2×)'},
 {id:'magnet',r:0,max:6, w:7, icon:'magnet',      name:'Lodestone Charm',  ds:'+35% pickup radius'},
 {id:'xp',    r:0,max:7, w:7, icon:'book-open',   name:"Scholar's Mind",   ds:'+15% XP gained'},
 {id:'regen', r:0,max:6, w:6, icon:'activity',    name:'Kindled Regeneration',ds:'+0.6 HP regenerated per second'},
 {id:'orbital',r:1,max:4,w:4, icon:'orbit',       name:'Orbiting Cinders',    ds:'+1 cinder orbiting you, scorching foes'},
 {id:'dash',  r:0,max:4, w:6, icon:'feather',     name:'Phantom Step',     ds:'−15% dash cooldown'},
 {id:'ric',   r:2,max:2, w:3, icon:'refresh-ccw', name:'Ricochet Rune',    ds:'Bullets ricochet to a nearby enemy (+1)'},
 {id:'exec',  r:1,max:3, w:4, icon:'axe',         name:'Executioner',      ds:'+30% damage against enemies below 30% HP'},
 {id:'glass', r:2,max:2, w:2, icon:'flame',       name:'Glass Cannon',     ds:'+40% damage, but −10% max HP'}
];
const bossFloorAt = f => f%5===0;
const FN_A=['Hollow','Mosslight','Drowned','Ashen','Starless','Ember','Obsidian','Weeping','Shattered','Sunken','Crimson','Whispering'];
const FN_B=['Gate','Vaults','Chapel','Stacks','Deep','Gallery','Warrens','Sanctum','Expanse','Reliquary','Catacombs','Spire'];
const BOSS_NAMES=['THE STAR WARDEN','THE HOLLOW MATRIARCH','THE EMBER COLOSSUS','THE VOID SERAPH','THE OBSIDIAN TYRANT'];
const BOSS_RANK=['','ASCENDANT','REBORN','ETERNAL','UNMADE'];
function bossTitle(f){
  const t=Math.max(1,Math.ceil(f/5));
  const base=BOSS_NAMES[(t-1)%BOSS_NAMES.length];
  const cyc=Math.floor((t-1)/BOSS_NAMES.length);
  return cyc>0 ? base+' '+BOSS_RANK[Math.min(cyc,BOSS_RANK.length-1)] : base;
}
function floorName(f){
  if(f<=10) return HOLLOW_FLOORS[f-1].name;
  if(bossFloorAt(f)) return 'Lair of '+bossTitle(f).replace(/^THE /,'the ');
  return FN_A[(f*5)%FN_A.length]+' '+FN_B[(f*7)%FN_B.length];
}
const PALETTES=[
 {f:['#0c0f16','#0e1219','#101420','#121724'], edge:'#232c44', rune:'rgba(90,120,200,', fog:'rgba(8,10,18,'},
 {f:['#0b1210','#0d1512','#101a15','#132018'], edge:'#2a4438', rune:'rgba(90,200,160,', fog:'rgba(8,16,12,'},
 {f:['#140d0d','#181010','#1d1313','#221616'], edge:'#4a2f2f', rune:'rgba(220,120,90,', fog:'rgba(16,9,9,'},
 {f:['#100b16','#130d1a','#171021','#1b1428'], edge:'#3a2f52', rune:'rgba(150,110,220,', fog:'rgba(11,8,18,'}
];
const G={
  state:'boot', paused:false, dead:false,
  ctx:null, w:0, h:0, dpr:1, t:0,
  run:null, player:null, floor:1,
  world:null, enemies:[], bullets:[], ebul:[], picks:[], parts:[], texts:[], chests:[], portal:null,
  cam:{x:0,y:0,shake:0}, pendingLevels:0, bossActive:false,
  fps:60, partScale:1, opts:{freeChoice:false},
};
