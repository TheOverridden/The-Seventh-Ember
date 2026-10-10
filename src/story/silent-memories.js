const SILENT_ECHO_ACTIONS = {};
(function () {
  const A = memoryActor,
    P = memoryProp;
  const scene = (id, actors, props) => {
    ECHO_TABLEAUS[id] = { mood: '', actors, props };
  };
  const track = (id, actor, keys) => {
    const s = SILENT_ECHO_ACTIONS[id] || (SILENT_ECHO_ACTIONS[id] = { duration: 12, tracks: [] });
    s.tracks.push({ actor, keys });
  };
  scene(
    'echo1',
    [A('warden', 0.32, 0.67, 'guard'), A('watcher', 0.67, 0.67, 'walk', -1)],
    [P('door', 0.78, 0.47, 46, 84), P('table', 0.24, 0.63, 66), P('slate', 0.24, 0.54, 30)]
  );
  track('echo1', 0, [
    [0, 0.32, 0.67, 'guard'],
    [3, 0.43, 0.67, 'offer'],
    [6, 0.43, 0.67, 'point'],
    [9, 0.19, 0.67, 'walk'],
  ]);
  track('echo1', 1, [
    [0, 0.78, 0.67, 'walk'],
    [3, 0.57, 0.67, 'receive'],
    [6, 0.57, 0.67, 'inspect'],
    [9, 0.45, 0.67, 'guard'],
  ]);
  scene(
    'echo2',
    [A('lamplighter', 0.29, 0.68, 'offer'), A('wick', 0.46, 0.57, 'follow', -1, 0, 0.7)],
    [
      P('lamp', 0.32, 0.42),
      P('lamp', 0.55, 0.42),
      P('lamp', 0.78, 0.42),
      P('crate', 0.18, 0.72, 30),
    ]
  );
  track('echo2', 0, [
    [0, 0.29, 0.68, 'offer'],
    [3, 0.51, 0.68, 'offer'],
    [6, 0.75, 0.68, 'offer'],
    [9, 0.82, 0.68, 'walk'],
  ]);
  track('echo2', 1, [
    [0, 0.46, 0.57, 'follow'],
    [3, 0.4, 0.57, 'follow'],
    [6, 0.64, 0.57, 'follow'],
    [9, 0.74, 0.57, 'follow'],
  ]);
  track('echo3', 0, [
    [0, 0.45, 0.7, 'reach'],
    [3, 0.45, 0.7, 'pull'],
    [6, 0.45, 0.7, 'pull'],
    [9, 0.45, 0.7, 'cheer'],
  ]);
  track('echo3', 1, [
    [0, 0.62, 0.66, 'help'],
    [4, 0.62, 0.66, 'help'],
    [6, 0.72, 0.66, 'watch'],
  ]);
  track('echo4', 0, [
    [0, 0.43, 0.66, 'write'],
    [4, 0.43, 0.66, 'hold'],
    [6, 0.43, 0.66, 'set'],
    [9, 0.77, 0.66, 'walk'],
  ]);
  track('echo5', 0, [
    [0, 0.23, 0.68, 'carry'],
    [3, 0.36, 0.68, 'wait'],
    [6, 0.69, 0.68, 'walk'],
    [9, 0.88, 0.68, 'walk'],
  ]);
  track('echo5', 1, [
    [0, 0.68, 0.64, 'guard'],
    [3, 0.61, 0.64, 'pull'],
    [6, 0.61, 0.64, 'hold'],
    [9, 0.61, 0.64, 'guard'],
  ]);
  scene(
    'echo6',
    [A('gardener', 0.41, 0.69, 'kneel'), A('gardener', 0.62, 0.69, 'hold', -1)],
    [P('sapling', 0.51, 0.62, 28, 68), P('root', 0.5, 0.77, 120)]
  );
  track('echo6', 0, [
    [0, 0.35, 0.69, 'walk'],
    [2, 0.41, 0.69, 'kneel'],
    [6, 0.41, 0.69, 'repair'],
    [9, 0.24, 0.69, 'walk'],
  ]);
  track('echo6', 1, [
    [0, 0.62, 0.69, 'hold'],
    [7, 0.62, 0.69, 'hold'],
    [9, 0.77, 0.69, 'walk'],
  ]);
  track('echo7', 0, [
    [0, 0.24, 0.69, 'warn'],
    [3, 0.24, 0.69, 'flee'],
    [9, 0.08, 0.69, 'flee'],
  ]);
  track('echo7', 1, [
    [0, 0.49, 0.68, 'reach'],
    [3, 0.57, 0.69, 'hold'],
    [6, 0.34, 0.69, 'walk'],
    [9, 0.1, 0.69, 'walk'],
  ]);
  track('echo7', 2, [
    [0, 0.67, 0.72, 'watch'],
    [3, 0.63, 0.72, 'hide'],
    [6, 0.4, 0.72, 'walk'],
    [9, 0.15, 0.72, 'walk'],
  ]);
  track('echo8', 0, [
    [0, 0.41, 0.7, 'paint'],
    [5, 0.41, 0.7, 'paint'],
    [6, 0.32, 0.7, 'inspect'],
    [8, 0.32, 0.7, 'repair'],
    [10, 0.22, 0.7, 'walk'],
  ]);
  scene(
    'echo9',
    [A('caretaker', 0.32, 0.68, 'set'), A('wick', 0.72, 0.51, 'hover', -1, 0, 0.8)],
    [
      ...Array.from({ length: 6 }, (_, i) => P('pod', 0.18 + i * 0.125, 0.64, 30)),
      P('labels', 0.5, 0.79, 98),
    ]
  );
  track('echo9', 0, [
    [0, 0.23, 0.73, 'set'],
    [3, 0.41, 0.73, 'set'],
    [6, 0.62, 0.73, 'set'],
    [9, 0.77, 0.73, 'set'],
  ]);
  track('echo9', 1, [
    [0, 0.72, 0.51, 'hover'],
    [5, 0.72, 0.51, 'hover'],
    [7, 0.54, 0.67, 'carry'],
    [10, 0.86, 0.58, 'follow'],
  ]);
  scene(
    'echo10',
    [A('gardener', 0.36, 0.71, 'kneel')],
    [
      P('root', 0.44, 0.76, 130),
      P('tool', 0.28, 0.61, 30),
      P('bed', 0.69, 0.62, 66),
      P('door', 0.18, 0.5, 46, 90),
    ]
  );
  track('echo10', 0, [
    [0, 0.36, 0.71, 'kneel'],
    [4, 0.36, 0.71, 'repair'],
    [6, 0.28, 0.67, 'set'],
    [9, 0.65, 0.7, 'sit'],
  ]);
  track('trace11', 0, [
    [0, 0.38, 0.65, 'mark'],
    [5, 0.38, 0.65, 'mark'],
    [8, 0.28, 0.65, 'watch'],
  ]);
  track('trace11', 1, [
    [0, 0.64, 0.74, 'carry'],
    [5, 0.66, 0.61, 'carry'],
    [8, 0.66, 0.61, 'set'],
  ]);
  track('trace12', 0, [
    [0, 0.34, 0.69, 'watch'],
    [3, 0.4, 0.69, 'brace'],
    [8, 0.4, 0.69, 'stand'],
  ]);
  track('trace12', 1, [
    [0, 0.61, 0.68, 'turn'],
    [4, 0.61, 0.68, 'brace'],
    [6, 0.61, 0.68, 'turn'],
    [9, 0.61, 0.68, 'watch'],
  ]);
  scene(
    'trace13',
    [A('worker', 0.24, 0.69, 'hold'), A('worker', 0.6, 0.69, 'hold', -1)],
    [P('door', 0.82, 0.45, 48, 92), P('stairs', 0.5, 0.73, 180), P('water', 0.5, 0.86, 190)]
  );
  track('trace13', 0, [
    [0, 0.24, 0.74, 'hold'],
    [3, 0.3, 0.66, 'hold'],
    [4, 0.3, 0.68, 'duck'],
    [6, 0.3, 0.66, 'brace'],
    [10, 0.39, 0.57, 'hold'],
  ]);
  track('trace13', 1, [
    [0, 0.6, 0.74, 'hold'],
    [3, 0.66, 0.66, 'hold'],
    [4, 0.66, 0.68, 'brace'],
    [6, 0.66, 0.66, 'hold'],
    [10, 0.75, 0.57, 'hold'],
  ]);
  track('trace14', 0, [
    [0, 0.31, 0.68, 'turn'],
    [4, 0.31, 0.68, 'signal'],
    [9, 0.31, 0.68, 'watch'],
  ]);
  track('trace14', 1, [
    [0, 0.52, 0.64, 'watch'],
    [4, 0.52, 0.64, 'signal'],
    [9, 0.52, 0.64, 'watch'],
  ]);
  track('trace14', 2, [
    [0, 0.73, 0.69, 'watch'],
    [5, 0.73, 0.69, 'turn'],
    [9, 0.73, 0.69, 'signal'],
  ]);
  track('trace15', 0, [
    [0, 0.5, 0.67, 'pull'],
    [8, 0.5, 0.67, 'pull'],
    [10, 0.5, 0.67, 'watch'],
  ]);
  track('trace15', 1, [
    [0, 0.24, 0.76, 'walk'],
    [4, 0.46, 0.73, 'walk'],
    [8, 0.76, 0.63, 'walk'],
    [10, 0.86, 0.59, 'walk'],
  ]);
  track('trace16', 0, [
    [0, 0.28, 0.67, 'sit'],
    [3, 0.28, 0.67, 'offer'],
    [6, 0.23, 0.67, 'sit'],
  ]);
  track('trace16', 1, [
    [0, 0.43, 0.68, 'eat'],
    [6, 0.43, 0.68, 'eat'],
  ]);
  track('trace16', 2, [
    [0, 0.61, 0.67, 'eat'],
    [4, 0.61, 0.67, 'receive'],
    [8, 0.61, 0.67, 'eat'],
  ]);
  track('trace16', 3, [
    [0, 0.87, 0.71, 'walk'],
    [5, 0.75, 0.67, 'sit'],
    [9, 0.75, 0.67, 'eat'],
  ]);
  track('trace17', 0, [
    [0, 0.38, 0.69, 'pull'],
    [3, 0.38, 0.69, 'inspect'],
    [5, 0.38, 0.69, 'set'],
    [8, 0.48, 0.69, 'receive'],
  ]);
  track('trace17', 1, [
    [0, 0.61, 0.65, 'watch'],
    [5, 0.61, 0.65, 'offer'],
    [8, 0.61, 0.65, 'watch'],
  ]);
  track('trace18', 0, [
    [0, 0.27, 0.69, 'signal'],
    [6, 0.27, 0.69, 'watch'],
    [9, 0.27, 0.69, 'signal'],
  ]);
  track('trace18', 1, [
    [0, 0.49, 0.67, 'watch'],
    [3, 0.49, 0.73, 'kneel'],
    [6, 0.49, 0.67, 'hold'],
    [9, 0.49, 0.67, 'signal'],
  ]);
  track('trace19', 0, [
    [0, 0.37, 0.68, 'inspect'],
    [3, 0.37, 0.68, 'hold'],
    [6, 0.42, 0.68, 'hold'],
    [9, 0.42, 0.68, 'repair'],
  ]);
  track('trace19', 1, [
    [0, 0.61, 0.68, 'kneel'],
    [3, 0.61, 0.68, 'hold'],
    [6, 0.66, 0.68, 'hold'],
    [9, 0.66, 0.68, 'hold'],
  ]);
  scene(
    'trace20',
    [
      A('worker', 0.35, 0.68, 'walk'),
      A('worker', 0.58, 0.67, 'walk', 1, 2),
      A('worker', 0.76, 0.66, 'walk', 1, 1),
    ],
    [
      P('rack', 0.55, 0.47, 130, 55),
      P('pail', 0.35, 0.6, 24),
      P('door', 0.86, 0.48, 50, 98),
      P('furnace', 0.18, 0.48, 46, 64),
    ]
  );
  track('trace20', 0, [
    [0, 0.35, 0.68, 'set'],
    [3, 0.75, 0.68, 'walk'],
    [5, 0.49, 0.68, 'walk'],
    [7, 0.35, 0.68, 'carry'],
    [10, 0.87, 0.68, 'walk'],
  ]);
  track('trace20', 1, [
    [0, 0.58, 0.67, 'set'],
    [5, 0.88, 0.67, 'walk'],
  ]);
  track('trace20', 2, [
    [0, 0.76, 0.66, 'set'],
    [3, 0.89, 0.66, 'walk'],
  ]);
  track('trace21', 0, [
    [0, 0.29, 0.68, 'eat'],
    [7, 0.29, 0.68, 'watch'],
  ]);
  track('trace21', 1, [
    [0, 0.51, 0.67, 'eat'],
    [4, 0.51, 0.67, 'look'],
  ]);
  track('trace21', 2, [
    [0, 0.86, 0.67, 'walk'],
    [4, 0.68, 0.67, 'reach'],
    [7, 0.68, 0.67, 'watch'],
    [10, 0.19, 0.67, 'walk'],
  ]);
  track('trace22', 0, [
    [0, 0.35, 0.67, 'repair'],
    [4, 0.57, 0.67, 'repair'],
    [6, 0.57, 0.67, 'wait'],
    [9, 0.37, 0.67, 'walk'],
  ]);
  track('trace22', 1, [
    [0, 0.76, 0.64, 'watch'],
    [6, 0.67, 0.64, 'stop'],
    [8, 0.67, 0.64, 'turn'],
  ]);
  scene(
    'trace23',
    [A('astronomer', 0.28, 0.66, 'mark'), A('worker', 0.63, 0.72, 'carry', -1)],
    [P('column', 0.5, 0.45, 28, 100), P('chalk', 0.42, 0.76, 75), P('path', 0.5, 0.65, 180)]
  );
  track('trace23', 0, [
    [0, 0.28, 0.66, 'mark'],
    [3, 0.38, 0.72, 'mark'],
    [6, 0.64, 0.72, 'mark'],
    [9, 0.76, 0.6, 'mark'],
  ]);
  track('trace23', 1, [
    [0, 0.21, 0.7, 'carry'],
    [3, 0.32, 0.76, 'carry'],
    [6, 0.57, 0.76, 'carry'],
    [9, 0.7, 0.65, 'carry'],
  ]);
  scene(
    'trace24',
    [A('astronomer', 0.38, 0.66, 'turn'), A('child', 0.65, 0.7, 'watch', -1, 1, 0.8)],
    [P('lens', 0.5, 0.43, 75), P('chair', 0.59, 0.73, 28), P('map', 0.25, 0.56, 70)]
  );
  track('trace24', 0, [
    [0, 0.38, 0.66, 'turn'],
    [4, 0.4, 0.66, 'watch'],
    [8, 0.49, 0.66, 'receive'],
  ]);
  track('trace24', 1, [
    [0, 0.72, 0.74, 'watch'],
    [4, 0.6, 0.65, 'look'],
    [7, 0.6, 0.65, 'reach'],
    [9, 0.6, 0.65, 'hold'],
  ]);
  track('trace25', 0, [
    [0, 0.47, 0.64, 'look'],
    [5, 0.47, 0.64, 'watch'],
    [7, 0.47, 0.64, 'set'],
    [9, 0.29, 0.64, 'walk'],
  ]);
  track('trace26', 0, [
    [0, 0.37, 0.66, 'stamp'],
    [4, 0.37, 0.66, 'inspect'],
    [6, 0.37, 0.66, 'turn'],
    [8, 0.37, 0.66, 'stamp'],
  ]);
  track('trace27', 0, [
    [0, 0.38, 0.66, 'pull'],
    [3, 0.38, 0.66, 'read'],
    [5, 0.25, 0.66, 'kneel'],
    [8, 0.65, 0.66, 'handkey'],
  ]);
  track('trace28', 0, [
    [0, 0.33, 0.68, 'write'],
    [5, 0.33, 0.68, 'offer'],
    [8, 0.33, 0.68, 'set'],
  ]);
  track('trace28', 1, [
    [0, 0.6, 0.66, 'read'],
    [5, 0.6, 0.66, 'cut'],
    [7, 0.73, 0.66, 'hold'],
    [10, 0.78, 0.66, 'set'],
  ]);
  track('trace29', 0, [
    [0, 0.31, 0.68, 'hold'],
    [3, 0.4, 0.68, 'carry'],
    [8, 0.82, 0.68, 'carry'],
  ]);
  track('trace29', 1, [
    [0, 0.62, 0.7, 'carry'],
    [4, 0.5, 0.7, 'set'],
    [7, 0.73, 0.7, 'set'],
    [10, 0.82, 0.7, 'walk'],
  ]);
  track('trace30', 0, [
    [0, 0.42, 0.66, 'read'],
    [4, 0.42, 0.66, 'burn'],
    [8, 0.27, 0.66, 'walk'],
  ]);
  track('trace30', 1, [
    [0, 0.64, 0.47, 'hover'],
    [3, 0.52, 0.57, 'reach'],
    [6, 0.68, 0.54, 'carry'],
    [10, 0.84, 0.5, 'follow'],
  ]);
  scene(
    'trace31',
    [A('servant', 0.3, 0.68, 'set'), A('servant', 0.72, 0.67, 'walk', -1, 2)],
    [
      P('table', 0.5, 0.58, 170),
      P('chair', 0.32, 0.74, 28),
      P('chair', 0.6, 0.74, 28),
      P('door', 0.85, 0.47, 42, 90),
    ]
  );
  track('trace31', 0, [
    [0, 0.3, 0.68, 'set'],
    [4, 0.61, 0.68, 'count'],
    [6, 0.8, 0.68, 'walk'],
    [9, 0.65, 0.68, 'carry'],
  ]);
  track('trace31', 1, [
    [0, 0.83, 0.67, 'walk'],
    [5, 0.73, 0.67, 'carry'],
    [9, 0.42, 0.67, 'set'],
  ]);
  track('trace32', 0, [
    [0, 0.31, 0.64, 'argue'],
    [8, 0.31, 0.64, 'argue'],
  ]);
  track('trace32', 1, [
    [0, 0.69, 0.64, 'refuse'],
    [8, 0.69, 0.64, 'argue'],
  ]);
  track('trace32', 2, [
    [0, 0.5, 0.83, 'carry'],
    [4, 0.5, 0.69, 'set'],
    [8, 0.5, 0.84, 'walk'],
  ]);
  track('trace33', 0, [
    [0, 0.26, 0.65, 'seal'],
    [4, 0.26, 0.65, 'watch'],
  ]);
  track('trace33', 1, [
    [0, 0.5, 0.67, 'read'],
    [6, 0.5, 0.67, 'sign'],
    [9, 0.5, 0.67, 'hold'],
  ]);
  track('trace33', 2, [
    [0, 0.74, 0.65, 'watch'],
    [2, 0.74, 0.65, 'seal'],
    [4, 0.74, 0.65, 'watch'],
  ]);
  scene(
    'trace34',
    [A('servant', 0.46, 0.71, 'kneel'), A('regent', 0.23, 0.65, 'walk', 1, 1)],
    [P('cloth', 0.51, 0.76, 140), P('door', 0.8, 0.48, 45, 95)]
  );
  track('trace34', 0, [
    [0, 0.46, 0.71, 'repair'],
    [6, 0.46, 0.71, 'repair'],
    [9, 0.46, 0.71, 'watch'],
  ]);
  track('trace34', 1, [
    [0, 0.23, 0.65, 'walk'],
    [4, 0.49, 0.7, 'walk'],
    [5, 0.54, 0.7, 'duck'],
    [7, 0.62, 0.64, 'walk'],
    [10, 0.85, 0.64, 'walk'],
  ]);
  scene(
    'trace35',
    [A('regent', 0.34, 0.66, 'stand'), A('regent', 0.68, 0.66, 'stand', -1, 3)],
    [P('cloth', 0.5, 0.74, 170), P('bell', 0.19, 0.42, 32)]
  );
  track('trace35', 0, [
    [0, 0.34, 0.66, 'stand'],
    [2, 0.38, 0.6, 'walk'],
    [4, 0.42, 0.64, 'turn'],
    [5, 0.42, 0.64, 'watch'],
    [7, 0.34, 0.66, 'walk'],
    [9, 0.38, 0.6, 'walk'],
    [11, 0.42, 0.64, 'turn'],
  ]);
  track('trace35', 1, [
    [0, 0.68, 0.66, 'stand'],
    [2, 0.65, 0.6, 'walk'],
    [3, 0.61, 0.64, 'turn'],
    [5, 0.61, 0.64, 'wait'],
    [7, 0.68, 0.66, 'walk'],
    [9, 0.65, 0.6, 'walk'],
    [11, 0.61, 0.64, 'turn'],
  ]);
  track('trace36', 0, [
    [0, 0.45, 0.68, 'sit'],
    [6, 0.45, 0.68, 'reach'],
    [9, 0.51, 0.59, 'walk'],
  ]);
  track('trace36', 1, [
    [0, 0.61, 0.48, 'hover'],
    [7, 0.61, 0.48, 'hover'],
    [10, 0.62, 0.39, 'follow'],
  ]);
  scene(
    'trace37',
    [
      A('singer', 0.24, 0.66, 'pass'),
      A('singer', 0.43, 0.65, 'receive', -1, 2),
      A('singer', 0.62, 0.65, 'receive', -1, 3),
      A('lamplighter', 0.79, 0.67, 'wait', -1),
    ],
    [P('music', 0.51, 0.54, 145), P('bell', 0.5, 0.32, 36)]
  );
  track('trace37', 0, [
    [0, 0.24, 0.66, 'pass'],
    [4, 0.24, 0.66, 'sing'],
  ]);
  track('trace37', 1, [
    [0, 0.43, 0.65, 'receive'],
    [3, 0.43, 0.65, 'pass'],
    [7, 0.43, 0.65, 'read'],
  ]);
  track('trace37', 2, [
    [0, 0.62, 0.65, 'receive'],
    [5, 0.62, 0.65, 'read'],
    [7, 0.71, 0.65, 'hold'],
  ]);
  track('trace37', 3, [
    [0, 0.79, 0.67, 'wait'],
    [8, 0.79, 0.67, 'read'],
  ]);
  scene(
    'trace38',
    [A('cantor', 0.34, 0.66, 'ring'), A('lamplighter', 0.65, 0.67, 'watch', -1)],
    [P('music', 0.5, 0.56, 110), P('star', 0.7, 0.38, 40)]
  );
  track('trace38', 0, [
    [0, 0.34, 0.66, 'ring'],
    [5, 0.34, 0.66, 'watch'],
    [9, 0.34, 0.66, 'hold'],
  ]);
  track('trace38', 1, [
    [0, 0.65, 0.67, 'watch'],
    [6, 0.49, 0.67, 'catch'],
    [9, 0.49, 0.67, 'hold'],
  ]);
  scene(
    'trace39',
    [
      A('seraph', 0.52, 0.48, 'shield', 1, 1, 1.12),
      A('singer', 0.3, 0.71, 'watch', 1, 2, 0.86),
      A('singer', 0.7, 0.71, 'watch', -1, 3, 0.86),
    ],
    [P('bell', 0.5, 0.28, 40), P('feathers', 0.5, 0.76, 130)]
  );
  track('trace39', 0, [
    [0, 0.52, 0.48, 'stand'],
    [2, 0.52, 0.48, 'shield'],
    [8, 0.52, 0.48, 'shield'],
    [10, 0.52, 0.48, 'stand'],
  ]);
  track('trace39', 1, [
    [0, 0.3, 0.71, 'watch'],
    [3, 0.3, 0.71, 'hide'],
    [8, 0.16, 0.74, 'duck'],
  ]);
  track('trace39', 2, [
    [0, 0.7, 0.71, 'watch'],
    [3, 0.7, 0.71, 'hide'],
    [8, 0.84, 0.74, 'duck'],
  ]);
  scene(
    'trace40',
    [A('cantor', 0.38, 0.65, 'read'), A('lamplighter', 0.66, 0.67, 'watch', -1)],
    [P('notice', 0.39, 0.55, 34), P('desk', 0.29, 0.61, 65), P('bell', 0.8, 0.36, 32)]
  );
  track('trace40', 0, [
    [0, 0.38, 0.65, 'read'],
    [4, 0.38, 0.65, 'hold'],
    [7, 0.29, 0.65, 'set'],
    [10, 0.29, 0.65, 'handkey'],
  ]);
  track('trace41', 0, [
    [0, 0.28, 0.66, 'aim'],
    [3, 0.38, 0.66, 'brace'],
    [7, 0.6, 0.66, 'aim'],
  ]);
  track('trace41', 1, [
    [0, 0.49, 0.66, 'watch'],
    [3, 0.49, 0.66, 'brace'],
    [7, 0.71, 0.66, 'aim'],
  ]);
  track('trace41', 2, [
    [0, 0.74, 0.68, 'watch'],
    [3, 0.6, 0.68, 'brace'],
    [7, 0.83, 0.68, 'watch'],
  ]);
  scene(
    'trace42',
    [
      A('worker', 0.35, 0.69, 'brace'),
      A('soldier', 0.67, 0.65, 'pull', -1, 1),
      A('civilian', 0.18, 0.74, 'wait'),
      A('civilian', 0.09, 0.75, 'wait', 1, 3),
    ],
    [P('door', 0.51, 0.5, 72, 108), P('chain', 0.5, 0.56, 105)]
  );
  track('trace42', 0, [
    [0, 0.35, 0.69, 'brace'],
    [9, 0.35, 0.69, 'brace'],
    [11, 0.35, 0.69, 'stand'],
  ]);
  track('trace42', 1, [
    [0, 0.67, 0.65, 'pull'],
    [4, 0.67, 0.65, 'repair'],
    [8, 0.67, 0.65, 'stand'],
  ]);
  track('trace42', 2, [
    [0, 0.18, 0.74, 'wait'],
    [4, 0.18, 0.74, 'walk'],
    [8, 0.79, 0.74, 'walk'],
    [10, 0.88, 0.74, 'walk'],
  ]);
  track('trace42', 3, [
    [0, 0.09, 0.75, 'wait'],
    [5, 0.09, 0.75, 'walk'],
    [9, 0.73, 0.75, 'walk'],
    [11, 0.83, 0.75, 'walk'],
  ]);
  scene(
    'trace43',
    [A('soldier', 0.32, 0.66, 'read'), A('lamplighter', 0.65, 0.67, 'watch', -1)],
    [P('table', 0.45, 0.62, 100), P('card', 0.44, 0.53, 32), P('target', 0.83, 0.48, 44)]
  );
  track('trace43', 0, [
    [0, 0.32, 0.66, 'read'],
    [3, 0.7, 0.66, 'set'],
    [8, 0.58, 0.66, 'watch'],
  ]);
  track('trace43', 1, [
    [0, 0.65, 0.67, 'watch'],
    [5, 0.75, 0.67, 'reach'],
    [8, 0.75, 0.67, 'set'],
  ]);
  track('trace44', 0, [
    [0, 0.36, 0.68, 'repair'],
    [4, 0.36, 0.68, 'set'],
    [8, 0.36, 0.68, 'repair'],
  ]);
  track('trace44', 1, [
    [0, 0.65, 0.67, 'brace'],
    [9, 0.65, 0.67, 'watch'],
  ]);
  track('trace45', 0, [
    [0, 0.35, 0.67, 'turn'],
    [5, 0.35, 0.67, 'turn'],
    [9, 0.35, 0.67, 'watch'],
  ]);
  track('trace45', 1, [
    [0, 0.67, 0.65, 'watch'],
    [6, 0.67, 0.65, 'look'],
  ]);
  track('trace46', 0, [
    [0, 0.18, 0.69, 'carry'],
    [5, 0.43, 0.69, 'carry'],
    [8, 0.43, 0.69, 'set'],
  ]);
  track('trace46', 1, [
    [0, 0.52, 0.66, 'hold'],
    [6, 0.52, 0.66, 'inspect'],
  ]);
  track('trace46', 2, [
    [0, 0.76, 0.59, 'watch'],
    [7, 0.65, 0.64, 'kneel'],
    [10, 0.65, 0.64, 'inspect'],
  ]);
  scene(
    'trace47',
    [A('gardener', 0.23, 0.65, 'watch'), A('wick', 0.66, 0.5, 'hover', -1, 0, 0.8)],
    [
      ...Array.from({ length: 7 }, (_, i) => P('pod', 0.16 + i * 0.11, 0.7, 30)),
      P('door', 0.85, 0.4, 42, 92),
    ]
  );
  track('trace47', 1, [
    [0, 0.66, 0.5, 'hover'],
    [6, 0.66, 0.5, 'hover'],
    [8, 0.82, 0.55, 'carryflame'],
    [11, 0.89, 0.41, 'carryflame'],
  ]);
  scene(
    'trace48',
    [A('vessel', 0.47, 0.68, 'sit'), A('wick', 0.69, 0.49, 'hover', -1, 0, 0.8)],
    [P('bed', 0.47, 0.69, 80), P('labels', 0.68, 0.73, 48)]
  );
  track('trace48', 0, [
    [0, 0.47, 0.68, 'sit'],
    [5, 0.47, 0.68, 'reach'],
    [9, 0.47, 0.68, 'stand'],
  ]);
  track('trace48', 1, [
    [0, 0.69, 0.49, 'hover'],
    [3, 0.53, 0.53, 'carry'],
    [7, 0.58, 0.57, 'receive'],
    [10, 0.72, 0.55, 'follow'],
  ]);
  scene(
    'trace49',
    [
      A('lamplighter', 0.31, 0.68, 'walk'),
      A('warden', 0.68, 0.64, 'guard', -1),
      A('lamplighter', 0.13, 0.69, 'walk'),
    ],
    [P('door', 0.51, 0.5, 64, 105)]
  );
  ECHO_TABLEAUS.trace49.actors[0].appearance = 0;
  ECHO_TABLEAUS.trace49.actors[2].appearance = 0;
  track('trace49', 0, [
    [0, 0.31, 0.68, 'walk'],
    [4, 0.66, 0.68, 'walk'],
    [7, 0.74, 0.68, 'watch'],
  ]);
  track('trace49', 1, [
    [0, 0.68, 0.64, 'pull'],
    [5, 0.68, 0.64, 'watch'],
    [8, 0.61, 0.64, 'guard'],
  ]);
  track('trace49', 2, [
    [0, 0.13, 0.69, 'walk'],
    [5, 0.38, 0.69, 'walk'],
    [8, 0.38, 0.69, 'wait'],
  ]);
  track('trace50', 0, [
    [0, 0.35, 0.67, 'read'],
    [4, 0.35, 0.67, 'watch'],
    [6, 0.35, 0.67, 'set'],
    [9, 0.35, 0.67, 'read'],
  ]);
  track('trace50', 1, [
    [0, 0.63, 0.51, 'hover'],
    [3, 0.5, 0.53, 'reach'],
    [6, 0.58, 0.51, 'hover'],
    [9, 0.58, 0.51, 'learn'],
  ]);
  for (const [id, s] of Object.entries(SILENT_ECHO_ACTIONS)) {
    s.duration = Math.max(11, ...s.tracks.flatMap((t) => t.keys.map((k) => k[0] + 2)));
    ECHO_TABLEAUS[id].mood = '';
  }
})();

function sampleMemoryTrack(keys, t) {
  let a = keys[0],
    b = a;
  for (let i = 1; i < keys.length; i++) {
    b = keys[i];
    if (t <= b[0]) break;
    a = b;
  }
  const q = b[0] === a[0] ? 1 : clamp((t - a[0]) / (b[0] - a[0]), 0, 1),
    ease = q * q * (3 - 2 * q);
  return {
    x: lerp(a[1], b[1], ease),
    y: lerp(a[2], b[2], ease),
    pose: q < 0.5 ? a[3] : b[3],
    fromPose: a[3],
    toPose: b[3],
    poseMix: ease,
    dir: b[1] === a[1] ? 0 : b[1] > a[1] ? 1 : -1,
  };
}
function silentMemoryTime() {
  return Math.max(0, (activeMemoryEcho?.t || 0) - 1.8);
}
function memoryActionProgress(t, start, end) {
  const q = clamp((t - start) / (end - start), 0, 1);
  return q * q * (3 - 2 * q);
}
function silentMemoryProps(source, id, t) {
  const props = source.props.map((o) => ({ ...o }));
  for (const o of props) {
    if (o.kind === 'door')
      o.open =
        id === 'echo5'
          ? memoryActionProgress(t, 1, 3) * (1 - memoryActionProgress(t, 7, 9))
          : id === 'trace42'
            ? memoryActionProgress(t, 1, 3)
            : id === 'trace49'
              ? 1 - memoryActionProgress(t, 6, 8)
              : 0;
    if (o.kind === 'lamp' && id === 'echo2') o.lit = t > (o.x < 0.4 ? 1 : o.x < 0.65 ? 4 : 7);
    if (o.kind === 'chain' && id === 'trace42') o.opacity = 1 - memoryActionProgress(t, 3, 6);
    if (o.kind === 'hammer' && id === 'trace18')
      o.y += t > 2 && t < 7 ? -0.025 : Math.sin(t * 2) * 0.025;
    if (o.kind === 'paper' && id === 'trace30') o.opacity = 1 - memoryActionProgress(t, 3, 5);
    if (o.kind === 'notice' && id === 'trace40') o.opacity = 1 - memoryActionProgress(t, 1, 4);
    if (o.kind === 'water' && id === 'trace15') o.y -= memoryActionProgress(t, 0, 10) * 0.12;
    if (o.kind === 'lens' && id === 'trace25') o.covered = memoryActionProgress(t, 5, 7);
    if (o.kind === 'chair' && id === 'trace31' && o.x > 0.5) {
      const q = memoryActionProgress(t, 5, 9);
      o.x = lerp(0.83, 0.42, q);
      o.y = 0.74;
    }
  }
  return props;
}
const silentDrawMemoryProp = drawMemoryProp;
drawMemoryProp = function (ctx, o, rect, key, t, alpha, index) {
  if (o.opacity !== undefined) alpha *= o.opacity;
  if (o.kind === 'door' && o.open) {
    const x = rect.x + rect.w * o.x,
      y = rect.y + rect.h * o.y,
      w = o.w || 48,
      h = o.h || 48,
      p = MEMORY_PALETTES[key] || MEMORY_PALETTES.hollow;
    ctx.save();
    ctx.globalAlpha = alpha * 0.78;
    ctx.fillStyle = '#070e15';
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.strokeStyle = p.trim;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y - h, w, h);
    const leaf = Math.max(4, w * (1 - o.open));
    ctx.fillStyle = '#536570';
    ctx.fillRect(x - w / 2, y - h, leaf, h);
    ctx.fillStyle = '#bcd2d4';
    ctx.fillRect(x - w / 2 + leaf - 4, y - h * 0.45, 3, 3);
    if (o.open < 0.2) {
      ctx.fillStyle = '#a5987d';
      ctx.fillRect(x - w / 2 - 6, y - h * 0.45, w + 12, 4);
    }
    ctx.restore();
    return;
  }
  if (o.kind === 'lamp' && o.lit === false) {
    const x = rect.x + rect.w * o.x,
      y = rect.y + rect.h * o.y;
    ctx.save();
    ctx.globalAlpha = alpha * 0.78;
    ctx.fillStyle = '#6c746c';
    ctx.fillRect(x - 9, y - 12, 18, 25);
    ctx.fillStyle = '#18272e';
    ctx.fillRect(x - 6, y - 9, 12, 19);
    ctx.fillStyle = '#b09c77';
    ctx.fillRect(x - 11, y + 11, 22, 3);
    ctx.restore();
    return;
  }
  silentDrawMemoryProp(ctx, o, rect, key, t, alpha, index);
  if (o.covered) {
    const x = rect.x + rect.w * o.x,
      y = rect.y + rect.h * o.y,
      w = o.w || 48;
    ctx.save();
    ctx.globalAlpha = alpha * o.covered * 0.9;
    ctx.fillStyle = '#566678';
    ctx.fillRect(x - w / 2, y - w / 2, w, w);
    ctx.fillStyle = '#91acbb';
    ctx.fillRect(x - w / 2 + 4, y - w / 2 + 3, 3, w - 6);
    ctx.restore();
  }
};
function leaveSilentMemory(interrupted = false) {
  const m = activeMemoryEcho;
  if (!m || m.phase === 'leaving') return false;
  echoDisposition(m, interrupted);
  m.phase = 'leaving';
  m.leaveT = 0;
  T('memoryStage').classList.add('leaving');
  clearInput();
  memorySound(9);
  return true;
}
advanceMemory = function () {
  const m = activeMemoryEcho;
  if (!m || m.t < 1.8) return;
  leaveSilentMemory(silentMemoryTime() < (SILENT_ECHO_ACTIONS[m.id]?.duration || 11));
};
closeRememberedTrace = function () {
  return leaveSilentMemory(
    silentMemoryTime() < (SILENT_ECHO_ACTIONS[activeMemoryEcho?.id]?.duration || 11)
  );
};
const silentTickRememberedRoom = tickRememberedRoom;
tickRememberedRoom = function (dt) {
  silentTickRememberedRoom(dt);
  const m = activeMemoryEcho;
  if (!m || m.phase === 'leaving') return;
  T('memoryAdvance').disabled = m.t < 1.8;
  if (silentMemoryTime() >= (SILENT_ECHO_ACTIONS[m.id]?.duration || 11)) leaveSilentMemory(false);
};
const silentBeginDialogue = beginDialogue;
beginDialogue = function (id, replay = false, index = 0, returnState) {
  if (TRACE_RECORDS[id]) return startRememberedTrace(id, replay);
  if (!HOLLOW_SCENES[id]?.lines.length) return false;
  return silentBeginDialogue(id, replay, index, returnState);
};

function drawSilentMemoryAction(ctx, rect, id, t, alpha) {
  const at = (x, y) => ({ x: rect.x + rect.w * x, y: rect.y + rect.h * y }),
    pixel = (x, y, w, h, c) => {
      const p = at(x, y);
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), w, h);
    };
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  if (id === 'echo2' && t > 3) {
    const q = clamp((t - 3) / 2, 0, 1),
      p = at(0.64, 0.71);
    ctx.fillStyle = '#272d35';
    ctx.fillRect(p.x - 18 * q, p.y, 36 * q, 4);
    ctx.fillStyle = '#84a9b577';
    ctx.fillRect(p.x - 9 * q, p.y + 1, 18 * q, 1);
  }
  if (id === 'echo6') {
    const p = at(0.48, 0.7),
      grow = clamp(t / 4, 0, 1);
    ctx.fillStyle = '#c2d7d5';
    ctx.fillRect(p.x - 1, p.y - 42, 3, 42);
    ctx.fillStyle = '#9abcb5';
    ctx.fillRect(p.x - 11, p.y - 25, 3, 27);
    ctx.fillRect(p.x - 19, p.y - 20, 9, 3);
    ctx.fillRect(p.x - 8, p.y - 15, 9, 3);
    if (t > 3) {
      ctx.strokeStyle = '#e1ebe3';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - 9, p.y - 20);
      ctx.lineTo(p.x + 1, p.y - 20);
      ctx.stroke();
    }
    ctx.fillStyle = '#d8eae7';
    ctx.fillRect(p.x - 1, p.y - 44, 3, 2 * grow);
  }
  if (id === 'trace13') {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys, t),
      p = at(q.x + 0.165, q.y - 0.11);
    ctx.fillStyle = '#9daead';
    ctx.fillRect(p.x - 42, p.y, 84, 5);
    ctx.fillStyle = '#d8eff0';
    ctx.fillRect(p.x - 29, p.y - 11, 54, 10);
    ctx.fillStyle = '#f0ffff';
    ctx.fillRect(p.x + 24, p.y - 15, 11, 11);
    ctx.fillStyle = '#60879388';
    ctx.fillRect(p.x - 20, p.y - 8, 40, 3);
  }
  if (id === 'echo7' || id === 'trace39') {
    const start = id === 'echo7' ? 3 : 4,
      q = clamp((t - start) / 2, 0, 1);
    if (t > start) {
      for (let i = 0; i < 12; i++) {
        const h = idHash(id) + i * 31,
          x = 0.24 + (i % 6) * 0.1,
          y = 0.27 + q * (0.43 + (i % 3) * 0.04);
        pixel(x, y, 3 + (i % 3), 4, '#d7f0f4');
      }
      if (q === 1) {
        ctx.globalAlpha = alpha * 0.3;
        for (let i = 0; i < 7; i++) pixel(0.28 + i * 0.07, 0.76, 5, 2, '#b5d3de');
      }
    }
  }
  if (id === 'trace47') {
    for (let i = 0; i < 7; i++) {
      const alive = i === 6 || t < i * 0.65 + 1.5;
      if (alive) {
        const p = at(0.16 + i * 0.11, 0.65);
        ctx.fillStyle = i === 6 ? '#ffd491' : '#dbfaff';
        ctx.globalAlpha = alpha * (i === 6 ? 0.92 : 0.55);
        ctx.fillRect(p.x - 3, p.y - 6, 6, 10);
        ctx.fillStyle = '#fffbe5';
        ctx.fillRect(p.x - 1, p.y - 9, 3, 5);
      }
    }
  }
  if (id === 'trace25' && t > 2 && t < 8) {
    const p = at(0.5, 0.43);
    ctx.globalAlpha = alpha * Math.sin(((t - 2) / 6) * Math.PI) * 0.4;
    ctx.fillStyle = '#e2faff';
    ctx.fillRect(p.x - 6, p.y - 26, 12, 9);
    ctx.fillRect(p.x - 8, p.y - 15, 16, 26);
    ctx.fillRect(p.x - 4, p.y + 11, 3, 13);
    ctx.fillRect(p.x + 2, p.y + 11, 3, 13);
  }
  if (id === 'trace29') {
    for (let i = 0; i < 22; i++) {
      const y = 0.24 + ((t * 0.21 + i * 0.071) % 1) * 0.48;
      pixel(0.24 + (i % 9) * 0.059, y, 1, 5, '#adcfdc');
    }
    for (let i = 0; i < 3; i++) {
      const p = at(0.39 + i * 0.12, 0.74);
      ctx.fillStyle = '#b7d1d8';
      ctx.fillRect(p.x - 9, p.y - 10, 18, 12);
      ctx.fillStyle = '#5a8495';
      ctx.fillRect(p.x - 7, p.y - 8, 14, 3);
    }
  }
  if (id === 'trace48') {
    const p = at(0.68, 0.73);
    ctx.fillStyle = '#cad7d6';
    ctx.fillRect(p.x - 12, p.y - 5, 24, 10);
    ctx.fillStyle = '#89a3af';
    ctx.fillRect(p.x - 9, p.y - 2, 2, 2);
    ctx.fillRect(p.x + 7, p.y - 2, 2, 2);
  }
  if (id === 'trace38' && t > 3) {
    for (let i = 0; i < 3; i++) {
      const p = at(0.47 + i * 0.04, 0.42 - Math.sin((t - 3) * 0.5) * 0.045);
      ctx.fillStyle = '#dceef0';
      ctx.fillRect(p.x, p.y, 4, 4);
    }
    ctx.strokeStyle = '#b9e1e788';
    ctx.lineWidth = 1;
    const p = at(0.48, 0.51);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12 + i * 7, -0.9, 0.9);
      ctx.stroke();
    }
  }
  if (id === 'echo4' && t > 4) {
    const p = at(0.43, 0.62);
    ctx.fillStyle = '#d3e1db';
    ctx.fillRect(p.x - 9, p.y - 8, 18, 5);
    ctx.fillStyle = '#a0b8bd';
    ctx.fillRect(p.x - 3, p.y - 15, 9, 10);
    ctx.fillStyle = '#314955';
    ctx.fillRect(p.x, p.y - 14, 5, 3);
  }
  if (id === 'echo1') {
    const a = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[t < 4 ? 0 : 1].keys, t),
      p = at(a.x + (t < 4 ? 0.045 : -0.045), a.y - 0.105);
    ctx.fillStyle = '#a6c2cd';
    ctx.fillRect(p.x - 4, p.y - 8, 8, 13);
    ctx.fillStyle = '#ffe2a1';
    ctx.fillRect(p.x - 2, p.y - 5, 4, 8);
    ctx.fillStyle = '#e3f3f0';
    ctx.fillRect(p.x - 5, p.y - 9, 10, 2);
    if (t > 4 && t < 8) {
      const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys, t),
        c = at(q.x, q.y - 0.11);
      ctx.fillStyle = '#dff7fb';
      ctx.fillRect(c.x + 3, c.y - 4, 4, 3);
    }
  }
  if (id === 'trace12') {
    const p = at(0.52, 0.57);
    ctx.strokeStyle = '#c7dedf';
    ctx.lineWidth = 3;
    const a = t < 3 ? 0.2 : t < 6 ? 0.2 : 0.2 + memoryActionProgress(t, 6, 9) * 2.3;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 15, 21, 0, TAU);
    ctx.moveTo(p.x - 21 * Math.cos(a), p.y - 15 - 21 * Math.sin(a));
    ctx.lineTo(p.x + 21 * Math.cos(a), p.y - 15 + 21 * Math.sin(a));
    ctx.stroke();
  }
  if (id === 'trace14') {
    for (const [i, x] of [0.27, 0.52, 0.77].entries()) {
      const p = at(x, 0.57),
        q = memoryActionProgress(t, i * 2, i * 2 + 2);
      ctx.strokeStyle = '#d5e5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13, 0, TAU);
      ctx.moveTo(p.x - 13 * Math.cos(q * 1.6), p.y - 13 * Math.sin(q * 1.6));
      ctx.lineTo(p.x + 13 * Math.cos(q * 1.6), p.y + 13 * Math.sin(q * 1.6));
      ctx.stroke();
    }
  }
  if (id === 'trace17') {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[t < 6 ? 0 : 1].keys, t),
      p = at(q.x, q.y - 0.09);
    ctx.strokeStyle = '#d5e9e9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 7, p.y + 5);
    ctx.lineTo(p.x + 8, p.y - 22);
    ctx.lineTo(p.x + (t < 5 ? 17 : 8), p.y - 26);
    ctx.stroke();
  }
  if (id === 'trace20') {
    for (let i = 0; i < 3; i++) {
      const p = at(0.45 + i * 0.11, 0.47);
      ctx.fillStyle = '#bdd5de';
      ctx.fillRect(p.x - 7, p.y - 20, 14, 21);
      ctx.fillStyle = '#e2f4ed';
      ctx.fillRect(p.x - 4, p.y - 22, 8, 3);
    }
  }
  if (id === 'trace27' && t > 5) {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys, t),
      p = at(q.x, q.y - 0.09);
    ctx.strokeStyle = '#e5e1c8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x + 11, p.y - 5, 4, 0, TAU);
    ctx.moveTo(p.x + 13, p.y - 2);
    ctx.lineTo(p.x + 18, p.y + 6);
    ctx.stroke();
  }
  if (id === 'trace41') {
    const q = memoryActionProgress(t, 2, 7),
      p = at(lerp(0.42, 0.7, q), 0.63),
      a = lerp(-0.9, 0.65, q);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(a);
    ctx.fillStyle = '#a3b8bd';
    ctx.fillRect(-33, -10, 66, 11);
    ctx.fillStyle = '#e1eee8';
    ctx.fillRect(-29, -9, 40, 2);
    ctx.restore();
    ctx.fillStyle = '#748b96';
    ctx.fillRect(p.x - 15, p.y, 30, 8);
  }
  if (id === 'trace45') {
    const p = at(0.51, 0.66),
      a = memoryActionProgress(t, 1, 7) * 1.2;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(a);
    ctx.fillStyle = '#a7c3c8';
    ctx.fillRect(-32, -8, 64, 12);
    ctx.fillStyle = '#e2f1ed';
    ctx.fillRect(-25, -6, 35, 2);
    ctx.restore();
  }
  if (id === 'echo8' && t > 5) {
    const p = at(0.51, 0.53);
    ctx.fillStyle = '#b77777';
    ctx.fillRect(p.x - 21, p.y - 25, 42, 2);
    ctx.fillRect(p.x - 16, p.y - 20, 32, 2);
  }
  if (id === 'echo9') {
    for (let i = 0; i < 6; i++) {
      if (t < i * 1.15) continue;
      const p = at(0.18 + i * 0.125, 0.64);
      ctx.fillStyle = '#cedfdc';
      ctx.fillRect(p.x - 4, p.y + 4, 8, 5);
    }
    if (t < 7) {
      const p = at(0.52, 0.79);
      ctx.fillStyle = '#edcf8c';
      ctx.fillRect(p.x - 5, p.y - 5, 10, 6);
    }
  }
  if (id === 'trace11' && t > 3) {
    const p = at(0.38, 0.52);
    ctx.fillStyle = '#dff0eb';
    ctx.fillRect(p.x - 7, p.y, 14, 3);
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys, t),
      c = at(q.x, q.y - 0.075);
    ctx.fillStyle = '#80959b';
    ctx.fillRect(c.x - 12, c.y - 10, 24, 20);
    ctx.strokeStyle = '#bdd5d7';
    ctx.strokeRect(c.x - 12, c.y - 10, 24, 20);
  }
  if (id === 'trace16' && t > 2) {
    const p = at(lerp(0.3, 0.55, memoryActionProgress(t, 2, 5)), 0.61);
    ctx.fillStyle = '#dbcdb2';
    ctx.fillRect(p.x - 8, p.y - 5, 16, 6);
    ctx.fillStyle = '#c29c71';
    ctx.fillRect(p.x - 7, p.y - 5, 14, 2);
  }
  if (id === 'trace18') {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys, t),
      p = at(t < 5 ? 0.52 : q.x, t < 5 ? 0.73 : q.y - 0.08);
    ctx.fillStyle = '#dcc997';
    ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
    ctx.fillStyle = '#705f53';
    ctx.fillRect(p.x - 1, p.y - 2, 2, 4);
  }
  if (id === 'trace19' && t > 2) {
    const q = memoryActionProgress(t, 2, 6),
      p = at(0.48, 0.63 - 0.09 * q);
    ctx.fillStyle = '#c1d1d0';
    ctx.fillRect(p.x - 15, p.y - 5, 30, 12);
    ctx.fillStyle = '#e5f4ee';
    ctx.fillRect(p.x - 12, p.y - 4, 24, 2);
  }
  if (id === 'trace22') {
    const p = at(0.68, 0.44);
    if (t < 6) {
      ctx.fillStyle = '#c1dedb';
      ctx.fillRect(p.x - 20 + t * 3, p.y - 16, 15, 8);
    } else {
      ctx.strokeStyle = '#d9edea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(memoryActionProgress(t, 6, 9) * 1.5) * 29, p.y - 30);
      ctx.stroke();
    }
  }
  if (id === 'trace23') {
    ctx.strokeStyle = '#dcebea';
    ctx.lineWidth = 2;
    const q = memoryActionProgress(t, 0, 9);
    ctx.beginPath();
    ctx.moveTo(at(0.28, 0.73).x, at(0.28, 0.73).y);
    ctx.lineTo(at(0.38, 0.79).x, at(0.38, 0.79).y);
    if (q > 0.4) ctx.lineTo(at(0.63, 0.79).x, at(0.63, 0.79).y);
    if (q > 0.7) ctx.lineTo(at(0.77, 0.64).x, at(0.77, 0.64).y);
    ctx.stroke();
  }
  if (id === 'trace26') {
    const p = at(0.51, 0.53);
    ctx.fillStyle = t < 6 ? '#ab7f88' : '#7b9da2';
    ctx.fillRect(p.x - 6, p.y - 2, 12, 6);
    ctx.fillStyle = '#d4e5df';
    ctx.fillRect(p.x - 3, p.y, 6, 2);
  }
  if (id === 'trace28') {
    const p = at(0.57, 0.55);
    ctx.fillStyle = '#d8e7df';
    ctx.fillRect(p.x - 12, p.y - 9, 24, 18);
    ctx.fillStyle = '#6b8a95';
    for (let i = 0; i < 4; i++) ctx.fillRect(p.x - 8, p.y - 5 + i * 3, 16, 1);
    if (t > 5) {
      ctx.fillStyle = '#1d2e38';
      for (let i = 0; i < 3; i++) ctx.fillRect(p.x - 7, p.y - 4 + i * 4, 14, 2);
    }
  }
  if (id === 'trace30' && t > 3 && t < 9) {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys, t),
      p = at(q.x, q.y + 0.02);
    ctx.fillStyle = '#dce8df';
    ctx.fillRect(p.x + 7, p.y - 7, 15, 13);
    ctx.fillStyle = '#7193a1';
    ctx.fillRect(p.x + 10, p.y - 3, 9, 1);
  }
  if (id === 'trace33') {
    const p = at(0.5, 0.54);
    for (const [x, delay] of [
      [-12, 1],
      [10, 3],
    ])
      if (t > delay) {
        ctx.fillStyle = '#a98183';
        ctx.fillRect(p.x + x, p.y - 4, 7, 7);
        ctx.fillStyle = '#e6d8c3';
        ctx.fillRect(p.x + x + 2, p.y - 2, 3, 3);
      }
    if (t > 6) {
      ctx.strokeStyle = '#638897';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - 6, p.y + 5);
      ctx.lineTo(p.x, p.y + 3);
      ctx.lineTo(p.x + 7, p.y + 5);
      ctx.stroke();
    }
  }
  if (id === 'trace34') {
    const p = at(0.51, 0.76);
    ctx.fillStyle = '#ddedeb';
    for (let i = 0; i < Math.min(12, Math.floor(t * 1.4)); i++)
      ctx.fillRect(p.x - 33 + i * 6, p.y - 4, 3, 1);
  }
  if (id === 'trace37') {
    const q = memoryActionProgress(t, 0, 7),
      p = at(lerp(0.25, 0.73, q), 0.57);
    ctx.fillStyle = '#dceae3';
    ctx.fillRect(p.x - 9, p.y - 9, 18, 13);
    ctx.fillStyle = '#618594';
    ctx.fillRect(p.x - 6, p.y - 4, 12, 1);
    ctx.fillRect(p.x - 6, p.y, 9, 1);
  }
  if (id === 'trace40' && t > 3 && t < 8) {
    const q = sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys, t),
      p = at(q.x, q.y - 0.09);
    ctx.fillStyle = '#d1e5e0';
    ctx.fillRect(p.x + 8, p.y - 4, 5, 19);
    ctx.fillStyle = '#8fbdc8';
    ctx.fillRect(p.x + 8, p.y + 3, 5, 2);
  }
  if (id === 'trace43') {
    const p = at(0.83, 0.48);
    ctx.fillStyle = t < 5 ? '#cedce2' : '#b3a78b';
    ctx.beginPath();
    ctx.arc(p.x, p.y - 22, 12, 0, TAU);
    ctx.fill();
    if (t < 5) {
      ctx.fillStyle = '#607b8a';
      ctx.fillRect(p.x - 5, p.y - 25, 3, 2);
      ctx.fillRect(p.x + 3, p.y - 25, 3, 2);
      ctx.fillRect(p.x - 2, p.y - 20, 4, 2);
    }
  }
  if (id === 'trace44' && t > 3) {
    const p = at(0.5, 0.54);
    ctx.fillStyle = '#c6d9d5';
    ctx.fillRect(p.x - 6, p.y - 27, 17, 8);
    ctx.fillStyle = '#83aab6';
    ctx.fillRect(p.x - 5, p.y - 25, 13, 1);
  }
  if (id === 'trace50') {
    const p = at(0.42, 0.54),
      q =
        t > 3 && t < 6
          ? memoryActionProgress(t, 3, 4)
          : t >= 6
            ? 1 - memoryActionProgress(t, 6, 7)
            : 0;
    ctx.strokeStyle = '#eef9f4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + 9);
    ctx.lineTo(p.x + 18 * Math.cos(q * Math.PI), p.y - 12 * Math.sin(q * Math.PI) - 5);
    ctx.stroke();
  }
  ctx.restore();
}
function drawMemoryPeople(ctx, rect, key, t, alpha) {
  const id = activeMemoryEcho?.id || 'echo1',
    source = ECHO_TABLEAUS[id] || ECHO_TABLEAUS.echo1,
    action = SILENT_ECHO_ACTIONS[id],
    clock = silentMemoryTime(),
    scene = {
      ...source,
      props: silentMemoryProps(source, id, clock),
      actors: source.actors.map((a) => ({ ...a })),
    };
  for (const track of action?.tracks || []) {
    const actor = scene.actors[track.actor];
    if (!actor) continue;
    const q = sampleMemoryTrack(track.keys, save.motion ? Math.floor(clock / 3) * 3 : clock);
    actor.x = q.x;
    actor.y = q.y;
    actor.pose = q.pose;
    actor.fromPose = q.fromPose;
    actor.toPose = q.toPose;
    actor.poseMix = q.poseMix;
    if (q.dir) actor.dir = q.dir;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x + 9, rect.y + 9, rect.w - 18, rect.h - 18);
  ctx.clip();
  drawTableauStagecraft(ctx, rect, key, scene, t, alpha);
  const items = [
    ...scene.props.map((o, i) => ({
      type: 'prop',
      o,
      i,
      z: MEMORY_BACK_KINDS.has(o.kind)
        ? -50 + o.y * 10
        : ['machine', 'belt', 'mold'].includes(o.kind)
          ? 45
          : o.y * 100 + (MEMORY_FRONT_KINDS.has(o.kind) ? 18 : 0),
    })),
    ...scene.actors.map((a, i) => ({ type: 'actor', a, i, z: a.y * 100 })),
  ];
  items.sort((a, b) => a.z - b.z);
  for (const item of items) {
    if (item.type === 'prop') drawMemoryProp(ctx, item.o, rect, key, t, alpha, item.i);
    else drawMemoryActor(ctx, item.a, rect, key, t, item.i, alpha);
  }
  drawSilentMemoryAction(ctx, rect, id, clock, alpha);
  ctx.restore();
}
