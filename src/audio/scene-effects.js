'use strict';

function sceneTone(freq, dur = 0.65, vol = 0.018, delay = 0, type = 'triangle') {
  if (!AC) return;
  const t = AC.currentTime + delay,
    o = AC.createOscillator(),
    g = AC.createGain(),
    lp = AC.createBiquadFilter();
  o.type = type;
  o.frequency.value = freq;
  lp.type = 'lowpass';
  lp.frequency.value = 1800;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.025);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(lp);
  lp.connect(g);
  g.connect(musLP);
  o.start(t);
  o.stop(t + dur + 0.05);
}
