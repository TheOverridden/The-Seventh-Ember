(function(){
 const STORY_RECUT_VERSION=2;
 const scene=(title,where,lines)=>({title,where,lines});
 Object.assign(HOLLOW_SCENES,{
  arrival:scene('The little light','The Gatehouse',[
   ['???','Hey. Stay with me.'],['You','I am with you. You are on fire.'],['???','A little. Can you sit up?'],['You','Name.'],['Wick','Wick.'],['You','Mine.'],['Wick','I was hoping you knew that one.']
  ]),
  walks:scene('A lamp out of place','The Lantern Walks',[
   ['You','That lamp has legs.'],['Wick','Yes.'],['You','You could sound more concerned.'],['Wick','I used it up when the first one grew teeth.']
  ]),
  barracks:scene('Blue thread','The Empty Barracks',[
   ['You','This coat fits me.'],['Wick','Check the left sleeve.'],['You','Blue thread. Bad stitching.'],['Wick','You kept moving. I did what I could.'],['You','You knew me.'],['Wick','Keep the coat.']
  ]),
  wardenBefore:scene('Wrong side of the door','The Last Watch',[
   ['The Star Warden','Two knocks.'],['You','What?'],['The Star Warden','You are on the wrong side.'],['Wick','Mara. Look at them.'],['The Star Warden','I am. That is why the gate stays shut.'],['You','Then tell me what you see.'],['The Star Warden','The seventh attempt.']
  ]),
  wardenAfter:scene('The question she kept','The Last Watch',[
   ['The Star Warden','Left shoulder still drops before you rush.'],['You','Mara?'],['The Star Warden','Some things survived.'],['You','Why did you call me seventh?'],['The Star Warden','Ask the garden how many beds it made.'],['Wick','The stairs are open.'],['The Star Warden','And Wick is still choosing what not to say.']
  ]),
  firstDeath:scene('A familiar fall','After the first fall',[
   ['You','I died.'],['Wick','You came back.'],['You','That distinction feels larger from your side.'],['Wick','It is.'],['You','How many times?'],['Wick','Enough that I stopped giving them numbers.']
  ]),
  firstSigil:scene('The hand remembers','The Skill Tree',[
   ['You','I knew where to put that mark.'],['Wick','Your hands kept more than the rest of you.'],['You','Did you?'],['Wick','More than I should have. Less than you want.']
  ]),
  gardenArrival:scene('Beds without sleepers','The Overgrown Walk',[
   ['You','These rows were planted by measure.'],['Wick','They were beds before they were rows.'],['You','For plants?'],['Wick','Keep walking.']
  ]),
  gardenChoice:scene('The back of the sign','The Still Courtyard',[
   ['You','KEEP THE GATE CLOSED.'],['Wick','Turn it over.'],['You','EVEN IF THEY ASK NICELY. That is my handwriting.'],['Wick','You added it the night the roots used Mara’s voice.']
  ]),
  nurseryTalk:scene('Seven plates','The Nursery',[
   ['You','Six frames. Seven nameplates.'],['Wick','One plate never touched a frame.'],['You','Mine.'],['Wick','I took it before the roots finished.'],['You','Finished what?'],['Wick','You. Badly. Six times.']
  ]),
  matriarchBefore:scene('The gardener remembers','The Root Chamber',[
   ['The Hollow Matriarch','Little lamp. You brought it back.'],['Wick','I brought no one to you.'],['The Hollow Matriarch','Six slept quietly. This one arrived awake.'],['You','What did you grow here?'],['The Hollow Matriarch','What you ordered. What he stole.']
  ]),
  matriarchAfter:scene('The empty seventh bed','The Root Chamber',[
   ['The Hollow Matriarch','There. The roots remember your weight.'],['You','The other six?'],['The Hollow Matriarch','They woke with the same words. They walked below. They did not return.'],['You','And me?'],['Wick','I left part of you unwritten.'],['You','You had better hope that was kindness.']
  ]),
  reservoirArrival:scene('Water above the line','The Spillway',[
   ['You','The flood marks are numbered.'],['Wick','Three floods happened.'],['You','There are four marks.'],['Wick','One was drawn before they opened the doors.']
  ]),
  bellkeeperBefore:scene('The shift bell','The Bell Cistern',[
   ['The Bellkeeper','Lower walk, clear. Upper walk, clear.'],['You','There is no one on either walk.'],['The Bellkeeper','Incorrect. Forty-two reported above. Eleven below.'],['Wick','That was nine years ago.'],['The Bellkeeper','The bell has not marked morning. The shift continues.']
  ]),
  bellkeeperAfter:scene('No morning bell','The Bell Cistern',[
   ['The Bellkeeper','Lower walk...'],['You','You can stop.'],['The Bellkeeper','Who relieves the watch?'],['Wick','No one.'],['You','Then we do.'],['The Bellkeeper','That is not procedure.'],['You','I know.']
  ]),
  foundryArrival:scene('A cold forge','The Cold Forge',[
   ['You','It is cold.'],['Wick','The rail is not.'],['You','You touch it.'],['Wick','I am fire.'],['You','That sounded smug.'],['Wick','It was practical. Mostly.']
  ]),
  colossusBefore:scene('Worker three','The Furnace Crown',[
   ['The Ember Colossus','Token.'],['You','I do not have one.'],['The Ember Colossus','Worker three always loses the token. Check the right pocket.'],['You','There is a hole in the right pocket.'],['The Ember Colossus','Incident repeated. Line halted. Remove obstruction.']
  ]),
  colossusAfter:scene('The line stops','The Furnace Crown',[
   ['The Ember Colossus','Hammer three... late.'],['You','For once.'],['Wick','You used to swear at it.'],['You','Did that help?'],['Wick','Not the hammer. The crew liked it.'],['The Ember Colossus','Break authorized. Duration: overdue.']
  ]),
  obsArrival:scene('A telescope pointed down','The Fallen Orrery',[
   ['You','This telescope is upside down.'],['Wick','It is looking through the floor.'],['You','At what?'],['Wick','The sky they buried.']
  ]),
  astronomerBefore:scene('One clean measurement','The Shattered Dome',[
   ['The Glass Astronomer','Stand on the brass line.'],['You','No.'],['The Glass Astronomer','Good. The first six obeyed.'],['Wick','Do not let the lenses see your whole face.'],['The Glass Astronomer','Too late. It has already begun correcting you.']
  ]),
  astronomerAfter:scene('The ninth lens','The Shattered Dome',[
   ['The Glass Astronomer','Seven shadows. One body.'],['You','Which shadow is mine?'],['The Glass Astronomer','The one that moved before you did.'],['Wick','Lens nine is looking into the Heart.'],['You','No. Something in the Heart is looking back.']
  ]),
  archiveArrival:scene('Returned tomorrow','The Intake Desk',[
   ['You','This stamp says I was returned tomorrow.'],['Wick','Do not touch the ink.'],['You','Why?'],['Wick','Last time it put your name on everything in the room.']
  ]),
  scribeBefore:scene('A name for the record','The Last Margin',[
   ['The Pale Scribe','State a name you have not borrowed.'],['You','You first.'],['The Pale Scribe','Mine was cut from the ledger.'],['Wick','By whose order?'],['The Pale Scribe','The hand standing before me.']
  ]),
  scribeAfter:scene('What the knife missed','The Last Margin',[
   ['The Pale Scribe','You removed the names. You spared the small things.'],['You','Shift times. Repairs. Lunch orders.'],['The Pale Scribe','You believed a life could hide inside its untidy parts.'],['Wick','Were they enough?'],['The Pale Scribe','You are asking one of them.']
  ]),
  courtArrival:scene('Dinner for people who left','The Servants’ Door',[
   ['You','The food is warm.'],['Wick','Do not eat it.'],['You','I was not going to.'],['Wick','You said that last time.'],['You','Did I eat it?'],['Wick','You complained about the salt.']
  ]),
  regentsBefore:scene('Two halves of an order','The Audience Chamber',[
   ['The First Regent','You wrote the seal.'],['The Second Regent','We supplied the authority.'],['The First Regent','Under protest.'],['The Second Regent','After supper.'],['You','You rehearsed this argument for nine years?'],['The First Regent','Ten.'],['The Second Regent','Nine and four months.']
  ]),
  regentsAfter:scene('Three signatures','The Audience Chamber',[
   ['You','My hand. Your seals.'],['The First Regent','Precisely.'],['The Second Regent','Conveniently.'],['You','Nobody gets to own only the part that excuses them.'],['The First Regent','I dislike this ruling.'],['The Second Regent','Then we agree.']
  ]),
  choirArrival:scene('Four in, six out','The Low Refrain',[
   ['Wick','Four in. Six out.'],['You','You have said that before.'],['Wick','You fainted on these stairs.'],['You','Once?'],['Wick','I got better at catching you.']
  ]),
  seraphBefore:scene('The note with no sound','The Open Belfry',[
   ['The Void Seraph','The song is waiting for its last note.'],['You','It can keep waiting.'],['The Void Seraph','You cut it from every throat and bell.'],['Wick','Because something followed it home.'],['The Void Seraph','It is already home. Listen.']
  ]),
  seraphAfter:scene('A different silence','The Open Belfry',[
   ['You','The missing note is still here.'],['Wick','Do not hum it.'],['You','I was not going to.'],['Wick','You hum when you are frightened.'],['You','I do not.'],['Wick','You are doing it now.']
  ]),
  citadelArrival:scene('The wall faces home','The Inward Wall',[
   ['You','Arrow slits on the wrong side.'],['Wick','The wall was turned around after the voices started.'],['You','What voices?'],['Wick','People they knew. Saying the right names.']
  ]),
  tyrantBefore:scene('The empty throne','The Siege Hall',[
   ['The Obsidian Tyrant','KNEEL FOR IDENTIFICATION.'],['You','Who is sitting up there?'],['Wick','No one. The chair gives the orders.'],['You','Of course it does.'],['The Obsidian Tyrant','SARCASM RECORDED AS NONCOMPLIANCE.'],['You','Finally, an accurate record.']
  ]),
  tyrantAfter:scene('An order without a king','The Siege Hall',[
   ['The Obsidian Tyrant','NO VALID TARGETS.'],['You','Good.'],['The Obsidian Tyrant','NO VALID COMMAND.'],['Wick','Even better.'],['The Obsidian Tyrant','REQUESTING PURPOSE.'],['You','Get in line.']
  ]),
  heartArrival:scene('The first room, badly remembered','The Borrowed Gate',[
   ['You','That hinge belongs upstairs.'],['Wick','So does the bell.'],['You','The Heart is taking the Archive apart.'],['Wick','It is rebuilding the night you opened the gate.'],['You','Why?'],['Wick','It wants the answer you gave Mara.']
  ]),
  keeperBefore:scene('The part that was taken','The Heart of the Star',[
   ['The First Keeper','Wick. Come home.'],['Wick','No.'],['The First Keeper','You are a key pretending to be a friend.'],['You','And I am?'],['The First Keeper','A friend pretending not to be a key.'],['Wick','Do not answer the door.'],['The First Keeper','The Listener has heard every answer except yours.']
  ]),
  keeperAfter:scene('The old answer','The Heart of the Star',[
   ['The First Keeper','The lock remembers you.'],['You','It remembers someone with my hands.'],['Wick','That is enough to open it.'],['You','And enough for the Listener to follow.'],['The First Keeper','Then do what the Lamplighter could not.'],['You','Say something new.']
  ]),
  listenerRecognition:scene('A voice made of rooms','The Heart of the Star',[
   ['The Listener','You are late.'],['The Listener','The bell has not gone.'],['The Listener','Why did you come?'],['Wick','Those are not its words.'],['You','Good. It will not know what I say next.']
  ])
 });

 const recordRows=[
  ['echo1','Watch Roster','The Gatehouse','Eight names are chalked beneath tonight’s watch. Mara’s name has been moved twice. The eighth line is rubbed into a grey hollow.','“Trade me east watch and I’ll owe you breakfast.”'],
  ['echo2','Oil Tin','The Lantern Walks','A strip of blue cloth is knotted around the handle. Someone dented the lid until a small metal arm could grip it.','“Not so full. Wick spills when he tries to hurry.”'],
  ['echo3','Bell Rope','The Bell Court','The lowest knot is child-high. Above it, the rope is polished by hundreds of hands.','“One for supper. Three for the gate. No, you may not ring four.”'],
  ['echo4','Unsent Letter','The Empty Barracks','The first page is an apology for the damp. The second promises to be home after the watch changes. There is no third page.','“Leave the hall lamp on. I hate coming home to a dark window.”'],
  ['echo5','Knock Plate','The Last Watch','Two bright marks show where knuckles struck the iron. Below them, a question has been scratched so deeply the letters bend.','“Ask why I came. Make me answer before you lift the bar.”'],
  ['echo6','Painted Bean Stakes','The Overgrown Walk','Six stakes say BEANS. A seventh says WEEDS, crossed out, then BEANS AGAIN in red.','“If you pull them a third time, you are buying supper.”'],
  ['echo7','Inside-Smoked Glass','Glasshouse Ruins','The pane is clean outside and black inside. Fingerprints stop at the exact height of a child’s face.','“No thunder. That came from under the beds.”'],
  ['echo8','Two-Sided Warning','The Still Courtyard','KEEP THE GATE CLOSED fills the front. The back adds EVEN IF THEY ASK NICELY in hurried red letters.','“That is not funny.” — “It will be when I am less frightened.”'],
  ['echo9','Seven Nameplates','The Nursery','Six plates are screwed to frames. The seventh has a leather cord threaded through it, made to be worn.','“If smoke fills the hall, follow the person carrying your names.”'],
  ['echo10','Garden Spade','The Root Chamber','The handle is notched six times. A seventh notch begins, then veers off into a long cut.','“Morning. I said I would be back by morning.”'],
  ['trace11','Flood Gauge','The Spillway','Three waterlines carry dates. A fourth line carries an hour and a supervisor’s initials.','“Draw it at six. Open the doors at seven. Give them time to move.”'],
  ['trace12','Pump Wrench','The Pump Gallery','The grip is wrapped in sailcloth and bitten through near the end.','“Kick three, insult it, then turn left. The insult is optional.”'],
  ['trace13','Dry Parcel','The Sunken Walk','Oilcloth holds socks, a heel of bread, and a child’s drawing of a crooked blue tower.','“Keep these. I have another pair.” — “You said that yesterday.”'],
  ['trace14','Valve Prayer','The Sluice Chapel','A maintenance sequence has been copied onto a prayer board. Someone added PLEASE between steps four and five.','“Two turns. Wait for the knock. One turn back.”'],
  ['trace15','Flattened Clapper','The Bell Cistern','One side is worn flat. The metal tastes of rust in the restored air.','“If it rings below water, follow the rail. Do not follow the voice.”'],
  ['trace16','Lunch Pail','The Cold Forge','Soot outlines a missing square photograph inside the lid. A name is written underneath, then covered with wax.','“Save my seat. Hammer three is sulking again.”'],
  ['trace17','Bent Cooling Hook','The Slag Run','Three repair tags hang from a tool that should have been discarded. The oldest tag is in your hand.','“Do not use this.” — “Then issue me one that works.”'],
  ['trace18','Brass Work Token','The Hammer Line','Number 3 has been stamped over an older number. The edge is smoothed by a thumb.','“Watch the belt. The bell lies. Hammer three lies louder.”'],
  ['trace19','Clay Finger','The Mold Vault','A fired finger rests beside a row of human-sized molds. A tiny crescent is pressed into its nail.','“Tools do not need fingernails.” — “The order says tools.”'],
  ['trace20','Soft Furnace Key','The Furnace Crown','Heat has rounded every tooth until the key can open nothing. Someone kept carrying it anyway.','“If I am not down by the second whistle, break the crown valve.”'],
  ['trace21','Hinged Brass Planet','The Fallen Orrery','The planet opens to reveal three workers sharing noodles beneath a paper constellation.','“If the sky ends during lunch, lunch still ends at half past.”'],
  ['trace22','Lens Ledger','The Meridian Hall','Every lens has a cleaning date except nine. Its column contains one instruction: LET IT STAY BLIND.','“Nine is clean. It is looking the wrong way.”'],
  ['trace23','Chalk Footprints','The Parallax Walk','Two matching trails divide around a pillar. The left print lands half a step before the right.','“If you see me ahead of you, stop. Do not try to catch up.”'],
  ['trace24','Map Marked HOME','The Blind Planetarium','HOME is circled below the drawn horizon, at a coordinate no surface telescope could see.','“Lens nine comes back to it every winter.”'],
  ['trace25','Warm Eyepiece','The Shattered Dome','The glass remains warm. Looking through it shows this room with someone already standing where you stand.','“Do not wave. It copies late, then early.”'],
  ['trace26','Tomorrow Stamp','The Intake Desk','RETURNED is followed by tomorrow’s date. Old ink on the handle spells half your title.','“Stop stamping the staff.” — “Then stop shelving my forms under FICTION.”'],
  ['trace27','Revision Card','The Flooded Index','A card points to Controlled Removal of Familiar Names, Revision Three. Revisions one and two never existed.','“If it can call us correctly, it can find us correctly.”'],
  ['trace28','Redaction Knife','The Redaction Rooms','The dull blade has cut thousands of names and not one sentence. Human skin oil darkens the handle.','“Leave the chores. Leave the arguments. Take only the names.”'],
  ['trace29','Weather Complaint','The Misfiled Wing','A form reports steady rain in aisle six and asks for two buckets and a new roof.','“There is no roof over aisle six.” — “Then this should be cheaper.”'],
  ['trace30','Unburned Corner','The Last Margin','A single corner escaped the fire. It contains three letters from a name and the words KEEP WICK OUTSIDE.','“You do not get to decide that alone.”'],
  ['trace31','Reversible Place Card','The Servants’ Door','Your title is written on one side. Your first name was cut from the other. Both sides have been used.','“Turn it according to who needs the Lamplighter today.”'],
  ['trace32','Cold Dinner Plate','The Empty Banquet','Dust covers the table. One plate is clean, with fresh fingerprints on both sides of the rim.','“We cannot vote hungry.” — “We have been deadlocked for six hours.”'],
  ['trace33','Three-Seal Order','The Gallery of Favors','Two wax seals crowd the bottom of the page. Your signature fits between them, written at an angle.','“If this fails, we signed together.” — “If it works?” — “Also together.”'],
  ['trace34','Mended Carpet','The Divided Throne','A perfect cut divides the carpet. Uneven stitches close it from underneath. Blue thread appears near the center.','“They split the room again.” — “Hand me the needle.”'],
  ['trace35','Silent Audience Bell','The Audience Chamber','The polished bell has never had a clapper. Wear inside the rim suggests someone struck it with a spoon.','“We removed that for a reason.” — “Then stop ignoring me.”'],
  ['trace36','Breath Marks','The Low Refrain','Finger streaks on the wall count four inward and six outward. The last set is much lower.','“Again. Slow this time. I can catch you, not your breath.”'],
  ['trace37','Stitched Song Strip','The Bell Lung','A line of music is sewn into leather so wet paper cannot erase it. One bar has been unpicked.','“Nobody carries the whole hymn. Nobody sings alone.”'],
  ['trace38','Blank Tuning Fork','The Cantor Stairs','The fork has no pitch. When struck, every loose object in the room turns toward the Heart.','“The silence points somewhere.”'],
  ['trace39','Night-Glass Feather','The Broken Octave','Layers of dark glass form a feather. A pale fingerprint lies sealed between them.','“It had feathers before it learned our song.”'],
  ['trace40','Do Not Sing','The Open Belfry','Four words are written across a page of music. Beneath them, someone has penciled: ESPECIALLY YOU.','“I hum.” — “You wander into key.”'],
  ['trace41','Inward Arrows','The Inward Wall','Every arrow is fletched to fly toward the courtyard. Several are tagged RETURN TO ARMORY, UNUSED.','“The enemy knows our names. Check faces twice.”'],
  ['trace42','Chain Doorstop','The Chain Ward','A prison chain has been folded beneath a door to keep it open. The proper key hangs untouched nearby.','“Keys can be taken back. A bent link is a promise.”'],
  ['trace43','Recognition Target','The Powder Chapel','A range card shows a human outline. FACE is crossed out. VOICE and ANSWER remain.','“If it answers before you ask, fire.”'],
  ['trace44','Cloth-Wrapped Gear','The King’s Engine','A strip of uniform quiets one broken tooth. The machine has worn the cloth smooth without tearing it.','“It counts every strike.” — “Then let it miss one.”'],
  ['trace45','Steering Crown','The Siege Hall','The crown fits a control column. Grease fills the jewels. One point is bent from being used as a handle.','“Ceremonial?” — “Only if steering is a ceremony.”'],
  ['trace46','Blue Gate Hinge','The Borrowed Gate','Paint from the first floor survives on the pin. The Heart has mounted it backward.','“It remembers the door, not which way freedom was.”'],
  ['trace47','Root Around Nothing','The Garden Without Soil','A dry root grips an empty vessel-shaped space. Six smaller roots end in knots.','“Six stay. The seventh goes with Wick.”'],
  ['trace48','Blank Brass Plate','The Unwritten Room','The plate has holes for a cord and none for a frame. Warmth gathers where a name should be.','“Leave it blank until they can answer for themselves.”'],
  ['trace49','Two Knocks','The Door With Two Knocks','Knuckle marks shine at the height of your hand. The question beneath them has been answered so often the floor remembers it.','“Why did you come?” — “To put the star back.”'],
  ['trace50','The First Wick','The Heart of the Star','A glass cup holds a dead wick joined to a curl of silver wire. The scorch marks resemble tiny handwriting.','“You read the manuals aloud. I corrected you before I knew what correcting was.”']
 ];
 for(const [id,title,place,description,fragment] of recordRows){const old=TRACE_RECORDS[id]||{};TRACE_RECORDS[id]={...old,title,place,description,fragment,note:''};}

 const reactions={
  echo1:[['A watchwoman','Mara swapped because she wanted the lower gate.'],['Wick','She told everyone it was for breakfast.']],
  echo2:[['A small flame','The knot is clumsy.'],['You','You tied it yourself.']],
  echo3:[['A child','Four bells means I found another reason.'],['An older voice','Three reasons are plenty.']],
  echo4:[['The writer','Leave the window lit.'],['You','Nobody knew there would be no next watch.']],
  echo5:[['Mara','Why did you come?'],['You','I taught the lock my answer.']],
  echo6:[['A gardener','Those are beans.'],['You','I was not good at this.']],
  echo7:[['Someone under glass','It came from below.'],['Wick','The beds opened before the gate did.']],
  echo8:[['You, before','It asked in Mara’s voice.'],['Wick','You laughed after you stopped shaking.']],
  echo9:[['A line of children','Who carries the names?'],['You','Someone they trusted.']],
  echo10:[['Wick, before','You said morning.'],['You','You waited anyway.']],
  trace11:[['A sluice worker','Give the lower crew an hour.'],['You','Somebody shortened it.']],
  trace12:[['A mechanic','Insult first. It likes consistency.'],['Wick','You were very consistent.']],
  trace13:[['A tired voice','Keep the socks.'],['Wick','You never did.']],
  trace14:[['A worker at the valve','Please.'],['You','Sometimes procedure needs one honest word.']],
  trace15:[['The Bellkeeper','Do not follow the voice.'],['Wick','It learned the bells before it learned names.']],
  trace16:[['A foundry worker','Save my seat.'],['You','I put the photograph in my coat.']],
  trace17:[['A foreman','Tag it out.'],['You, before','Replace it first.']],
  trace18:[['The third hammer','EARLY.'],['You','My hands remember the gap.']],
  trace19:[['A mold maker','Tools do not need fingernails.'],['Wick','They were not allowed to call the vessels people.']],
  trace20:[['You, before','Break the crown valve.'],['Wick','You made it down. Not back.']],
  trace21:[['Someone laughing','Half past. Even for the end of the sky.'],['You','Good rule.']],
  trace22:[['The Glass Astronomer','Let nine stay blind.'],['Wick','Someone kept opening its eye.']],
  trace23:[['Footsteps ahead','Stop.'],['You','The first six followed themselves.']],
  trace24:[['An astronomer','Home is down.'],['Wick','That was the first lie the sky told.']],
  trace25:[['Your reflection','Do not wave.'],['You','It moved first.']],
  trace26:[['A clerk','Returned tomorrow.'],['You','The Archive expected everyone back.']],
  trace27:[['You, before','Names are doors.'],['Wick','So you took yours away.']],
  trace28:[['The Pale Scribe','Leave the untidy parts.'],['You','A life is hard to imitate when it stays messy.']],
  trace29:[['A clerk with a bucket','Still raining.'],['Wick','The Reservoir leaked into a memory.']],
  trace30:[['Wick, before','You do not decide alone.'],['You','I tried to leave you outside.']],
  trace31:[['A servant','Which side today?'],['You','Whichever side made me useful.']],
  trace32:[['The Second Regent','Pass the salt.'],['The First Regent','We are voting.'],['You','Apparently both can happen.']],
  trace33:[['Three voices','Together.'],['Wick','They remembered the promise differently.']],
  trace34:[['Someone beneath the table','Hand me the blue thread.'],['You','I kept sewing their arguments shut.']],
  trace35:[['A spoon against brass','Listen.'],['Wick','The quietest bell in the Archive.']],
  trace36:[['Wick, before','Four in. Six out.'],['You','You knew my breath before my name.']],
  trace37:[['A row of singers','Nobody sings alone.'],['Wick','That rule kept it from finding the whole path.']],
  trace38:[['A soundless note','—'],['You','Even the silence points to the Heart.']],
  trace39:[['A singer','It was already becoming us.'],['Wick','Before anyone gave it a name.']],
  trace40:[['Wick, before','Especially you.'],['You','I do not wander into key.']],
  trace41:[['A guard','Check faces twice.'],['You','The second check came too late.']],
  trace42:[['A prisoner','Leave it open.'],['Mara','I never found who bent the link.']],
  trace43:[['A range officer','Ask first.'],['Wick','The Listener learned to answer early.']],
  trace44:[['A mechanic','Let it miss one.'],['You','A whole machine confused by a piece of cloth.']],
  trace45:[['A driver','Hold the crown.'],['Wick','They made a weapon easier to obey by giving it a throne.']],
  trace46:[['The Heart','OPEN / CLOSE'],['You','It cannot remember which.']],
  trace47:[['The Hollow Matriarch','Six stay.'],['Wick','I took the seventh.']],
  trace48:[['Wick, before','No name yet.'],['You','You left me room.']],
  trace49:[['Your old voice','To put the star back.'],['Wick','It has been waiting for those exact words.']],
  trace50:[['A new little voice','Page twelve is upside down.'],['You','You started by correcting me.'],['Wick','Some things survive.']]
 };
 for(const [id,lines] of Object.entries(reactions))ECHO_REACTIONS[id]=lines;

 const storyEchoObjectKind=echoObjectKind;
 echoObjectKind=function(title=''){
  if(/knock plate/i.test(title))return'door';
  if(/unburned corner|recognition target/i.test(title))return'paper';
  if(/tuning fork/i.test(title))return'music';
  return storyEchoObjectKind(title);
 };

 Object.assign(ARCHIVE_BOSS_LINE,{
  witness:'You keep stopping for the small things. The rooms have noticed.',
  shelter:'There are little fires behind you now. People are walking toward them.',
  defiance:'The last guardian taught me how you stand. You taught it badly.',
  severance:'The rooms close before you reach them. They remember being left.'
 });

 const dynamicBossLines={
  wardenBefore:{witness:'You looked at the roster. Did you find the name I erased?',shelter:'You lit the brazier. You always hated leaving a cold room behind.',defiance:'Still meeting locked doors shoulder-first.',severance:'You passed the first room without looking. That is new.'},
  matriarchBefore:{witness:'You listen longer now. The other six were in a hurry.',shelter:'Every flame you tend warms my roots.',defiance:'You break what reaches for you. Sensible.',severance:'You leave rooms empty. I can grow in emptiness.'},
  bellkeeperBefore:{witness:'You heard the people between the bells.',shelter:'Rest lights reported along the upper route.',defiance:'Previous watch removed by force. Logged.',severance:'Unanswered rooms added to the flood count.'},
  colossusBefore:{witness:'INSPECTION ROUTE ACCEPTED.',shelter:'HEAT SHARED OUTSIDE AUTHORIZED CHANNELS.',defiance:'DAMAGE PATTERN RECEIVED.',severance:'STATIONS PASSED WITHOUT CLOCKING IN.'},
  astronomerBefore:{witness:'You keep turning toward the figures instead of the lens.',shelter:'Small lights distort the measurement. Keep them.',defiance:'Your shadow reaches the line before you do.',severance:'Less of you appears in every room.'},
  scribeBefore:{witness:'You read what we left between the names.',shelter:'The margins carry a line of warm fingerprints.',defiance:'You have corrected several records by impact.',severance:'Blank pages are accumulating behind you.'},
  regentsBefore:{witness:'You heard the witnesses. Annoying.','shelter':'The servants are lighting the lower tables.','defiance':'You have mistaken every objection for permission to advance.','severance':'Unheard testimony is still testimony.'},
  seraphBefore:{witness:'You listened without finishing the song.',shelter:'Little flames have found a harmony of their own.',defiance:'You strike between the beats.',severance:'You are making a silence even I cannot follow.'},
  tyrantBefore:{witness:'ARCHIVE ACCESS: EXCESSIVE.',shelter:'UNAUTHORIZED BEACON TRAIL DETECTED.',defiance:'COMBAT HABIT RECEIVED. COUNTERMEASURE LOADED.',severance:'MISSING-ROOM COUNT ACCEPTABLE.'},
  keeperBefore:{witness:'You carried the rooms here. The lock is crowded with them.',shelter:'The route behind you is lit. I had forgotten what that meant.',defiance:'Every guardian arrives in your stance. None kept it.',severance:'You came to the Heart lighter than the others.'}
 };

 function flattenScene(id){
  const s=HOLLOW_SCENES[id];if(!s)return[];const out=[];
  for(let i=0;i<s.lines.length;i++){const q=s.lines[i];if(Array.isArray(q))out.push({speaker:q[0],text:q[1]});else if(q?.choices){const selected=storyData().choices[id+':'+i],choice=q.choices[selected];if(choice)out.push({speaker:q.speaker||'You',text:choice.label},...choice.reply.map(x=>({speaker:x[0],text:x[1]})));else out.push({...q,choiceKey:id+':'+i});}else if(q)out.push({...q});}
  return out;
 }
 storyLines=function(id){
  const lines=flattenScene(id),speaker=ARCHIVE_BOSS_SPEAKER[id],profile=archiveProfile();
  if(speaker&&profile.recovered+profile.skipped>=3){const text=dynamicBossLines[id]?.[profile.dominant]||ARCHIVE_BOSS_LINE[profile.dominant];if(text)lines.splice(Math.min(2,lines.length),0,{speaker,text});}
  return lines;
 };

 const priorRenderDialogueLine=renderDialogueLine;
 renderDialogueLine=function(){priorRenderDialogueLine();if(dialogue?.lines[dialogue.index]?.speaker==='The Listener')T('speakerTag').textContent='THE LISTENER';};

 Object.assign(FINAL_ANSWERS,{
  people:{label:'Because they are still waiting.',title:'The people who waited',text:'“Because they are still waiting.” The Listener searches every room for the sentence. It finds requests, orders, apologies, and jokes. Nobody said it before you.'},
  wick:{label:'Because Wick came back for me.',title:'The promise beside you',text:'“Because Wick came back for me.” His flame jumps at the sound of his name. The old Lamplighter gave him instructions. You give him credit. The Listener has no place to put the difference.'},
  choice:{label:'Because I decided to.',title:'The answer with no echo',text:'“Because I decided to.” Nothing answers. Six vessels came down carrying borrowed reasons. Yours begins here, and the Listener cannot stand ahead of a memory that has never happened.'}
 });

 function storyRecutEndingHistory(){
  const p=archiveProfile(),count=p.recovered,miss=p.skipped;
  if(p.dominant==='shelter')return'Mara finds the first Resting Flame still lit. Beyond it, another wakes, then another. The people follow the small lights upward while the guardians hold the doors.';
  if(p.dominant==='defiance')return'The guardians remember every time you refused their old orders. When the Heart speaks again, none of them kneels. The Citadel turns its weapons toward the empty dark.';
  if(p.dominant==='severance')return`${miss||'Some'} rooms remain shut. Wick marks each door before leaving. He does not call that failure. He calls it a way back.`;
  return`You carried ${count} rooms to the Heart. Their voices arrive as witnesses, untidy and overlapping. The Listener can copy each sentence. It cannot make them agree.`;
 }
 configureEndingScenes=function(){
  const answer=FINAL_ANSWERS[storyData().finalAnswer],heart=storyChoice('heartChoice'),identity=heart===0?'You keep the Lamplighter’s title because you chose the work, not because the Archive assigned it.':heart===1?'The Lamplighter died below the furnace. You let that life belong to the dead and keep your own.':'The brass plate stays blank. Wick says he can wait until you find a name you like.';
  ENDING_SCENES.splice(0,ENDING_SCENES.length,
   {title:'The door remembers',speaker:'The First Keeper',text:'The iron door rebuilds itself from fifty imperfect rooms. It knows your hand. It knows the knock. It knows the answer the Lamplighter gave Mara.'},
   {title:'Six empty beds',speaker:'Wick',text:'The garden made six vessels from that answer. Each woke certain of who they were. Each came here, spoke the old words, and gave the Listener another way through.'},
   {title:'The seventh plate',speaker:'Wick',text:'I took your nameplate before the roots finished. I left holes in the memory. I thought an unfinished person might still surprise the door.'},
   {title:'What waited in the Star',speaker:'The First Keeper',text:'When the sky fell, the First Star folded the city inward: rooms, voices, everyone who had not reached the gate. I kept them still until stillness became the only mercy I understood.'},
   {title:'The voice between copies',speaker:'The Listener',text:'You are late. The bell has not gone. Leave the window lit. Why did you come?'},
   {title:'Wick answers first',speaker:'Wick',text:'That is every room talking at once. It knows what we said. It does not know why we meant it.'},
   {title:'A reason of your own',speaker:'You',text:'The old answer waits behind your teeth. You leave it there.',choice:true},
   {title:answer?.title||'The unanswered question',speaker:'You',text:answer?.text||'The door waits for words that belong to the person standing before it.'},
   {title:'The lock misses a step',speaker:'',text:'The question searches for its familiar answer. It finds nothing. For the first time in nine years, the iron bar moves the correct way.'},
   {title:'A name, or room for one',speaker:'Wick',text:identity},
   {title:'What came with you',speaker:'',text:storyRecutEndingHistory()},
   {title:'First through',speaker:'Mara',text:'Mara crosses with one hand over her eyes and the other still on her glaive. “Morning,” she says, testing the word. Behind her, somebody laughs because it is not morning at all.'},
   {title:'The open gate',speaker:'Wick',text:'Wick settles beside your shoulder. Nobody asks him to become a key. Nobody asks you to become the dead. You leave the door open.'}
  );
 };

 const storyRecutChapterClear=showChapterClear;
 showChapterClear=function(){
  storyRecutChapterClear();if(G.state!=='chapter'||G.floor>=50)return;
  const copy={
   5:['Mara lowers the glaive. The gate opens for someone she does not quite recognize.','“The seventh attempt.”'],
   10:['The roots loosen around six empty beds. The place where a seventh should stand is clean.','“What you ordered. What he stole.”'],
   15:['The last bell fades underwater. For the first time, no one answers it.','“Who relieves the watch?”'],
   20:['Hammer three misses its stroke. The foundry discovers that stopping is possible.','“Break authorized. Duration: overdue.”'],
   25:['Lens nine turns away from you. Your seventh shadow remains against the glass.','“Seven shadows. One body.”'],
   30:['The Scribe closes the ledger with the names still missing and the ordinary details intact.','“You are asking one of them.”'],
   35:['The Regents unlock both doors at once, then argue over who moved first.','“Then we agree.”'],
   40:['The hymn ends one note early. Something below continues listening.','“It is already home. Listen.”'],
   45:['The throne asks for a purpose. Nobody in the room gives it one.','“REQUESTING PURPOSE.”']
  }[G.floor];if(copy){T('chapterCompleteText').textContent=copy[0];T('chapterQuote').textContent=copy[1];}
 };

 document.documentElement.dataset.storyRecut='v'+STORY_RECUT_VERSION;
 globalThis.TheSeventhEmberStoryRecut={version:STORY_RECUT_VERSION,records:recordRows.length,scenes:Object.keys(HOLLOW_SCENES).length};
})();
