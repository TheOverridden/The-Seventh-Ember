const COMBO_BLESSINGS=[
 {id:'hailstone',family:'frost',name:'Hailstone',r:0,max:3,w:7,minFloor:7,icon:'snowflake',ds:'Every fifth Bolt hit releases three piercing icicles for 70% damage each. Ranks add 20%'},
 {id:'tidePulse',family:'tide',name:'Tidal Pulse',r:0,max:3,w:7,minFloor:10,icon:'waves',ds:'Every third Flare sends out an expanding wave for 100% damage. Ranks add 35%'},
 {id:'stormCoil',family:'storm',name:'Storm Coil',r:1,max:3,w:5,minFloor:14,icon:'zap',ds:'Every eighth Bolt hit places a conductor for 4s. It strikes a nearby enemy each second for 80% damage. Ranks add 25%'},
 {id:'faultline',family:'stone',name:'Faultline',r:1,max:3,w:5,minFloor:17,icon:'mountain',ds:'Every fourth Flare rolls a ground fissure forward, striking each enemy once for 180% damage. Ranks add 50%'},
 {id:'moonShard',family:'moon',name:'Moon Shard',r:1,max:3,w:5,minFloor:21,icon:'moon',ds:'Every sixth cast launches a broad piercing crescent for 160% damage. Ranks add 40%'},
 {id:'lanternMoths',family:'moth',name:'Lantern Moths',r:1,max:3,w:5,minFloor:24,icon:'feather',ds:'Every tenth kill summons three moths. After circling you, each restores 1 health per rank'},
 {id:'sawHalo',family:'blade',name:'Saw Halo',r:2,max:2,w:3,minFloor:29,icon:'disc',ds:'Every fourth Flare summons three orbiting blades for 5s. Each contact deals 85% damage. Ranks add 30%'},
 {id:'meteorCore',family:'meteor',name:'Meteor Heart',r:2,max:2,w:3,minFloor:33,icon:'flame',ds:'Every tenth cast calls a meteor at your aim, exploding for 300% damage. Rank two adds 100%'}
];
POOL.push(...COMBO_BLESSINGS);
const COMBO_CARD_BY_ID=Object.fromEntries(COMBO_BLESSINGS.map(c=>[c.id,c]));
const COMBO_RECIPES=[
 {id:'icebreaker',name:'Icebreaker',cards:['hailstone','lastCoal'],family:'frost',ds:'Icicle hits explode into splinters for 40% damage in a small area.'},
 {id:'glacier',name:'Glacier',cards:['hailstone','roomTone'],family:'frost',ds:'Icicle hits leave frost patches for 2s. Enemies crossing them freeze; Guardians are briefly chilled.'},
 {id:'whiteout',name:'Whiteout',cards:['hailstone','seeking'],family:'frost',ds:'Every sixth cast also sends five seeking icicles spiraling outward.'},
 {id:'stormglass',name:'Stormglass',cards:['stormCoil','firstSpark'],family:'storm',ds:'Conductors freeze their targets and grow crystalline spires.'},
 {id:'forkedStorm',name:'Forked Storm',cards:['stormCoil','patientAim'],family:'storm',ds:'Each conductor strikes up to three enemies instead of one.'},
 {id:'ballLightning',name:'Ball Lightning',cards:['stormCoil','orbital'],family:'storm',ds:'Conductors become floating storm spheres that orbit you, carrying their lightning through the room.'},
 {id:'thunderquake',name:'Thunderquake',cards:['faultline','patientAim'],family:'stone',ds:'Each fissure hit arcs an extra 60% damage to two nearby enemies.'},
 {id:'magmaFault',name:'Magma Fault',cards:['faultline','burn'],family:'stone',ds:'Fissures leave molten cracks that burn for 3s and ignite anything crossing them.'},
 {id:'rupture',name:'Rupture',cards:['faultline','gravityFlare'],family:'stone',ds:'Flare pulls enemies toward its aim and fissures fork into three paths.'},
 {id:'tidalBore',name:'Tidal Bore',cards:['tidePulse','counterstep'],family:'tide',ds:'Waves grow from 190 to 280 reach, gain 50% damage, and push ordinary enemies farther away.'},
 {id:'permafrost',name:'Permafrost',cards:['tidePulse','firstSpark'],family:'tide',ds:'Waves freeze every enemy they pass and leave a ring of ice shards.'},
 {id:'undertow',name:'Undertow',cards:['tidePulse','blackHole'],family:'tide',ds:'Each wave returns inward, striking enemies a second time and pulling ordinary enemies toward its center.'},
 {id:'bloodMoon',name:'Blood Moon',cards:['moonShard','crit'],family:'moon',ds:'Crescent critical hits deal 50% extra damage and burst into a crown of six razor splinters.'},
 {id:'moonwake',name:'Moonwake',cards:['moonShard','echoFlare'],family:'moon',ds:'Every second Flare releases two crossing crescents.'},
 {id:'eclipse',name:'Eclipse',cards:['moonShard','blackHole'],family:'moon',ds:'Crescents passing through a Black Star double in power, grow larger, and gain three piercing hits.'},
 {id:'sawfire',name:'Sawfire',cards:['sawHalo','burn'],family:'blade',ds:'Orbiting blades ignite their targets. Every third blade hit launches a burning blade outward.'},
 {id:'gearstorm',name:'Gearstorm',cards:['sawHalo','ric'],family:'blade',ds:'When a halo expires or is replaced, its three blades fly toward enemies with three ricochets each.'},
 {id:'iceHalo',name:'Ice Halo',cards:['sawHalo','firstSpark'],family:'blade',ds:'Blade contacts freeze enemies. The halo becomes three large serrated ice wheels.'},
 {id:'meteorSwarm',name:'Meteor Swarm',cards:['meteorCore','comet'],family:'meteor',ds:'Each meteor brings two smaller meteors, each dealing 130% damage.'},
 {id:'impactCrater',name:'Impact Crater',cards:['meteorCore','emberMine'],family:'meteor',ds:'Meteor impacts leave a molten crater for 4s, dealing 40% damage twice per second.'},
 {id:'extinction',name:'Extinction',cards:['meteorCore','supernova'],family:'meteor',ds:'Main meteors deal 50% more damage and explode across a 180-radius area.'},
 {id:'mothlight',name:'Mothlight',cards:['lanternMoths','overheal'],family:'moth',ds:'Each moth grants a 3-health ward per rank in addition to its healing. Total wards remain capped.'},
 {id:'cinderMoths',name:'Cinder Moths',cards:['lanternMoths','burn'],family:'moth',ds:'After healing, moths dive at nearby enemies for 120% damage each and set them alight.'},
 {id:'soulLantern',name:'Soul Lantern',cards:['lanternMoths','starfall'],family:'moth',ds:'Elite kills summon a flock immediately and release a 160% starburst. Once every 6s.'},
 {id:'prismChoir',name:'Prism Choir',cards:['doubleCast','prismBolt'],family:'prism',ds:'Each repeated volley adds two crystalline lances for 60% damage each, with two piercing hits.'},
 {id:'starforge',name:'Starforge',cards:['brightNeedle','meteorCore'],family:'stitch',ds:'Meteor impacts pin up to two survivors into Starstitch and send a 100% damage pulse along connected strands.'},
 {id:'stormstep',name:'Stormstep',cards:['patientAim','dashBurst'],family:'storm',ds:'Ending a dash strikes up to three nearby enemies with lightning for 85% damage.'},
 {id:'trailOfGlass',name:'Trail of Glass',cards:['hailstone','dashTrail'],family:'frost',ds:'Ending a dash throws a five-icicle fan along the direction you traveled.'},
 {id:'hearthguard',name:'Hearthguard',cards:['lanternMoths','flareGuard'],family:'moth',ds:'Every third Flare summons one healing moth and grants a 4-health ward per rank. Once every 3s.'},
 {id:'cageOfStars',name:'Cage of Stars',cards:['brightNeedle','stormCoil'],family:'stitch',ds:'Stationary conductors pin their position and lightning targets into Starstitch. Lightning also pulses connected strands for 35% damage.'}
];
