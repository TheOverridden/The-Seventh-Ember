const CHAPTER_EXIT_TEXT={5:'The gate is open. The stairs lead down to the garden.',10:'The roots have pulled back from the stairs.',15:'The walkway is clear. The foundry is below.',20:'The furnace is cooling. You can cross the platform.',25:'The stairway behind the dome is open.',30:'The Scribe has unlocked the lower doors.',35:'Both doors are open. The Choir is through the right one.',40:'The bells have stopped. The Citadel stairs are clear.',45:'The throne has stopped moving. The Heart is below.'};
const STORY_DIALOGUES={
 arrival:['Getting up','The Gatehouse',[
  ['Wick','Hey. Can you hear me?'],['You','Yes. Where are you?'],['Wick','Beside you. The little light.'],['You','Oh.'],['Wick','I’m Wick. Try moving. We need to get out of this room.']]],
 walks:['The lanterns','The Lantern Walks',[
  ['You','That lantern moved.'],['Wick','Keep back. Some of them bite.']]],
 barracks:['The coat','The Empty Barracks',[
  ['You','Is this mine?'],['Wick','Yes. You left it here before the last watch.'],['You','Do I need it?'],['Wick','Not anymore. Check the pocket, though. You used to keep the gate key in there.']]],
 firstDeath:['Back at the gate','The Gatehouse',[
  ['You','What happened?'],['Wick','You went out. I brought you back here.'],['You','You can do that?'],['Wick','As long as there’s a bit of you left. Sit for a minute.']]],
 firstSigil:['A new sigil','The Skill Tree',[
  ['You','Will I have to do that again if I die?'],['Wick','No. That one stays.']]],
 wardenBefore:['The closed gate','The Last Watch',[
  ['The Star Warden','Stay there.'],['You','I need to get through.'],['The Star Warden','Then you’ll have to wait.'],['Wick','Mara. It’s us.'],['The Star Warden','I know. I’m not opening it.']]],
 wardenAfter:['Past the watch','The Last Watch',[
  ['The Star Warden','Wick. Help me with the bar.'],['You','You’re letting us through?'],['The Star Warden','You’ve broken the lock. I can’t keep you here.'],['The Star Warden','The garden stairs are on your right.']]],
 gardenArrival:['The old garden','The Overgrown Walk',[
  ['You','Did people live here?'],['Wick','They worked here. Most of the food came from these beds.']]],
 gardenChoice:['The sign','The Still Courtyard',[
  ['You','Did I paint that?'],['Wick','Yes. People kept leaving the gate open.'],['You','Did it help?'],['Wick','For a while.']]],
 nurseryTalk:['The nursery','The Nursery',[
  ['You','What are those frames for?'],['Wick','New bodies. The garden made them from the old records.'],['You','Like me?'],['Wick','Yes. I carried you out of this room.']]],
 matriarchBefore:['The root chamber','The Root Chamber',[
  ['The Hollow Matriarch','Get off the beds.'],['You','I’m trying to get to the stairs.'],['The Hollow Matriarch','Not through here.'],['Wick','She’s closing the path. Move.']]],
 matriarchAfter:['The empty frames','The Root Chamber',[
  ['You','Were there others like me?'],['The Hollow Matriarch','Six. They all went downstairs.'],['You','Did any come back?'],['The Hollow Matriarch','No. Wick took you before I finished.'],['Wick','You weren’t waking up. I wasn’t leaving you there.']]],
 reservoirArrival:['The spillway','The Spillway',[
  ['Wick','Use the upper walk.'],['You','Does it go all the way across?'],['Wick','It did. We’ll check before you jump.']]],
 bellkeeperBefore:['The walkway','The Bell Cistern',[
  ['The Bellkeeper','Clear the walkway.'],['You','We’re crossing.'],['The Bellkeeper','This section is closed. Use the upper stairs.'],['You','They’re flooded.'],['The Bellkeeper','Then stay where you are.']]],
 bellkeeperAfter:['The water settles','The Bell Cistern',[
  ['The Bellkeeper','Is anyone still on the lower walk?'],['Wick','No. We checked.'],['The Bellkeeper','Good. Don’t open the sluice until you’re across.']]],
 foundryArrival:['The rail','The Cold Forge',[
  ['Wick','Don’t touch that rail.'],['You','It’s not glowing.'],['Wick','It doesn’t have to be.']]],
 colossusBefore:['The furnace','The Furnace Crown',[
  ['The Ember Colossus','Furnace access closed.'],['You','Shut it down. We need to pass.'],['The Ember Colossus','Shutdown requires a work token.'],['You','We haven’t got one.'],['The Ember Colossus','Leave the platform.']]],
 colossusAfter:['Shutdown','The Furnace Crown',[
  ['The Ember Colossus','Pressure falling.'],['Wick','That’s the valve. Leave it open.'],['The Ember Colossus','Cooling cycle started.']]],
 obsArrival:['The telescope','The Fallen Orrery',[
  ['You','What were they looking at?'],['Wick','The star. Before they brought it underground.']]],
 astronomerBefore:['The brass line','The Shattered Dome',[
  ['The Glass Astronomer','Stay behind the brass line.'],['You','Is that the way down?'],['The Glass Astronomer','It’s the measurement floor.'],['Wick','We need the door behind you.'],['The Glass Astronomer','You can wait until I’m finished.']]],
 astronomerAfter:['The broken lenses','The Shattered Dome',[
  ['The Glass Astronomer','Leave the glass where it is.'],['You','Can you still see the star?'],['The Glass Astronomer','No. Take the stairs. I need to repair this.']]],
 archiveArrival:['The intake desk','The Intake Desk',[
  ['You','Is there a record of me here?'],['Wick','There should be. Check the shelves by the desk.']]],
 scribeBefore:['The ledger','The Last Margin',[
  ['The Pale Scribe','Put that back.'],['You','I’m looking for my record.'],['The Pale Scribe','The public shelves are upstairs.'],['You','They’re empty.'],['The Pale Scribe','I know. You still can’t take this one.']]],
 scribeAfter:['The names','The Last Margin',[
  ['You','Who cut out the names?'],['The Pale Scribe','We did. Yours was on the order.'],['You','Why?'],['The Pale Scribe','Something was calling people out of their rooms. It used the names in these books.'],['Wick','We kept a copy. It’s behind the weather shelf.']]],
 courtArrival:['The tables','The Servants’ Door',[
  ['You','They’re still setting the tables.'],['Wick','The Keeper left this room running. They don’t know how long it’s been.']]],
 regentsBefore:['The audience chamber','The Audience Chamber',[
  ['The First Regent','Close the doors.'],['The Second Regent','Both?'],['The First Regent','Both.'],['You','We only need to pass through.'],['The Second Regent','You’ll stay until we’re done.']]],
 regentsAfter:['Both doors','The Audience Chamber',[
  ['The First Regent','Open the left door.'],['The Second Regent','The right one’s nearer.'],['The First Regent','Open that one, then.'],['Wick','We can manage it.']]],
 choirArrival:['The stairs','The Low Refrain',[
  ['You','How much further?'],['Wick','Two more landings. Stop here if you need to.']]],
 seraphBefore:['The belfry','The Open Belfry',[
  ['The Void Seraph','Put out the light.'],['Wick','No.'],['The Void Seraph','It’s drawing them up the stairs.'],['You','We’re going down.'],['The Void Seraph','You’re not bringing them through here.']]],
 seraphAfter:['The quiet stairs','The Open Belfry',[
  ['The Void Seraph','Can you hear anything below?'],['Wick','Not now.'],['The Void Seraph','Keep it that way. Don’t ring the bells.']]],
 citadelArrival:['The wall','The Inward Wall',[
  ['You','Why are the weapons facing in?'],['Wick','They were trying to stop anything coming out of the Heart.']]],
 tyrantBefore:['The siege hall','The Siege Hall',[
  ['The Obsidian Tyrant','Return to the outer checkpoint.'],['You','Nobody’s there.'],['The Obsidian Tyrant','Checkpoint remains in service.'],['Wick','It’s running on the old orders.'],['The Obsidian Tyrant','Clear the hall.']]],
 tyrantAfter:['The engine stops','The Siege Hall',[
  ['The Obsidian Tyrant','Drive failure.'],['Wick','Stay clear of the wheels.'],['The Obsidian Tyrant','Brakes engaged.']]],
 heartArrival:['The borrowed gate','The Borrowed Gate',[
  ['You','We’ve been in this room.'],['Wick','Upstairs. The Heart copied it.'],['You','Why?'],['Wick','It’s been putting the old rooms back together. That’s what those memories were.']]],
 keeperBefore:['The Heart','The Heart of the Star',[
  ['The First Keeper','Wick. Put them back.'],['Wick','They’re awake.'],['The First Keeper','I can see that. They still can’t leave.'],['You','Open the gate.'],['The First Keeper','The star is failing. I’m not opening anything.']]],
 keeperAfter:['The control room','The Heart of the Star',[
  ['The First Keeper','Stop. You’ll break the controls.'],['You','Then use them. Open the gate.'],['The First Keeper','The people won’t survive outside.'],['Wick','You haven’t checked. You’ve kept them here for nine years.'],['The First Keeper','Help me lift the cover.']]],
 wickPointer1:['The portal','An open gate',[['Wick','There’s nothing here to open. Try the portal.']]],
 wickPointer2:['Over there','An open gate',[['Wick','The round thing. Over there.']]],
 wickPointer3:['Again','An open gate',[['Wick','Did something get stuck? You keep doing that.']]],
 wickPointer4:['Still here','An open gate',[['Wick','I can’t open it from here. You have to walk over.']]],
 wickPointer5:['The spare','An open gate',[['Wick','Hang on. I’ve got something that might help.']]],
 wickPointer6:['Take this','An open gate',[['Wick','Here. Take it. I was keeping it for later.']]],
 wickPointerAfter:['The pointer','An open gate',[['Wick','It points toward the portal. It can pick out enemies too.']]]
};
for(const [id,[title,where,lines]] of Object.entries(STORY_DIALOGUES))HOLLOW_SCENES[id]={title,where,lines,hidden:id.startsWith('wickPointer')};
const SILENT_MEMORY_ROWS=[
 ['echo1','Watch Roster','The Gatehouse','Two guards change shifts. One hands over a lantern, then points out a loose buckle on the other’s coat.'],
 ['echo2','Oil Tin','The Lantern Walks','A lamplighter fills three lamps. Wick follows with the oil tin and spills a little while turning around.'],
 ['echo3','Bell Rope','The Bell Court','A child pulls the supper bell. An adult helps with the first pull. The child insists on doing the second alone.'],
 ['echo4','Unsent Letter','The Empty Barracks','A guard writes a letter, folds it twice, and leaves it under a cup before going on watch.'],
 ['echo5','Gate Bar','The Last Watch','Mara lifts the gate bar for a worker carrying tools. She lowers it again as soon as the worker is through.'],
 ['echo6','Bean Stakes','The Overgrown Walk','Two gardeners tie a young tree to a stake. One holds it straight while the other knots the cord.'],
 ['echo7','Glass Pane','Glasshouse Ruins','A caretaker covers a child with a coat as glass begins falling from the roof. They leave together.'],
 ['echo8','Painted Sign','The Still Courtyard','A lamplighter paints the sign, steps back, finds paint on a sleeve, and wipes it with an already dirty cloth.'],
 ['echo9','Brass Labels','The Nursery','A caretaker hangs six labels on six frames. Wick takes a seventh label from the table and carries it out.'],
 ['echo10','Garden Spade','The Root Chamber','A gardener finishes digging, leans a spade by the door, and sits beside an empty frame.'],
 ['trace11','Flood Gauge','The Spillway','A worker marks the expected water level. Another worker moves a crate above the mark.'],
 ['trace12','Pump Wrench','The Pump Gallery','An engineer turns a pump wheel. It sticks. A second worker braces the pipe until the wheel moves.'],
 ['trace13','Oilcloth Parcel','The Sunken Walk','Two workers carry an injured person upstairs on a door. One slips; both stop, adjust their grip, and continue.'],
 ['trace14','Valve Board','The Sluice Chapel','Three workers close valves in sequence. The last waits for the others to raise their hands before turning.'],
 ['trace15','Bell Clapper','The Bell Cistern','The Bellkeeper holds the bell rope while the lower crew crosses. Water rises; the last worker reaches the upper step.'],
 ['trace16','Lunch Pail','The Cold Forge','Four workers eat at a table. One slides half a loaf to a late arrival and makes room on the bench.'],
 ['trace17','Cooling Hook','The Slag Run','A worker tries a bent hook, puts it aside, then picks up a straight one from a colleague.'],
 ['trace18','Work Token','The Hammer Line','A worker raises a hand to stop the belt. Another retrieves a dropped token before the belt starts again.'],
 ['trace19','Clay Mold','The Mold Vault','Two workers lift a cooled casting from its mold. One brushes clay away while the other holds it steady.'],
 ['trace20','Furnace Key','The Furnace Crown','Workers hang their aprons by the exit. One comes back for a lunch tin, then follows the others out.'],
 ['trace21','Brass Planet','The Fallen Orrery','An astronomer eats beneath the model planets. A passing worker nudges one planet and watches it circle the table.'],
 ['trace22','Lens Ledger','The Meridian Hall','A cleaner wipes the lenses in order. At lens nine, a supervisor stops the cloth and turns the lens away from the room.'],
 ['trace23','Chalk Marks','The Parallax Walk','An assistant chalks a path around a pillar. A second assistant follows it carrying a heavy lens.'],
 ['trace24','Star Map','The Blind Planetarium','An astronomer adjusts a telescope for a child on a stool. The child looks through and reaches back for the adult’s hand.'],
 ['trace25','Eyepiece','The Shattered Dome','A lens turns toward the Heart. A person appears in its reflection. The astronomer covers the glass and backs away.'],
 ['trace26','Date Stamp','The Intake Desk','A clerk stamps a stack of forms, notices the wrong date, adjusts the stamp, and starts the stack again.'],
 ['trace27','Index Card','The Flooded Index','A clerk tries a locked cabinet, checks an index card, and fetches a key from a drawer.'],
 ['trace28','Redaction Knife','The Redaction Rooms','A clerk makes a copy of a list. A lamplighter cuts the names from the original and hides the copy behind a shelf.'],
 ['trace29','Rain Bucket','The Misfiled Wing','A clerk carries books away from a ceiling leak in a coat. A worker follows with two buckets.'],
 ['trace30','Loose Page','The Last Margin','A lamplighter burns a page in a brazier. Wick pulls a second page clear before it catches and carries it away.'],
 ['trace31','Place Card','The Servants’ Door','An attendant sets the table, counts the chairs, then carries two mismatched chairs in from a side room.'],
 ['trace32','Dinner Plate','The Empty Banquet','The Regents argue across a table without speaking. A servant puts food between them; neither notices.'],
 ['trace33','Three Seals','The Gallery of Favors','The Regents seal an order. A lamplighter hesitates, reads it again, then signs between their seals.'],
 ['trace34','Mended Carpet','The Divided Throne','An attendant kneels to stitch a torn carpet. A passing Regent steps over the thread and nearly catches a foot.'],
 ['trace35','Audience Bell','The Audience Chamber','The Regents practice their paired steps. One turns early. They stop, return to their places, and try more slowly.'],
 ['trace36','Stair Rail','The Low Refrain','A tired worker sits on a stair. Wick waits beside them. The worker rests a hand on the rail, then gets up.'],
 ['trace37','Song Strip','The Bell Lung','Singers pass copies of a score along a row. One person has no copy; a neighbour moves closer to share.'],
 ['trace38','Tuning Fork','The Cantor Stairs','A cantor strikes a tuning fork. Loose objects tremble toward the Heart. The lamplighter grips the fork to stop it.'],
 ['trace39','Glass Feather','The Broken Octave','The Seraph shelters two singers with a wing as pieces of a bell fall. The singers crawl clear before the wing folds.'],
 ['trace40','Pinned Notice','The Open Belfry','A cantor takes a score from the wall, rolls it up, and puts it in a locked drawer.'],
 ['trace41','Arrow Bundle','The Inward Wall','Soldiers reposition a weapon from the outer window to the inner passage. A lamplighter helps turn the carriage.'],
 ['trace42','Door Chain','The Ward Cells','A worker holds a cell door open while a soldier removes its chain. Two people pass through before they let go.'],
 ['trace43','Target Card','The Range Below','A soldier pins a face to a target. The lamplighter removes it and pins up a plain wooden disc instead.'],
 ['trace44','Cloth Strip','The King’s Engine','An engineer stops a rattling gear with a strip of folded cloth. A worker holds the housing while the bolts are tightened.'],
 ['trace45','Control Crown','The Siege Hall','An engineer turns the throne’s controls. The weapon carriage below turns the same way. A soldier watches from the platform.'],
 ['trace46','Gate Hinge','The Borrowed Gate','Workers carry a gate hinge into the Heart. The Keeper checks its fit against a copy of the gate upstairs.'],
 ['trace47','Empty Frame','The Sixfold Garden','Six lights leave their frames one at a time. Wick waits for the seventh, then carries its small flame through the side door.'],
 ['trace48','Blank Nameplate','The Unnamed Hall','Wick removes a plate from a sleeping vessel. The vessel wakes before the plate can be replaced. Wick takes its hand.'],
 ['trace49','Door Plate','The Last Question','Mara checks a worker through the gate. An identical worker arrives behind them. She looks at both and lowers the bar.'],
 ['trace50','Open Book','The Heart of the Star','A lamplighter reads beside Wick. Wick turns a page too early. The lamplighter turns it back and moves the book closer.']
];
for(const [id,title,place] of SILENT_MEMORY_ROWS){TRACE_RECORDS[id]={title,place,description:'',fragment:'',note:'',color:'#c8edf5'};HOLLOW_SCENES[id]={title,where:place,lines:[],echo:true,silent:true};}
