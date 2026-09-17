const MID_GUARDIAN_HP_V3={bellkeeper:8400,colossus:13500,astronomer:18500,scribe:24500};
const MID_GUARDIAN_DMG_V3={bellkeeper:32,colossus:39,astronomer:44,scribe:50};
Object.assign(ENDGAME_HP,MID_GUARDIAN_HP_V3);Object.assign(ENDGAME_DAMAGE,MID_GUARDIAN_DMG_V3);
Object.assign(LATE_BOSSES.bellkeeper,{hp:8400,dmg:32});Object.assign(LATE_BOSSES.emberColossus,{hp:13500,dmg:39});Object.assign(LATE_BOSSES.glassAstronomer,{hp:18500,dmg:44});Object.assign(LATE_BOSSES.paleScribe,{hp:24500,dmg:50});

const durableMidPiece=placeMidGuardianPiece;
placeMidGuardianPiece=function(b,kind,slot,count,radius,hp){return durableMidPiece(b,kind,slot,count,radius,Math.round(hp*1.5));};
const durableMidState=midGuardianState;
midGuardianState=function(b){const m=durableMidState(b);if(!m.durabilityV3){m.durabilityV3=true;m.desperate=b.hp<=b.max*.25;m.damagePulse=0;m.damageSpent=0;}return m;};

const durableMidDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(e?.lateBoss&&e.introduced&&MID_GUARDIAN_KEYS.has(e.bossKey)){const s=e.bs,m=midGuardianState(e),pieces=midGuardianPieces(e).length,exposed=(s.exposed||0)>0||!pieces;if(m.invulnerable||s.mode==='shift')return;const shield={bellkeeper:.38,colossus:.55,astronomer:.34,scribe:.32}[e.bossKey];if(pieces)dmg*=shield;const cap=e.max*(exposed?.075:.025);dmg=Math.min(dmg,cap);}
 return durableMidDamage(e,dmg,ang,crit,kb,kind);
};

const durableMiddleAI=middleGuardianAI;
middleGuardianAI=function(b,dt,d,dx,dy){const m=midGuardianState(b);if(m.phase&&b.hp<=b.max*.25&&!m.desperate){m.desperate=true;b.bs.mode='shift';b.bs.kind='desperation';b.bs.t=b.bs.duration=.9;m.events=[];discardMidGuardianPieces(b);clearMidGuardianHazards(b);G.ebul=[];burst(b.x,b.y,36,b.col,230,.9,3,true);fieldNote({bellkeeper:'The last bell cracks.',colossus:'The furnace sheds its casing.',astronomer:'The final lens turns inward.',scribe:'The page begins writing itself.'}[b.bossKey],2.6);sfx('midPhase');return;}const haste=m.desperate?1.24:m.phase?1.14:1;return durableMiddleAI(b,dt*haste,d,dx,dy);};
bellkeeperAI=colossusAI=astronomerAI=scribeAI=middleGuardianAI;

const durableMidBroken=midPieceBroken;
midPieceBroken=function(owner,e){const before=midGuardianPieces(owner).length;durableMidBroken(owner,e);if(before===0||midGuardianPieces(owner).length===0){const m=owner.bs?.mid;if(m)m.respawn={bellkeeper:10,colossus:11,astronomer:10,scribe:12}[owner.bossKey];}};
