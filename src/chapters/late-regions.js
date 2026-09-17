const LATE_REGIONS=[
  {stage:3,from:11,to:15,key:'reservoir',name:'The Drowned Reservoir',boss:'THE BELLKEEPER',bossKey:'bellkeeper',color:'#62c6d9',pi:1,
   floors:[['The Spillway','Water keeps finding the stairs.'],['The Pump Gallery','The old pistons still move when the bells ring.'],['The Sunken Walk','Ripples cross the path against the current.'],['The Sluice Chapel','Someone built an altar around the main valve.'],['The Bell Cistern','The Keeper is moving under the water.']]},
  {stage:4,from:16,to:20,key:'foundry',name:'The Ember Foundry',boss:'THE EMBER COLOSSUS',bossKey:'colossus',color:'#ff9a56',pi:2,
   floors:[['The Cold Forge','The furnaces are dark, but the rails are warm.'],['The Slag Run','The floor cools in patches. Use them.'],['The Hammer Line','Every third hammer falls early.'],['The Mold Vault','The empty molds are shaped like people.'],['The Furnace Crown','The Colossus has started the main fire.']]},
  {stage:5,from:21,to:25,key:'observatory',name:'The Shattered Observatory',boss:'THE GLASS ASTRONOMER',bossKey:'astronomer',color:'#80d9ef',pi:3,
   floors:[['The Fallen Orrery','The ceiling is moving. The room is not.'],['The Meridian Hall','Broken lenses still follow warm things.'],['The Parallax Walk','Two routes occupy the same corridor.'],['The Blind Planetarium','Watch the glass, not the stars.'],['The Shattered Dome','The Astronomer has corrected for your arrival.']]},
  {stage:6,from:26,to:30,key:'archive',name:'The Buried Archive',boss:'THE PALE SCRIBE',bossKey:'scribe',color:'#d8c6a1',pi:0,
   floors:[['The Intake Desk','Every returned book is stamped with tomorrow’s date.'],['The Flooded Index','The cards have swollen into little walls.'],['The Redaction Rooms','The missing words move when you look away.'],['The Misfiled Wing','Nothing here belongs on this shelf.'],['The Last Margin','The Scribe has run out of paper.']]},
  {stage:7,from:31,to:35,key:'court',name:'The Silent Court',boss:'THE TWIN REGENTS',bossKey:'regents',color:'#e49aa9',pi:2,
   floors:[['The Servants’ Door','Someone has set the table again.'],['The Empty Banquet','The place cards turn when you pass.'],['The Gallery of Favors','The portraits watch whichever half of the hall you use.'],['The Divided Throne','The carpet was cut in half and stitched back together.'],['The Audience Chamber','Two voices are arguing behind the door.']]},
  {stage:8,from:36,to:40,key:'choir',name:'The Choir Spire',boss:'THE VOID SERAPH',bossKey:'seraph',color:'#a9b9ff',pi:3,
   floors:[['The Low Refrain','The stone hums under your feet.'],['The Bell Lung','Breathe between the notes.'],['The Cantor Stairs','An eighth step appears whenever the tower sings high.'],['The Broken Octave','One filed-down tuning fork keeps the upper door shut.'],['The Open Belfry','Something above you has stopped singing.']]},
  {stage:9,from:41,to:45,key:'citadel',name:'The Black Citadel',boss:'THE OBSIDIAN TYRANT',bossKey:'tyrant',color:'#ff966d',pi:2,
   floors:[['The Inward Wall','The arrow slits face the wrong way.'],['The Chain Ward','Every lock is fastened from inside.'],['The Powder Chapel','The fuses are fresh.'],['The King’s Engine','The floor shudders once every twelve seconds.'],['The Siege Hall','The throne is walking toward you.']]},
  {stage:10,from:46,to:50,key:'heart',name:'The Heart of the Star',boss:'THE FIRST KEEPER',bossKey:'keeper',color:'#ffd174',pi:0,
   floors:[['The Borrowed Gate','Pieces of the first floor drift in the dark.'],['The Garden Without Soil','Roots hang in the outlines of missing beds.'],['The Unwritten Room','Blank brass labels cover doors with no handles.'],['The Door With Two Knocks','Knock once, wait, then knock again.'],['The Heart of the Star','Wick dims when the cradle comes into view.']]}
];
const lateRegion=f=>{const n=f>50?11+(f-51)%40:f;return LATE_REGIONS.find(r=>n>=r.from&&n<=r.to)||null;};
const roman=n=>['','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ'][n]||String(n);

const BLESSINGS=[
 {id:'dmg',r:0,max:8,w:12,icon:'sparkles',name:'Bright Core',ds:'+18% damage to Ember Bolt and Flare'},
 {id:'rate',r:0,max:6,w:11,icon:'zap',name:'Rapid Conjuring',ds:'+15% Ember Bolt casting rate'},
 {id:'hp',r:0,max:6,w:11,icon:'heart',name:'Vital Ember',ds:'+25 max health and restore 25 health'},
 {id:'speed',r:0,max:5,w:9,icon:'wind',name:'Cinderstep',ds:'+10% movement speed'},
 {id:'magnet',r:0,max:4,w:7,icon:'magnet',name:'Far Reach',ds:'+35% pickup reach'},
 {id:'xp',r:0,max:5,w:8,icon:'book-open',name:'Quick Study',ds:'+15% run XP'},
 {id:'regen',r:0,max:4,w:6,icon:'activity',name:'Steady Flame',ds:'Restore 0.6 health each second'},
 {id:'magazine',r:0,max:3,w:7,icon:'orbit',name:'Deep Wells',ds:'+2 Ember Bolt charges'},
 {id:'quickload',r:0,max:3,w:7,icon:'refresh-ccw',name:'Quickening',ds:'Rekindle 18% faster'},
 {id:'edge',r:0,max:4,w:8,icon:'flame',name:'Broad Flare',ds:'+25% Flare damage'},
 {id:'dash',r:0,max:4,w:7,icon:'feather',name:'Phantom Step',ds:'Dash recovers 15% faster'},
 {id:'flareReach',r:0,max:3,w:7,icon:'target',name:'Long Spark',ds:'+16 Flare reach and a wider arc'},

 {id:'proj',r:1,max:3,w:6,icon:'copy',name:'Split Sigil',ds:'+1 Ember Bolt per cast'},
 {id:'pierce',r:1,max:3,w:6,icon:'target',name:'Piercing Light',ds:'Ember Bolts pierce one more target'},
 {id:'crit',r:1,max:4,w:6,icon:'eye',name:'Clear Sight',ds:'+8% critical chance'},
 {id:'orbital',r:1,max:4,w:5,icon:'orbit',name:'Orbiting Cinders',ds:'+1 cinder that scorches nearby enemies'},
 {id:'burn',r:1,max:3,w:6,icon:'flame',name:'Searing Brand',ds:'Ember Bolts ignite enemies for 3 seconds'},
 {id:'blast',r:1,max:3,w:5,icon:'sparkles',name:'Flashover',ds:'Critical bolts scorch enemies around the target'},
 {id:'guard',r:1,max:3,w:6,icon:'activity',name:'Kindled Guard',ds:'Rekindling grants a brief ward'},
 {id:'dashTrail',r:1,max:3,w:5,icon:'wind',name:'Wakefire',ds:'Dash leaves a damaging trail of embers'},
 {id:'reserve',r:1,max:2,w:5,icon:'gem',name:'Hidden Spark',ds:'+1 charge and begin each floor fully Rekindled'},
 {id:'pruning',r:1,max:2,w:4,icon:'sparkles',name:'Pruning Flare',ds:'+60% Flare damage to summoned growth',unlock:'pruning'},
 {id:'leech',r:1,max:3,w:5,icon:'heart',name:'Warm Hands',ds:'Every sixth kill restores 5 health'},
 {id:'fullHeart',r:1,max:2,w:4,icon:'flame',name:'High Flame',ds:'+22% damage while above 80% health'},

 {id:'ric',r:2,max:2,w:4,icon:'refresh-ccw',name:'Ricochet Rune',ds:'Ember Bolts jump to another enemy'},
 {id:'exec',r:2,max:3,w:4,icon:'axe',name:'Mercy Stroke',ds:'+30% damage against enemies below 30% health'},
 {id:'afterbloom',r:2,max:1,w:3,icon:'heart',name:'Afterbloom',ds:'Critical hits can restore 2 health',unlock:'afterbloom'},
 {id:'bladeEcho',r:2,max:1,w:3,icon:'wind',name:'Warden’s Wake',ds:'Flare releases a piercing light crescent',unlock:'bladeEcho'},
 {id:'glass',r:2,max:2,w:3,icon:'flame',name:'Glass Heart',ds:'+40% damage, but −10% maximum health'},
 {id:'chain',r:2,max:2,w:4,icon:'zap',name:'Chainfire',ds:'Every fourth Bolt forks to two targets; rank 2 adds a third'},
 {id:'thorns',r:2,max:3,w:3,icon:'activity',name:'Reprisal',ds:'Taking damage scorches the attacker'},
 {id:'runRevive',r:2,max:1,w:2,icon:'heart',name:'Second Ember',ds:'Refuse one fatal hit during this descent'},
 {id:'overcharge',r:2,max:2,w:3,icon:'sparkles',name:'Overcharge',ds:'Finishing Rekindle releases a damaging pulse'},
 {id:'stillness',r:2,max:2,w:3,icon:'eye',name:'Held Breath',ds:'Standing still steadily increases Bolt damage'},
 {id:'aftershock',r:2,max:2,w:3,icon:'orbit',name:'Cinderstorm',ds:'Flare erupts again after a short delay'},
 {id:'eliteBane',r:2,max:2,w:3,icon:'skull',name:'Star Eater',ds:'+35% damage to elites and guardians'},

 {id:'whiteStar',r:3,max:1,w:1,icon:'sparkles',name:'White Star',ds:'Every fourth cast detonates for 280% damage across a vast area'},
 {id:'twinFlame',r:3,max:1,w:1,icon:'copy',name:'Twin Flame',ds:'Every cast erupts forward, backward, and to both sides'},
 {id:'lastLight',r:3,max:1,w:1,icon:'heart',name:'Last Light',ds:'Deal up to +200% damage as health falls'},
 {id:'ashCrown',r:3,max:1,w:1,icon:'orbit',name:'Crown of Ash',ds:'Gain five empowered cinders; their hits spread a fierce Searing Brand'}
];
RARITY.splice(0,RARITY.length,
 {n:'COMMON',c:'#9db4d0'},{n:'UNCOMMON',c:'#65d9b1'},{n:'RARE',c:'#b98aff'},{n:'MYTHIC',c:'#ffbf5c'});
POOL.splice(0,POOL.length,...BLESSINGS);

const TRACE_RECORDS={};
function trace(id,title,place,description,fragment,note='A concrete piece of the route back.',color='#a98aca'){TRACE_RECORDS[id]={title,place,description,fragment,note,color};}
trace('echo1','Watch Roster','The Gatehouse','A slate roster lists eight names. The last has been scrubbed away so hard the slate is grooved.','“Mara has second watch. If she asks to trade again, wake me.”','Names, shifts, and one deliberate erasure.');
trace('echo2','Oil Tin','The Lantern Walks','The lid is dented to fit a left thumb. A strip of blue cloth has been tied around the handle.','“Enough for the east walk. Don’t waste it on the locked rooms.”','Someone rationed the light.');
trace('echo3','Bell Rope','The Bell Court','The rope ends in a child-sized knot. Dark fibers cling where many smaller hands held it.','“One pull for supper. Three if the gate opens.”','The warning bell was also an ordinary bell.');
trace('echo4','Unsent Letter','The Empty Barracks','The paper begins with an apology and ends before the writer says what happened.','“I’ll be home when they change the watch. Don’t wait up.”','The watch never changed.');
trace('echo5','Iron Door','The Last Watch','Two polished marks sit shoulder-high on the door: knock, pause, knock.','“Ask why I came. If I answer wrong, keep the door shut.”','A recognition test you helped invent.');
trace('echo6','Bean Stakes','The Overgrown Walk','Six stakes are labeled in careful handwriting. A seventh says WEED, then BEANS beneath it.','“You pulled them twice. I’m painting the leaves next year.”','A small argument survived the garden.','#8dbb72');
trace('echo7','Glass Wedge','Glasshouse Ruins','The shard is clean on the outside and smoked on the inside. The break came from below.','“No storm. Get everyone out of the beds.”','The glasshouse broke inward.','#8dbb72');
trace('echo8','Warning Sign','The Still Courtyard','KEEP THE GATE CLOSED is painted on the front. The back adds EVEN IF THEY ASK NICELY.','“You laughed when you wrote that. Wick didn’t.”','Your handwriting, and your joke.','#8dbb72');
trace('echo9','Bed Labels','The Nursery','There are six frames and seven brass nameplates. One plate was meant to be carried.','“No, count the names. The beds aren’t the important part.”','One person was never meant to stay.','#8dbb72');
trace('echo10','Garden Spade','The Root Chamber','Dry soil fills the socket. The handle bears fresh nail marks where someone refused to let go.','“Keep them warm until morning. I’ll come back with the key.”','You did not come back.','#8dbb72');

const lateTraceRows=[
 ['trace11','Flood Gauge','The Spillway','The gauge records three floods. The fourth line was added before the water rose.','“Close the lower doors at six. Don’t wait for the alarm.”'],
 ['trace12','Pump Wrench','The Pump Gallery','The handle is wrapped for a smaller hand. Teeth marks scar the leather.','“Kick pump three first. It only listens after you insult it.”'],
 ['trace13','Waterproof Parcel','The Sunken Walk','Oilcloth protects a dry pair of socks and a child’s drawing of the reservoir.','“For the night shift. Stop giving yours away.”'],
 ['trace14','Valve Prayer','The Sluice Chapel','A maintenance checklist was copied onto a prayer board without changing a word.','“Open two turns. Wait for the knock. Close one.”'],
 ['trace15','Bell Clapper','The Bell Cistern','The iron clapper is worn flat on one side. It rang underwater for years.','“If the Keeper rings twice, get off the walkways.”'],
 ['trace16','Lunch Pail','The Cold Forge','The lid is blackened except for a clean square where a photograph used to be.','“Save my seat. The crown furnace is acting up again.”'],
 ['trace17','Cooling Hook','The Slag Run','The long hook bends away from the heat. Someone kept using it after it failed.','“Don’t be brave. Get another hook.”'],
 ['trace18','Hammer Token','The Hammer Line','A brass token marks a worker’s place in the sequence. Yours is number three.','“Third hammer lies. Watch the belt, not the bell.”'],
 ['trace19','Clay Finger','The Mold Vault','A fired clay finger fits the smallest mold. A name was pressed into the nail.','“They said the molds were for tools.”'],
 ['trace20','Furnace Key','The Furnace Crown','The key is too soft to turn after being heated and cooled hundreds of times.','“If I don’t come down, break the crown valve.”'],
 ['trace21','Brass Planet','The Fallen Orrery','A hand-sized planet opens on a hinge. Inside is a portrait of three observatory workers eating lunch.','“If the sky ends, we still get half an hour.”'],
 ['trace22','Lens Ledger','The Meridian Hall','Every lens has a cleaning date except number nine. Beside it: DO NOT TOUCH.','“Nine isn’t dirty. It’s looking somewhere else.”'],
 ['trace23','Chalk Footprints','The Parallax Walk','Two sets of footprints begin as one. Neither returns.','“Take the left hall. If you see me, don’t follow.”'],
 ['trace24','Star Map','The Blind Planetarium','Most constellations are familiar. One has been circled and labeled HOME in your hand.','“Circle this coordinate. Lens nine returns here every winter.”'],
 ['trace25','Cracked Eyepiece','The Shattered Dome','A crescent of glass is warm despite the cold room.','“The Keeper moved the star again. Tell them I noticed.”'],
 ['trace26','Return Stamp','The Intake Desk','The stamp reads RETURNED, followed by tomorrow’s date. Ink coats the grip.','“Stop stamping people. The joke stopped being funny.”'],
 ['trace27','Index Card','The Flooded Index','The card names a manual that never existed: Controlled Memory Removal, Revision Three.','“Restricted shelf. Your authorization.”'],
 ['trace28','Redaction Knife','The Redaction Rooms','The blade is blunt from cutting names out of paper, never sharpening quills.','“Cut the names only. Keep the dates and room numbers.”'],
 ['trace29','Misfile Slip','The Misfiled Wing','A complaint form has been filed under WEATHER, INTERNAL.','“There is rain in aisle six again.”'],
 ['trace30','Last Sheet','The Last Margin','Only one line remains unmarked at the bottom of the page.','“Your name was on the burn list. I left one copy in the desk.”'],
 ['trace31','Place Card','The Servants’ Door','Your name is written on both sides. The ink differs by several years.','“Set one chair. They’ll argue with themselves either way.”'],
 ['trace32','Cold Plate','The Empty Banquet','Dust covers the table except for one clean plate and two sets of fingerprints.','“We can’t keep pretending dinner makes this a meeting.”'],
 ['trace33','Favor Token','The Gallery of Favors','A bone token records one favor owed by each Regent. Both debts are crossed out.','“Paid in full. They will disagree.”'],
 ['trace34','Cut Carpet','The Divided Throne','The carpet was sliced exactly down the middle, then repaired from underneath.','“They divided the room. You sewed it back together overnight.”'],
 ['trace35','Audience Bell','The Audience Chamber','The bell has no clapper. A servant still polished it every week.','“Remove the clapper before audience. The left Regent rings twice when angry.”'],
 ['trace36','Breath Mark','The Low Refrain','Finger marks in the dust count four beats in and six beats out.','“Don’t match the tower. Make it match you.”'],
 ['trace37','Bellows Patch','The Bell Lung','A leather patch is stitched with the initials W.K. The work is clumsy but intact.','“I can hold the seam. You get the children down.”'],
 ['trace38','Cantor’s Shoe','The Cantor Stairs','The sole is worn through at the toe from climbing the same seven steps.','“Again. The eighth stair only appears on the high note.”'],
 ['trace39','Tuning Fork','The Broken Octave','One tine was filed shorter by hand. The missing pitch makes your teeth ache.','“We broke the note so the thing above us couldn’t land.”'],
 ['trace40','Black Feather','The Open Belfry','The feather is made of overlapping slivers of night glass. It hums near your ember.','“It learned our hymn. Stop singing.”'],
 ['trace41','Arrow Bundle','The Inward Wall','Every arrow is fletched to fly toward the courtyard.','“The enemy was already inside when they built this.”'],
 ['trace42','Open Padlock','The Chain Ward','The lock was picked from the cell side. The key remains in the guard’s pocket.','“Transfer complete. Old guards in the cells. Old prisoners on watch.”'],
 ['trace43','Fresh Fuse','The Powder Chapel','The fuse smells of oil and oranges. Someone replaced it recently.','“If the throne reaches the gate, light all four.”'],
 ['trace44','Engine Tooth','The King’s Engine','A gear tooth is wrapped in cloth to stop it striking the same place each turn.','“Quiet it down. The Keeper counts the impacts.”'],
 ['trace45','Bent Crown','The Siege Hall','The crown is part of the throne’s steering assembly. It was never ceremonial.','“Steering crown loose again. Tighten before the next test.”'],
 ['trace46','Gate Hinge','The Borrowed Gate','A gatehouse hinge floats here, still carrying blue paint from the first floor.','“It’s taking the archive apart from the entrance inward.”'],
 ['trace47','Dry Root','The Garden Without Soil','The root curls around an object that is no longer present.','“The six pods go under the roots. The seventh goes with Wick.”'],
 ['trace48','Blank Label','The Unwritten Room','The brass label has screw holes but no letters. Holding it makes Wick’s flame shrink.','“Leave the brass blank. The labels keep changing the doors.”'],
 ['trace49','Knuckle Marks','The Door With Two Knocks','The door is polished at the height of your hand. Two knocks. A pause.','“Why did you come?” — “To put the star back.”'],
 ['trace50','First Wick','The Heart of the Star','A little glass cup holds a dead wick and a curl of silver wire. It is exactly Wick’s shape.','“I was here before I had a voice. You taught me by reading the maintenance log out loud.”']
];
for(const [id,title,place,description,fragment] of lateTraceRows){const f=Number(id.slice(5)),r=lateRegion(f);trace(id,title,place,description,fragment,'',r?.color);}

Object.assign(HOLLOW_SCENES,{
 arrival:{title:'Up off the floor',where:'The Gatehouse',lines:[['???','Hey. Eyes open.'],['You','They are. You’re on fire.'],['???','Good. Can you stand?'],['You','Who are you?'],['Wick','Wick. Get up and I’ll explain what I can.']]},
 walks:{title:'The moving lamps',where:'The Lantern Walks',lines:[['You','That lantern moved.'],['Wick','I saw.'],['You','Is that normal?'],['Wick','No. Break the glass before it gets close.']]},
 barracks:{title:'Your old coat',where:'The Empty Barracks',lines:[['You','That coat is mine.'],['Wick','It was.'],{speaker:'You',choices:[{label:'How do you know?',reply:[['Wick','You tore it on the west rail. I held the thread while you fixed it.'],['You','Did it look this bad then?'],['Wick','Worse.']]},{label:'I’m taking it.',reply:[['Wick','Check the left sleeve first.'],['You','Why?'],['Wick','Mouse. Probably gone.']]}]}]},
 wardenBefore:{title:'The standing order',where:'The Last Watch',lines:[['The Star Warden','You’re late.'],['You','I woke up five minutes ago.'],['The Star Warden','Then turn around while you still can.'],['You','What’s behind me is worse?'],['The Star Warden','The gate is closed. Let it stay closed.'],['Wick','Mara, lower the glaive.'],['The Star Warden','You know the order.']]},
 wardenAfter:{title:'The open gate',where:'The Last Watch',lines:[['The Star Warden','Still dropping your left shoulder.'],['You','Mara?'],['The Star Warden','Took you long enough.'],['Wick','The gate is opening.'],['You','I have questions.'],['The Star Warden','Keep one for the door at the bottom.']]},
 firstDeath:{title:'Again',where:'After the first fall',lines:[['You','That hurt.'],['Wick','You always say that.'],['You','How many times?'],['Wick','You told me to stop counting.']]},
 firstSigil:{title:'Muscle memory',where:'The Skill Tree',lines:[['You','My hand knew where that mark went.'],['Wick','Your hands remember more than your head. Take the win.'],['You','Is that supposed to help?'],['Wick','It wasn’t supposed to be anything.']]},
 gardenArrival:{title:'The old garden',where:'The Overgrown Walk',lines:[['You','Did I work here?'],['Wick','You were on the watering roster.'],['You','I hate gardening.'],['Wick','You wrote that on the roster.']]},
 gardenChoice:{title:'The warning sign',where:'The Still Courtyard',lines:[['You','That’s my handwriting.'],['Wick','You ran out of red paint halfway through.'],{speaker:'You',choices:[{label:'What was I keeping out?',reply:[['Wick','Strays, at first.'],['You','At first?'],['Wick','Then the roots started knocking.']]},{label:'I still stand by “ask nicely.”',reply:[['Wick','You added that after somebody asked.'],['You','Did we let them in?'],['Wick','No. You opened the gate yourself.']]}]}]},
 nurseryTalk:{title:'Seven names',where:'The Nursery',lines:[['You','Six beds. Seven names.'],['Wick','The seventh plate was yours.'],['You','Why was my name on a nursery bed?'],['Wick','It wasn’t. You carried the plate during evacuations so the children would follow you.']]},
 matriarchBefore:{title:'The gardener',where:'The Root Chamber',lines:[['The Hollow Matriarch','Late again.'],['You','Do I know you?'],['The Hollow Matriarch','You signed the order that cut open my wall.'],['Wick','Roots are coming up. Keep moving.'],['The Hollow Matriarch','He gave the same warning then.']]},
 matriarchAfter:{title:'What was planted',where:'The Root Chamber',lines:[['You','What was in those beds?'],['The Hollow Matriarch','Six were planted. One was carried out.'],['You','By me?'],['The Hollow Matriarch','By your little lamp.'],['Wick','I watched the other six fail.'],['You','You’re explaining that downstairs.']]},
 reservoirArrival:{title:'Wet feet',where:'The Spillway',lines:[['You','The stairs are underwater.'],['Wick','Only the bottom three.'],['You','That isn’t better.'],['Wick','It was the best number I had.']]},
 bellkeeperBefore:{title:'Two bells',where:'The Bell Cistern',lines:[['The Bellkeeper','Clear the walkway.'],['You','Are the pumps running?'],['The Bellkeeper','The pumps are stopped.'],['You','Then why keep ringing?'],['The Bellkeeper','Because the shift isn’t over.']]},
 bellkeeperAfter:{title:'The pumps stop',where:'The Bell Cistern',lines:[['You','Did we just shut off the pumps?'],['Wick','There haven’t been pumps in years. The bells moved the water.'],['You','How long until this room floods?'],['Wick','It’s already started.']]},
 foundryArrival:{title:'Still warm',where:'The Cold Forge',lines:[['You','Nothing is burning.'],['Wick','Touch the rail.'],['You','No.'],['Wick','Good. It only took you three tries last time.']]},
 colossusBefore:{title:'Clocking in',where:'The Furnace Crown',lines:[['The Ember Colossus','Shift name.'],['You','I don’t have one.'],['The Ember Colossus','Then you are not on the roster.'],['Wick','We’re passing through.'],['The Ember Colossus','Nobody passes the crown furnace.']]},
 colossusAfter:{title:'Cooling period',where:'The Furnace Crown',lines:[['You','Third hammer.'],['Wick','The one that drops early.'],['You','Did I fix it?'],['Wick','With a wedge and a bad word.'],['You','Did it work?'],['Wick','Until somebody pulled out the wedge.']]},
 obsArrival:{title:'The old telescope',where:'The Fallen Orrery',lines:[['You','I know this mechanism.'],['Wick','You dropped it through the ceiling.'],['You','Did I repair it?'],['Wick','You tried. That’s why it has two cranks.']]},
 astronomerBefore:{title:'Correction',where:'The Shattered Dome',lines:[['The Glass Astronomer','Stand on the brass line.'],['You','Why?'],['The Glass Astronomer','I need one clean measurement.'],['You','Of what?'],['The Glass Astronomer','Whether you are still you.'],['Wick','Don’t step on it.']]},
 astronomerAfter:{title:'The ninth lens',where:'The Shattered Dome',lines:[['The Glass Astronomer','There. Same error.'],['You','Which error?'],['The Glass Astronomer','You always arrive after the star moves.'],['You','How late am I?'],['The Glass Astronomer','Nine years and four months.']]},
 archiveArrival:{title:'Checked out',where:'The Intake Desk',lines:[['You','My name is in the returns column.'],['Wick','It’s also under materials checked out.'],['You','What did I borrow?'],['Wick','Turn the page.']]},
 scribeBefore:{title:'The last copy',where:'The Last Margin',lines:[['The Pale Scribe','State your name.'],['You','It’s on your desk.'],['The Pale Scribe','State it for the record.'],['Wick','Don’t answer questions in here.'],['The Pale Scribe','He remembers procedure.']]},
 scribeAfter:{title:'Unredacted',where:'The Last Margin',lines:[['The Pale Scribe','I kept one copy.'],['You','Which record?'],['The Pale Scribe','Your petition to seal the lower archive.'],['You','Give it to me.'],['The Pale Scribe','Your last instruction was to burn it unread.']]},
 courtArrival:{title:'Your seat',where:'The Servants’ Door',lines:[['You','They set a place for me.'],['Wick','They’ve reset that table every morning since you left.'],['You','How do you know?'],['Wick','I was here for too many mornings.']]},
 regentsBefore:{title:'The audience',where:'The Audience Chamber',lines:[['The First Regent','At last.'],['The Second Regent','Late, as usual.'],['You','You’ve been sharing the same speech too long.'],['The First Regent','It is my speech.'],['The Second Regent','They think everything is theirs.']]},
 regentsAfter:{title:'One answer',where:'The Audience Chamber',lines:[['You','Who ordered the archive sealed?'],['The First Regent','You did.'],['The Second Regent','We did.'],['You','Which is it?'],['Wick','You wrote the order. They gave you the authority.']]},
 choirArrival:{title:'Breathing room',where:'The Low Refrain',lines:[['Wick','Four in, six out.'],['You','I’ve heard that before.'],['Wick','You fainted on this staircase twice.'],['You','Only twice?'],['Wick','I caught you the third time.']]},
 seraphBefore:{title:'The missing note',where:'The Open Belfry',lines:[['The Void Seraph','Finish the hymn.'],['You','I don’t know it.'],['The Void Seraph','You removed the final note.'],['Wick','The note let it land. We filed it out of every bell.'],['The Void Seraph','I kept a copy.']]},
 seraphAfter:{title:'After the song',where:'The Open Belfry',lines:[['You','I can still hear the missing note.'],['Wick','Bite your tongue if you have to.'],['You','That bad?'],['Wick','Last time you hummed it, the stairs grew three floors.']]},
 citadelArrival:{title:'Defenses',where:'The Inward Wall',lines:[['You','All the defenses point inside.'],['Wick','The order was to hold the courtyard.'],['You','Against who?'],['Wick','Everyone who worked below floor forty.']]},
 tyrantBefore:{title:'The moving throne',where:'The Siege Hall',lines:[['The Obsidian Tyrant','Kneel.'],['You','Does that throne turn?'],['The Obsidian Tyrant','Kneel.'],['Wick','Not quickly.'],['You','I’ll take that.']]},
 tyrantAfter:{title:'No king',where:'The Siege Hall',lines:[['You','Who sat on the throne?'],['Wick','Nobody. It’s the command engine.'],['You','They put their orders in a chair?'],['Wick','People objected less when it wore a crown.']]},
 heartArrival:{title:'Pieces',where:'The Borrowed Gate',lines:[['You','That hinge came from the gatehouse.'],['Wick','So did the bell on the next platform.'],['You','The archive is eating itself?'],['Wick','It’s trying to rebuild the first lock.']]},
 keeperBefore:{title:'The first promise',where:'The Heart of the Star',lines:[['The First Keeper','Put my light back.'],['You','Wick isn’t a tool.'],['The First Keeper','He is the missing part.'],['Wick','So are you.'],['The First Keeper','They brought you here to turn the key.']]},
 keeperAfter:{title:'Why you came',where:'The Heart of the Star',lines:[['You','Why did I open the gate?'],['Wick','The star was failing.'],['The First Keeper','He told you it could be repaired.'],['You','Were either of you right?'],['Wick','We’re about to find out.']]}
});
