/* Published progression targets. Keep these beside the live formulas so a
   balance pass can be checked without guessing what a healthy run looks like. */
'use strict';

const PROGRESSION_BALANCE_VERSION=2;
const CAMPAIGN_LEVEL_TARGETS=[
 {floor:5,min:6,max:8},{floor:10,min:10,max:12},{floor:20,min:17,max:20},
 {floor:30,min:23,max:26},{floor:40,min:29,max:32},{floor:50,min:34,max:37}
];
const CAMPAIGN_REWARD_TARGET={fullClearMin:6500,fullClearMax:8000,masteryCost:MASTERY_TOTAL};
function xpToFinishLevel(level){let total=0;for(let rank=1;rank<level;rank++)total+=needXP(rank);return total;}

const treeFooter=document.querySelector('.tree-foot span:last-child');
if(treeFooter)treeFooter.textContent='ABOUT ◆ 6,500–8,000 PER FULL CLEAR · ◆ '+MASTERY_TOTAL.toLocaleString()+' TO MASTER';
globalThis.VoidFallProgression={
 version:PROGRESSION_BALANCE_VERSION,
 levelTargets:CAMPAIGN_LEVEL_TARGETS.map(target=>({...target})),
 rewardTarget:{...CAMPAIGN_REWARD_TARGET},
 xpToFinishLevel,
 guardianRequirements:[...ADAPTIVE_REQUIREMENT]
};
document.documentElement.dataset.progression='rebuild-v2';
