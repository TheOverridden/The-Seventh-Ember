function collectGuardianRewards() {
  if (
    !G.run ||
    !G.player ||
    G.dead ||
    G.boss ||
    G.collectingGuardianRewards ||
    !bossFloorAt(G.floor) ||
    isGuardianMode() ||
    isHearthTrial()
  )
    return 0;
  let collected = 0;
  G.collectingGuardianRewards = true;
  try {
    for (let pass = 0; pass < 8 && G.picks.length; pass++) {
      const before = new Set(G.picks);
      for (const pick of before) {
        pick.x = G.player.x;
        pick.y = G.player.y;
        pick.vx = pick.vy = 0;
      }
      updatePicks(0);
      const remaining = new Set(G.picks),
        count = [...before].filter((pick) => !remaining.has(pick)).length;
      collected += count;
      if (!count) break;
    }
  } finally {
    G.collectingGuardianRewards = false;
  }
  if (G.pendingLevels > 0 && G.state === 'playing') triggerLevelup();
  if (collected) {
    updateHUD(0);
    saveNow('guardian-rewards');
  }
  return collected;
}
function finishGuardianRewardChoices() {
  if (G.run?.guardianEndingPending && !G.pendingLevels && G.state === 'playing') beginEnding();
}
const rewardsChooseCard = chooseCard;
chooseCard = function (i) {
  const out = rewardsChooseCard(i);
  finishGuardianRewardChoices();
  return out;
};
const rewardsResumeRun = resumeRun;
resumeRun = function () {
  const out = rewardsResumeRun();
  finishGuardianRewardChoices();
  return out;
};
