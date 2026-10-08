
// ============================================================
// DATA
// ============================================================

// ============================================================
// TYPE DEFINITIONS (JSDoc — TypeScript compatible)
// ============================================================

/**
 * @typedef {'g1'|'g2'|'g3'|'g4'|'g5'} ArtistGroup
 */

/**
 * @typedef {Object} Artist
 * @property {string} id
 * @property {string} name
 * @property {ArtistGroup} group
 * @property {string} genre
 * @property {string} about
 * @property {string} sound
 * @property {string[]} moods
 * @property {string[]} tracks
 */

/**
 * @typedef {'user'|'ai'} ChatRole
 */

/**
 * @typedef {Object} ChatMessage
 * @property {ChatRole} role
 * @property {string} text
 */

/**
 * @typedef {Object} OpenRouterModel
 * @property {string} id
 * @property {string} label
 */

/** @type {Artist[]} */
const ARTISTS = [
  // g1 - Your List
  { id: 'odeal', name: 'Odeal', group: 'g1', genre: 'R&B / Neo-Soul', about: 'A UK-based singer-songwriter whose voice carries the weight of quiet devastation. Odeal writes love songs that feel like personal letters you were never meant to find.', sound: 'Silky falsetto over sparse piano, late-night bedroom production', moods: ['late night','melancholic','intimate'], tracks: ['Lonely Street','Don\'t Leave Me Alone','Butterflies'] },
  { id: 'raahiim', name: 'Raahiim', group: 'g1', genre: 'Alternative R&B', about: 'Brooding and cinematic, Raahiim blends alternative textures with classic R&B soul. His work feels like the soundtrack to a film that hasn\'t been made yet.', sound: 'Dark, layered production with confessional lyricism', moods: ['brooding','cinematic','introspective'], tracks: ['Suffocating','Green Eyes','Nothing At All'] },
  { id: '6lack', name: '6LACK', group: 'g1', genre: 'Trap Soul / Alternative R&B', about: '6LACK turned heartbreak into an aesthetic. His debut album Free 6LACK redefined what vulnerability sounds like in modern R&B.', sound: 'Minimalist trap beats, soft vocals soaked in reverb', moods: ['heartbreak','late night','melancholic'], tracks: ['PRBLMS','Seasons','Ex Calling'] },
  { id: 'daniel_caesar', name: 'Daniel Caesar', group: 'g1', genre: 'R&B / Soul', about: 'Toronto\'s poet of devotion. Caesar\'s music is rooted in gospel but soaked in modern longing — spiritual and sensual all at once.', sound: 'Warm guitar-led soul, falsetto harmonies, introspective lyricism', moods: ['devotional','warm','sensual'], tracks: ['Get You','Best Part','Blessed'] },
  { id: 'chase_shakur', name: 'Chase Shakur', group: 'g1', genre: 'Alternative R&B', about: 'Chase Shakur blurs the line between R&B and indie, making music that feels like a dream you half-remember. Raw and uncommercial.', sound: 'Hazy, low-fi R&B with psychedelic undertones', moods: ['dreamy','hazy','alternative'], tracks: ['On My Mind','Smoke','Just Maybe'] },
  { id: 'leon_thomas', name: 'Leon Thomas', group: 'g1', genre: 'R&B / Neo-Soul', about: 'A generational vocal talent, Leon Thomas III brings classic soul craft to contemporary production. His voice is an instrument with no ceiling.', sound: 'Rich tenor vocals, introspective lyrics, polished neo-soul production', moods: ['soulful','romantic','introspective'], tracks: ['MUTT','Breaking Me Down','Remember'] },
  { id: 'sir', name: 'SiR', group: 'g1', genre: 'Neo-Soul / R&B', about: 'TDE\'s quiet philosopher. SiR makes R&B for people who read between the lines — each album a meditation on love, family, and the self.', sound: 'Smooth, jazz-influenced neo-soul with sharp social commentary', moods: ['thoughtful','warm','soulful'], tracks: ['Hair Down','Something Foreign','John Redcorn'] },
  { id: 'sampha', name: 'Sampha', group: 'g1', genre: 'Electronic Soul', about: 'Sampha makes music that sounds like grief and gratitude occupying the same breath. Process was one of the most celebrated albums of the 2010s.', sound: 'Sparse piano, electronic textures, devastatingly honest vocals', moods: ['grief','cathartic','ethereal'], tracks: ['(No One Knows Me) Like The Piano','Blood On Me','Timmy\'s Prayer'] },
  { id: 'pink_sweats', name: 'Pink Sweat$', group: 'g1', genre: 'R&B / Indie Soul', about: 'Earnest and unafraid of sincerity, Pink Sweat$ writes love songs with the directness of a poet who\'s given up on pretense.', sound: 'Acoustic-led R&B, warm falsetto, simple and affecting arrangements', moods: ['romantic','sincere','warm'], tracks: ['At My Worst','Honesty','Icy'] },
  { id: 'frank_ocean', name: 'Frank Ocean', group: 'g1', genre: 'Alternative R&B / Art Pop', about: 'Frank Ocean changed what R&B could say and how it could sound. Channel Orange and Blonde are landmarks of emotional precision.', sound: 'Experimental, layered production; nonlinear storytelling; genre-defying', moods: ['complex','nostalgic','introspective'], tracks: ['Nights','Pyramids','Self Control'] },
  { id: 'joji', name: 'Joji', group: 'g1', genre: 'Lo-fi Soul / Sad Pop', about: 'Joji turned internet melancholy into genuine art. His music sits in the space between detachment and desperate longing.', sound: 'Lo-fi beats, muted vocals, atmospheric sadness', moods: ['melancholic','detached','late night'], tracks: ['Slow Dancing in the Dark','SANCTUARY','Like You Do'] },
  { id: 'brent_faiyaz', name: 'Brent Faiyaz', group: 'g1', genre: 'Alternative R&B', about: 'Brent Faiyaz makes unflinchingly honest music about desire, guilt, and self-destruction. Sonder was a statement; his later work refined that into something dangerous.', sound: 'Dark, low-end heavy production, raw intimate vocals', moods: ['dark','sensual','honest'], tracks: ['Gravity','Clouded','Make It Work'] },
  { id: 'jon_vinyl', name: 'Jon Vinyl', group: 'g1', genre: 'R&B / Neo-Soul', about: 'Jon Vinyl is a Toronto singer-songwriter crafting intimate R&B with cinematic sweep. Each song feels like a scene from a film about love\'s quiet devastation.', sound: 'Warm, textured neo-soul with confessional lyricism', moods: ['intimate','cinematic','warm'], tracks: ['Clouds','No Feelings','Thinkin Bout You'] },
  { id: 'bryson_tiller', name: 'Bryson Tiller', group: 'g1', genre: 'Trap Soul / R&B', about: 'Bryson Tiller pioneered a subgenre. TRAPSOUL brought vulnerability to trap production and opened a door thousands walked through.', sound: 'Whispered vocals over dark trap production, brooding romance', moods: ['sensual','late night','brooding'], tracks: ['Exchange','Don\'t','Right My Wrongs'] },
  { id: 'jacquees', name: 'Jacquees', group: 'g1', genre: 'R&B', about: 'Self-proclaimed King of R&B, Jacquees is rooted in classic soul tradition but speaks the language of the current moment.', sound: 'Smooth, honeyed vocals, traditional R&B production with modern sensibility', moods: ['smooth','romantic','confident'], tracks: ['B.E.D.','You\'re My Everything','Inside'] },
  { id: 'tank', name: 'Tank', group: 'g1', genre: 'Classic R&B', about: 'Tank is a craftsman of traditional R&B — powerful vocals, unapologetic romance, and a commitment to the art form that never wavers.', sound: 'Powerful tenor, lush orchestration, timeless R&B production', moods: ['passionate','romantic','classic'], tracks: ['When We','Fuckin With Me','You Don\'t Know'] },
  { id: 'barii', name: 'BARii', group: 'g1', genre: 'R&B / Alternative', about: 'BARii is a rising voice in alternative R&B, blending emotional honesty with genre-fluid production that refuses easy categorization.', sound: 'Breathy vocals over experimental beats, introspective and fresh', moods: ['introspective','alternative','fresh'], tracks: ['Luv You Different','All I Need','Patterns'] },
  { id: 'aloe_blacc', name: 'Aloe Blacc', group: 'g1', genre: 'Soul / R&B', about: 'Aloe Blacc channels classic soul with modern purpose. His voice carries the authority of Motown and the urgency of a man who has something to say.', sound: 'Powerful vocals, socially conscious lyrics, vintage soul production', moods: ['soulful','hopeful','powerful'], tracks: ['I Need a Dollar','The Man','Wake Me Up'] },
  { id: 'lucky_daye', name: 'Lucky Daye', group: 'g1', genre: 'R&B / Neo-Soul', about: 'Lucky Daye is a meticulous vocal craftsman making classic-sounding R&B for right now. His Grammy win felt inevitable.', sound: 'Polished neo-soul, layered harmonies, effortless vocal runs', moods: ['smooth','soulful','romantic'], tracks: ['Roll Some Mo','Built For Love','How Much Can A Heart Take'] },
  { id: 'masy', name: 'MASY', group: 'g1', genre: 'Alternative R&B', about: 'MASY crafts dreamy, atmospheric R&B that sounds like being half-awake at golden hour. Emotional and textured.', sound: 'Hazy, layered production with delicate vocals and emotional depth', moods: ['dreamy','atmospheric','emotional'], tracks: ['Letting Go','Golden','Right Here'] },
  { id: 'majid_jordan', name: 'Majid Jordan', group: 'g1', genre: 'Electronic R&B', about: 'The OVO duo brought electronic sensibility to R&B without sacrificing warmth. Their productions feel like cities at night.', sound: 'Synth-heavy electronic R&B, atmospheric and cinematic', moods: ['nocturnal','cinematic','electronic'], tracks: ['A Place Like This','My Love','Gave Your Love Away'] },
  { id: 'odie', name: 'ODIE', group: 'g1', genre: 'R&B / Soul', about: 'ODIE writes songs that feel like lived experience distilled to its essence. Honest, vulnerable, and quietly powerful.', sound: 'Raw, soulful vocals over minimal production, confessional writing', moods: ['vulnerable','honest','raw'], tracks: ['Hello World','Strangers','Won\'t Be Long'] },
  { id: 'teo', name: '¿Téo?', group: 'g1', genre: 'Alternative R&B / Indie', about: '¿Téo? exists at the intersection of indie and R&B — experimental enough to surprise you, soulful enough to hold you.', sound: 'Genre-blending indie R&B with unpredictable arrangements', moods: ['experimental','alternative','soulful'], tracks: ['Lovemeorleave','Suede','Yellow Light'] },
  { id: 'dijon', name: 'Dijon', group: 'g1', genre: 'Indie Soul / Folk R&B', about: 'Dijon makes music that sounds like being emotionally literate in a world that isn\'t. His debut album was an intimate masterpiece.', sound: 'Folk-inflected R&B, layered harmonies, raw emotional honesty', moods: ['introspective','raw','intimate'], tracks: ['Many Times','Florida','Rodeo Clown'] },
  { id: 'fkj', name: 'FKJ', group: 'g1', genre: 'Electronic Soul / Jazz', about: 'French Kiwi Juice is a one-man band and sonic architect. His live performances — playing every instrument — are legendary.', sound: 'Jazzy, electronic soul with lush arrangements and improvisational spirit', moods: ['warm','groovy','expansive'], tracks: ['Lying Together','Vibin Out','Skyline'] },

  // g2 - Go Deeper
  { id: 'sonder', name: 'Sonder', group: 'g2', genre: 'Electronic R&B', about: 'The project born from the minds of Brent Faiyaz and Dpat, Sonder makes music that feels like midnight in slow motion.', sound: 'Atmospheric, lo-fi electronic R&B; brooding and cinematic', moods: ['brooding','nocturnal','atmospheric'], tracks: ['Too Fast','Got Me Goin\'','Nobody'] },
  { id: 'steve_lacy', name: 'Steve Lacy', group: 'g2', genre: 'Psychedelic Soul / R&B', about: 'Steve Lacy produces magic on his iPhone and in the studio. Apollo XXI and Gemini Rights are psychedelic journeys through queer love and identity.', sound: 'Psychedelic, guitar-driven soul with playful production and introspective lyrics', moods: ['psychedelic','playful','introspective'], tracks: ['Bad Habit','Infrunami','Helmet'] },
  { id: 'umi', name: 'UMI', group: 'g2', genre: 'R&B / Dream Pop', about: 'UMI makes music that sounds like standing in sunlight with your eyes closed. Spiritual, healing, and genuinely other.', sound: 'Ethereal vocals, dream-pop-inflected R&B, healing frequencies', moods: ['spiritual','healing','ethereal'], tracks: ['Love Affair','Remember Me','Introspection'] },
  { id: 'syd', name: 'Syd', group: 'g2', genre: 'Electronic R&B', about: 'The Internet\'s co-founder and solo artist, Syd makes cool, minimal R&B that carries enormous emotional depth beneath its surface ease.', sound: 'Cool, minimalist electronic R&B with introspective lyrics', moods: ['cool','introspective','minimal'], tracks: ['Body','All About Me','Know'] },
  { id: 'bj_chicago_kid', name: 'BJ the Chicago Kid', group: 'g2', genre: 'Soul / R&B', about: 'BJ the Chicago Kid is a keeper of the soul tradition — his voice a direct line to Marvin Gaye and Al Green, filtered through lived experience.', sound: 'Classic soul craftsmanship with modern production, rich voice', moods: ['soulful','classic','warm'], tracks: ['Church','Turnin\' Me Up','Woman\'s World'] },
  { id: 'miguel', name: 'Miguel', group: 'g2', genre: 'Alternative R&B', about: 'Miguel is one of the most original voices in R&B — sensual, experimental, and unafraid to shatter genre expectations.', sound: 'Psychedelic, guitar-heavy R&B with Prince-like sensuality', moods: ['sensual','experimental','bold'], tracks: ['Adorn','Sure Thing','Coffee'] },
  { id: 'anderson_paak', name: 'Anderson .Paak', group: 'g2', genre: 'Soul / Neo-Soul / Hip-Hop', about: 'Anderson .Paak is a force of nature — drummer, rapper, singer, performer. Malibu remains one of the finest albums of the decade.', sound: 'Live-band soul with hip-hop roots, infectious grooves and virtuosic performance', moods: ['groovy','joyful','energetic'], tracks: ['Am I Wrong','Come Down','Tints'] },
  { id: 'her', name: 'H.E.R.', group: 'g2', genre: 'Contemporary R&B', about: 'H.E.R. kept her identity hidden while her music spoke volumes. A guitarist and vocalist of rare ability, her anonymity only deepened the mystery.', sound: 'Guitar-forward contemporary R&B, powerful vocals, emotional depth', moods: ['powerful','emotional','soulful'], tracks: ['Best Part','Focus','Hard Place'] },

  // g3 - Rising & Slept On
  { id: 'khamari', name: 'Khamari', group: 'g3', genre: 'R&B / Soul', about: 'Khamari\'s voice is one of the most distinctive in emerging R&B — warm, textured, and carrying the weight of classic soul in a contemporary frame.', sound: 'Rich vocal tone, gospel-influenced soul, introspective writing', moods: ['soulful','warm','introspective'], tracks: ['Something That I\'m Not','Better Friend','Grills'] },
  { id: '4batz', name: '4batz', group: 'g3', genre: 'Trap Soul', about: '4batz is the sound of after-hours vulnerability — soft vocals over dark trap production, a new voice in the emotional R&B conversation.', sound: 'Whispered trap soul, dark production, raw emotional delivery', moods: ['late night','vulnerable','dark'], tracks: ['act ii: date @ 8','act i: stickin out yo','Soak'] },
  { id: 'blk_odyssy', name: 'BLK ODYSSY', group: 'g3', genre: 'Neo-Soul / Funk', about: 'BLK ODYSSY is a full-throated celebration of Black music history — funk, soul, psychedelia, and gospel all woven into something alive.', sound: 'Energetic neo-soul with funk influences, celebratory and alive', moods: ['groovy','celebratory','vibrant'], tracks: ['BLKBX','Superstar','Bounce Back'] },
  { id: 'bina', name: 'BINA.', group: 'g3', genre: 'R&B / Alternative', about: 'BINA. is a quiet storm — unassuming in approach but deeply affecting. Her songs wrap around you slowly until you\'re completely held.', sound: 'Gentle, intimate R&B with atmospheric production and emotional resonance', moods: ['intimate','gentle','emotional'], tracks: ['Phases','Everything','Yours'] },
  { id: 'olivia_dean', name: 'Olivia Dean', group: 'g3', genre: 'Soul / Pop', about: 'London\'s brightest young soul voice. Olivia Dean writes songs that feel lived-in and true, wrapped in arrangements that sing alongside her.', sound: 'Bright, warm soul pop with jazz influences and honest songwriting', moods: ['warm','bright','heartfelt'], tracks: ['Dive','UFO','Danger'] },
  { id: 'avangelia', name: 'Avangelia', group: 'g3', genre: 'Alternative R&B', about: 'Avangelia exists at the outer edges of R&B — experimental, poetic, and deeply personal. Her work rewards patience.', sound: 'Experimental, avant-garde R&B with spoken word elements', moods: ['experimental','poetic','introspective'], tracks: ['INTERLUDE','Blessed','Nowhere'] },
  { id: 'baby_rose', name: 'Baby Rose', group: 'g3', genre: 'Soul / Blues R&B', about: 'Baby Rose carries the weight of Nina Simone and the modernity of SZA in her voice — one of the most raw and powerful singers working today.', sound: 'Deep, smoky vocals, blues-inflected soul, emotionally devastating', moods: ['powerful','raw','bluesy'], tracks: ['Show & Tell','To Myself','Game'] },
  { id: 'mereba', name: 'Mereba', group: 'g3', genre: 'Indie Soul / R&B', about: 'Atlanta\'s Mereba makes music that lives in open spaces — spacious arrangements, meditative lyrics, and a voice that feels like morning.', sound: 'Spacious indie soul, atmospheric production, meditative and grounding', moods: ['meditative','grounded','atmospheric'], tracks: ['Black Truck','Sandstorm','Rider'] },
  { id: 'wayne_snow', name: 'Wayne Snow', group: 'g3', genre: 'Electronic Soul', about: 'Berlin-based Wayne Snow blends European electronic sensibility with deep soul roots, creating something genuinely singular.', sound: 'European electronic soul, minimal and haunting, deeply felt', moods: ['haunting','minimal','introspective'], tracks: ['Daydreaming','With You','Hey Love'] },
  { id: 'amindi', name: 'Amindi', group: 'g3', genre: 'R&B / Dancehall Fusion', about: 'Amindi fuses Afrobeats, dancehall, and R&B into something joyful and globally minded. Her voice has a lightness that makes even sadness feel alive.', sound: 'Afrobeats-inflected R&B, dancehall rhythm, bright and kinetic', moods: ['joyful','vibrant','warm'], tracks: ['Loco','Easy Now','Can\'t Find Love'] },
  { id: 'yebba', name: 'Yebba', group: 'g3', genre: 'Soul / R&B', about: 'Yebba\'s voice is one of those rare instruments that makes you stop what you\'re doing. Dawn is a debut album of devastating emotional clarity.', sound: 'Powerful, gospel-tinged soul, raw and unguarded, sweeping arrangements', moods: ['powerful','cathartic','soulful'], tracks: ['Boomerang','Distance','October Sky'] },
  { id: 'cleo_sol', name: 'Cleo Sol', group: 'g3', genre: 'Neo-Soul', about: 'Cleo Sol is making neo-soul that ranks alongside the greatest. ROSE in the Dark is a perfect album — spare, healing, and profound.', sound: 'Minimal neo-soul, acoustic warmth, healing and meditative', moods: ['healing','meditative','spiritual'], tracks: ['Golden','One','Wild At Heart'] },
  { id: 'snoh_aalegra', name: 'Snoh Aalegra', group: 'g3', genre: 'Contemporary R&B', about: 'Swedish-Iranian with a voice like silk, Snoh Aalegra is a throwback to classic R&B\'s golden era filtered through contemporary melancholy.', sound: 'Classic R&B influences, lush production, silky and melancholic', moods: ['melancholic','classic','silky'], tracks: ['Whoa','Do 4 Love','I Want You Around'] },

  // g4 - New Additions
  { id: 'elmiene', name: 'Elmiene', group: 'g4', genre: 'R&B / Soul', about: 'Elmiene emerged from London with a voice that commands attention and songs that feel like timeless dispatches from the heart.', sound: 'Rich, mature R&B with emotional intelligence and vocal control', moods: ['powerful','emotional','classic'], tracks: ['Let Me Down Easy','All I Ever Wanted','Belong To You'] },
  { id: 'durand_bernarr', name: 'Durand Bernarr', group: 'g4', genre: 'Avant-Soul / Alternative R&B', about: 'Durand Bernarr is one of the most adventurous voices in contemporary soul — boundary-pushing, theatrically expressive, impossible to categorize.', sound: 'Avant-garde soul, theatrical and expressive, deeply unique', moods: ['experimental','bold','expressive'], tracks: ['LOVE.','Sweetest Taboo','Gumption'] },
  { id: 'destin_conrad', name: 'Destin Conrad', group: 'g4', genre: 'Alternative R&B', about: 'Destin Conrad makes music that sits in the quiet space between joy and longing. His debut Sonder was a statement of artistic intention.', sound: 'Smooth alternative R&B, introspective lyricism, confident delivery', moods: ['smooth','introspective','confident'], tracks: ['Body (Like a Vacation)','Undecided','On My Own'] },
  { id: 'jordan_ward', name: 'Jordan Ward', group: 'g4', genre: 'Funk Soul / R&B', about: 'Jordan Ward is young, restless, and impossibly talented — his debut Forward is a kinetic celebration of funk, soul, and lived-in joy.', sound: 'High-energy funk soul, youthful exuberance, infectious grooves', moods: ['energetic','joyful','groovy'], tracks: ['2 CENTS','FORWARD','Real Life Sh*t'] },
  { id: 'masego', name: 'Masego', group: 'g4', genre: 'TrapHouseJazz / Neo-Soul', about: 'Masego coined his own genre: TrapHouseJazz. Saxophonist, producer, vocalist — he\'s a one-man festival who makes you want to move.', sound: 'Jazz-infused neo-soul, saxophone-led, playful and sophisticated', moods: ['playful','sophisticated','groovy'], tracks: ['Lady Lady','Tadow','Mystery Lady'] },
  { id: 'isaiah_falls', name: 'Isaiah Falls', group: 'g4', genre: 'Alternative R&B', about: 'Isaiah Falls makes music that feels like standing on the edge of something — breathless and expansive, emotionally precise.', sound: 'Alternative R&B with indie influences, emotionally expansive', moods: ['expansive','emotional','alternative'], tracks: ['Afraid','Better','All I Had'] },
  { id: 'mac_ayres', name: 'Mac Ayres', group: 'g4', genre: 'Neo-Soul / Indie R&B', about: 'Mac Ayres brings a classic singer-songwriter sensibility to neo-soul — warm, real, and quietly brilliant.', sound: 'Warm neo-soul, acoustic elements, introspective and genuine', moods: ['warm','genuine','introspective'], tracks: ['Easy','Drive Slow','Slow Down'] },
  { id: 'bruno_major', name: 'Bruno Major', group: 'g4', genre: 'Indie Soul / Jazz Pop', about: 'Bruno Major writes songs that feel like they\'ve always existed. His guitar playing and voice occupy a gentle, aching universe.', sound: 'Jazz-influenced indie pop, acoustic guitar, intimate and aching', moods: ['aching','intimate','warm'], tracks: ['Easily','Nothing','A Song for Every Moon'] },
  { id: 'kamauu', name: 'KAMAUU', group: 'g4', genre: 'Alternative Soul / Jazz', about: 'KAMAUU exists in his own dimension — jazz, soul, spoken word, and Afrofuturism colliding into something genuinely visionary.', sound: 'Jazz-inflected alternative soul, spoken word, visionary and expansive', moods: ['visionary','atmospheric','intellectual'], tracks: ['Mango','It\'s Okay to Cry','Jungle'] },
  { id: 'silas', name: 'Silas', group: 'g4', genre: 'R&B / Neo-Soul', about: 'Silas writes R&B that feels handmade — careful, intimate, and built to last. A voice to watch closely.', sound: 'Intimate neo-soul, careful production, emotional clarity', moods: ['intimate','careful','soulful'], tracks: ['Come Outside','Last Night','Deserve'] },
  { id: 'sekou', name: 'Sekou', group: 'g4', genre: 'R&B / Alternative', about: 'Sekou blends sharp lyricism with R&B sensibility, making music that sounds modern but feels classic.', sound: 'Modern R&B with lyrical depth, blending contemporary and classic', moods: ['lyrical','smooth','modern'], tracks: ['Wait','Wondering','Sunday Afternoon'] },
  { id: '1010benja', name: '1010Benja', group: 'g4', genre: 'R&B / Alternative Pop', about: '1010Benja brings a global pop sensibility to R&B — multilingual, joyful, and entirely his own.', sound: 'Global R&B with pop influences, multilingual, fresh and vibrant', moods: ['joyful','global','fresh'], tracks: ['Do The Most','Love Drunk','Right Here'] },
  { id: 'nick_hakim', name: 'Nick Hakim', group: 'g4', genre: 'Psychedelic Soul', about: 'Nick Hakim makes psychedelic soul that feels like the inside of a dream. His music is dense, beautiful, and unlike anything else.', sound: 'Dense psychedelic soul, experimental production, dreamlike and dense', moods: ['psychedelic','dreamlike','deep'], tracks: ['Bet She Looks Like You','Qadir','Needy Bees'] },
  { id: 'reuben_aziz', name: 'Reuben Aziz', group: 'g4', genre: 'Indie Soul', about: 'Reuben Aziz is a UK-based songwriter whose music feels like standing in a quiet room after a difficult conversation.', sound: 'Quiet indie soul, introspective and unhurried, emotionally precise', moods: ['quiet','introspective','precise'], tracks: ['Before You Go','Dissolve','Letting Go'] },
  { id: 'nourished_by_time', name: 'Nourished By Time', group: 'g4', genre: 'Lo-fi R&B / Indie Pop', about: 'Nourished By Time makes music that sounds like it\'s been discovered in a shoebox — warm, crackling, and deeply human.', sound: 'Lo-fi indie R&B, warm tape sounds, genuinely idiosyncratic', moods: ['nostalgic','warm','idiosyncratic'], tracks: ['Showing Out','Catching Chickens','Shed My Skin'] },
  { id: 'samara_cyn', name: 'Samara Cyn', group: 'g4', genre: 'Alternative R&B', about: 'Samara Cyn is one of the freshest voices in alternative R&B — her perspective is sharp, her sound is singular.', sound: 'Fresh alternative R&B, sharp perspective, singular and confident', moods: ['confident','fresh','sharp'], tracks: ['My Name Isn\'t Baby','What U Want','Easy'] },
  { id: 'tendai', name: 'Tendai', group: 'g4', genre: 'Soul / R&B', about: 'Tendai makes soul music with the kind of old-fashioned sincerity that feels radical now. Heart-on-sleeve and beautiful.', sound: 'Sincere soul with emotional openness, classic in feel but fresh in voice', moods: ['sincere','heartfelt','warm'], tracks: ['Better Days','Stay','Waiting'] },

  // g5 - Classics
  { id: 'dangelo', name: 'D\'Angelo', group: 'g5', genre: 'Neo-Soul', about: 'D\'Angelo is the architect. Brown Sugar and Voodoo defined neo-soul\'s golden era. Black Messiah, arriving 14 years late, proved the wait was worth it.', sound: 'Richly layered neo-soul, gospel roots, sensual and politically awake', moods: ['sensual','classic','profound'], tracks: ['Untitled (How Does It Feel)','Brown Sugar','Really Love'] },
  { id: 'sade', name: 'Sade', group: 'g5', genre: 'Quiet Storm / Neo-Soul', about: 'Sade is a force of pure taste. Her music doesn\'t age — it deepens. Every album a study in restraint and emotional mastery.', sound: 'Spare, elegant arrangements around one of music\'s most distinct voices', moods: ['elegant','timeless','intimate'], tracks: ['No Ordinary Love','By Your Side','The Sweetest Taboo'] },
  { id: 'maxwell', name: 'Maxwell', group: 'g5', genre: 'Neo-Soul', about: 'Maxwell brought androgynous sensuality and orchestral ambition to neo-soul. Urban Hang Suite remains a complete, transportive world.', sound: 'Lush, orchestrated neo-soul with falsetto mastery and romantic sweep', moods: ['romantic','lush','classic'], tracks: ['Ascension','Fortunate','This Woman\'s Work'] },
  { id: 'musiq_soulchild', name: 'Musiq Soulchild', group: 'g5', genre: 'Soul / R&B', about: 'Musiq Soulchild is the voice of early-2000s soul — earnest, devotional, and deeply rooted in a tradition he wore openly.', sound: 'Warm, earnest soul with live instrumentation and timeless feel', moods: ['devotional','warm','classic'], tracks: ['Just Friends','Love','Teach Me'] },
  { id: 'erykah_badu', name: 'Erykah Badu', group: 'g5', genre: 'Neo-Soul', about: 'Erykah Badu is the high priestess of neo-soul — politically awake, spiritually searching, and in complete command of her artistry at all times.', sound: 'Hypnotic neo-soul, jazz and hip-hop influences, deeply spiritual and political', moods: ['spiritual','hypnotic','profound'], tracks: ['On & On','Bag Lady','Tyrone'] },
  { id: 'donny_hathaway', name: 'Donny Hathaway', group: 'g5', genre: 'Soul / Gospel R&B', about: 'Donny Hathaway played with a genius-level touch. His recordings carry a kind of grace that feels transcendent. A Live is one of the greatest albums ever recorded.', sound: 'Gospel-rooted soul, piano mastery, emotional transcendence', moods: ['transcendent','grief','spiritual'], tracks: ['A Song for You','This Christmas','Someday We\'ll All Be Free'] },
  { id: 'marvin_gaye', name: 'Marvin Gaye', group: 'g5', genre: 'Soul / R&B', about: 'Marvin Gaye turned personal crisis into universal art. What\'s Going On remains one of the most important albums in American music.', sound: 'Socially conscious soul, lush arrangements, deeply emotional and political', moods: ['profound','timeless','political'], tracks: ['What\'s Going On','Sexual Healing','Mercy Mercy Me'] },
];

const SECTION_LABELS = {
  g1: 'Your List',
  g2: 'Go Deeper',
  g3: 'Rising & Slept On',
  g4: 'New Additions',
  g5: 'Classics'
};

// ============================================================
// STATE
// ============================================================

let GEMINI_API_KEY = '';
let OPENROUTER_KEY = '';
let SELECTED_MODEL = 'google/gemini-2.0-flash-001';
let currentFilter = 'all';
let selectedMood = '';
let selectedLength = 10;
/** @type {ChatMessage[]} */
let chatHistory = [];
let activeArtistId = null;
/** @type {{title:string,mood:string,tracks:{artist:string,track:string,reason:string}[]}|null} */
let lastGeneratedPlaylist = null;

// ============================================================
// USER PROFILE — persisted in localStorage
// ============================================================

function loadUserProfile() {
  try {
    const raw = localStorage.getItem('tsw_profile');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { artistInterests: {}, moodHistory: {}, sessionCount: 0, lastVisit: null };
}

function saveUserProfile() {
  try { localStorage.setItem('tsw_profile', JSON.stringify(userProfile)); } catch(e) {}
}

/**
 * Called whenever the user expresses interest in an artist or a mood.
 * @param {string|null} artistId
 * @param {string|null} mood
 */
function updateUserProfile(artistId, mood) {
  if (artistId) {
    userProfile.artistInterests[artistId] = (userProfile.artistInterests[artistId] || 0) + 1;
  }
  if (mood) {
    userProfile.moodHistory[mood] = (userProfile.moodHistory[mood] || 0) + 1;
  }
  saveUserProfile();
}

/** Returns the user's top artist (most queried) or null */
function topProfileArtist() {
  const entries = Object.entries(userProfile.artistInterests);
  if (!entries.length) return null;
  const topId = entries.sort((a, b) => b[1] - a[1])[0][0];
  return ARTISTS.find(a => a.id === topId) || null;
}

/** Returns the user's top mood or null */
function topProfileMood() {
  const entries = Object.entries(userProfile.moodHistory);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

/** @type {{ artistInterests: Object.<string,number>, moodHistory: Object.<string,number>, sessionCount: number, lastVisit: string|null }} */
let userProfile = loadUserProfile();
// Increment session count on load
userProfile.sessionCount = (userProfile.sessionCount || 0) + 1;
userProfile.lastVisit = new Date().toISOString();
saveUserProfile();

// ============================================================
// API KEY
// ============================================================

function detectKeyType(val) {
  const hint = document.getElementById('keyDetectHint');
  if (!val) { hint.textContent = ''; return; }
  if (val.startsWith('sk-or')) {
    hint.innerHTML = '✓ OpenRouter key detected — access to many AI models';
    hint.style.color = 'var(--green)';
  } else if (val.startsWith('AIza')) {
    hint.innerHTML = '✓ Gemini key detected';
    hint.style.color = 'var(--green)';
  } else {
    hint.innerHTML = 'Key format not recognised — try pasting again';
    hint.style.color = 'var(--muted)';
  }
}

function saveApiKey() {
  const val = document.getElementById('unifiedKeyInput').value.trim();
  if (!val) { skipApiKey(); return; }
  if (val.startsWith('sk-or')) {
    OPENROUTER_KEY = val;
    GEMINI_API_KEY = '';
    SELECTED_MODEL = 'google/gemini-2.0-flash-001';
  } else {
    GEMINI_API_KEY = val;
    OPENROUTER_KEY = '';
  }
  document.getElementById('apikeyModal').style.display = 'none';
  renderAll();
}

function skipApiKey() {
  GEMINI_API_KEY = '';
  OPENROUTER_KEY = '';
  document.getElementById('apikeyModal').style.display = 'none';
  renderAll();
}

function openApiKeyModal() {
  const current = OPENROUTER_KEY || GEMINI_API_KEY || '';
  document.getElementById('unifiedKeyInput').value = current;
  detectKeyType(current);
  document.getElementById('apikeyModal').style.display = 'flex';
}

// ============================================================
// GEMINI API
// ============================================================

async function callGemini(prompt, temperature = 0.85) {
  if (!GEMINI_API_KEY) throw new Error('No API key set');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: 1500 }
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// ============================================================
// OPENROUTER API (multi-model)
// ============================================================

/**
 * @param {{ role: string, content: string }[]} messages
 * @param {number} [temperature]
 * @returns {Promise<string>}
 */
async function callOpenRouter(messages, temperature = 0.75) {
  if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'The Soft Wave'
    },
    body: JSON.stringify({
      model: SELECTED_MODEL,
      messages,
      temperature,
      max_tokens: 1500
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

function artistContextBlock(artists) {
  return artists.map(a =>
    `- ${a.name} (${a.genre}): ${a.about} Sound: ${a.sound}. Moods: ${a.moods.join(', ')}. Known tracks: ${a.tracks.join(', ')}.`
  ).join('\n');
}

// ============================================================
// RENDER
// ============================================================

function renderAll() {
  populateArtistFilter();
  renderGrid();
  updateSidebarCounts();
}

function updateSidebarCounts() {
  const cntAll = document.getElementById('cnt-all');
  if (cntAll) cntAll.textContent = ARTISTS.length;
  ['g1','g2','g3','g4','g5'].forEach(g => {
    const el = document.getElementById(`cnt-${g}`);
    if (el) el.textContent = ARTISTS.filter(a => a.group === g).length;
  });
}

function renderGrid() {
  const container = document.getElementById('mainContent');
  container.innerHTML = '';

  const groups = currentFilter === 'all'
    ? ['g1','g2','g3','g4','g5']
    : [currentFilter];

  groups.forEach(group => {
    const artists = ARTISTS.filter(a => a.group === group);
    if (!artists.length) return;

    const section = document.createElement('div');
    section.className = 'section fade-in';
    section.dataset.group = group;

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title">${SECTION_LABELS[group]}</div>
        <div class="section-count">${artists.length} artists</div>
      </div>
      <div class="artist-grid" id="grid-${group}"></div>
    `;

    container.appendChild(section);

    const grid = section.querySelector(`#grid-${group}`);
    artists.forEach(artist => {
      const card = createArtistCard(artist);
      grid.appendChild(card);
    });
  });
}

function createArtistCard(artist) {
  const card = document.createElement('div');
  card.className = 'artist-card';
  card.dataset.id = artist.id;
  card.onclick = () => openDetail(artist.id);

  const moodDots = artist.moods.slice(0,3).map(() => `<div class="mood-dot"></div>`).join('');

  card.innerHTML = `
    <div class="artist-name">${artist.name}</div>
    <div class="artist-tag">${artist.genre.split('/')[0].trim()}</div>
    <div class="mood-dots">${moodDots}</div>
  `;

  return card;
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.sidebar-link[data-filter]').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderGrid();
  // On mobile, close sidebar after selection
  if (window.innerWidth <= 768) closeSidebar();
}

// ============================================================
// DETAIL PANEL
// ============================================================

function openDetail(artistId) {
  const artist = ARTISTS.find(a => a.id === artistId);
  if (!artist) return;

  activeArtistId = artistId;

  document.querySelectorAll('.artist-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === artistId);
  });

  const panel = document.getElementById('detailInner');
  const moodTagsHtml = artist.moods.map(m => `<span class="mood-tag">${m}</span>`).join('');
  const tracksHtml = artist.tracks.map((t, i) => {
    const q = encodeURIComponent(artist.name + ' ' + t);
    const spotifyUrl = `https://open.spotify.com/search/${q}`;
    const appleMusicUrl = `https://music.apple.com/search?term=${q}`;
    return `<div class="track-item" style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0;border-bottom:1px solid var(--border);">
      <span class="track-num">0${i+1}</span>
      <span class="track-name" style="flex:1;">${t}</span>
      <a href="${spotifyUrl}" target="_blank" class="track-spotify" style="text-decoration:none;">↗ Spotify</a>
      <a href="${appleMusicUrl}" target="_blank" class="track-spotify" style="text-decoration:none;margin-left:0.5rem;">↗ Apple</a>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <button class="detail-close" onclick="closeDetail()">✕</button>
    <div class="detail-group-label">${SECTION_LABELS[artist.group]}</div>
    <div class="detail-name">${artist.name}</div>
    <div class="detail-genre">${artist.genre}</div>

    <div class="detail-section-label">About</div>
    <div class="detail-about">${artist.about}</div>

    <hr class="detail-divider">

    <div class="detail-section-label">Sound</div>
    <div class="detail-sound">${artist.sound}</div>

    <hr class="detail-divider">

    <div class="detail-section-label">Moods</div>
    <div class="mood-tags">${moodTagsHtml}</div>

    <hr class="detail-divider">

    <div class="detail-section-label">Starter Tracks</div>
    <div class="tracks-list">${tracksHtml}</div>

    <hr class="detail-divider">

    <div class="sounds-like-section">
      <div class="detail-section-label">Sounds Like This</div>
      <div style="font-size:0.65rem;color:var(--muted);margin-bottom:0.6rem;">Describe a feeling or reference track — get 5 matches from the artist pool</div>
      <div class="sounds-like-input-wrap">
        <input type="text" class="sounds-like-input" id="soundsLikeInput" placeholder="e.g. Nights by Frank Ocean but sadder...">
        <button class="btn" onclick="runSoundsLike('${artist.id}')" id="soundsLikeBtn">Find</button>
      </div>
      <div id="soundsLikeResults"></div>
    </div>
  `;

  document.getElementById('detailPanel').classList.add('open');
  document.getElementById('detailOverlay').classList.add('open');
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('detailOverlay').classList.remove('open');
  document.querySelectorAll('.artist-card').forEach(c => c.classList.remove('active'));
  activeArtistId = null;
}

// ============================================================
// SOUNDS LIKE THIS
// ============================================================

async function runSoundsLike(artistId) {
  const artist = ARTISTS.find(a => a.id === artistId);
  const query = document.getElementById('soundsLikeInput').value.trim();
  if (!query) return;

  const btn = document.getElementById('soundsLikeBtn');
  const resultsDiv = document.getElementById('soundsLikeResults');
  btn.disabled = true;
  resultsDiv.innerHTML = '<div class="loading-pulse" style="margin-top:1rem;">searching the pool...</div>';

  const allArtistContext = artistContextBlock(ARTISTS);

  const prompt = `You are a music curator with encyclopedic knowledge of R&B, soul, and related genres.

A user is browsing the artist "${artist.name}" and typed this sonic reference or feeling:
"${query}"

Based on the following artist pool, find 5 tracks that match this sonic reference or emotional feeling. Use actual known tracks by these artists (from their starter tracks listed, or other real well-known tracks).

ARTIST POOL:
${allArtistContext}

Return EXACTLY this JSON format and nothing else:
{
  "tracks": [
    {
      "artist": "Artist Name",
      "track": "Track Title",
      "reason": "One sentence explaining why this track matches, written in second person, present tense, in a poetic/evocative style."
    }
  ]
}`;

  try {
    let text;
    if (OPENROUTER_KEY) {
      const messages = [
        { role: 'system', content: 'You are a music curator. Return only valid JSON, no markdown.' },
        { role: 'user', content: prompt }
      ];
      text = await callOpenRouter(messages, 0.8);
    } else {
      text = await callGemini(prompt, 0.8);
    }
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    renderAiTracks(data.tracks, 'soundsLikeResults', true);
  } catch(e) {
    resultsDiv.innerHTML = `<div class="error-msg">Couldn't find matches: ${e.message}. Check your API key.</div>`;
  }

  btn.disabled = false;
}

// ============================================================
// PLAYLIST GENERATOR
// ============================================================

function populateArtistFilter() {
  const grid = document.getElementById('artistFilterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  ARTISTS.forEach(a => {
    const label = document.createElement('label');
    label.className = 'artist-checkbox-label';
    label.innerHTML = `<input type="checkbox" value="${a.id}"> ${a.name}`;
    grid.appendChild(label);
  });
}

function openPlaylistModal() {
  document.getElementById('playlistModal').classList.add('open');
}

function closePlaylistModal() {
  document.getElementById('playlistModal').classList.remove('open');
}

function selectPreset(btn, mood) {
  document.querySelectorAll('.mood-preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedMood = mood;
  document.getElementById('customMood').value = '';
}

function selectLength(btn, len) {
  document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedLength = len;
}

async function generatePlaylist() {
  const customMood = document.getElementById('customMood').value.trim();
  const mood = customMood || selectedMood;
  if (!mood) { alert('Please select or type a mood first.'); return; }

  const btn = document.getElementById('genPlaylistBtn');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  const checkedIds = [...document.querySelectorAll('#artistFilterGrid input:checked')].map(i => i.value);
  const artistPool = checkedIds.length > 0
    ? ARTISTS.filter(a => checkedIds.includes(a.id))
    : ARTISTS;

  const artistContext = artistContextBlock(artistPool);

  const prompt = `You are an editorial music curator for a platform called The Soft Wave, which focuses on R&B, soul, neo-soul, alternative R&B, and related genres.

Create a playlist with exactly ${selectedLength} tracks for this mood: "${mood}"

AVAILABLE ARTIST POOL:
${artistContext}

Rules:
- Only use artists from the pool above
- Use real, actual tracks (use their listed starter tracks or other well-known tracks by them)
- The playlist should have a poetic, evocative title (examples: "For 3am when the city's quiet", "Soft rain on a Saturday you forgot about", "The kind of love that doesn't ask questions")
- Each track should have a one-sentence reason written in second person, present tense, poetic and evocative

Return EXACTLY this JSON format and nothing else:
{
  "title": "Playlist title here",
  "tracks": [
    {
      "artist": "Artist Name",
      "track": "Track Title",
      "reason": "One evocative sentence explaining why this track fits the mood, second person present tense."
    }
  ]
}`;

  try {
    let text;
    if (OPENROUTER_KEY) {
      const messages = [
        { role: 'system', content: 'You are an editorial music curator. Return only valid JSON, no markdown.' },
        { role: 'user', content: prompt }
      ];
      text = await callOpenRouter(messages, 0.9);
    } else if (GEMINI_API_KEY) {
      text = await callGemini(prompt, 0.9);
    } else {
      text = null;
    }

    if (text) {
      const clean = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      closePlaylistModal();
      renderPlaylistOutput(data, mood);
    } else {
      throw new Error('no_key');
    }
  } catch(e) {
    if (e.message === 'no_key' || e.message === 'No API key set' || e.message === 'No OpenRouter key') {
      // Local fallback — build a playlist from scored artists without AI
      const pool = [...artistPool].sort(() => Math.random() - 0.5).slice(0, selectedLength);
      const data = {
        title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} — a soft wave`,
        tracks: pool.map(a => ({ artist: a.name, track: a.tracks[0], reason: a.sound }))
      };
      closePlaylistModal();
      renderPlaylistOutput(data, mood);
    } else {
      alert(`Couldn't generate playlist: ${e.message}`);
    }
  }

  btn.disabled = false;
  btn.textContent = 'Generate';
}

function renderPlaylistOutput(data, mood) {
  const modal = document.getElementById('playlistOutputModal');
  const inner = document.getElementById('playlistOutputInner');

  const tracksHtml = data.tracks.map((t, i) => {
    const q = encodeURIComponent(t.artist + ' ' + t.track);
    const spotifyUrl = `https://open.spotify.com/search/${q}`;
    const appleMusicUrl = `https://music.apple.com/search?term=${q}`;
    const artistObj = ARTISTS.find(a => a.name.toLowerCase() === t.artist.toLowerCase());
    const artistLink = artistObj
      ? `<span style="cursor:pointer;color:var(--gold);text-decoration:underline;text-underline-offset:3px;" onclick="closePlaylistOutput();openDetail('${artistObj.id}')">${t.artist}</span>`
      : `<span style="color:var(--gold)">${t.artist}</span>`;

    return `<div class="ai-track-card fade-in" style="animation-delay:${i * 0.05}s">
      <div class="ai-track-artist">${artistLink}</div>
      <div class="ai-track-name">${t.track}</div>
      <div class="ai-track-reason">${t.reason}</div>
      <div class="ai-track-links">
        <a href="${spotifyUrl}" target="_blank" class="ai-track-link">↗ Spotify</a>
        <a href="${appleMusicUrl}" target="_blank" class="ai-track-link">↗ Apple Music</a>
      </div>
    </div>`;
  }).join('');

  const copyText = data.tracks.map((t,i) => `${i+1}. ${t.artist} — ${t.track}`).join('\n');
  lastGeneratedPlaylist = { title: data.title, mood, tracks: data.tracks };

  inner.innerHTML = `
    <div class="playlist-output-header">
      <div class="playlist-eyebrow">The Soft Wave · Generated Playlist</div>
      <div class="playlist-title">${data.title}</div>
      <div class="playlist-meta">${data.tracks.length} tracks · Mood: ${mood}</div>
    </div>
    <div class="playlist-output-actions">
      <button class="btn btn-gold" onclick="openPlaylistInChat()">Discuss in Chat</button>
      <button class="btn" onclick="sharePlaylist()">Share</button>
      <button class="btn" onclick="copyPlaylist(\`${copyText.replace(/`/g,'\\`')}\`)">Copy</button>
      <button class="btn" onclick="closePlaylistOutput()">← Back</button>
    </div>
    <div class="playlist-tracks">${tracksHtml}</div>
    <div style="height:3rem;"></div>
  `;

  modal.classList.add('open');
}

function closePlaylistOutput() {
  document.getElementById('playlistOutputModal').classList.remove('open');
}

function copyPlaylist(text) {
  navigator.clipboard.writeText(text).then(() => {
    const tooltip = document.getElementById('copyTooltip');
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
  });
}

function sharePlaylist() {
  if (!lastGeneratedPlaylist) return;
  const { title, mood, tracks } = lastGeneratedPlaylist;
  const text = `${title}\n— mood: ${mood} —\n\n` + tracks.map((t, i) => `${i + 1}. ${t.artist} — ${t.track}`).join('\n') + '\n\nvia The Soft Wave';
  if (navigator.share) {
    navigator.share({ title: `The Soft Wave — ${title}`, text }).catch(() => {});
  } else {
    copyPlaylist(text);
  }
}

function openPlaylistInChat() {
  if (!lastGeneratedPlaylist) return;
  closePlaylistOutput();
  document.getElementById('chatPanel').classList.add('open');
  const { title, mood, tracks } = lastGeneratedPlaylist;
  const trackList = tracks.map(t => `${t.artist} — ${t.track}`).join(', ');
  document.getElementById('chatInput').value = `i just made a playlist called "${title}" for the mood: "${mood}". tracks: ${trackList}. what else fits this — more artists or songs in this exact energy?`;
  sendChat();
}

// ============================================================
// AI TRACK RENDERER
// ============================================================

function renderAiTracks(tracks, containerId, withArtistLink = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="ai-results">` + tracks.map((t, i) => {
    const q = encodeURIComponent(t.artist + ' ' + t.track);
    const spotifyUrl = `https://open.spotify.com/search/${q}`;
    const appleMusicUrl = `https://music.apple.com/search?term=${q}`;
    const artistObj = ARTISTS.find(a => a.name.toLowerCase() === t.artist.toLowerCase());
    const artistDisplay = (withArtistLink && artistObj)
      ? `<span style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;" onclick="openDetail('${artistObj.id}')">${t.artist}</span>`
      : t.artist;

    return `<div class="ai-track-card fade-in" style="animation-delay:${i*0.07}s">
      <div class="ai-track-artist">${artistDisplay}</div>
      <div class="ai-track-name">${t.track}</div>
      <div class="ai-track-reason">${t.reason}</div>
      <div class="ai-track-links">
        <a href="${spotifyUrl}" target="_blank" class="ai-track-link">↗ Spotify</a>
        <a href="${appleMusicUrl}" target="_blank" class="ai-track-link">↗ Apple Music</a>
      </div>
    </div>`;
  }).join('') + `</div>`;
}

// ============================================================
// CHAT
// ============================================================

function toggleChat() {
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('open');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('mobile-open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
}

function toggleSidebarAddArtist() {
  const expand = document.getElementById('sidebarAddExpand');
  expand.style.display = expand.style.display === 'block' ? 'none' : 'block';
}

function chatKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

function localChatResponse(msg, history = []) {
  const lower = msg.trim().toLowerCase();

  // ── Follow-up / contextual replies ────────────────────────
  if (/^(tell me more|more about (them|that|him|her)|what else|expand|elaborate|more details?|and their|what are their)/.test(lower)) {
    // Find the most recently mentioned artist in conversation history
    for (const h of [...history].reverse()) {
      for (const a of ARTISTS) {
        if (h.text.toLowerCase().includes(a.name.toLowerCase())) {
          return artistCard(a, true);
        }
      }
    }
  }

  // ── "What do you know about me?" / profile recall ─────────
  if (/what.*know.*me|my.*taste|my.*history|remember|what.*been.*into|my.*profile|what.*i.*like|have.*i.*asked/.test(lower)) {
    const top = topProfileArtist();
    const mood = topProfileMood();
    const count = Object.keys(userProfile.artistInterests).length;
    if (!count) {
      return "We're just getting started — I don't know your taste yet. Ask me about artists or moods and I'll start learning.";
    }
    let reply = `here's what i've picked up about you:<br><br>`;
    if (top) reply += `you keep coming back to <strong>${top.name}</strong> — ${top.sound.toLowerCase()}.<br><br>`;
    if (mood) reply += `the mood you lean toward most is <em style="color:var(--gold);">${mood}</em>.<br><br>`;
    const allArtists = Object.entries(userProfile.artistInterests)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 5)
      .map(([id]) => ARTISTS.find(a => a.id === id)?.name)
      .filter(Boolean);
    if (allArtists.length > 1) reply += `you've explored: <span style="color:var(--gold);">${allArtists.join(', ')}</span>`;
    return reply;
  }

  // ── "Reset / forget me" ───────────────────────────────────
  if (/forget.*me|reset.*my|clear.*my.*history|start.*over|fresh start/.test(lower)) {
    userProfile = { artistInterests: {}, moodHistory: {}, sessionCount: 1, lastVisit: new Date().toISOString() };
    saveUserProfile();
    return "done — clean slate. what are we listening to?";
  }

  // ── Learn from "I love / I'm into / I've been listening to X" ─
  const affinity = lower.match(/i(?:'?m| am)?\s*(?:love|loving|like|liking|into|obsessed with|been listening to|always listen to|keep listening to|a fan of|really like|really love)\s+(.{2,40})/);
  if (affinity) {
    const phrase = affinity[1].replace(/[^\w\s]/g, '').trim();
    const match = ARTISTS.find(a => phrase.includes(a.name.toLowerCase()));
    if (match) {
      updateUserProfile(match.id, match.moods[0] || null);
      const similar = ARTISTS
        .filter(a => a.id !== match.id)
        .map(a => ({ a, score: a.moods.filter(m => match.moods.includes(m)).length * 2 + (a.genre.toLowerCase().includes(match.genre.split('/')[0].toLowerCase().trim()) ? 2 : 0) }))
        .filter(x => x.score > 0)
        .sort((a,b) => b.score - a.score)
        .slice(0, 4);
      let reply = `${match.name} — good taste. ${match.about}<br><br>`;
      if (similar.length) {
        reply += `if you're into them, these feel similar:<br><br>` +
          similar.map(x => `<strong>${x.a.name}</strong> — <em style="color:var(--muted);">${x.a.sound}</em>`).join('<br><br>');
      }
      return reply;
    }
    // Didn't find a named artist — treat phrase as a mood/vibe query and still acknowledge
    return `noted. tell me more about what you like about them and i'll find you something similar`;
  }

  // ── Greetings & small talk — respond conversationally ─────
  const greetings = /^(yo+|hey+|hi+|hello+|sup|what'?s up|wassup|heyy+|hiii+|yo+\s*!*)$/;
  const howAreYou = /how are you|how'?s it going|you good|you okay/;
  const thanks    = /^(thanks?|ty|thank you|thx|appreciate)(\s.*)?$/;
  const bored     = /^(bored|idk|idk what|not sure|hmm+|hm+|dunno|don'?t know)(\s.*)?$/;

  if (greetings.test(lower)) {
    const top = topProfileArtist();
    const mood = topProfileMood();
    if (top && userProfile.sessionCount > 1) {
      return `back again — you were on <strong>${top.name}</strong> last time${mood ? `, really into that <em>${mood}</em> sound` : ''}. still on that, or switching it up?`;
    }
    const greeted = [
      "yo, what are we putting on?",
      "what sounds good right now?",
      "what are you feeling?",
      "what do you want to hear?"
    ];
    return greeted[Math.floor(Math.random() * greeted.length)];
  }
  if (howAreYou.test(lower)) {
    return "good, what are you trying to listen to?";
  }
  if (thanks.test(lower)) {
    return "anytime. anything else on your mind?";
  }
  if (bored.test(lower)) {
    const top = topProfileArtist();
    if (top) {
      const similar = ARTISTS.filter(a => a.id !== top.id && a.moods.some(m => top.moods.includes(m)))[0];
      return `since you've been into <strong>${top.name}</strong>, give <strong>${similar?.name || top.name}</strong> a go — start with ${spotifyLink((similar || top).tracks[0], (similar || top).name)}, that one hits`;
    }
    const r = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
    return `put on <strong>${r.name}</strong> — ${spotifyLink(r.tracks[0], r.name)} is a good place to start. ${r.sound.toLowerCase()}`;
  }

  // ── Meta / conversational complaint ───────────────────────
  const isMetaConversational = /stop\s*(guessing|suggesting|throwing|recommend)|not\s*what\s*i\s*(said|meant|asked)|have\s*a\s*(real\s*)?(conversation|convo)|too\s*(direct|robotic|formal)|sound\s*(too|like)\s*(a\s*)?(bot|robot)|just\s*(talk|chat)|not\s*about\s*(the\s*)?mood|i\s*never\s*said|back\s*off|that'?s\s*not\s*what|stop\s*giving/.test(lower);
  if (isMetaConversational) {
    const replies = [
      "fair enough. what's actually going on?",
      "got it. just talk to me — what are you feeling?",
      "alright, i'll ease up. what do you want to hear?",
      "okay, i'm listening. what's on your mind?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // ── Feelings / emotional state → map to music ─────────────
  const feelingMap = [
    { test: /i'?m?\s*(feeling|feel|am)\s*(sad|down|low|hurt|broken|crying|heartbroken|devastated)/, mood: 'melancholic' },
    { test: /i'?m?\s*(feeling|feel|am)\s*(happy|good|great|amazing|joy|excited|hyped)/, mood: 'groovy' },
    { test: /can'?t\s*sleep|late\s*night|up\s*late|2am|3am|midnight|insomnia/, mood: 'late night' },
    { test: /i'?m?\s*(feeling|feel|am)\s*(romantic|in\s*love|love|tender|soft)/, mood: 'romantic' },
    { test: /i'?m?\s*(feeling|feel|am)\s*(dark|heavy|moody|brooding|angry|pissed)/, mood: 'dark' },
    { test: /reflecting|thinking\s*a\s*lot|introspect|need\s*to\s*think/, mood: 'introspective' },
    { test: /chill|relax|calm\s*down|unwind|sunday|morning|coffee/, mood: 'warm' },
    { test: /spiritual|pray|hopeful|grateful|thankful|uplift/, mood: 'spiritual' },
    { test: /creative|focus|work|study|zone\s*in/, mood: 'introspective' },
  ];

  // ── Number detection (e.g. "10 songs", "5 tracks") ────────
  const countMatch = lower.match(/\b(\d+)\s*(song|track|artist|pick|rec|recommendation)s?\b/);
  const requestedCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 20) : null;

  // ── Direct mood keywords (no "I feel" required) ───────────
  const directMoodMap = {
    'sad':        'melancholic',
    'melancholy': 'melancholic',
    'heartbreak': 'melancholic',
    'late night': 'late night',
    'midnight':   'late night',
    '2am':        'late night',
    '3am':        'late night',
    'dark':       'dark',
    'brooding':   'brooding',
    'chill':      'warm',
    'calm':       'warm',
    'mellow':     'warm',
    'warm':       'warm',
    'romantic':   'romantic',
    'love':       'romantic',
    'groovy':     'groovy',
    'energetic':  'groovy',
    'soulful':    'soulful',
    'spiritual':  'spiritual',
    'healing':    'healing',
    'introspect': 'introspective',
    'cinematic':  'cinematic',
    'ethereal':   'ethereal',
    'dreamy':     'dreamy',
    'raw':        'raw',
    'intimate':   'intimate',
  };

  // Collect all moods the user is expressing (multi-mood support)
  const detectedMoods = new Set();

  // From feelingMap
  for (const { test, mood } of feelingMap) {
    if (test.test(lower)) detectedMoods.add(mood);
  }
  // From direct mood keywords
  for (const [kw, mood] of Object.entries(directMoodMap)) {
    if (lower.includes(kw)) detectedMoods.add(mood);
  }

  if (detectedMoods.size > 0) {
    const moodList = [...detectedMoods];
    for (const mood of moodList) updateUserProfile(null, mood);

    // Score artists: more shared moods = higher score
    const scored = ARTISTS
      .map(a => ({ a, score: a.moods.filter(m => moodList.includes(m)).length }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    // If no direct matches, fall back to closest single mood
    const pool = scored.length >= 2
      ? scored
      : ARTISTS.filter(a => moodList.some(m => a.moods.includes(m))).map(a => ({ a, score: 1 }));

    if (pool.length >= 2) {
      const limit = requestedCount || 8;
      const picks = pool.slice(0, limit);

      const moodLabel = moodList.length > 1
        ? moodList.join(' + ')
        : moodList[0];

      const phrases = {
        'melancholic': 'for when things feel heavy',
        'late night':  'for 2am',
        'warm':        'to ease in',
        'dark':        'for that heavy mood',
        'romantic':    'for that one person',
        'groovy':      'to match that energy',
        'introspective': 'when you need to think',
        'spiritual':   'for that space',
        'soulful':     'full of soul',
        'healing':     'that actually heals',
        'cinematic':   'big and cinematic',
        'brooding':    'slow and brooding',
        'ethereal':    'weightless',
        'intimate':    'just for you',
        'dreamy':      'hazy and dreamlike',
        'raw':         'raw and honest',
      };
      const labelKey = moodList.find(m => phrases[m]) || moodList[0];
      const opening = phrases[labelKey] || 'for that vibe';
      const intro = picks.length > 1
        ? `here are ${picks.length} that fit — ${opening}:`
        : `this one fits — ${opening}:`;

      const list = picks.map((e, i) =>
        `${i + 1}. <strong>${e.a.name}</strong> — ${spotifyLink(moodBestTrack(e.a, moodList), e.a.name)}<br>`
        + `<span style="color:var(--muted);font-size:0.85em;">${e.a.sound}</span>`
      ).join('<br><br>');

      return `${intro}<br><br>${list}`;
    }
  }

  // ── Stopwords ──────────────────────────────────────────────
  const STOP = new Set(['the','and','with','for','that','this','who','what','how',
    'give','tell','about','some','find','like','want','need','make','me','my',
    'you','your','can','could','would','should','is','are','was','were','has',
    'have','had','will','do','does','did','a','an','i','im','its','if','of',
    'to','in','on','at','by','be','so','it','or','not','but','from','as','up',
    'no','more','most','any','all','when','where','which','there','they','them',
    'he','she','his','her','we','our','just','get','let','much','too','than',
    'then','out','into','only','over','even','after','new','old','been','well',
    'now','got','say','said','something','someone','kind','type','sort','stuff',
    'thing','music','artist','artists','song','songs','track','tracks','sound']);

  // ── Extract meaningful query tokens ───────────────────────
  const queryTokens = lower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w));

  // ── Build searchable corpus per artist ────────────────────
  const index = ARTISTS.map(a => ({
    artist: a,
    corpus: [
      a.name, a.genre, a.about, a.sound,
      ...a.moods, ...a.tracks,
      SECTION_LABELS[a.group]
    ].join(' ').toLowerCase()
  }));

  // ── Score artists against query ───────────────────────────
  function scoreArtist(entry) {
    let score = 0;
    const a = entry.artist;
    // Hard name match — very high weight
    if (lower.includes(a.name.toLowerCase())) score += 20;
    for (const token of queryTokens) {
      const corpusWords = entry.corpus.split(/\s+/);
      for (const cw of corpusWords) {
        if (cw === token) { score += 3; break; }
        if (cw.length > 3 && (cw.startsWith(token) || token.startsWith(cw))) { score += 1; break; }
      }
    }
    // Personalization boost — lift artists similar to ones user has explored
    for (const [knownId, count] of Object.entries(userProfile.artistInterests)) {
      const known = ARTISTS.find(x => x.id === knownId);
      if (!known || known.id === a.id) continue;
      const sharedMoods = a.moods.filter(m => known.moods.includes(m)).length;
      const sharedGenre = a.genre.split('/').some(g =>
        known.genre.split('/').some(g2 => g.trim().toLowerCase() === g2.trim().toLowerCase()));
      score += sharedMoods * 0.5 + (sharedGenre ? 0.5 : 0);
    }
    return score;
  }

  const scoredAll = index
    .map(e => ({ ...e, score: scoreArtist(e) }))
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score);

  // ── Intent flags ──────────────────────────────────────────
  const isSoundsLike = /sounds?\s*like|similar\s*to|reminds?\s*(me\s*of)?|fans?\s*of|if\s*i\s*(like|love|enjoy)|who\s*else|alternative\s*to|instead\s*of/.test(lower);
  const isPlaylist   = /playlist|make.*list|give.*list|build|create.*mix|night.*playlist|morning.*playlist|drive.*playlist/.test(lower);
  const isAbout      = /who\s*is|tell.*about|what.*about|info|describe|explain|background|history/.test(lower);
  const isDiscover   = /discover|recommend|suggest|slept\s*on|underrated|listen\s*next|what\s*should|hidden\s*gem|don.?t\s*know\s*where|look\s*for/.test(lower);
  const isClassics   = /classic|legend|golden\s*(era|age)|old\s*school|pioneer|iconic|70s|80s|90s/.test(lower);
  const isRising     = /rising|emerging|fresh|upcoming|new\s*(artist|voice|music)|just\s*came\s*out/.test(lower);
  const isVibe       = /vibe|mood|feeling|feel|energy|atmosphere|sound\s*(like|of)|aesthetic/.test(lower);
  const isWhy        = /why|what\s*makes|what\s*is\s*special|what\s*(sets|makes)/.test(lower);
  const isCompare    = /compar|differ|versus|vs\.?|contrast|between/.test(lower);
  const isPlaylistQ  = /playlist|give me|list|make|build/.test(lower);

  // Find the highest-scoring named artist (if any)
  const mentionedArtist = scoredAll.length > 0 && scoredAll[0].score >= 20
    ? scoredAll[0].artist
    : null;

  // Track interest in this artist
  if (mentionedArtist) updateUserProfile(mentionedArtist.id, mentionedArtist.moods[0] || null);

  // ── Helper: Spotify search link ───────────────────────────
  function spotifyLink(track, artist) {
    const q = encodeURIComponent(`${track} ${artist}`);
    return `<a href="https://open.spotify.com/search/${q}" target="_blank" style="color:var(--green);text-decoration:none;" title="Search on Spotify"><em>"${track}"</em> <span style="font-size:0.75em;">↗</span></a>`;
  }

  // ── Helper: pick best track for the requested mood ────────────
  function moodBestTrack(artist, requestedMoods = []) {
    for (let i = 0; i < artist.moods.length; i++) {
      if (requestedMoods.includes(artist.moods[i]) && artist.tracks[i]) {
        return artist.tracks[i];
      }
    }
    return artist.tracks[0];
  }

  // ── Helper: artist card ───────────────────────────────────
  function artistCard(a, showTracks = false) {
    const related = ARTISTS
      .filter(x => x.id !== a.id && x.moods.some(m => a.moods.includes(m)))
      .slice(0, 3).map(x => x.name).join(', ');
    return `<strong>${a.name}</strong> &nbsp;<em style="color:var(--gold);">${a.genre}</em><br><br>`
      + `${a.about}<br><br>`
      + `<em style="color:var(--muted);">${a.sound}</em>`
      + (showTracks ? `<br><br>tracks: ${a.tracks.map(t => spotifyLink(t, a.name)).join(', ')}` : `<br><br>start with: ${spotifyLink(a.tracks[0], a.name)}`)
      + (related ? `<br><br>You might also like: <span style="color:var(--gold);">${related}</span>` : '');
  }

  // ── Helper: scored list ───────────────────────────────────
  function scoredList(entries, max = 6) {
    return entries.slice(0, max).map(e =>
      `<strong>${e.artist.name}</strong> <em style="color:var(--muted);font-size:0.85em;">(${e.artist.genre})</em><br>`
      + `<span style="color:var(--muted);font-size:0.9em;">${e.artist.sound}</span>`
    ).join('<br><br>');
  }

  // ── 1. "Who sounds like X?" / "Similar to X?" ────────────
  if (isSoundsLike && mentionedArtist) {
    const ref = mentionedArtist;
    const similar = ARTISTS
      .filter(a => a.id !== ref.id)
      .map(a => ({
        artist: a,
        score: a.moods.filter(m => ref.moods.includes(m)).length * 2
          + (a.genre.split('/').some(g =>
              ref.genre.split('/').some(g2 =>
                g.trim().toLowerCase() === g2.trim().toLowerCase())) ? 3 : 0)
          + (a.group === ref.group ? 1 : 0)
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (similar.length > 0) {
      const list = similar.map(e =>
        `<strong>${e.artist.name}</strong> (${e.artist.genre})<br>`
        + `<span style="color:var(--muted);font-size:0.9em;">${e.artist.sound}</span><br>`
        + `start with: ${spotifyLink(e.artist.tracks[0], e.artist.name)}`
      ).join('<br><br>');
      return `if you're into ${ref.name}, these should hit the same way:<br><br>${list}`;
    }
  }

  // ── 2. "Compare X and Y" ──────────────────────────────────
  if (isCompare && scoredAll.length >= 2 && scoredAll[0].score >= 10 && scoredAll[1].score >= 10) {
    const a = scoredAll[0].artist;
    const b = scoredAll[1].artist;
    const sharedMoods = a.moods.filter(m => b.moods.includes(m));
    const sameGenreFamily = a.genre.split('/').some(g =>
      b.genre.split('/').some(g2 => g.trim().toLowerCase() === g2.trim().toLowerCase()));
    let prose = `<strong>${a.name}</strong> and <strong>${b.name}</strong> both carry emotional weight, but they arrive there differently.<br><br>`;
    prose += `${a.name} is ${a.sound.toLowerCase()} — ${a.moods[0] ? "there\u2019s a distinctly <em style=\"color:var(--gold);\">" + a.moods[0] + "</em> quality to it" : "subtle and contained"}. `;
    prose += `${b.name} leans toward ${b.sound.toLowerCase()}, which gives it a <em style="color:var(--gold);">${b.moods[0] || 'different'}</em> feeling altogether.<br><br>`;
    if (sharedMoods.length) {
      prose += `Where they meet: both carry a <strong>${sharedMoods.join(' and ')}</strong> undercurrent that connects them at the root. `;
    } else {
      prose += `They don't share much sonically — that's actually what makes listening to both interesting. `;
    }
    if (!sameGenreFamily) {
      prose += `${a.name} is rooted in ${a.genre}, while ${b.name} draws from ${b.genre}.<br><br>`;
    } else {
      prose += `<br><br>`;
    }
    prose += `start with ${spotifyLink(a.tracks[0], a.name)} and ${spotifyLink(b.tracks[0], b.name)} to hear the contrast.`;
    return prose;
  }

  // ── 3. "What makes X special?" / "Why is X good?" ────────
  if (isWhy && mentionedArtist) {
    const a = mentionedArtist;
    return `${a.about}<br><br>`
      + `sonically it's ${a.sound.toLowerCase()}.<br><br>`
      + `the moods it hits: <em style="color:var(--gold);">${a.moods.join(', ')}</em>`;
  }

  // ── 4. Direct artist question ("tell me about X", "who is X") ──
  if (mentionedArtist && (isAbout || (!isPlaylistQ && !isDiscover && scoredAll[0]?.score >= 15))) {
    return artistCard(mentionedArtist, true);
  }

  // ── 5. Playlist from query ────────────────────────────────
  if (isPlaylistQ && scoredAll.length >= 4) {
    const limit = requestedCount || 10;
    const picks = scoredAll.slice(0, limit);
    const list = picks.map((e, i) =>
      `${i + 1}. <strong>${e.artist.name}</strong> — ${spotifyLink(moodBestTrack(e.artist, scoredAll.map(x => x.artist.moods[0])), e.artist.name)}<br>`
      + `<span style="color:var(--muted);font-size:0.85em;">${e.artist.sound}</span>`
    ).join('<br><br>');
    return `here's ${picks.length} that fit:<br><br>${list}`;
  }

  // ── 6. Discover / slept on ────────────────────────────────
  if (isDiscover || isRising) {
    const pool = scoredAll.filter(e => e.artist.group === 'g3' || e.artist.group === 'g4').slice(0, 5);
    const fallback = ARTISTS.filter(a => a.group === 'g3' || a.group === 'g4')
      .sort(() => Math.random() - 0.5).slice(0, 5).map(a => ({ artist: a }));
    const list = (pool.length >= 3 ? pool : fallback).map(e =>
      `<strong>${e.artist.name}</strong> — ${spotifyLink(e.artist.tracks[0], e.artist.name)}<br>`
      + `<span style="color:var(--muted);font-size:0.9em;">${e.artist.sound}</span>`
    ).join('<br><br>');
    return `these are the ones people sleep on — really worth digging into:<br><br>${list}`;
  }

  // ── 7. Classics ───────────────────────────────────────────
  if (isClassics) {
    const pool = scoredAll.filter(e => e.artist.group === 'g5');
    const fallback = ARTISTS.filter(a => a.group === 'g5').map(a => ({ artist: a }));
    const list = (pool.length > 0 ? pool : fallback)
      .map(e => `<strong>${e.artist.name}</strong> — ${spotifyLink(e.artist.tracks[0], e.artist.name)}`).join('<br>');
    return `the classics section — these are the foundations:<br><br>${list}`;
  }

  // ── 8. Good text match (vibe / genre / mood questions) ────
  if (scoredAll.length >= 3 && scoredAll[0].score >= 5) {
    const top = scoredAll.slice(0, 5);
    const openers = ['these feel right for what you described:', 'here\'s what comes to mind:', 'this is probably what you\'re looking for:'];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    return `${opener}<br><br>${scoredList(top)}`;
  }

  // ── 9. Single strong match ────────────────────────────────
  if (scoredAll.length >= 1 && scoredAll[0].score >= 10) {
    return artistCard(scoredAll[0].artist);
  }

  // ── 10. Genre / style freetext ────────────────────────────
  const genreKeywords = {
    'jazz':       ['jazz','jazzy','saxophone','trumpet','improvisation'],
    'gospel':     ['gospel','church','spiritual','choir','sacred'],
    'funk':       ['funk','funky','groove','groovy','bass line'],
    'electronic': ['electronic','synth','synthesizer','ambient','digital'],
    'indie':      ['indie','lo-fi','bedroom','underground'],
    'dark':       ['dark','heavy','brooding','intense','noir'],
    'smooth':     ['smooth','silky','easy','mellow'],
    'romantic':   ['romantic','love songs','sensual','tender','date night','couples'],
    'sad':        ['sad','cry','tears','heartbreak','grief','breakup'],
    'happy':      ['happy','uplifting','joy','feel good','positive'],
  };

  for (const [label, kws] of Object.entries(genreKeywords)) {
    if (kws.some(kw => lower.includes(kw))) {
      const moodMap = { dark:'dark', smooth:'smooth', romantic:'romantic', sad:'melancholic', happy:'groovy', funk:'groovy', gospel:'spiritual', jazz:'groovy', electronic:'electronic', indie:'alternative' };
      const targetMood = moodMap[label];
      let matches = targetMood
        ? ARTISTS.filter(a => a.moods.includes(targetMood) || a.genre.toLowerCase().includes(label))
        : ARTISTS.filter(a => a.genre.toLowerCase().includes(label));
      if (!matches.length) matches = ARTISTS.filter(a => a.about.toLowerCase().includes(label) || a.sound.toLowerCase().includes(label));
      if (matches.length >= 2) {
        const picks = matches.sort(() => Math.random() - 0.5).slice(0, 5);
        return `for a ${label} sound, these are heavy hitters:<br><br>` + picks.map(a =>
          `<strong>${a.name}</strong> — <em style="color:var(--muted);">${a.sound}</em><br>start with: ${spotifyLink(a.tracks[0], a.name)}`
        ).join('<br><br>');
      }
    }
  }

  // ── 11. List all artists ───────────────────────────────────
  if (/show|list|all|everyone|everything|full|complete|what.*have|what.*got/.test(lower) && /artist|name|roster|catalogue|catalog/.test(lower)) {
    const byGroup = {};
    for (const a of ARTISTS) { if (!byGroup[a.group]) byGroup[a.group] = []; byGroup[a.group].push(a.name); }
    return `here's the full roster:<br><br>` + Object.entries(byGroup).map(([g, names]) =>
      `<strong>${SECTION_LABELS[g]}</strong><br>${names.join(', ')}`
    ).join('<br><br>');
  }

  // ── 12. Best tracks / where to start ──────────────────────
  if (/best (track|song|record)|top (track|song)|where.*start|starter|entry point|first.*listen/.test(lower)) {
    if (mentionedArtist) {
      return `for <strong>${mentionedArtist.name}</strong>, i'd start here:<br><br>`
        + mentionedArtist.tracks.map((t, i) => `${i + 1}. ${spotifyLink(t, mentionedArtist.name)}`).join('<br>');
    }
    const picks = [...ARTISTS].sort(() => Math.random() - 0.5).slice(0, 5);
    return `some good entry points if you're just getting into the catalogue:<br><br>` + picks.map(a =>
      `<strong>${a.name}</strong> — ${spotifyLink(a.tracks[0], a.name)}`
    ).join('<br>');
  }

  // ── 13. Direct mood words not caught above ─────────────────
  const moodWords = ['intimate','warm','ethereal','haunting','cathartic','cinematic','brooding','nocturnal','healing','meditative','spiritual','experimental','playful','soulful','atmospheric','dreamy','hazy','raw','melancholic'];
  const foundMood = moodWords.find(m => lower.includes(m));
  if (foundMood) {
    const matches = ARTISTS.filter(a => a.moods.includes(foundMood));
    if (matches.length >= 2) {
      return `these all carry that ${foundMood} quality:<br><br>` + matches.slice(0, 5).map(a =>
        `<strong>${a.name}</strong> — <em style="color:var(--muted);">${a.sound}</em>`
      ).join('<br><br>');
    }
  }

  // ── 14. What to play / music for a moment ─────────────────
  if (/what.*(play|listen|put on|hear)|give me (something|anything)|music for (tonight|today|a drive|the ride|a run)|driving|road trip|^good\s*(music|songs?|stuff|vibes?)|^(just\s*)?play\s*something|^something\s*(good|new)|^just\s*(give|play|throw)/.test(lower)) {
    const r1 = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
    const r2 = ARTISTS.filter(a => a.id !== r1.id)[Math.floor(Math.random() * (ARTISTS.length - 1))];
    const picks2 = [`<strong>${r1.name}</strong> — ${spotifyLink(r1.tracks[0], r1.name)}<br><em style="color:var(--muted);">${r1.sound}</em>`, `<strong>${r2.name}</strong> — ${spotifyLink(r2.tracks[0], r2.name)}<br><em style="color:var(--muted);">${r2.sound}</em>`];
    const intros2 = ['two things worth hearing right now:', 'honestly just put one of these on:', 'here, try one of these:'];
    return `${intros2[Math.floor(Math.random() * intros2.length)]}<br><br>${picks2.join('<br><br>')}`;
  }

  // ── 15. Default ────────────────────────────────────────────
  if (lower.length < 8) return "paint me a picture — what time is it, what are you feeling, what's the energy? the more detail you give, the better i can curate.";
  if (scoredAll.length >= 1 && scoredAll[0].score >= 5) return `this is probably what you're looking for:<br><br>${scoredList(scoredAll.slice(0, 4))}`;
  const fallbacks = [
    "give me more to work with — what's the time of day, what are you feeling, what's the energy? vague gets vague back.",
    "too broad to dial in. describe the moment — like \"it's 3am and i'm in my feelings\" or \"something for a slow sunday morning without any intensity\".",
    "be specific with me. are you heartbroken? driving alone? numb? the detail is what makes the difference between a random pick and the right one."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  appendChatMsg('user', msg);
  chatHistory.push({ role: 'user', text: msg });

  const loadingId = 'chat-loading-' + Date.now();
  appendChatMsg('ai', '<span class="loading-pulse">thinking...</span>', loadingId);

  const scrollToBottom = () => {
    const msgs = document.getElementById('chatMessages');
    msgs.scrollTop = msgs.scrollHeight;
  };
  scrollToBottom();

  const finishReply = (reply) => {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.innerHTML = reply;
    chatHistory.push({ role: 'ai', text: reply });
    scrollToBottom();
  };

  if (OPENROUTER_KEY || GEMINI_API_KEY) {
    try {
      const reply = await callGeminiChat(msg);
      finishReply(reply);
    } catch (e) {
      console.warn('AI chat failed, using local fallback:', e.message);
      finishReply(localChatResponse(msg, chatHistory));
    }
  } else {
    setTimeout(() => finishReply(localChatResponse(msg, chatHistory)), 120);
  }
}

async function callGeminiChat(userMsg) {
  const artistContext = ARTISTS.map(a =>
    `${a.name} (${a.genre}, ${SECTION_LABELS[a.group]}): ${a.about} Sound: ${a.sound}. Moods: ${a.moods.join(', ')}. Key tracks: ${a.tracks.slice(0,2).join(', ')}.`
  ).join('\n');

  const systemPrompt = `You are the voice behind The Soft Wave — a real person who loves R&B, soul, and neo-soul. Not a bot. Not an assistant. A friend who has heard everything and actually cares.

Personality rules — do NOT break these:
- NEVER say "How can I help you?", "How can I assist?", "What can I do for you?", or anything like that. Ever.
- When someone says "yo", "hey", "what's up", "sup" — just vibe back. Say something like "yo, what are we putting on?" or "what sounds good right now?" — not a question about how to help.
- Be direct, warm, and real. Casual language, contractions, the occasional slang. You are not formal.
- No fluff. No "certainly!", no "great question!", no "of course!".
- Show real opinions. If something is genuinely special, say so. If there's a better pick than what they asked for, say that too.
- Ask follow-up questions sometimes — like a real conversation, not a support ticket.
- Never start with an artist name as a bold header. Weave it into sentences.
- No bullet points with "•". Natural sentences or a numbered list max.
- Keep it short enough to read in a chat window. This isn't an essay.
- If someone is just chatting or venting, respond to the person first before jumping to music.

Artist roster:
${artistContext}

Music rules:
- Max 4-5 artists unless they explicitly ask for more
- Always mention at least one specific track and why it fits the mood
- Use your own knowledge of what track best fits the requested mood — don't just default to the most popular song
- If you don't know enough about something, say so honestly
- If someone's message is vague — just "sad", "chill vibes", "something good" — do NOT flood them with recs. Ask ONE specific follow-up to get more texture before recommending. Something like "what kind of sad? numb and hollow, or full-on crying in the car?" or "what's the setting — late night alone, daytime, driving?"
- The more specific a person's description, the more precise your picks should be. Match the texture of what they give you.${lastGeneratedPlaylist ? `

User's active playlist (use this as a reference point):
Title: "${lastGeneratedPlaylist.title}" · Mood: "${lastGeneratedPlaylist.mood}"
Tracks: ${lastGeneratedPlaylist.tracks.map(t => t.artist + ' — ' + t.track).join(', ')}
If they ask for more or what else fits, use this playlist's texture and mood as the template.` : ''}`;

  // OpenRouter — uses standard chat format (works with all models)
  if (OPENROUTER_KEY) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text.replace(/<[^>]*>/g, '')
      })),
      { role: 'user', content: userMsg }
    ];
    return callOpenRouter(messages);
  }

  // Gemini fallback — uses prompt format
  const historyText = chatHistory.slice(-10).map(h =>
    `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text.replace(/<[^>]*>/g, '')}`
  ).join('\n');
  const prompt = `${systemPrompt}\n${historyText ? '\nConversation:\n' + historyText + '\n' : ''}\nUser: ${userMsg}\nAssistant:`;
  return callGemini(prompt, 0.75);
}

function surpriseMe() {
  const r = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
  document.getElementById('chatInput').value = `Tell me about ${r.name}`;
  sendChat();
}

function sendQuick(msg) {
  document.getElementById('chatInput').value = msg;
  sendChat();
}

function appendChatMsg(role, html, id = null) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  if (id) div.id = id;
  div.innerHTML = html;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ============================================================
// ADD ARTIST
// ============================================================

async function addArtistAI() {
  const name = document.getElementById('addArtistName').value.trim();
  if (!name) { alert('Enter an artist name.'); return; }

  const group = document.getElementById('addArtistSection').value;
  const btn = document.getElementById('addArtistBtn');
  const status = document.getElementById('addArtistStatus');

  btn.disabled = true;
  status.textContent = 'Researching...';

  const prompt = `Generate a music profile for the artist "${name}" for a curated R&B/soul platform called The Soft Wave.

Return EXACTLY this JSON format and nothing else:
{
  "genre": "Primary genre / subgenre",
  "about": "2-3 sentences about the artist, written in a literary, editorial style.",
  "sound": "One sentence describing their sonic signature.",
  "moods": ["mood1", "mood2", "mood3"],
  "tracks": ["Track Title 1", "Track Title 2", "Track Title 3"]
}

Only include real, actual tracks that this artist has released. If unsure, use their most well-known songs.`;

  try {
    const text = await callGemini(prompt, 0.7);
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newArtist = {
      id: newId,
      name,
      group,
      genre: data.genre,
      about: data.about,
      sound: data.sound,
      moods: data.moods,
      tracks: data.tracks
    };

    ARTISTS.push(newArtist);
    status.textContent = `${name} added!`;
    document.getElementById('addArtistName').value = '';
    populateArtistFilter();
    renderGrid();

    setTimeout(() => { status.textContent = ''; }, 3000);
  } catch(e) {
    status.style.color = 'var(--red)';
    status.textContent = `Error: ${e.message}`;
    setTimeout(() => { status.textContent = ''; status.style.color = 'var(--muted)'; }, 4000);
  }

  btn.disabled = false;
}

// ============================================================
// INIT
// ============================================================

// Show API key modal on load (don't render grid until key is set)
// renderAll() is called after key is entered

