// Blind Rank — expansion pack: creators rebuilt with verified channel pictures,
// plus a big push for the US market (and more UK too).
//
// Creator items: 'Wikipedia Title|Display Name|@youtubeHandle,tw:twitchLogin'
//   The catalog builder uses the channel's own picture first, but only when the
//   channel's name matches — otherwise it falls back to a strict Wikipedia lookup.
// Other items follow data.js formats (wiki titles, 'Film|Year', 'Show|Year', 'Actor|Shown as').

const nav = (id, name, icon, desc) => ({ type: 'nav', id, name, icon, desc });
const wiki = (id, name, icon, items, extra = {}) => ({ type: 'wiki', id, name, icon, items, ...extra });
const films = (id, name, icon, list, extra = {}) => ({
  type: 'custom', id, name, icon, kind: 'films', ...extra,
  queries: list.map(s => { const [q, y] = s.split('|'); return { q, y, n: q, t: 'movie' }; }),
});
const shows = (id, name, icon, list, extra = {}) => ({
  type: 'custom', id, name, icon, kind: 'shows', ...extra,
  queries: list.map(s => { const [q, y] = s.split('|'); return { q, y, n: q, t: 'tv' }; }),
});
const people = (id, name, icon, list, extra = {}) => ({
  type: 'custom', id, name, icon, kind: 'people', ...extra,
  queries: list.map(s => { const [q, n] = s.split('|'); return { q, n: n || q, t: 'person' }; }),
});
const albums = (id, name, icon, items, extra = {}) => ({ type: 'albums', id, name, icon, items, ...extra });
const US = { region: 'us' }, UK = { region: 'uk' };

/* ======================= CREATORS ======================= */
const CREATORS = {
  creators: [
    nav('cr_youtube', 'YOUTUBERS', '▶️', 'USA, UK, WORLDWIDE'),
    nav('cr_live', 'STREAMERS', '🟪', 'TWITCH, KICK, YOUTUBE LIVE'),
    nav('cr_niche', 'BY GENRE', '🎮', 'GAMING, SCIENCE, COMEDY, FOOD'),
    nav('cr_social', 'TIKTOK & PODCASTS', '🎙️', 'TIKTOK STARS, PODCASTERS'),
  ],
  cr_youtube: [
    wiki('cr_us', 'USA YouTubers', '🇺🇸', [
      'MrBeast||@MrBeast', 'Logan Paul||@loganpaulvlogs', 'Jake Paul||@jakepaul', 'Dude Perfect||@DudePerfect', 'Markiplier||@markiplier',
      'Emma Chamberlain||@emmachamberlain', 'Marques Brownlee|MKBHD|@mkbhd', 'David Dobrik||@DavidDobrik', 'Casey Neistat||@casey',
      'Ryan Trahan||@ryan,@RyanTrahan', 'Airrack||@airrack', 'Mark Rober||@MarkRober', 'IShowSpeed||@IShowSpeed', 'Kai Cenat||@KaiCenat',
      'Rhett and Link|Rhett & Link|@rhettandlink', 'Smosh||@smosh', 'Danny Duncan||@dannyduncan69,@DannyDuncan', 'Sam and Colby|Sam & Colby|@SamandColby',
      'Unspeakable (YouTuber)|Unspeakable|@unspeakable', 'PrestonPlayz|Preston|@PrestonPlayz,@Preston', 'Brent Rivera||@BrentRivera', 'Stokes Twins||@StokesTwins',
      'Jesser||@jesser', 'ZHC||@ZHC', 'Michelle Khare||@MichelleKhare', 'Zach King||@ZachKing', 'SSSniperWolf||@SSSniperWolf', 'CoryxKenshin||@CoryxKenshin',
      'Dhar Mann||@DharMann', 'Cody Ko||@CodyKo', 'Drew Gooden||@DrewGooden', 'Danny Gonzalez||@Danny-Gonzalez,@dannygonzalez', 'JiDion||@JiDion',
      'Duke Dennis||@DukeDennis', 'Fanum||@Fanum', 'Ryan Kaji|Ryan’s World|@RyansWorld', 'Nick DiGiovanni||@NickDiGiovanni',
    ], US),
    wiki('cr_uk', 'UK YouTubers', '🇬🇧', [
      'KSI||@KSI', 'Sidemen||@Sidemen', 'Simon Minter|Miniminter|@Miniminter', 'Vikkstar123||@Vikkstar123', 'Ethan Payne|Behzinga|@Behzinga',
      'Harry Lewis (YouTuber)|W2S|@W2S', 'Josh Bradley|Zerkaa|@Zerkaa', 'Tobi Brown|TBJZL|@TBJZL', 'Chunkz||@Chunkz', 'Niko Omilana||@NikoOmilana',
      'Angry Ginge||@AngryGinge13,@AngryGinge', 'Yung Filly||@YungFilly', 'Max Fosh||@MaxFosh', 'Joe Weller||@JoeWeller', 'Zoe Sugg|Zoella|@zoella,@zoesugg',
      'Alfie Deyes||@PointlessBlog,@AlfieDeyes', 'Joe Sugg||@ThatcherJoe!', 'Dan Howell||@danielhowell!', 'Phil Lester||@AmazingPhil!',
      'Tom Scott (YouTuber)|Tom Scott|@TomScottGo', 'DanTDM||@DanTDM', 'TommyInnit||@TommyInnit', 'Stephen Tries||@StephenTries', 'Harry Pinero||@HarryPinero',
      'Calfreezy||@Calfreezy', 'Danny Aarons||@DannyAarons', 'Deji Olatunji|Deji|@Deji',
      'Ali-A||@AliA', 'Mrwhosetheboss||@Mrwhosetheboss', 'Colin Furze||@colinfurze', 'ChrisMD||@ChrisMD', 'Beta Squad||@BetaSquad', 'Callux||@Callux',
      'WillNE||@WillNE', 'Caspar Lee||@CasparLee', 'Specs Gonzalez||@SpecsGonzalez', 'Spencer FC|Spencer Owen|@SpencerFC',
    ], UK),
    wiki('cr_yt', 'Biggest YouTubers on Earth', '🌍', [
      'MrBeast||@MrBeast', 'PewDiePie||@PewDiePie', 'KSI||@KSI', 'Markiplier||@markiplier', 'Jacksepticeye||@jacksepticeye', 'Dude Perfect||@DudePerfect',
      'IShowSpeed||@IShowSpeed', 'Logan Paul||@loganpaulvlogs', 'Marques Brownlee|MKBHD|@mkbhd', 'Mark Rober||@MarkRober', 'Smosh||@smosh',
      'Dream (YouTuber)|Dream|@dream', 'DanTDM||@DanTDM', 'LazarBeam||@LazarBeam', 'Ryan Trahan||@ryan,@RyanTrahan', 'Kai Cenat||@KaiCenat',
      'Lilly Singh||@lilly,@IISuperwomanII', 'Linus Sebastian|Linus Tech Tips|@LinusTechTips', 'CarryMinati||@CarryMinati', 'Squeezie||@Squeezie',
      'ElRubius||@elrubiusOMG', 'Felipe Neto||@felipeneto', 'Whindersson Nunes||@whinderssonnunes', 'Luisito Comunica||@luisitocomunica',
      'Fernanfloo||@Fernanfloo', 'Vegetta777||@vegetta777', 'Zach King||@ZachKing', 'Khaby Lame||@KhabyLame', 'Bhuvan Bam|BB Ki Vines|@BBKiVines',
    ]),
    wiki('cr_sidemen', 'Sidemen & Friends', '⚪', [
      'KSI||@KSI', 'Simon Minter|Miniminter|@Miniminter', 'Josh Bradley|Zerkaa|@Zerkaa', 'Tobi Brown|TBJZL|@TBJZL', 'Ethan Payne|Behzinga|@Behzinga',
      'Vikkstar123||@Vikkstar123', 'Harry Lewis (YouTuber)|W2S|@W2S', 'Chunkz||@Chunkz', 'Yung Filly||@YungFilly', 'Calfreezy||@Calfreezy',
      'Danny Aarons||@DannyAarons', 'Niko Omilana||@NikoOmilana', 'Stephen Tries||@StephenTries', 'Angry Ginge||@AngryGinge13,@AngryGinge',
      'Max Fosh||@MaxFosh', 'Joe Weller||@JoeWeller', 'Harry Pinero||@HarryPinero', 'Manny (YouTuber)|Manny|@Manny',
    ], UK),
    wiki('cr_og', 'OG YouTube Legends', '📼', [
      'Smosh||@smosh', 'Ray William Johnson||@RayWilliamJohnson', 'Fred Figglehorn|Fred|@Fred', 'Shane Dawson||@shane', 'Jenna Marbles||@JennaMarbles',
      'Ryan Higa|nigahiga|@nigahiga', 'The Annoying Orange|Annoying Orange|@AnnoyingOrange', 'Epic Rap Battles of History||@ERB!', 'Dan and Phil|Dan & Phil|@DanAndPhilGAMES',
      'Zoe Sugg|Zoella|@zoella,@zoesugg', 'Michelle Phan||@MichellePhan', 'Bethany Mota||@BethanyMota', 'Tyler Oakley||@tyleroakley', 'Joey Graceffa||@JoeyGraceffa',
      'iJustine||@ijustine', 'Shaytards||@SHAYTARDS', 'Roman Atwood||@RomanAtwoodVlogs', 'Yogscast||@yogscast', 'Syndicate (YouTuber)|Syndicate|@TheSyndicateProject',
      'CaptainSparklez||@CaptainSparklez', 'Ali-A||@AliA', 'PewDiePie||@PewDiePie', 'KSI||@KSI', 'Philip DeFranco||@PhilipDeFranco', 'H3h3Productions|h3h3|@h3h3Productions',
    ]),
    wiki('cr_boxers', 'YouTuber Boxers', '🥊', [
      'KSI||@KSI', 'Logan Paul||@loganpaulvlogs', 'Jake Paul||@jakepaul', 'Joe Weller||@JoeWeller', 'Deji Olatunji|Deji|@Deji', 'AnEsonGib||@AnEsonGib',
      'Austin McBroom||@ACEFamily', 'Bryce Hall||@BryceHall', 'Slim Albaher|Slim|@slim', 'Salt Papi||@SaltPapi',
      'Viddal Riley||@ViddalRiley', 'Tayler Holder||@TaylerHolder', 'Faze Jarvis||@JarvisFaZe!', 'Swarmz||@Swarmz', 'Idris Virgo||@IdrisVirgo',
    ]),
  ],
  cr_live: [
    wiki('cr_stream', 'Streamers', '🟪', [
      'Ninja (gamer)|Ninja|tw:ninja,@Ninja', 'Shroud (gamer)|Shroud|tw:shroud', 'xQc||tw:xqc', 'Kai Cenat||tw:kaicenat', 'Pokimane||tw:pokimane',
      'Summit1g||tw:summit1g', 'TimTheTatman||tw:timthetatman', 'Dr Disrespect||@drdisrespect', 'Nickmercs||tw:nickmercs', 'SypherPK||tw:sypherpk',
      'Asmongold||tw:zackrawrr', 'HasanAbi||tw:hasanabi', 'Ludwig Ahgren|Ludwig|@ludwig,tw:ludwig', 'Valkyrae||@Valkyrae', 'Tarik (gamer)|Tarik|tw:tarik',
      'TenZ||tw:tenz', 'QTCinderella||tw:qtcinderella', 'Ironmouse||tw:ironmouse', 'Gawr Gura||@GawrGura', 'MoistCr1TiKaL||tw:moistcr1tikal,@penguinz0',
      'Jerma985||tw:jerma985', 'IShowSpeed||@IShowSpeed', 'Adin Ross||@adinross!', 'CaseOh||tw:caseoh_,@caseoh', 'Jynxzi||tw:jynxzi', 'Stable Ronaldo||tw:stableronaldo',
      'PlaqueBoyMax||tw:plaqueboymax', 'Sodapoppin||tw:sodapoppin', 'Lirik||tw:lirik', 'Emiru||tw:emiru', 'Sketch (streamer)|Sketch|tw:sketch',
    ], US),
    wiki('cr_vtubers', 'VTubers', '🎀', [
      'Gawr Gura||@GawrGura', 'Ironmouse||tw:ironmouse', 'Houshou Marine||@HoushouMarine!', 'Kizuna AI||@AIChannel', 'Mori Calliope||@MoriCalliope',
      'Pekora Usada|Usada Pekora|@usadapekora!', 'Shylily||tw:shylily', 'Filian||tw:filian', 'CodeMiko||tw:codemiko', 'Kson||@ksonONAIR', 'Nyanners||tw:nyanners',
      'Veibae||tw:veibae', 'Projekt Melody||tw:projektmelody', 'Hakos Baelz||@HakosBaelz', 'Takanashi Kiara||@TakanashiKiara', 'Ninomae Ina\'nis||@NinomaeInanis',
    ]),
  ],
  cr_niche: [
    wiki('cr_gaming', 'Gaming YouTubers', '🎮', [
      'PewDiePie||@PewDiePie', 'Markiplier||@markiplier', 'Jacksepticeye||@jacksepticeye', 'DanTDM||@DanTDM', 'Dream (YouTuber)|Dream|@dream',
      'TommyInnit||@TommyInnit', 'Technoblade||@Technoblade', 'GeorgeNotFound||@GeorgeNotFound', 'Sapnap||@sapnap', 'CaptainSparklez||@CaptainSparklez',
      'VanossGaming||@VanossGaming', 'PrestonPlayz|Preston|@PrestonPlayz', 'Unspeakable (YouTuber)|Unspeakable|@unspeakable', 'Aphmau||@Aphmau', 'SSundee||@SSundee',
      'Jelly (YouTuber)|Jelly|@Jelly', 'Muselk||@Muselk', 'LazarBeam||@LazarBeam', 'Ali-A||@AliA', 'CoryxKenshin||@CoryxKenshin', 'Sykkuno||@Sykkuno',
      'Jynxzi||@Jynxzi', 'Ninja (gamer)|Ninja|@Ninja', 'Vikkstar123||@Vikkstar123', 'Miniminter||@Miniminter', 'Kwebbelkop||@Kwebbelkop', 'Grian||@Grian',
    ]),
    wiki('cr_edu', 'Science & Tech YouTubers', '🔬', [
      'Mark Rober||@MarkRober', 'Veritasium||@veritasium', 'Vsauce||@Vsauce', 'Kurzgesagt||@kurzgesagt', 'Tom Scott (YouTuber)|Tom Scott|@TomScottGo',
      'Marques Brownlee|MKBHD|@mkbhd', 'Linus Sebastian|Linus Tech Tips|@LinusTechTips', 'SmarterEveryDay||@smartereveryday', 'CGP Grey||@CGPGrey',
      'Mrwhosetheboss||@Mrwhosetheboss', 'Unbox Therapy||@unboxtherapy', 'The Slow Mo Guys||@theslowmoguys', 'Michael Reeves||@MichaelReeves',
      'Vlogbrothers||@vlogbrothers', 'Steve Mould||@SteveMould', 'Johnny Harris||@johnnyharris', 'Colin Furze||@colinfurze', 'Stuff Made Here||@StuffMadeHere',
      'Wendover Productions||@Wendoverproductions', 'NileRed||@NileRed', 'Physics Girl||@physicsgirl',
      'Real Engineering||@RealEngineering', 'Hydraulic Press Channel||@HydraulicPressChannel',
    ]),
    wiki('cr_comedy', 'Comedy & Commentary', '😂', [
      'MoistCr1TiKaL|penguinz0|@penguinz0', 'Danny Gonzalez||@Danny-Gonzalez,@dannygonzalez', 'Kurtis Conner||@KurtisConner', 'Drew Gooden||@DrewGooden',
      'Cody Ko||@CodyKo', 'Eddy Burback||@eddyburback', 'Jarvis Johnson||@jarvis', 'Ryan George||@RyanGeorge', 'Gus Johnson||@GusJohnson',
      'Jaiden Animations||@JaidenAnimations', 'TheOdd1sOut||@theodd1sout', 'Sam and Colby|Sam & Colby|@SamandColby', 'Ryan Higa|nigahiga|@nigahiga',
      'Liza Koshy||@lizakoshy', 'Jenna Marbles||@JennaMarbles', 'Philip DeFranco||@PhilipDeFranco', 'H3h3Productions|h3h3|@h3h3Productions',
      'Smosh||@smosh', 'Danny Duncan||@dannyduncan69,@DannyDuncan', 'JiDion||@JiDion', 'Max Fosh||@MaxFosh', 'Jacksfilms||@jacksfilms', 'Internet Historian||@InternetHistorian',
      'Domics||@Domics', 'SomeOrdinaryGamers||@SomeOrdinaryGamers',
    ]),
    wiki('cr_food', 'Food YouTubers', '🍳', [
      'Joshua Weissman||@JoshuaWeissman', 'Babish Culinary Universe|Babish|@babishculinaryuniverse', 'Nick DiGiovanni||@NickDiGiovanni', 'Matt Stonie||@MattStonie',
      'Mythical Kitchen||@mythicalkitchen', 'Gordon Ramsay||@gordonramsay', 'Max the Meat Guy||@MaxTheMeatGuy', 'Sorted Food||@SortedFood', 'Nikocado Avocado||@NikocadoAvocado',
      'First We Feast|Hot Ones|@FirstWeFeast', 'Guga Foods||@GugaFoods', 'Matty Matheson||@MattyMatheson', 'Kenji López-Alt|J. Kenji López-Alt|@JKenjiLopezAlt',
      'Bon Appétit||@bonappetit', 'Nigel Ng|Uncle Roger|@mrnigelng',
    ]),
    wiki('cr_beauty', 'Beauty & Lifestyle', '💄', [
      'James Charles||@jamescharles', 'Jeffree Star||@jeffreestar', 'NikkieTutorials||@NikkieTutorials', 'Jackie Aina||@jackieaina', 'Emma Chamberlain||@emmachamberlain',
      'Safiya Nygaard', 'Bretman Rock||@bretmanrock', 'Michelle Phan||@MichellePhan', 'Zoe Sugg|Zoella|@zoella,@zoesugg', 'Patrick Starrr||@patrickstarrr',
      'Huda Kattan', 'Manny MUA||@MannyMua733', 'Tati Westbrook||@TatiWestbrook', 'Jaclyn Hill||@JaclynHill1', 'Bethany Mota||@BethanyMota',
      'Liza Koshy||@lizakoshy', 'Hyram||@Hyram', 'Alisha Marie||@AlishaMarie',
    ]),
    wiki('cr_kids', 'Kids YouTube', '🧸', [
      'Ryan Kaji|Ryan’s World|@RyansWorld', 'Cocomelon|CoComelon|@CoComelon', 'Blippi||@Blippi', 'Ms Rachel|Ms Rachel|@msrachel', 'Like Nastya||@LikeNastyaofficial',
      'Vlad and Niki||@VladandNiki', 'Kids Diana Show||@KidsDianaShow', 'Pinkfong||@Pinkfong', 'Unspeakable (YouTuber)|Unspeakable|@unspeakable',
      'PrestonPlayz|Preston|@PrestonPlayz', 'Aphmau||@Aphmau', 'DanTDM||@DanTDM', 'Dude Perfect||@DudePerfect', 'MrBeast||@MrBeast', 'Mark Rober||@MarkRober',
      'Toys and Me||@ToysAndMe', 'Super Simple Songs||@SuperSimpleSongs', 'Little Baby Bum||@LittleBabyBum', 'Sis vs Bro||@SISvsBRO',
    ]),
  ],
  cr_social: [
    wiki('cr_tiktok', 'TikTok Stars', '🎵', [
      'Khaby Lame||@KhabyLame', 'Charli D\'Amelio||@charlidamelio', 'Addison Rae', 'Bella Poarch||@BellaPoarch', 'Zach King||@ZachKing',
      'Dixie D\'Amelio', 'Spencer X||@SpencerX', 'Noah Beck', 'Loren Gray', 'Brent Rivera||@BrentRivera', 'Michael Le (social media personality)|Michael Le',
      'Avani Gregg', 'Josh Richards (internet personality)|Josh Richards', 'Chase Hudson|Lil Huddy', 'Alan Chikin Chow||@alanchikinchow!',
      'Kimberly Loaiza', 'Junya1gou|Junya|@junya1gou', 'Jason Derulo', 'Riyaz Aly',
      'Tabitha Brown', 'Keith Lee (food critic)|Keith Lee', 'Alix Earle', 'Druski', 'Bryce Hall||@BryceHall', 'Nessa Barrett', 'Dylan Mulvaney',
    ]),
    wiki('cr_pods', 'Podcasters', '🎙️', [
      'Joe Rogan', 'Alex Cooper (podcaster)|Alex Cooper', 'Theo Von', 'Andrew Schulz', 'Logan Paul||@loganpaulvlogs', 'Lex Fridman', 'Jay Shetty', 'Mel Robbins', 'Dax Shepard',
      'Conan O\'Brien', 'Charlamagne tha God', 'Shannon Sharpe', 'Joe Budden', 'Steven Bartlett (businessman)|Steven Bartlett', 'Marc Maron', 'Bill Simmons',
      'Emma Chamberlain||@emmachamberlain', 'Tim Ferriss', 'Andrew Huberman', 'Bobbi Althoff', 'Kylie Kelce', 'Jason Kelce', 'Travis Kelce', 'Pat McAfee',
      'Bert Kreischer', 'Tom Segura', 'Dan Le Batard', 'Hasan Piker|HasanAbi',
    ], US),
  ],
};

/* ======================= SPORTS (US) ======================= */
const SPORTS = {
  sp_amer_more: [
    wiki('a_nfl_now', 'NFL Stars Right Now', '🏈', ['Patrick Mahomes', 'Josh Allen (quarterback)|Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Jalen Hurts', 'Travis Kelce', 'Justin Jefferson', "Ja'Marr Chase", 'Tyreek Hill', 'CeeDee Lamb', 'Christian McCaffrey', 'Saquon Barkley', 'Derrick Henry', 'Micah Parsons', 'T. J. Watt', 'Myles Garrett', 'Nick Bosa', 'Jayden Daniels', 'C. J. Stroud', 'Puka Nacua', 'Amon-Ra St. Brown', 'Brock Purdy', 'Caleb Williams (quarterback)|Caleb Williams', 'Bijan Robinson', 'Jahmyr Gibbs', 'A. J. Brown', 'George Kittle', 'Sauce Gardner', 'Malik Nabers', 'Brian Thomas Jr.'], { ...US, league: 'nfl' }),
    wiki('a_nfl_qbs', 'Greatest Quarterbacks', '🎯', ['Tom Brady', 'Peyton Manning', 'Joe Montana', 'Dan Marino', 'John Elway', 'Brett Favre', 'Aaron Rodgers', 'Drew Brees', 'Patrick Mahomes', 'Johnny Unitas', 'Steve Young', 'Troy Aikman', 'Terry Bradshaw', 'Roger Staubach', 'Ben Roethlisberger', 'Eli Manning', 'Russell Wilson', 'Josh Allen (quarterback)|Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Michael Vick', 'Cam Newton', 'Philip Rivers', 'Matthew Stafford', 'Kurt Warner', 'Jim Kelly', 'Joe Namath'], { ...US, league: 'nfl' }),
    wiki('a_nfl_teams', 'NFL Teams', '🏈', ['Dallas Cowboys|Cowboys', 'Kansas City Chiefs|Chiefs', 'New England Patriots|Patriots', 'Green Bay Packers|Packers', 'Pittsburgh Steelers|Steelers', 'San Francisco 49ers|49ers', 'Philadelphia Eagles|Eagles', 'Buffalo Bills|Bills', 'Baltimore Ravens|Ravens', 'Las Vegas Raiders|Raiders', 'Chicago Bears|Bears', 'New York Giants|Giants', 'Miami Dolphins|Dolphins', 'Denver Broncos|Broncos', 'Seattle Seahawks|Seahawks', 'Detroit Lions|Lions', 'Cincinnati Bengals|Bengals', 'Los Angeles Rams|Rams', 'New York Jets|Jets', 'Minnesota Vikings|Vikings'], { ...US, img: 'logo' }),
    wiki('a_mlb_now', 'MLB Stars Right Now', '⚾', ['Shohei Ohtani', 'Aaron Judge', 'Mookie Betts', 'Juan Soto', 'Bryce Harper', 'Mike Trout', 'Ronald Acuña Jr.', 'Freddie Freeman', 'Fernando Tatís Jr.', 'Vladimir Guerrero Jr.', 'Corey Seager', 'Julio Rodríguez', 'Bobby Witt Jr.', 'Pete Alonso', 'Paul Skenes', 'Gerrit Cole', 'Elly De La Cruz', 'Kyle Tucker', 'José Ramírez', 'Yoshinobu Yamamoto', 'Gunnar Henderson', 'Francisco Lindor', 'Cal Raleigh', 'Jacob deGrom', 'Corbin Carroll', 'Tarik Skubal'], { ...US, league: 'mlb' }),
    wiki('a_mlb_teams', 'MLB Teams', '⚾', ['New York Yankees|Yankees', 'Boston Red Sox|Red Sox', 'Los Angeles Dodgers|Dodgers', 'Chicago Cubs|Cubs', 'San Francisco Giants|Giants', 'St. Louis Cardinals|Cardinals', 'Atlanta Braves|Braves', 'Houston Astros|Astros', 'New York Mets|Mets', 'Philadelphia Phillies|Phillies', 'Chicago White Sox|White Sox', 'Detroit Tigers|Tigers', 'Seattle Mariners|Mariners', 'Toronto Blue Jays|Blue Jays', 'San Diego Padres|Padres', 'Texas Rangers (baseball)|Rangers'], { ...US, img: 'logo' }),
    wiki('a_nhl', 'NHL Legends', '🏒', ['Wayne Gretzky', 'Mario Lemieux', 'Gordie Howe', 'Bobby Orr', 'Sidney Crosby', 'Alexander Ovechkin|Alex Ovechkin', 'Connor McDavid', 'Mark Messier', 'Jaromír Jágr', 'Patrick Roy', 'Martin Brodeur', 'Steve Yzerman', 'Maurice Richard', 'Nicklas Lidström', 'Joe Sakic', 'Auston Matthews', 'Nathan MacKinnon', 'Leon Draisaitl', 'Patrick Kane', 'Jonathan Toews', 'Henrik Lundqvist', 'Brett Hull', 'Teemu Selänne', 'Cale Makar'], { ...US, league: 'nhl' }),
    wiki('a_nhl_teams', 'NHL Teams', '🏒', ['Montreal Canadiens|Canadiens', 'Toronto Maple Leafs|Maple Leafs', 'Boston Bruins|Bruins', 'Chicago Blackhawks|Blackhawks', 'Detroit Red Wings|Red Wings', 'New York Rangers|Rangers', 'Pittsburgh Penguins|Penguins', 'Edmonton Oilers|Oilers', 'Vegas Golden Knights|Golden Knights', 'Colorado Avalanche|Avalanche', 'Tampa Bay Lightning|Lightning', 'Philadelphia Flyers|Flyers', 'Florida Panthers|Panthers', 'Los Angeles Kings|Kings', 'Washington Capitals|Capitals', 'Vancouver Canucks|Canucks'], { ...US, img: 'logo' }),
    wiki('a_wnba', 'WNBA Stars', '🏀', ['Caitlin Clark', "A'ja Wilson", 'Breanna Stewart', 'Sabrina Ionescu', 'Diana Taurasi', 'Sue Bird', 'Candace Parker', 'Angel Reese', 'Paige Bueckers', 'Napheesa Collier', 'Lisa Leslie', 'Maya Moore', 'Brittney Griner', 'Kelsey Plum', 'Jewell Loyd', 'Arike Ogunbowale', 'Alyssa Thomas', 'Aliyah Boston', 'Cameron Brink', 'Sheryl Swoopes', 'Elena Delle Donne', 'Nneka Ogwumike', 'Jonquel Jones', 'Kahleah Copper'], { ...US, league: 'wnba' }),
    wiki('a_college', 'College Football Powerhouses', '🏟️', ['Alabama Crimson Tide football|Alabama', 'Ohio State Buckeyes football|Ohio State', 'Georgia Bulldogs football|Georgia', 'Michigan Wolverines football|Michigan', 'Texas Longhorns football|Texas', 'Notre Dame Fighting Irish football|Notre Dame', 'LSU Tigers football|LSU', 'Clemson Tigers football|Clemson', 'USC Trojans football|USC', 'Oklahoma Sooners football|Oklahoma', 'Florida Gators football|Florida', 'Penn State Nittany Lions football|Penn State', 'Oregon Ducks football|Oregon', 'Tennessee Volunteers football|Tennessee', 'Auburn Tigers football|Auburn', 'Miami Hurricanes football|Miami', 'Nebraska Cornhuskers football|Nebraska', 'Florida State Seminoles football|Florida State', 'Texas A&M Aggies football|Texas A&M', 'Wisconsin Badgers football|Wisconsin'], { ...US, img: 'logo' }),
    wiki('a_teamusa', 'Team USA Olympians', '🥇', ['Michael Phelps', 'Simone Biles', 'Katie Ledecky', 'Carl Lewis', 'Jesse Owens', 'Allyson Felix', 'Florence Griffith Joyner', 'Shaun White', 'Caeleb Dressel', "Sha'Carri Richardson", 'Noah Lyles', 'Mary Lou Retton', 'Jackie Joyner-Kersee', 'Apolo Ohno', 'Lindsey Vonn', 'Mikaela Shiffrin', 'Gabby Douglas', 'Suni Lee', 'Missy Franklin', 'Ryan Lochte', 'Greg Louganis', 'Chloe Kim', 'Michael Johnson (sprinter)|Michael Johnson', 'Eric Heiden'], US),
    wiki('c_wwe_now', 'WWE Superstars Now', '💪', ['Roman Reigns', 'Cody Rhodes', 'Seth Rollins', 'CM Punk', 'Rhea Ripley', 'Bianca Belair', 'Gunther (wrestler)|Gunther', 'Jey Uso', 'LA Knight', 'Randy Orton', 'John Cena', 'Becky Lynch', 'Charlotte Flair', 'Drew McIntyre', 'Logan Paul', 'Bron Breakker', 'Jade Cargill', 'Iyo Sky', 'Damian Priest', 'Sami Zayn', 'Kevin Owens', 'Liv Morgan', 'Solo Sikoa', 'Jacob Fatu', 'Tiffany Stratton', 'Dominik Mysterio'], US),
  ],
};

/* ======================= FOOD (US) ======================= */
const FOOD = {
  fd_us: [
    wiki('fd_us_fast', 'American Fast Food', '🍔', ["McDonald's", 'Burger King', "Wendy's", 'Taco Bell', 'Chick-fil-A', 'Popeyes', 'In-N-Out Burger', 'Whataburger', 'Sonic Drive-In|Sonic', "Arby's", 'Jack in the Box', "Carl's Jr.", 'Dairy Queen', "Culver's", "Raising Cane's Chicken Fingers|Raising Cane's", 'Panda Express', 'Chipotle Mexican Grill|Chipotle', 'Five Guys', 'Shake Shack', 'White Castle (restaurant)|White Castle', 'Del Taco', "Zaxby's", 'Wingstop', "Jersey Mike's Subs|Jersey Mike's", 'Subway (restaurant)|Subway', 'KFC', "Steak 'n Shake", 'Firehouse Subs', "Hardee's"], { ...US, img: 'logo' }),
    wiki('fd_us_sit', 'Restaurant Chains', '🍽️', ['Olive Garden', 'Texas Roadhouse', "Applebee's", "Chili's", 'Red Lobster', 'IHOP', "Denny's", 'The Cheesecake Factory', 'Buffalo Wild Wings', 'Outback Steakhouse', 'Cracker Barrel', 'Waffle House', 'TGI Fridays', 'Hooters', 'Red Robin', "P. F. Chang's", 'LongHorn Steakhouse', 'Golden Corral', 'Panera Bread', 'Benihana', "Dave & Buster's", 'Hard Rock Cafe', 'Bob Evans Restaurants|Bob Evans', 'Ruth\'s Chris Steak House|Ruth\'s Chris'], { ...US, img: 'logo' }),
    wiki('fd_pizza_chains', 'Pizza Chains', '🍕', ["Domino's|Domino's", 'Pizza Hut', "Papa John's", 'Little Caesars', "Papa Murphy's", "Marco's Pizza", 'Sbarro', 'Chuck E. Cheese', 'California Pizza Kitchen', 'Round Table Pizza', "Hungry Howie's Pizza|Hungry Howie's", 'Blaze Pizza', 'MOD Pizza', 'Cicis', 'PizzaExpress', 'Pizza Inn', "Godfather's Pizza", 'Uno Pizzeria & Grill|Uno', "Jet's Pizza", 'Papa Gino\'s'], { img: 'logo' }),
    wiki('fd_coffee', 'Coffee & Donut Chains', '☕', ['Starbucks', "Dunkin' Donuts|Dunkin'", 'Tim Hortons', 'Krispy Kreme', 'Dutch Bros. Coffee|Dutch Bros', "Peet's Coffee", 'Caribou Coffee', 'Costa Coffee', 'Pret a Manger', 'Caffè Nero', 'The Coffee Bean & Tea Leaf', "Scooter's Coffee", 'Blue Bottle Coffee', 'Philz Coffee', 'Greggs', 'Shipley Do-Nuts', 'Black Sheep Coffee', 'Gail\'s Bakery|Gail\'s'], { img: 'logo' }),
    wiki('fd_us_candy', 'American Candy', '🍭', ["Reese's Peanut Butter Cups|Reese's", 'Hershey bar|Hershey\'s Bar', 'Snickers', 'Twix', "M&M's", 'Skittles (confectionery)|Skittles', 'Starburst (confectionery)|Starburst', 'Sour Patch Kids', 'Swedish Fish', 'Twizzlers', 'Jolly Rancher', 'Butterfinger', 'Baby Ruth', '3 Musketeers (chocolate bar)|3 Musketeers', 'Almond Joy', 'Kit Kat', 'Nerds (candy)|Nerds', 'Airheads (candy)|Airheads', 'Laffy Taffy', 'Tootsie Roll', 'Warheads (candy)|Warheads', 'PayDay (candy)|PayDay', "Hershey's Kisses", 'Whoppers (candy)|Whoppers', 'Milk Duds', 'Junior Mints', 'Mike and Ike', 'Peeps', 'Ring Pop', 'Pop Rocks', 'Fun Dip', 'Pixy Stix'], US),
    wiki('fd_us_snacks', 'American Snacks', '🥨', ['Doritos', 'Cheetos', "Lay's", 'Pringles', 'Fritos', 'Funyuns', 'Takis', 'Goldfish (cracker)|Goldfish', 'Cheez-It', 'Ritz Crackers', 'Oreo', 'Chips Ahoy!', 'Pop-Tarts', 'Twinkie|Twinkies', 'Little Debbie', 'Hot Pockets', 'Ruffles', 'Tostitos', 'SunChips', 'Combos (snack food)|Combos', 'Bugles (snack)|Bugles', 'Smartfood', 'Rice Krispies Treats', 'Fruit by the Foot', 'Gushers', 'Fruit Roll-Ups', 'Lunchables', 'Uncrustables', 'Teddy Grahams', 'Nutter Butter', 'Chex Mix'], US),
    wiki('fd_us_soda', 'American Sodas', '🥤', ['Coca-Cola', 'Pepsi', 'Dr Pepper', 'Mountain Dew', 'Sprite (drink)|Sprite', 'A&W Root Beer', "Barq's", 'Canada Dry', 'Sunkist (soft drink)|Sunkist', 'Fanta', '7 Up', 'Crush (soft drink)|Crush', 'Big Red (soft drink)|Big Red', 'Mug Root Beer', 'Cheerwine', 'Fresca', 'Pibb Xtra', 'Diet Coke', 'Coca-Cola Zero Sugar|Coke Zero', 'Squirt (soft drink)|Squirt', 'Faygo', 'Vernors', 'RC Cola', 'Jones Soda', 'Starry (soft drink)|Starry', 'Olipop'], US),
    wiki('fd_icecream', 'Ice Cream Brands', '🍦', ["Ben & Jerry's", 'Häagen-Dazs', 'Baskin-Robbins', 'Dairy Queen', "Breyers", 'Blue Bell Creameries|Blue Bell', 'Cold Stone Creamery', 'Magnum (ice cream)|Magnum', 'Carvel (franchise)|Carvel', 'Klondike bar', 'Drumstick (ice cream)|Drumstick', 'Halo Top', "Wall's (ice cream)|Wall's", 'Cornetto', 'Mister Softee', 'Good Humor', "Dippin' Dots", 'Talenti', 'Tillamook County Creamery Association|Tillamook'], { img: 'logo' }),
    wiki('fd_us_food', 'American Classics', '🌭', ['Hamburger', 'Hot dog', 'Buffalo wing', 'Macaroni and cheese', 'Apple pie', 'Fried chicken', 'Cheesesteak', 'Clam chowder', 'Chicago-style pizza', 'New York–style pizza', 'Biscuits and gravy', 'Grits', 'Cornbread', 'Pancake', 'Chili con carne', 'Corn dog', 'Lobster roll', 'Reuben sandwich', 'Gumbo', 'Jambalaya', "S'more", 'Chocolate brownie', 'Cheesecake', 'Pecan pie', 'Key lime pie', 'Meatloaf', 'Tater tots', 'Nachos', 'Po\' boy', 'Chicken and waffles', 'Pulled pork'], US),
  ],
  fd_uk: [
    wiki('fd_uk_food', 'British Classics', '🇬🇧', ['Fish and chips', 'Full breakfast|Full English', 'Sunday roast', 'Yorkshire pudding', 'Shepherd\'s pie', 'Bangers and mash', 'Toad in the hole', 'Beef Wellington', 'Cornish pasty', 'Sausage roll', 'Scotch egg', 'Chicken tikka masala', 'Ploughman\'s lunch', 'Haggis', 'Welsh rarebit', 'Pie and mash', 'Beans on toast', 'Black pudding', 'Sticky toffee pudding', 'Eton mess', 'Victoria sponge cake|Victoria sponge', 'Scone', 'Crumpet', 'Spotted dick', 'Trifle', 'Bakewell tart', 'Jaffa Cakes'], UK),
  ],
};

/* ======================= TV (US) ======================= */
const TV = {
  tv_us: [
    shows('tc_network', 'Network TV Hits', '📡', ["Grey's Anatomy", 'NCIS', 'Law & Order: Special Victims Unit', 'The Big Bang Theory', 'ER|1994', 'House|2004', 'Lost|2004', 'Desperate Housewives', 'How I Met Your Mother', 'Criminal Minds', 'CSI: Crime Scene Investigation', 'This Is Us', 'Modern Family', 'Two and a Half Men', '24|2001', 'Prison Break', 'The X-Files|1993', 'Bones|2005', 'Supernatural|2005', 'Glee', 'The Good Wife', 'Heroes|2006', 'Chicago Fire', '9-1-1', 'Abbott Elementary', 'Brooklyn Nine-Nine', 'Scrubs', 'Friday Night Lights'], US),
    shows('tc_teen', 'Teen Dramas', '💔', ['Gossip Girl|2007', 'The O.C.', 'One Tree Hill', "Dawson's Creek", 'Riverdale', 'Euphoria|2019', '13 Reasons Why', 'Pretty Little Liars|2010', 'The Vampire Diaries', 'Skins|2007', 'Outer Banks', 'Never Have I Ever', 'Elite', 'Sex Education', 'Gilmore Girls', 'Beverly Hills, 90210', 'Degrassi: The Next Generation', 'Veronica Mars', 'Wednesday', 'The Summer I Turned Pretty', 'Heartstopper', 'Smallville', 'Buffy the Vampire Slayer', 'Teen Wolf|2011', 'Stranger Things']),
    shows('tc_ushits', 'Prestige US TV', '🏆', ['Breaking Bad', 'The Sopranos', 'The Wire', 'Mad Men', 'Better Call Saul', 'Succession', 'The Bear', 'Severance', 'The Last of Us|2023', 'Yellowstone|2018', 'True Detective', 'Westworld', 'Ozark', 'The White Lotus', 'Fargo|2014', 'Boardwalk Empire', 'Dexter', 'Homeland', 'Mindhunter', 'The Leftovers', 'Shōgun|2024', 'The Pitt', 'Euphoria|2019', 'Six Feet Under', 'Deadwood']),
    people('tc_late', 'Late-Night & Talk Hosts', '🌙', ['Jimmy Fallon', 'Jimmy Kimmel', 'Stephen Colbert', "Conan O'Brien", 'David Letterman', 'Jay Leno', 'Johnny Carson', 'Seth Meyers', 'James Corden', 'Trevor Noah', 'John Oliver', 'Graham Norton', 'Jon Stewart', 'Oprah Winfrey', 'Ellen DeGeneres', 'Kelly Clarkson', 'Drew Barrymore', 'Craig Ferguson', 'Arsenio Hall', 'Jonathan Ross', 'Andy Cohen', 'Bill Maher', 'Taylor Tomlinson', 'Jennifer Hudson'], US),
    people('tc_snl', 'SNL Legends', '🎤', ['Will Ferrell', 'Eddie Murphy', 'Bill Murray', 'Tina Fey', 'Amy Poehler', 'Adam Sandler', 'Chris Farley', 'Kristen Wiig', 'Andy Samberg', 'Kate McKinnon', 'Dan Aykroyd', 'John Belushi', 'Chevy Chase', 'Mike Myers', 'Dana Carvey', 'Phil Hartman', 'Jimmy Fallon', 'Maya Rudolph', 'Bill Hader', 'Pete Davidson', 'Kenan Thompson', 'Seth Meyers', 'Chris Rock', 'David Spade', 'Molly Shannon', 'Cecily Strong', 'Bowen Yang', 'Gilda Radner', 'Fred Armisen', 'Will Forte', 'Jason Sudeikis'], US),
    shows('tc_usreal', 'US Reality TV', '🌴', ['Keeping Up with the Kardashians', 'The Bachelor|2002', 'Survivor|2000', 'The Real Housewives of Beverly Hills', 'Jersey Shore', 'The Amazing Race', 'Big Brother|2000', 'American Idol', 'The Voice|2011', 'Love Island|2019', 'Vanderpump Rules', 'Queer Eye|2018', "RuPaul's Drag Race", 'Selling Sunset', 'Love Is Blind', 'Too Hot to Handle', 'The Kardashians', 'Duck Dynasty', 'Pawn Stars', 'Shark Tank', 'Cake Boss', 'The Simple Life', 'Laguna Beach: The Real Orange County', 'The Hills', 'Dance Moms', "Hell's Kitchen|2005", 'The Apprentice|2004', 'Squid Game: The Challenge', 'Beast Games'], US),
    shows('tc_kids', 'Preschool Favourites', '🧩', ['Sesame Street', 'Arthur|1996', 'Barney & Friends', "Blue's Clues", 'Dora the Explorer', 'Bluey|2018', 'Peppa Pig', 'PAW Patrol', 'Thomas & Friends', 'Teletubbies', "Mister Rogers' Neighborhood", 'Curious George|2006', 'Clifford the Big Red Dog|2000', 'The Magic School Bus', "Daniel Tiger's Neighborhood", 'Bob the Builder|1998', 'The Wiggles', 'Mickey Mouse Clubhouse', 'Doc McStuffins', 'Bubble Guppies', 'Wild Kratts', 'Hey Duggee', 'In the Night Garden...', 'Octonauts', 'Ms. Rachel']),
    shows('tc_00s', '2000s TV Nostalgia', '📟', ['The O.C.', 'Lost|2004', 'Smallville', 'Malcolm in the Middle', 'Gilmore Girls', 'Desperate Housewives', 'Prison Break', 'Heroes|2006', 'Scrubs', 'Entourage', 'The Office|2005', 'Arrested Development', 'My Name Is Earl', 'Everybody Hates Chris', 'That \'70s Show', 'Hannah Montana', 'iCarly|2007', 'Drake & Josh', 'The Suite Life of Zack & Cody', 'Lizzie McGuire', 'Ugly Betty', 'Gossip Girl|2007', 'One Tree Hill', '24|2001', 'Pimp My Ride']),
  ],
};

/* ======================= MOVIES (US) ======================= */
const MOVIES = {
  m_actors: [
    films('fa_sandler', 'Adam Sandler Films', '🏌️', ['Billy Madison|1995', 'Happy Gilmore|1996', 'The Wedding Singer|1998', 'The Waterboy|1998', 'Big Daddy|1999', 'Mr. Deeds|2002', 'Anger Management|2003', '50 First Dates|2004', 'The Longest Yard|2005', 'Click|2006', 'I Now Pronounce You Chuck & Larry|2007', "You Don't Mess with the Zohan|2008", 'Grown Ups|2010', 'Just Go with It|2011', 'Jack and Jill|2011', 'Hotel Transylvania|2012', 'Pixels|2015', 'Murder Mystery|2019', 'Uncut Gems|2019', 'Hubie Halloween|2020', 'Hustle|2022', 'Happy Gilmore 2|2025']),
    films('fa_carrey', 'Jim Carrey Films', '🤪', ['Ace Ventura: Pet Detective|1994', 'The Mask|1994', 'Dumb and Dumber|1994', 'Ace Ventura: When Nature Calls|1995', 'Batman Forever|1995', 'The Cable Guy|1996', 'Liar Liar|1997', 'The Truman Show|1998', 'Man on the Moon|1999', 'Me, Myself & Irene|2000', 'How the Grinch Stole Christmas|2000', 'Bruce Almighty|2003', 'Eternal Sunshine of the Spotless Mind|2004', "Lemony Snicket's A Series of Unfortunate Events|2004", 'Fun with Dick and Jane|2005', 'Yes Man|2008', 'A Christmas Carol|2009', "Mr. Popper's Penguins|2011", 'Sonic the Hedgehog|2020', 'Sonic the Hedgehog 3|2024']),
    films('fa_ferrell', 'Will Ferrell Films', '🎺', ['A Night at the Roxbury|1998', 'Zoolander|2001', 'Old School|2003', 'Elf|2003', 'Anchorman: The Legend of Ron Burgundy|2004', 'Kicking & Screaming|2005', 'Talladega Nights: The Ballad of Ricky Bobby|2006', 'Stranger Than Fiction|2006', 'Blades of Glory|2007', 'Semi-Pro|2008', 'Step Brothers|2008', 'Land of the Lost|2009', 'The Other Guys|2010', 'Megamind|2010', 'The Campaign|2012', 'Anchorman 2: The Legend Continues|2013', 'Get Hard|2015', "Daddy's Home|2015", 'Holmes & Watson|2018', 'Eurovision Song Contest: The Story of Fire Saga|2020', 'Spirited|2022', 'Barbie|2023']),
    films('fa_leo', 'Leonardo DiCaprio Films', '🚢', ["What's Eating Gilbert Grape|1993", 'Romeo + Juliet|1996', 'Titanic|1997', 'The Man in the Iron Mask|1998', 'The Beach|2000', 'Catch Me If You Can|2002', 'Gangs of New York|2002', 'The Aviator|2004', 'The Departed|2006', 'Blood Diamond|2006', 'Revolutionary Road|2008', 'Shutter Island|2010', 'Inception|2010', 'Django Unchained|2012', 'The Great Gatsby|2013', 'The Wolf of Wall Street|2013', 'The Revenant|2015', 'Once Upon a Time... in Hollywood|2019', "Don't Look Up|2021", 'Killers of the Flower Moon|2023', 'One Battle After Another|2025']),
    films('fa_cruise', 'Tom Cruise Films', '✈️', ['Risky Business|1983', 'Top Gun|1986', 'The Color of Money|1986', 'Cocktail|1988', 'Rain Man|1988', 'Born on the Fourth of July|1989', 'Days of Thunder|1990', 'A Few Good Men|1992', 'The Firm|1993', 'Interview with the Vampire|1994', 'Mission: Impossible|1996', 'Jerry Maguire|1996', 'Eyes Wide Shut|1999', 'Magnolia|1999', 'Vanilla Sky|2001', 'Minority Report|2002', 'The Last Samurai|2003', 'Collateral|2004', 'War of the Worlds|2005', 'Tropic Thunder|2008', 'Edge of Tomorrow|2014', 'Mission: Impossible - Fallout|2018', 'Top Gun: Maverick|2022', 'Mission: Impossible - The Final Reckoning|2025']),
    films('fa_denzel', 'Denzel Washington Films', '🎖️', ['Glory|1989', 'Malcolm X|1992', 'Philadelphia|1993', 'The Pelican Brief|1993', 'Crimson Tide|1995', 'The Hurricane|1999', 'Remember the Titans|2000', 'Training Day|2001', 'John Q|2002', 'Man on Fire|2004', 'Inside Man|2006', 'Déjà Vu|2006', 'American Gangster|2007', 'The Book of Eli|2010', 'Unstoppable|2010', 'Flight|2012', 'Safe House|2012', 'The Equalizer|2014', 'Fences|2016', 'The Equalizer 2|2018', 'The Equalizer 3|2023', 'Gladiator II|2024']),
    films('fa_rock', 'Dwayne Johnson Films', '💪', ['The Scorpion King|2002', 'The Rundown|2003', 'Walking Tall|2004', 'The Game Plan|2007', 'Fast Five|2011', 'Journey 2: The Mysterious Island|2012', 'Pain & Gain|2013', 'Hercules|2014', 'San Andreas|2015', 'Central Intelligence|2016', 'Moana|2016', 'Jumanji: Welcome to the Jungle|2017', 'Baywatch|2017', 'Rampage|2018', 'Skyscraper|2018', 'Fighting with My Family|2019', 'Hobbs & Shaw|2019', 'Jungle Cruise|2021', 'Red Notice|2021', 'Black Adam|2022', 'Red One|2024', 'The Smashing Machine|2025']),
    films('fa_wsmith', 'Will Smith Films', '🕶️', ['Bad Boys|1995', 'Independence Day|1996', 'Men in Black|1997', 'Enemy of the State|1998', 'Wild Wild West|1999', 'Ali|2001', 'Men in Black II|2002', 'Bad Boys II|2003', 'I, Robot|2004', 'Shark Tale|2004', 'Hitch|2005', 'The Pursuit of Happyness|2006', 'I Am Legend|2007', 'Hancock|2008', 'Seven Pounds|2008', 'Men in Black 3|2012', 'Focus|2015', 'Suicide Squad|2016', 'Aladdin|2019', 'Bad Boys for Life|2020', 'King Richard|2021', 'Bad Boys: Ride or Die|2024']),
    films('fa_keanu', 'Keanu Reeves Films', '🕴️', ["Bill & Ted's Excellent Adventure|1989", 'Point Break|1991', "Bram Stoker's Dracula|1992", 'Speed|1994', 'Johnny Mnemonic|1995', "The Devil's Advocate|1997", 'The Matrix|1999', 'The Matrix Reloaded|2003', "Something's Gotta Give|2003", 'Constantine|2005', 'The Lake House|2006', 'John Wick|2014', 'John Wick: Chapter 2|2017', 'John Wick: Chapter 3 - Parabellum|2019', 'Always Be My Maybe|2019', 'Toy Story 4|2019', 'The Matrix Resurrections|2021', 'John Wick: Chapter 4|2023']),
    films('fa_hanks', 'Tom Hanks Films', '🏐', ['Big|1988', 'A League of Their Own|1992', 'Sleepless in Seattle|1993', 'Philadelphia|1993', 'Forrest Gump|1994', 'Apollo 13|1995', 'Toy Story|1995', 'Saving Private Ryan|1998', "You've Got Mail|1998", 'The Green Mile|1999', 'Cast Away|2000', 'Road to Perdition|2002', 'Catch Me If You Can|2002', 'The Terminal|2004', 'The Polar Express|2004', 'The Da Vinci Code|2006', 'Captain Phillips|2013', 'Saving Mr. Banks|2013', 'Bridge of Spies|2015', 'Sully|2016', 'The Post|2017', 'Elvis|2022', 'A Man Called Otto|2022']),
    films('fa_eddie', 'Eddie Murphy Films', '😆', ['48 Hrs.|1982', 'Trading Places|1983', 'Beverly Hills Cop|1984', 'The Golden Child|1986', 'Beverly Hills Cop II|1987', 'Coming to America|1988', 'Boomerang|1992', 'The Nutty Professor|1996', 'Mulan|1998', 'Doctor Dolittle|1998', 'Life|1999', 'Bowfinger|1999', 'Shrek|2001', 'Daddy Day Care|2003', 'The Haunted Mansion|2003', 'Dreamgirls|2006', 'Norbit|2007', 'Tower Heist|2011', 'Dolemite Is My Name|2019', 'Coming 2 America|2021', 'Beverly Hills Cop: Axel F|2024']),
    films('fa_bullock', 'Sandra Bullock Films', '💫', ['Demolition Man|1993', 'Speed|1994', 'While You Were Sleeping|1995', 'The Net|1995', 'A Time to Kill|1996', 'Hope Floats|1998', 'Practical Magic|1998', 'Miss Congeniality|2000', 'Two Weeks Notice|2002', 'Crash|2004', 'The Lake House|2006', 'The Proposal|2009', 'The Blind Side|2009', 'The Heat|2013', 'Gravity|2013', 'Minions|2015', "Ocean's 8|2018", 'Bird Box|2018', 'The Lost City|2022', 'Bullet Train|2022']),
  ],
  m_lists_more: [
    films('l_dcom', 'Disney Channel Movies', '🎤', ['High School Musical|2006', 'High School Musical 2|2007', 'Camp Rock|2008', 'Halloweentown|1998', 'Zombies|2018', 'Descendants|2015', 'The Cheetah Girls|2003', 'Twitches|2005', 'Cadet Kelly|2002', 'Lemonade Mouth|2011', 'Teen Beach Movie|2013', 'StarStruck|2010', 'Read It and Weep|2006', 'Johnny Tsunami|1999', 'Smart House|1999', 'Zenon: Girl of the 21st Century|1999', 'Jump In!|2007', 'Princess Protection Program|2009', 'Wizards of Waverly Place: The Movie|2009', 'Life-Size|2000', 'Hannah Montana: The Movie|2009', 'High School Musical 3: Senior Year|2008'], US),
    films('l_uscom', 'Comedy Classics', '🤣', ['Superbad|2007', 'Step Brothers|2008', 'The Hangover|2009', 'Anchorman: The Legend of Ron Burgundy|2004', 'Bridesmaids|2011', 'Napoleon Dynamite|2004', 'Mean Girls|2004', 'Dumb and Dumber|1994', 'Office Space|1999', 'Tropic Thunder|2008', 'Zoolander|2001', 'Wedding Crashers|2005', 'Old School|2003', 'The 40-Year-Old Virgin|2005', 'Knocked Up|2007', 'Pineapple Express|2008', 'Ghostbusters|1984', 'Airplane!|1980', 'Groundhog Day|1993', 'Caddyshack|1980', 'Borat|2006', '21 Jump Street|2012', 'White Chicks|2004', 'Friday|1995', 'Dodgeball: A True Underdog Story|2004', 'Happy Gilmore|1996', 'Elf|2003']),
    films('l_halloween', 'Halloween Movies', '🎃', ['Hocus Pocus|1993', 'Halloweentown|1998', 'The Nightmare Before Christmas|1993', 'Beetlejuice|1988', 'Ghostbusters|1984', 'Casper|1995', 'Coraline|2009', 'Practical Magic|1998', 'Scream|1996', 'Halloween|1978', 'The Addams Family|1991', 'ParaNorman|2012', 'Monster House|2006', "Trick 'r Treat|2007", 'Corpse Bride|2005', 'Goosebumps|2015', 'Edward Scissorhands|1990', 'Sleepy Hollow|1999', 'Hubie Halloween|2020', 'Gremlins|1984', 'The Craft|1996', 'Frankenweenie|2012', 'Hotel Transylvania|2012']),
    films('l_musicals', 'Movie Musicals', '🎶', ['The Greatest Showman|2017', 'La La Land|2016', 'Grease|1978', 'Mamma Mia!|2008', 'Les Misérables|2012', 'The Sound of Music|1965', 'Chicago|2002', 'West Side Story|1961', 'Hairspray|2007', 'Moulin Rouge!|2001', 'Wicked|2024', 'Wicked: For Good|2025', 'Dreamgirls|2006', 'Rocketman|2019', 'Bohemian Rhapsody|2018', 'Elvis|2022', 'Pitch Perfect|2012', 'A Star Is Born|2018', 'Into the Woods|2014', 'Mary Poppins|1964', 'The Wizard of Oz|1939', "Singin' in the Rain|1952", 'Dirty Dancing|1987', 'Footloose|1984', 'The Phantom of the Opera|2004']),
    films('fr_trek', 'Star Trek Films', '🖖', ['Star Trek: The Motion Picture|1979', 'Star Trek II: The Wrath of Khan|1982', 'Star Trek III: The Search for Spock|1984', 'Star Trek IV: The Voyage Home|1986', 'Star Trek V: The Final Frontier|1989', 'Star Trek VI: The Undiscovered Country|1991', 'Star Trek: Generations|1994', 'Star Trek: First Contact|1996', 'Star Trek: Insurrection|1998', 'Star Trek: Nemesis|2002', 'Star Trek|2009', 'Star Trek Into Darkness|2013', 'Star Trek Beyond|2016']),
    films('l_2000s', '2000s Blockbusters', '📀', ['Gladiator|2000', 'Shrek|2001', 'The Lord of the Rings: The Fellowship of the Ring|2001', "Harry Potter and the Philosopher's Stone|2001", 'Spider-Man|2002', 'Pirates of the Caribbean: The Curse of the Black Pearl|2003', 'Finding Nemo|2003', 'The Incredibles|2004', 'Batman Begins|2005', 'Casino Royale|2006', 'Transformers|2007', 'The Dark Knight|2008', 'Iron Man|2008', 'Avatar|2009', 'The Hangover|2009', 'Up|2009', 'The Bourne Ultimatum|2007', 'Mean Girls|2004', 'National Treasure|2004', 'Night at the Museum|2006', 'Kung Fu Panda|2008', 'Twilight|2008', 'I Am Legend|2007', 'The Matrix Reloaded|2003']),
  ],
};

/* ======================= CELEBS (US) ======================= */
const ACTORS = {
  a_more: [
    people('a_reality', 'Reality Stars', '💅', ['Kim Kardashian', 'Kylie Jenner', 'Kendall Jenner', 'Khloé Kardashian', 'Kourtney Kardashian', 'Kris Jenner', 'Paris Hilton', 'Nicole Richie', 'Nicole Polizzi|Snooki', 'Mike Sorrentino|The Situation', 'Lisa Vanderpump', 'Bethenny Frankel', 'Lauren Conrad', 'Spencer Pratt', 'Chrishell Stause', 'Teresa Giudice', 'NeNe Leakes', 'Kandi Burruss', 'Andy Cohen', 'Joey Essex', 'Gemma Collins', 'Molly-Mae Hague', 'Tyler Cameron'], US),
    people('a_standup', 'Stand-Up Comedians', '🎙️', ['Dave Chappelle', 'Chris Rock', 'Kevin Hart', 'Eddie Murphy', 'Richard Pryor', 'George Carlin', 'Robin Williams', 'Jerry Seinfeld', 'Bill Burr', 'Ali Wong', 'John Mulaney', 'Jim Gaffigan', 'Sebastian Maniscalco', 'Ricky Gervais', 'Trevor Noah', 'Hasan Minhaj', 'Tom Segura', 'Matt Rife', 'Nate Bargatze', 'Gabriel Iglesias', 'Steve Martin', 'Joan Rivers', 'Bernie Mac', 'Amy Schumer', 'Sarah Silverman', 'Taylor Tomlinson', 'Jimmy Carr', 'Michael McIntyre', 'Peter Kay']),
    people('a_disney', 'Disney Channel Stars', '🐭', ['Miley Cyrus', 'Selena Gomez', 'Demi Lovato', 'Zac Efron', 'Vanessa Hudgens', 'Ashley Tisdale', 'Hilary Duff', 'Raven-Symoné', 'Shia LaBeouf', 'Zendaya', 'Dove Cameron', 'Sabrina Carpenter', 'Olivia Rodrigo', 'Joe Jonas', 'Nick Jonas', 'Bella Thorne', 'Debby Ryan', 'Cole Sprouse', 'Dylan Sprouse', 'Brenda Song', 'Emily Osment', 'Bridgit Mendler', 'China Anne McClain', 'Ross Lynch', 'Sofia Carson', 'Jenna Ortega', 'Corbin Bleu', 'Lucas Grabeel'], US),
    people('a_legends', 'Hollywood Legends', '🎞️', ['Marilyn Monroe', 'Audrey Hepburn', 'James Dean', 'Marlon Brando', 'Humphrey Bogart', 'Elizabeth Taylor', 'Cary Grant', 'Grace Kelly', 'Clark Gable', 'Judy Garland', 'Paul Newman', 'Jack Nicholson', 'Al Pacino', 'Robert De Niro', 'Meryl Streep', 'Katharine Hepburn', 'John Wayne', 'Clint Eastwood', 'Sophia Loren', 'Charlie Chaplin', 'Fred Astaire', 'Gene Kelly', 'Steve McQueen', 'James Stewart', 'Bette Davis', 'Sidney Poitier']),
    people('a_kidstars', 'Child Stars', '🧒', ['Macaulay Culkin', 'Drew Barrymore', 'Shirley Temple', 'Lindsay Lohan', 'Mara Wilson', 'Haley Joel Osment', 'Dakota Fanning', 'Jodie Foster', 'Millie Bobby Brown', 'Jacob Tremblay', 'Finn Wolfhard', 'Abigail Breslin', 'Elijah Wood', 'Kirsten Dunst', 'Natalie Portman', 'Daniel Radcliffe', 'Emma Watson', 'Rupert Grint', 'Freddie Highmore', 'Frankie Muniz', 'Jaden Smith', 'Mary-Kate Olsen', 'Hailee Steinfeld', 'Noah Schnapp']),
    wiki('a_ceos', 'Billionaires & Tech Titans', '💰', ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Warren Buffett', 'Steve Jobs', 'Tim Cook', 'Oprah Winfrey', 'Jensen Huang', 'Larry Page', 'Sergey Brin', 'Larry Ellison', 'Sam Altman', 'Jack Dorsey', 'Richard Branson', 'Steve Ballmer', 'Michael Bloomberg', 'Sundar Pichai', 'Satya Nadella', 'Bernard Arnault', 'Jack Ma', 'Mark Cuban', 'Alan Sugar', 'James Dyson'], { img: 'person' }),
    wiki('a_chefs', 'Celebrity Chefs', '👨‍🍳', ['Gordon Ramsay', 'Guy Fieri', 'Jamie Oliver', 'Anthony Bourdain', 'Bobby Flay', 'Rachael Ray', 'Martha Stewart', 'Ina Garten', 'Emeril Lagasse', 'Wolfgang Puck', 'Julia Child', 'Nigella Lawson', 'Mary Berry', 'Paul Hollywood', 'Marco Pierre White', 'Heston Blumenthal', 'Nusret Gökçe|Salt Bae', 'Giada De Laurentiis', 'Alton Brown', 'Ree Drummond', 'Padma Lakshmi', 'José Andrés', 'David Chang', 'Rick Stein', 'Ainsley Harriott'], { img: 'person' }),
    wiki('a_models', 'Supermodels', '📸', ['Naomi Campbell', 'Kate Moss', 'Cindy Crawford', 'Gisele Bündchen', 'Tyra Banks', 'Heidi Klum', 'Claudia Schiffer', 'Linda Evangelista', 'Christy Turlington', 'Adriana Lima', 'Alessandra Ambrosio', 'Miranda Kerr', 'Gigi Hadid', 'Bella Hadid', 'Kendall Jenner', 'Cara Delevingne', 'Karlie Kloss', 'Candice Swanepoel', 'Tyson Beckford', 'David Gandy', 'Ashley Graham', 'Chrissy Teigen', 'Iman (model)|Iman', 'Elle Macpherson'], { img: 'person' }),
  ],
};

/* ======================= MUSIC (US) ======================= */
const MUSIC = {
  mu_us: [
    wiki('mu_rapnow', 'Rap Right Now', '🎧', ['Kendrick Lamar', 'Drake (musician)|Drake', 'Travis Scott', 'Future (rapper)|Future', 'Lil Baby', '21 Savage', 'Metro Boomin', 'Playboi Carti', 'Tyler, the Creator', 'Doja Cat', 'Megan Thee Stallion', 'Cardi B', 'Nicki Minaj', 'Ice Spice', 'Lil Uzi Vert', 'J. Cole', 'Gunna (rapper)|Gunna', 'Young Thug', 'Don Toliver', 'Lil Durk', 'GloRilla', 'Latto', 'Kanye West', 'A$AP Rocky', 'Jack Harlow', 'Polo G', 'Roddy Ricch', 'YoungBoy Never Broke Again|NBA YoungBoy', 'Sexyy Red', 'Lil Yachty', 'Kodak Black'], US),
    wiki('mu_popgirls', 'Pop Princesses', '👑', ['Taylor Swift', 'Sabrina Carpenter', 'Olivia Rodrigo', 'Billie Eilish', 'Ariana Grande', 'Dua Lipa', 'Chappell Roan', 'Lady Gaga', 'Beyoncé', 'Rihanna', 'Katy Perry', 'Miley Cyrus', 'Selena Gomez', 'Doja Cat', 'Charli XCX', 'Tate McRae', 'Gracie Abrams', 'Madison Beer', 'Ava Max', 'Halsey', 'Camila Cabello', 'Demi Lovato', 'Britney Spears', 'Christina Aguilera', 'Kesha', 'Lorde', 'SZA', 'Addison Rae', 'Reneé Rapp', 'Raye (singer)|Raye']),
    wiki('mu_emo', 'Emo & Pop-Punk', '🖤', ['My Chemical Romance', 'Fall Out Boy', 'Paramore', 'Green Day', 'Blink-182', 'Panic! at the Disco', 'Sum 41', 'Avril Lavigne', 'Good Charlotte', 'Simple Plan', 'All Time Low', 'Linkin Park', 'Yellowcard', 'The All-American Rejects', 'Jimmy Eat World', 'Taking Back Sunday', 'Dashboard Confessional', 'Twenty One Pilots', 'Machine Gun Kelly (musician)|Machine Gun Kelly', 'Bring Me the Horizon', 'Pierce the Veil', 'Sleeping with Sirens', 'The Used', 'New Found Glory', 'Neck Deep', '5 Seconds of Summer', 'Weezer', 'The Offspring']),
    wiki('mu_latin', 'Latin Superstars', '💃', ['Bad Bunny', 'Shakira', 'J Balvin', 'Karol G', 'Daddy Yankee', 'Ozuna (singer)|Ozuna', 'Maluma', 'Peso Pluma', 'Rauw Alejandro', 'Anuel AA', 'Nicky Jam', 'Rosalía', 'Becky G', 'Enrique Iglesias', 'Ricky Martin', 'Jennifer Lopez', 'Marc Anthony', 'Pitbull (rapper)|Pitbull', 'Feid', 'Myke Towers', 'Romeo Santos', 'Selena (singer)|Selena', 'Luis Fonsi', 'Camilo (singer)|Camilo', 'Grupo Frontera', 'Carín León', 'Sebastián Yatra', 'Anitta (singer)|Anitta', 'Farruko']),
    wiki('mu_rnb00', '2000s R&B', '💜', ['Usher (musician)|Usher', 'Beyoncé', 'Alicia Keys', 'Rihanna', 'Ne-Yo', 'Chris Brown', 'Mary J. Blige', "Destiny's Child", 'Ciara', 'Akon', 'T-Pain', 'Mariah Carey', 'Aaliyah', 'Ashanti (singer)|Ashanti', 'Keyshia Cole', 'Brandy (singer)|Brandy', 'Monica (singer)|Monica', 'John Legend', 'Mario (singer)|Mario', 'Omarion', 'Trey Songz', 'Sean Paul', 'Nelly', 'Amerie', 'Keri Hilson', 'Jordin Sparks', 'Craig David', 'Justin Timberlake']),
    wiki('mu_countrynow', 'Modern Country', '🛻', ['Morgan Wallen', 'Luke Combs', 'Zach Bryan', 'Chris Stapleton', 'Lainey Wilson', 'Jelly Roll (rapper)|Jelly Roll', 'Kane Brown', 'Luke Bryan', 'Thomas Rhett', 'Jason Aldean', 'Carrie Underwood', 'Miranda Lambert', 'Kacey Musgraves', 'Shaboozey', 'Post Malone', 'Bailey Zimmerman', 'Megan Moroney', 'Cody Johnson', 'Riley Green', 'Kenny Chesney', 'Florida Georgia Line', 'Dan + Shay', 'Old Dominion (band)|Old Dominion', 'Brad Paisley', 'Toby Keith', 'Alan Jackson', 'George Strait', 'Ella Langley'], US),
    wiki('mu_90shiphop', '90s Hip-Hop', '📻', ['Tupac Shakur', 'The Notorious B.I.G.', 'Nas', 'Jay-Z', 'Dr. Dre', 'Snoop Dogg', 'Ice Cube', 'Wu-Tang Clan', 'Outkast', 'A Tribe Called Quest', 'Lauryn Hill', 'Missy Elliott', 'DMX', 'Busta Rhymes', 'Lil\' Kim', 'Queen Latifah', 'Method Man', 'Salt-N-Pepa', 'Bone Thugs-n-Harmony', 'Eazy-E', 'LL Cool J', 'Mobb Deep', 'Fugees', 'Coolio', 'Will Smith', 'MC Hammer', 'Vanilla Ice'], US),
  ],
  mu_albums_more: [
    albums('al_hiphop', 'Hip-Hop Albums', '💽', ['Illmatic|Nas', 'The Chronic|Dr. Dre', 'Ready to Die|The Notorious B.I.G.', 'The Marshall Mathers LP|Eminem', 'The Blueprint|Jay-Z', 'My Beautiful Dark Twisted Fantasy|Kanye West', 'To Pimp a Butterfly|Kendrick Lamar', 'good kid, m.A.A.d city|Kendrick Lamar', 'The College Dropout|Kanye West', "Get Rich or Die Tryin'|50 Cent", 'All Eyez on Me|2Pac', 'The Miseducation of Lauryn Hill|Lauryn Hill', 'Reasonable Doubt|Jay-Z', 'Aquemini|Outkast', 'Enter the Wu-Tang (36 Chambers)|Wu-Tang Clan', 'Graduation|Kanye West', 'Take Care|Drake', 'Astroworld|Travis Scott', 'DAMN.|Kendrick Lamar', 'The Eminem Show|Eminem', 'Doggystyle|Snoop Dogg', 'Tha Carter III|Lil Wayne', '2014 Forest Hills Drive|J. Cole', 'Igor|Tyler, the Creator', 'Speakerboxxx/The Love Below|Outkast', 'Late Registration|Kanye West', 'Nothing Was the Same|Drake', 'Life After Death|The Notorious B.I.G.', 'GNX|Kendrick Lamar'], US),
    albums('al_pop', 'Pop Albums', '🌈', ['Thriller|Michael Jackson', '1989|Taylor Swift', '21|Adele', 'Lemonade|Beyoncé', 'Future Nostalgia|Dua Lipa', 'SOUR|Olivia Rodrigo', 'When We All Fall Asleep, Where Do We Go?|Billie Eilish', "Short n' Sweet|Sabrina Carpenter", 'Brat|Charli XCX', 'The Fame|Lady Gaga', 'Teenage Dream|Katy Perry', '...Baby One More Time|Britney Spears', 'Thank U, Next|Ariana Grande', 'Purpose|Justin Bieber', 'Anti|Rihanna', 'Born This Way|Lady Gaga', 'Justified|Justin Timberlake', 'After Hours|The Weeknd', 'Midnights|Taylor Swift', '÷|Ed Sheeran', 'Back to Black|Amy Winehouse', 'Renaissance|Beyoncé', 'Happier Than Ever|Billie Eilish', 'Hit Me Hard and Soft|Billie Eilish', 'The Rise and Fall of a Midwest Princess|Chappell Roan', 'GUTS|Olivia Rodrigo']),
    albums('al_taylor', 'Taylor Swift Albums', '🐍', ['Taylor Swift|Taylor Swift', 'Fearless|Taylor Swift', 'Speak Now|Taylor Swift', 'Red|Taylor Swift', '1989|Taylor Swift', 'Reputation|Taylor Swift', 'Lover|Taylor Swift', 'Folklore|Taylor Swift', 'Evermore|Taylor Swift', 'Midnights|Taylor Swift', 'The Tortured Poets Department|Taylor Swift', 'The Life of a Showgirl|Taylor Swift']),
    albums('al_rock', 'Rock Albums', '🎸', ['Nevermind|Nirvana', 'Appetite for Destruction|Guns N\' Roses', 'Back in Black|AC/DC', 'The Dark Side of the Moon|Pink Floyd', 'Led Zeppelin IV|Led Zeppelin', 'Hotel California|Eagles', 'Rumours|Fleetwood Mac', 'American Idiot|Green Day', 'Hybrid Theory|Linkin Park', 'Ten|Pearl Jam', 'Born in the U.S.A.|Bruce Springsteen', 'Master of Puppets|Metallica', 'Metallica|Metallica', 'The Black Parade|My Chemical Romance', 'Is This It|The Strokes', 'Elephant|The White Stripes', 'Californication|Red Hot Chili Peppers', 'Abbey Road|The Beatles', 'Sticky Fingers|The Rolling Stones', 'A Night at the Opera|Queen', 'Slippery When Wet|Bon Jovi', 'Enema of the State|Blink-182', 'AM|Arctic Monkeys', 'Hot Fuss|The Killers', 'OK Computer|Radiohead']),
  ],
};

/* ======================= GAMING ======================= */
const GAMES = {
  vg_more: [
    wiki('vg_cod', 'Call of Duty Games', '🪖', ['Call of Duty (video game)|Call of Duty', 'Call of Duty 2', 'Call of Duty 4: Modern Warfare', 'Call of Duty: World at War', 'Call of Duty: Modern Warfare 2', 'Call of Duty: Black Ops', 'Call of Duty: Modern Warfare 3', 'Call of Duty: Black Ops II', 'Call of Duty: Ghosts', 'Call of Duty: Advanced Warfare', 'Call of Duty: Black Ops III', 'Call of Duty: Infinite Warfare', 'Call of Duty: WWII', 'Call of Duty: Black Ops 4', 'Call of Duty: Modern Warfare (2019 video game)|Call of Duty: Modern Warfare (2019)', 'Call of Duty: Warzone', 'Call of Duty: Black Ops Cold War', 'Call of Duty: Vanguard', 'Call of Duty: Modern Warfare II (2022 video game)|Call of Duty: Modern Warfare II (2022)', 'Call of Duty: Black Ops 6', 'Call of Duty: Black Ops 7']),
    wiki('vg_rockstar', 'Rockstar Games', '⭐', ['Grand Theft Auto III', 'Grand Theft Auto: Vice City', 'Grand Theft Auto: San Andreas', 'Grand Theft Auto IV', 'Grand Theft Auto V', 'Grand Theft Auto VI', 'Red Dead Redemption', 'Red Dead Redemption 2', 'Bully (video game)|Bully', 'Max Payne 3', 'L.A. Noire', 'Manhunt (video game)|Manhunt', 'Grand Theft Auto (video game)|Grand Theft Auto', 'Grand Theft Auto: Liberty City Stories', 'Grand Theft Auto: Chinatown Wars', 'Grand Theft Auto: Vice City Stories', 'Max Payne (video game)|Max Payne', 'Red Dead Revolver']),
    wiki('vg_switch', 'Nintendo Switch Games', '🔴', ['The Legend of Zelda: Breath of the Wild', 'The Legend of Zelda: Tears of the Kingdom', 'Super Mario Odyssey', 'Mario Kart 8 Deluxe', 'Super Smash Bros. Ultimate', 'Animal Crossing: New Horizons', 'Pokémon Scarlet and Violet', 'Splatoon 3', 'Super Mario Bros. Wonder', 'Kirby and the Forgotten Land', 'Metroid Dread', "Luigi's Mansion 3", 'Pokémon Legends: Arceus', 'Xenoblade Chronicles 3', 'Fire Emblem: Three Houses', 'Mario Party Superstars', 'Pokémon Sword and Shield', 'Hollow Knight', 'Stardew Valley', 'Donkey Kong Country: Tropical Freeze', 'Mario Kart World', 'Donkey Kong Bananza']),
    wiki('vg_ps', 'PlayStation Greats', '🎮', ['The Last of Us', 'The Last of Us Part II', 'God of War (2018 video game)|God of War (2018)', 'God of War Ragnarök', "Marvel's Spider-Man (2018 video game)|Marvel's Spider-Man", "Marvel's Spider-Man 2", 'Uncharted 2: Among Thieves', "Uncharted 4: A Thief's End", 'Ghost of Tsushima', 'Horizon Zero Dawn', 'Bloodborne', 'Gran Turismo 7', 'Ratchet & Clank: Rift Apart', 'Astro Bot', 'Days Gone', 'Death Stranding', 'Returnal', 'Shadow of the Colossus', 'Crash Bandicoot (video game)|Crash Bandicoot', 'Spyro the Dragon (video game)|Spyro the Dragon', 'Ghost of Yōtei', 'Infamous Second Son', 'Detroit: Become Human']),
    wiki('vg_xbox', 'Xbox Classics', '🟢', ['Halo: Combat Evolved', 'Halo 2', 'Halo 3', 'Halo: Reach', 'Halo Infinite', 'Halo 4', 'Gears of War (video game)|Gears of War', 'Gears of War 2', 'Gears 5', 'Forza Horizon 5', 'Forza Horizon 4', 'Fable (2004 video game)|Fable', 'Fable II', 'Sea of Thieves', 'State of Decay 2', 'Crackdown (video game)|Crackdown', 'Alan Wake', 'Ori and the Blind Forest', 'Hi-Fi Rush', 'Indiana Jones and the Great Circle', 'Starfield (video game)|Starfield', 'Banjo-Kazooie']),
    wiki('vg_horror', 'Horror Games', '👻', ["Five Nights at Freddy's (video game)|Five Nights at Freddy's", 'Resident Evil 4', 'Resident Evil 2 (2019 video game)|Resident Evil 2 (2019)', 'Resident Evil 7: Biohazard', 'Resident Evil Village', 'Silent Hill 2', 'Dead Space (2008 video game)|Dead Space', 'Outlast (video game)|Outlast', 'Amnesia: The Dark Descent', 'Alien: Isolation', 'Until Dawn', 'Phasmophobia (video game)|Phasmophobia', 'Poppy Playtime', 'Bendy and the Ink Machine', 'Little Nightmares', 'The Evil Within', 'Lethal Company', 'Dead by Daylight', 'Slender: The Eight Pages', 'Alan Wake 2', 'P.T. (video game)|P.T.', 'Layers of Fear']),
    wiki('vg_shooters', 'Battle Royales & Shooters', '🎯', ['Fortnite', 'Apex Legends', 'PUBG: Battlegrounds', 'Call of Duty: Warzone', 'Valorant', 'Counter-Strike 2', 'Overwatch 2', 'Rainbow Six Siege', 'Halo Infinite', 'Destiny 2', 'Team Fortress 2', 'Battlefield 1', 'Battlefield 6', 'Rocket League', 'Free Fire (video game)|Free Fire', 'Marvel Rivals', 'The Finals', 'Escape from Tarkov', 'Titanfall 2', 'Splitgate', 'Halo 3', 'Counter-Strike: Global Offensive']),
  ],
};

/* ======================= PLACES / HISTORY / CARS / NATURE ======================= */
const PLACES = {
  pl_more: [
    wiki('pl_us_cities', 'US Cities', '🗽', ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Las Vegas', 'San Francisco', 'Seattle', 'Boston', 'Washington, D.C.', 'New Orleans', 'Nashville, Tennessee|Nashville', 'Austin, Texas|Austin', 'Denver', 'Philadelphia', 'Atlanta', 'San Diego', 'Dallas', 'Orlando, Florida|Orlando', 'Honolulu', 'Portland, Oregon|Portland', 'Phoenix, Arizona|Phoenix', 'Detroit', 'Minneapolis', 'Charleston, South Carolina|Charleston', 'Salt Lake City', 'Savannah, Georgia|Savannah', 'San Antonio'], US),
    wiki('pl_states', 'US State Flags', '🇺🇸', ['Flag of Texas|Texas', 'Flag of California|California', 'Flag of New York (state)|New York', 'Flag of Florida|Florida', 'Flag of Colorado|Colorado', 'Flag of Alaska|Alaska', 'Flag of Arizona|Arizona', 'Flag of New Mexico|New Mexico', 'Flag of Hawaii|Hawaii', 'Flag of Maryland|Maryland', 'Flag of South Carolina|South Carolina', 'Flag of Tennessee|Tennessee', 'Flag of Ohio|Ohio', 'Flag of Washington (state)|Washington', 'Flag of Georgia (U.S. state)|Georgia', 'Flag of Illinois|Illinois', 'Flag of Michigan|Michigan', 'Flag of Pennsylvania|Pennsylvania', 'Flag of Massachusetts|Massachusetts', 'Flag of Wyoming|Wyoming', 'Flag of Montana|Montana', 'Flag of Utah|Utah', 'Flag of Oregon|Oregon', 'Flag of Louisiana|Louisiana', 'Flag of Alabama|Alabama', 'Flag of Rhode Island|Rhode Island', 'Flag of Minnesota|Minnesota'], { ...US, img: 'flag' }),
    wiki('pl_natparks', 'US National Parks', '🏞️', ['Yellowstone National Park|Yellowstone', 'Grand Canyon National Park|Grand Canyon', 'Yosemite National Park|Yosemite', 'Zion National Park|Zion', 'Great Smoky Mountains National Park|Great Smoky Mountains', 'Rocky Mountain National Park|Rocky Mountain', 'Acadia National Park|Acadia', 'Glacier National Park (U.S.)|Glacier', 'Arches National Park|Arches', 'Grand Teton National Park|Grand Teton', 'Olympic National Park|Olympic', 'Joshua Tree National Park|Joshua Tree', 'Bryce Canyon National Park|Bryce Canyon', 'Death Valley National Park|Death Valley', 'Everglades National Park|Everglades', 'Sequoia National Park|Sequoia', 'Denali National Park and Preserve|Denali', 'Mount Rainier National Park|Mount Rainier', 'Hawaiʻi Volcanoes National Park|Hawaiʻi Volcanoes', 'Shenandoah National Park|Shenandoah', 'Crater Lake National Park|Crater Lake', 'Badlands National Park|Badlands', 'Canyonlands National Park|Canyonlands', 'Redwood National and State Parks|Redwood'], US),
    wiki('pl_us_land', 'American Landmarks', '🗽', ['Statue of Liberty', 'Golden Gate Bridge', 'Mount Rushmore', 'Empire State Building', 'Hollywood Sign', 'White House', 'Las Vegas Strip', 'Times Square', 'Space Needle', 'Gateway Arch', 'Lincoln Memorial', 'Niagara Falls', 'Brooklyn Bridge', 'Alcatraz Island', 'Washington Monument', 'Central Park', 'Hoover Dam', 'Liberty Bell', 'Willis Tower', 'One World Trade Center', 'Kennedy Space Center', 'Graceland', 'U.S. Route 66|Route 66', 'Alamo Mission in San Antonio|The Alamo', 'French Quarter', 'Old Faithful'], US),
    wiki('pl_uk_land', 'UK Landmarks', '💂', ['Big Ben', 'Tower Bridge', 'Buckingham Palace', 'Stonehenge', 'Tower of London', 'London Eye', 'Edinburgh Castle', 'Angel of the North', 'The Shard', 'Windsor Castle', "St Paul's Cathedral", "Giant's Causeway", 'Westminster Abbey', "Hadrian's Wall", 'Blackpool Tower', 'Loch Ness', 'Snowdon', 'White cliffs of Dover', 'Roman Baths (Bath)|Roman Baths', 'Cardiff Castle', 'Clifton Suspension Bridge', 'Royal Liver Building|Liver Building', 'Trafalgar Square', 'Lake District'], UK),
  ],
  hg_more: [
    wiki('hg_founding', 'Founding Fathers', '📜', ['George Washington', 'Thomas Jefferson', 'Benjamin Franklin', 'John Adams', 'Alexander Hamilton', 'James Madison', 'John Jay', 'Samuel Adams', 'John Hancock', 'Paul Revere', 'Patrick Henry', 'Thomas Paine', 'Aaron Burr', 'James Monroe', 'Gouverneur Morris', 'John Marshall', 'Benjamin Rush', 'George Mason', 'Gilbert du Motier, Marquis de Lafayette|Lafayette', 'Betsy Ross'], { ...US, img: 'person' }),
    wiki('hg_civil', 'Civil Rights Icons', '✊', ['Martin Luther King Jr.', 'Rosa Parks', 'Malcolm X', 'Harriet Tubman', 'Frederick Douglass', 'John Lewis', 'Sojourner Truth', 'W. E. B. Du Bois', 'Booker T. Washington', 'Thurgood Marshall', 'Medgar Evers', 'Ruby Bridges', 'Jackie Robinson', 'Maya Angelou', 'Coretta Scott King', 'Harvey Milk', 'Cesar Chavez', 'Susan B. Anthony', 'Elizabeth Cady Stanton', 'Nelson Mandela', 'Ida B. Wells', 'Fannie Lou Hamer', 'Bayard Rustin'], { ...US, img: 'person' }),
    wiki('hg_science', 'Scientists & Inventors', '💡', ['Albert Einstein', 'Isaac Newton', 'Thomas Edison', 'Nikola Tesla', 'Marie Curie', 'Charles Darwin', 'Galileo Galilei', 'Leonardo da Vinci', 'Alexander Graham Bell', 'Stephen Hawking', 'Ada Lovelace', 'Alan Turing', 'Louis Pasteur', 'Johannes Gutenberg', 'James Watt', 'Henry Ford', 'Tim Berners-Lee', 'Archimedes', 'Carl Sagan', 'Rosalind Franklin', 'Michael Faraday', 'Neil deGrasse Tyson', 'Grace Hopper', 'Katherine Johnson'], { img: 'person' }),
    wiki('hg_space', 'Space Legends', '🚀', ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Sally Ride', 'John Glenn', 'Valentina Tereshkova', 'Alan Shepard', 'Michael Collins (astronaut)|Michael Collins', 'Chris Hadfield', 'Mae Jemison', 'Tim Peake', 'Scott Kelly (astronaut)|Scott Kelly', 'Jim Lovell', 'Peggy Whitson', 'Christina Koch', 'Gene Cernan', 'Eileen Collins', 'Gus Grissom', 'Sunita Williams', 'Laika'], { img: 'person' }),
  ],
  car_more: [
    wiki('car_muscle', 'American Muscle', '🇺🇸', ['Ford Mustang', 'Chevrolet Camaro', 'Dodge Challenger', 'Dodge Charger', 'Pontiac GTO', 'Chevrolet Corvette', 'Plymouth Barracuda', 'AC Cobra|Shelby Cobra', 'Pontiac Firebird', 'Chevrolet Chevelle', 'Plymouth Road Runner', 'Oldsmobile 442', 'Ford Torino', 'Chevrolet Nova', 'AMC Javelin', 'Dodge Viper', 'Ford GT', 'Chevrolet Impala', 'Mercury Cougar', 'Shelby Mustang', 'Buick Grand National', 'Chevrolet El Camino'], US),
    wiki('car_trucks', 'Pickup Trucks', '🛻', ['Ford F-Series|Ford F-150', 'Chevrolet Silverado', 'Ram pickup|Ram 1500', 'Toyota Tacoma', 'Toyota Tundra', 'GMC Sierra', 'Tesla Cybertruck', 'Rivian R1T', 'Nissan Titan', 'Honda Ridgeline', 'Jeep Gladiator (JT)|Jeep Gladiator', 'Ford F-150 Lightning', 'Chevrolet Colorado', 'GMC Hummer EV', 'Ford Maverick (2022)|Ford Maverick', 'Toyota Hilux', 'Ford Ranger', 'Dodge Dakota'], US),
    wiki('car_usbrands', 'American Car Brands', '🏁', ['Ford Motor Company|Ford', 'Chevrolet', 'Dodge', 'Tesla, Inc.|Tesla', 'Jeep', 'Cadillac', 'GMC (automobile)|GMC', 'Lincoln Motor Company|Lincoln', 'Buick', 'Chrysler', 'Ram Trucks|Ram', 'Rivian', 'Lucid Motors|Lucid', 'Pontiac', 'Hummer', 'Oldsmobile', 'Plymouth (automobile)|Plymouth', 'Saturn Corporation|Saturn', 'Mercury (automobile)|Mercury', 'DeLorean Motor Company|DeLorean'], { ...US, img: 'logo' }),
    wiki('car_ev', 'Electric Cars', '⚡', ['Tesla Model S', 'Tesla Model 3', 'Tesla Model X', 'Tesla Model Y', 'Tesla Cybertruck', 'Rivian R1S', 'Lucid Air', 'Porsche Taycan', 'Ford Mustang Mach-E', 'Chevrolet Bolt', 'Nissan Leaf', 'BMW i3', 'Hyundai Ioniq 5', 'Kia EV6', 'Audi e-tron GT', 'Polestar 2', 'Tesla Roadster (first generation)|Tesla Roadster', 'BYD Seal', 'Rimac Nevera', 'Lotus Evija']),
  ],
  n_more: [
    wiki('n_reptiles', 'Reptiles & Amphibians', '🦎', ['Komodo dragon', 'King cobra', 'Saltwater crocodile', 'Green anaconda', 'Chameleon', 'Gila monster', 'Galápagos tortoise', 'Axolotl', 'Poison dart frog', 'Black mamba', 'Green iguana', 'Leopard gecko', 'Pogona|Bearded dragon', 'American alligator', 'Frill-necked lizard', 'Burmese python', 'Green sea turtle', 'Thorny devil', 'Western diamondback rattlesnake|Rattlesnake', 'Gharial', 'Tuatara', 'Red-eyed tree frog']),
    wiki('n_farm', 'Farm Animals', '🐄', ['Cattle|Cow', 'Pig', 'Sheep', 'Goat', 'Chicken', 'Horse', 'Donkey', 'Domestic duck|Duck', 'Llama', 'Alpaca', 'Domestic turkey|Turkey', 'Domestic rabbit|Rabbit', 'Domestic goose|Goose', 'Highland cattle', 'Water buffalo', 'Mule', 'Shetland pony', 'Guinea pig']),
    wiki('n_us', 'American Wildlife', '🦅', ['Bald eagle', 'American bison', 'Grizzly bear', 'American black bear', 'Moose', 'Mountain lion|Cougar', 'Gray wolf', 'Coyote', 'Raccoon', 'Virginia opossum|Opossum', 'Striped skunk|Skunk', 'White-tailed deer', 'American alligator', 'Bobcat', 'Pronghorn', 'Wild turkey', 'Elk', 'North American beaver|Beaver', 'Manatee', 'Roadrunner', 'Prairie dog', 'Armadillo'], US),
  ],
};

/** Merge the expansion into the main catalog. */
export function extendMenu(M) {
  // Creators: rebuilt from scratch.
  for (const k of ['creators']) delete M[k];
  Object.assign(M, CREATORS);
  M.domain.find(d => d.id === 'creators').desc = 'YOUTUBE, TWITCH, TIKTOK';

  // Sports
  M.sp_amer = [...M.sp_amer.map(x => x.id === 'a_nfl_all' ? { ...x, league: 'nfl', region: 'us' } : x.id === 'a_mlb' ? { ...x, league: 'mlb', region: 'us' } : x), ...SPORTS.sp_amer_more.filter(x => x.id !== 'c_wwe_now')];
  M.sports.find(x => x.id === 'sp_amer').desc = 'NFL, MLB, NHL, WNBA, COLLEGE';
  const amer = M.sports.findIndex(x => x.id === 'sp_amer');
  M.sports.splice(amer, 1); M.sports.unshift(nav('sp_amer', 'US SPORTS', '🏈', 'NFL, MLB, NHL, WNBA, COLLEGE'));
  M.sp_combat.push(SPORTS.sp_amer_more.find(x => x.id === 'c_wwe_now'));
  for (const id of ['b_all', 'b_mod', 'b_90']) { const x = M.sp_basket.find(y => y.id === id); if (x) Object.assign(x, { league: 'nba', region: 'us' }); }
  const bt = M.sp_basket.find(y => y.id === 'b_teams'); if (bt) Object.assign(bt, { img: 'logo', region: 'us' });

  // Food
  M.food.push(nav('fd_us', 'AMERICAN FOOD', '🇺🇸', 'FAST FOOD, CANDY, SODA, SNACKS'), ...FOOD.fd_uk);
  M.fd_us = FOOD.fd_us;

  // TV
  M.tv.push(nav('tv_us', 'AMERICAN TV', '🇺🇸', 'NETWORK HITS, TEEN DRAMAS, SNL, LATE NIGHT'));
  M.tv_us = TV.tv_us;

  // Movies
  M.movies.push(nav('m_actors', 'STAR FILMOGRAPHIES', '🌟', 'SANDLER, CARREY, DICAPRIO, THE ROCK'));
  M.m_actors = MOVIES.m_actors;
  M.m_lists.push(...MOVIES.m_lists_more);

  // Celebs
  M.actors.push(...ACTORS.a_more);

  // Music
  M.music.push(nav('mu_us', 'AMERICAN MUSIC', '🇺🇸', 'RAP, POP, COUNTRY, LATIN, EMO'));
  M.mu_us = MUSIC.mu_us;
  M.mu_albums.push(...MUSIC.mu_albums_more);

  // Gaming
  M.games.push(...GAMES.vg_more);

  // Places / history / cars / nature
  M.places.push(...PLACES.pl_more);
  M.history.push(...PLACES.hg_more);
  M.cars.push(...PLACES.car_more);
  M.nature.push(...PLACES.n_more);
}

/* ======================= GROW: topping every category up towards 100 =======================
 * The catalog builder keeps the hand-picked items first, then adds the most famous matches:
 *   Wikidata spec  { occ, inst, sub, team, league, position, genre, award, platform, posHeld, castOf,
 *                    country: ['us','uk',...], sex: 'm'|'f', born: [from, to], since, until, where }
 *                  ranked by how many Wikipedias have an article (a good fame signal).
 *   TMDB spec      { tmdb: '/discover/...', keyword, company } or { person, job } for filmographies.
 * Every grown pick still goes through the same strict picture checks. */
const M = '/discover/movie?sort_by=vote_count.desc&vote_count.gte=250';
const T = '/discover/tv?sort_by=vote_count.desc&vote_count.gte=80&with_original_language=en';
const NO = (...g) => `&without_genres=${['10763', '10767', ...g].join(',')}`;
const ACT = ['actor', 'film actor', 'television actor'];
const ANGLO = ['us', 'uk', 'ca', 'au', 'nz', 'ie'];
const SINGER = ['singer', 'singer-songwriter'];
const BAND = ['musical group', 'rock band', 'band', 'boy band', 'girl group', 'pop rock band'];
const CHAIN = ['restaurant chain', 'fast food restaurant chain', 'fast casual restaurant chain', 'chain restaurant'];
const BIG_TEAMS = ['Real Madrid CF', 'FC Barcelona', 'Manchester United F.C.', 'Liverpool F.C.', 'FC Bayern Munich', 'Juventus FC', 'AC Milan', 'Inter Milan', 'Chelsea F.C.', 'Arsenal F.C.', 'Manchester City F.C.', 'Paris Saint-Germain F.C.', 'Borussia Dortmund', 'Atlético Madrid', 'AFC Ajax', 'Tottenham Hotspur F.C.', 'S.L. Benfica', 'FC Porto', 'Brazil national football team', 'Argentina national football team', 'France national football team', 'Germany national football team', 'Italy national football team', 'Spain national football team', 'England national football team', 'Netherlands national football team', 'Portugal national football team'];
const SPORT_EX_BASE = ['film actor', 'television actor', 'actor', 'singer', 'comedian', 'monarch', 'sovereign', 'aristocrat', 'physicist', 'skydiver', 'television presenter'];
const SPORT_EX = [...SPORT_EX_BASE, 'association football player'];
const footy = team => ({ occ: 'association football player', team, exclude: SPORT_EX_BASE });
export const GROW = {
  // ---- Movies
  fr_horror: { tmdb: M + '&with_genres=27&without_genres=878,16' },
  fr_pixar: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=50', company: 'Pixar' },
  mc_marvel: { universe: 'Marvel Universe', inst: ['superhero', 'fictional human', 'comics character', 'mutant', 'fictional superhero', 'fictional character'], human: false },
  mc_dc: { universe: 'DC Universe', inst: ['superhero', 'fictional human', 'comics character', 'supervillain', 'fictional superhero', 'fictional character'], human: false },
  d_nolan: { person: 'Christopher Nolan', job: 'Director', minVotes: 150 }, d_taran: { person: 'Quentin Tarantino', job: 'Director', minVotes: 150 },
  d_spiel: { person: 'Steven Spielberg', job: 'Director', minVotes: 150 }, d_scors: { person: 'Martin Scorsese', job: 'Director', minVotes: 150 },
  d_kubri: { person: 'Stanley Kubrick', job: 'Director', minVotes: 150 }, d_finch: { person: 'David Fincher', job: 'Director', minVotes: 150 },
  d_ridley: { person: 'Ridley Scott', job: 'Director', minVotes: 150 }, d_ritchie: { person: 'Guy Ritchie', job: 'Director', minVotes: 150 },
  d_villeneuve: { person: 'Denis Villeneuve', job: 'Director', minVotes: 150 }, d_wes: { person: 'Wes Anderson', job: 'Director', minVotes: 150 },
  d_burton: { person: 'Tim Burton', job: 'Director', minVotes: 150 },
  l_xmas: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=60&with_genres=10751|35&without_genres=27,80,53', keyword: ['christmas', 'christmas eve', 'santa claus'] },
  l_heist: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=150&with_genres=80&without_genres=878,14,16', keyword: ['heist'] },
  l_romcom: { tmdb: M + '&with_genres=10749,35&without_genres=16,878,14,28,18', keyword: ['romantic comedy'] }, l_sport: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=150&without_genres=16,80,878,14', keyword: ['sports', 'sport', 'boxing', 'basketball', 'american football', 'baseball', 'football (soccer)', 'ice hockey'] },
  l_scifi: { tmdb: M + '&with_genres=878&without_genres=16', notKeyword: ['superhero', 'marvel cinematic universe (mcu)', 'based on comic', 'dc extended universe (dceu)'] }, l_kids: { tmdb: M + '&with_genres=10751&primary_release_date.lte=2012-12-31' },
  l_teen: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=150&with_genres=35|10749|18&without_genres=878,27,14,16,28', keyword: ['high school'] },
  l_uscom: { tmdb: M + '&with_genres=35&with_origin_country=US&without_genres=28,12,16,878,14,18,80,53,27' },
  l_halloween: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=100&without_genres=878', keyword: ['halloween'] },
  l_musicals: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=100&without_genres=16', keyword: ['musical'] },
  l_2000s: { tmdb: M + '&primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&with_genres=12|28' },
  s_disney: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=50', company: 'Walt Disney Animation Studios' },
  s_ghibli: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=20', company: 'Studio Ghibli' },
  s_dream: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=50', company: 'DreamWorks Animation' },
  s_pixar2: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=50', company: 'Pixar' },
  fa_sandler: { person: 'Adam Sandler' }, fa_carrey: { person: 'Jim Carrey' }, fa_ferrell: { person: 'Will Ferrell' }, fa_leo: { person: 'Leonardo DiCaprio' },
  fa_cruise: { person: 'Tom Cruise' }, fa_denzel: { person: 'Denzel Washington' }, fa_rock: { person: 'Dwayne Johnson' }, fa_wsmith: { person: 'Will Smith' },
  fa_keanu: { person: 'Keanu Reeves' }, fa_hanks: { person: 'Tom Hanks' }, fa_eddie: { person: 'Eddie Murphy' }, fa_bullock: { person: 'Sandra Bullock' },
  an_series: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=100&with_genres=16&with_origin_country=JP' },
  an_films: { tmdb: '/discover/movie?sort_by=vote_count.desc&vote_count.gte=100&with_genres=16&with_origin_country=JP' },

  // ---- Celebs (TMDB photos, Wikidata portrait as backup)
  a_men: { occ: ACT, sex: 'm', country: ANGLO, born: [1940], minLinks: 30, acting: true }, a_women: { occ: ACT, sex: 'f', country: ANGLO, born: [1940], minLinks: 30, acting: true },
  a_action: { occ: ACT, acting: true, where: '?item wdt:P106 ?o2 . VALUES ?o2L { "martial artist"@en "stunt performer"@en "bodybuilder"@en "professional wrestler"@en } ?o2 rdfs:label ?o2L .' },
  a_brits: { occ: ACT, acting: true, country: 'uk', born: [1930], minLinks: 15 }, a_com: { occ: ['comedian', 'stand-up comedian'], acting: true, country: ANGLO, born: [1935], where: '?item wdt:P106 ?o2 . VALUES ?o2L { "actor"@en "film actor"@en } ?o2 rdfs:label ?o2L .' },
  a_rising: { occ: ACT, acting: true, country: ANGLO, born: [1994], minLinks: 10 }, a_reality: { occ: ['television personality', 'socialite', 'reality television participant'], country: ['us', 'uk'], born: [1960] },
  a_standup: { occ: 'stand-up comedian', country: ANGLO }, a_legends: { occ: ACT, acting: true, born: [1870, 1935], minLinks: 25 }, a_kidstars: { occ: 'child actor', acting: true, born: [1925] },
  a_disney: { acting: true, born: [1983], where: 'VALUES ?netL { "Disney Channel"@en } ?net rdfs:label ?netL . ?show wdt:P449 ?net . ?show wdt:P161 ?item .', human: true },
  a_ceos: { occ: ['entrepreneur', 'business executive', 'business magnate', 'chief executive officer'], born: [1925] }, a_chefs: { occ: ['chef', 'restaurateur', 'television chef'] },
  a_models: { occ: ['model', 'fashion model'], sex: 'f', born: [1950] },

  // ---- TV (TMDB discovery)
  tc_sitcom: { tmdb: T + '&with_genres=35&with_origin_country=US|GB' + NO('16', '10764', '10765', '10759', '9648'), keyword: ['sitcom'] }, tc_drama: { tmdb: T + '&with_genres=18&vote_average.gte=8&vote_count.gte=400' + NO('16', '10764', '10766', '10765') },
  tc_anim: { tmdb: T + '&with_genres=16&with_origin_country=US|GB|CA' + NO() }, tc_crime: { tmdb: T + '&with_genres=80&vote_average.gte=7.6&vote_count.gte=300' + NO('16', '10765') }, tc_scifi: { tmdb: T + '&with_genres=10765&vote_average.gte=7.5&vote_count.gte=300' + NO('16') },
  tc_ukcom: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=15&with_genres=35&with_origin_country=GB&without_genres=16,10764,10765,99,10762,10763,10767' }, tc_ukdrama: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=40&with_genres=18&with_origin_country=GB&vote_average.gte=7.2&without_genres=10766,10765,35,16' },
  ct_cn: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=10&with_networks=56' }, ct_nick: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=10&with_networks=13' },
  ct_disney: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=10&with_networks=54' }, ct_uk: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=5&with_origin_country=GB&with_genres=10762' },
  rt_uk: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=5&with_genres=10764&with_origin_country=GB&without_genres=99,16' },
  rt_comp: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=10&with_origin_country=GB|US&without_genres=16,99', keyword: ['game show', 'quiz show', 'talent show', 'singing competition', 'competition show'] },
  tc_network: { tmdb: T + '&with_networks=6|16|2|19' + NO('16', '10764') }, tc_teen: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=50&with_original_language=en&with_genres=18&without_genres=16,9648,80', keyword: ['teen drama', 'high school'] },
  tc_ushits: { tmdb: T + '&with_genres=18&with_origin_country=US&vote_average.gte=8&vote_count.gte=400' + NO('16', '10764', '10766') }, tc_usreal: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=10&with_genres=10764&with_origin_country=US&without_genres=16,99,35,10759' },
  tc_kids: { tmdb: '/discover/tv?sort_by=vote_count.desc&vote_count.gte=15&with_genres=10762' }, tc_00s: { tmdb: T + '&first_air_date.gte=2000-01-01&first_air_date.lte=2009-12-31' + NO('10764') },
  tc_late: { occ: ['talk show host', 'television presenter'], country: ['us', 'uk'], born: [1930] }, tc_snl: { castOf: 'Saturday Night Live' },

  // ---- Football
  fc_utd: footy('Manchester United F.C.'), fc_city: footy('Manchester City F.C.'), fc_liverpool: footy('Liverpool F.C.'), fc_arsenal: footy('Arsenal F.C.'),
  fc_chelsea: footy('Chelsea F.C.'), fc_spurs: footy('Tottenham Hotspur F.C.'), fc_newcastle: footy('Newcastle United F.C.'), fc_madrid: footy(['Real Madrid CF', 'Q8682']),
  fc_barca: footy('FC Barcelona'), fc_bayern: footy('FC Bayern Munich'), fc_juve: footy('Juventus FC'),
  f_all: { team: BIG_TEAMS, minLinks: 25 }, f_now: { team: BIG_TEAMS, born: [1995], minLinks: 12 },
  f_prem: { occ: 'association football player', born: [1965], team: ['Manchester United F.C.', 'Arsenal F.C.', 'Chelsea F.C.', 'Liverpool F.C.', 'Manchester City F.C.', 'Tottenham Hotspur F.C.', 'Everton F.C.', 'Newcastle United F.C.'] },
  f_eng: footy(['England national football team', 'Q47762']), f_liga: { occ: 'association football player', born: [1960], team: ['Real Madrid CF', 'FC Barcelona', 'Atlético Madrid', 'Sevilla FC', 'Valencia CF'] },
  f_mgr: { occ: ['association football manager', 'Q628099'], minLinks: 20 }, f_ballon: { award: "Ballon d'Or" }, f_gk: { team: BIG_TEAMS, position: ['goalkeeper', 'association football goalkeeper'], minLinks: 10, exclude: SPORT_EX_BASE },
  f_lionesses: { team: ["England women's national football team", "England women's national association football team"] },
  f_pl_clubs: { inst: ['association football club'], country: 'uk' }, f_eu_clubs: { inst: ['association football club'] },
  f_nations: { inst: ['sovereign state', 'country'], human: false },
  // ---- US & other sports
  b_all: { league: 'National Basketball Association' }, b_mod: { league: 'National Basketball Association', born: [1992] }, b_90: { league: 'National Basketball Association', born: [1962, 1980] },
  a_nfl_all: { league: 'National Football League' }, a_nfl_now: { league: 'National Football League', born: [1994] }, a_nfl_qbs: { league: 'National Football League', position: 'quarterback' },
  a_mlb: { league: 'Major League Baseball' }, a_mlb_now: { league: 'Major League Baseball', born: [1992] }, a_nhl: { league: ['National Hockey League', 'Q1215892'] },
  a_wnba: { league: "Women's National Basketball Association" }, a_teamusa: { occ: ['swimmer', 'athletics competitor', 'artistic gymnast', 'alpine skier', 'figure skater', 'snowboarder', 'sprinter'], country: 'us' },
  a_college: { inst: ['college football team', 'college sports team'], human: false },
  c_ufc_goat: { occ: ['mixed martial artist', 'Q11607585'], exclude: SPORT_EX }, c_box: { occ: 'boxer', minLinks: 12, exclude: SPORT_EX }, c_wwe_att: { occ: 'professional wrestler', born: [1940, 1985] }, c_wwe_now: { occ: 'professional wrestler', born: [1980] },
  g_f1: { occ: 'Formula One driver', exclude: SPORT_EX }, g_ten: { occ: 'tennis player', minLinks: 15, exclude: SPORT_EX }, g_darts: { occ: 'darts player', exclude: SPORT_EX }, g_snooker: { occ: 'snooker player', exclude: SPORT_EX }, g_golf: { occ: 'golfer', exclude: SPORT_EX },
  g_olymp: { occ: ['swimmer', 'athletics competitor', 'artistic gymnast', 'sprinter', 'long-distance runner', 'track cyclist'], minLinks: 30 }, g_cricket: { occ: 'cricketer', minLinks: 10, exclude: SPORT_EX }, g_rugby: { occ: 'rugby union player', exclude: SPORT_EX },

  // ---- Music (Deezer artist photos)
  mu_now: { occ: SINGER, genre: ['pop music', 'dance-pop', 'electropop'], born: [1993] }, mu_pop: { occ: SINGER, genre: ['pop music', 'dance-pop'] }, mu_rap: { occ: 'rapper' },
  mu_rock: { occ: SINGER, sex: 'm', genre: ['rock music', 'hard rock', 'alternative rock', 'rock and roll'] }, mu_divas: { occ: SINGER, sex: 'f', genre: ['pop music', 'contemporary R&B', 'soul music'] },
  mu_rb: { occ: SINGER, genre: ['contemporary R&B', 'soul music', 'rhythm and blues', 'neo soul'] },
  mu_kpop: [{ genre: 'K-pop', inst: BAND, human: false }, { genre: 'K-pop', occ: SINGER }], mu_country: { occ: SINGER, genre: 'country music', exclude: ['martial artist', 'businessperson'] },
  uk_grime: { occ: 'rapper', country: 'uk', exclude: ['film actor', 'television actor', 'actor'] }, uk_britpop: { inst: BAND, country: 'uk', human: false }, uk_pop: { occ: SINGER, country: 'uk', genre: ['pop music', 'pop rock', 'soul music'] },
  mb_all: { inst: BAND, human: false }, mb_boy: { inst: ['boy band', 'girl group'], human: false },
  md_2010: { occ: SINGER, born: [1984, 1999], genre: ['pop music', 'contemporary R&B', 'hip hop music', 'dance-pop'] }, md_2000: { occ: SINGER, born: [1972, 1986], genre: ['pop music', 'contemporary R&B', 'hip hop music', 'pop rock'] },
  md_1990: { occ: SINGER, born: [1960, 1977], genre: ['pop music', 'contemporary R&B', 'hip hop music', 'alternative rock'] }, md_1980: { occ: SINGER, born: [1945, 1966], genre: ['pop music', 'new wave', 'synth-pop', 'rock music'] },
  mu_rapnow: { occ: 'rapper', country: 'us', born: [1990] }, mu_popgirls: { occ: SINGER, sex: 'f', genre: ['pop music', 'dance-pop'], born: [1982] },
  mu_emo: { inst: BAND, genre: ['emo', 'pop-punk', 'pop punk', 'post-hardcore'], country: ['us', 'uk', 'ca', 'au'], human: false }, mu_latin: { genre: ['reggaeton', 'Latin pop', 'Latin trap', 'regional Mexican', 'bachata'], occ: SINGER },
  mu_rnb00: { occ: SINGER, genre: ['contemporary R&B', 'hip hop soul'], born: [1970, 1990] }, mu_countrynow: { occ: SINGER, genre: 'country music', born: [1975] },
  mu_90shiphop: { occ: 'rapper', born: [1960, 1980] },
  al_greatest: { inst: ['album', 'studio album'], human: false }, al_modern: { inst: ['album', 'studio album'], since: 2008, human: false },
  al_uk: { inst: ['album', 'studio album'], country: 'uk', human: false }, al_hiphop: { inst: ['album', 'studio album'], genre: ['hip hop music', 'hardcore hip hop', 'trap music'], human: false },
  al_pop: { inst: ['album', 'studio album'], genre: ['pop music', 'dance-pop'], human: false }, al_rock: { inst: ['album', 'studio album'], genre: ['rock music', 'hard rock', 'alternative rock', 'grunge', 'heavy metal music'], human: false },

  // ---- Gaming
  vg_best: { inst: 'video game', human: false }, vg_chars: { inst: ['video game character', 'player character'], human: false }, vg_franchise: { inst: 'video game series', human: false },
  vg_consoles: { inst: ['home video game console', 'handheld game console', 'video game console', 'Q8076'], human: false }, vg_mobile: { inst: 'video game', platform: ['iOS', 'Android'], human: false },
  vg_rockstar: { inst: 'video game', developer: ['Rockstar Games', 'Rockstar North', 'Q94981'], human: false }, vg_switch: { inst: 'video game', platform: ['Nintendo Switch', 'Q19610114', 'Nintendo Switch 2'], human: false },
  vg_ps: { inst: 'video game', platform: ['PlayStation 4', 'PlayStation 5', 'PlayStation 3', 'Q5014725', 'Q63184502', 'Q10683'], human: false }, vg_xbox: { inst: 'video game', platform: ['Xbox 360', 'Xbox One', 'Xbox Series X and Series S', 'Q48263', 'Q13361286', 'Q64513817'], human: false },
  vg_horror: { inst: 'video game', genre: ['survival horror', 'psychological horror'], human: false }, vg_shooters: { inst: 'video game', genre: ['first-person shooter', 'battle royale game', 'third-person shooter', 'hero shooter'], human: false },

  // ---- Creators (channel pictures come straight from the YouTube/Twitch IDs on Wikidata)
  cr_us: { occ: ['YouTuber', 'vlogger'], country: 'us', ytSubs: true, exclude: ['singer', 'singer-songwriter', 'guitarist', 'chef', 'diver', 'film actor', 'television actor', 'association football player', 'politician', 'model', 'journalist', 'television presenter'] }, cr_uk: { occ: ['YouTuber', 'vlogger'], country: 'uk', ytSubs: true, exclude: ['singer', 'singer-songwriter', 'guitarist', 'chef', 'diver', 'film actor', 'television actor', 'association football player', 'politician', 'model', 'journalist', 'television presenter'] }, cr_yt: { occ: 'YouTuber', ytSubs: true, exclude: ['singer', 'singer-songwriter', 'guitarist', 'chef', 'diver', 'film actor', 'television actor', 'association football player', 'politician', 'model', 'journalist', 'television presenter'] },
  cr_stream: { occ: ['streamer', 'Twitch streamer', 'live streamer', 'video game streamer'] }, cr_tiktok: { occ: ['TikToker', 'social media influencer'], exclude: ['model', 'politician'] },
  cr_pods: { occ: 'podcaster' }, cr_gaming: { occ: ['esports player', 'streamer', 'Twitch streamer', 'video game streamer', 'Let\'s Player'], ytSubs: true },
  cr_beauty: { occ: ['beauty vlogger', 'makeup artist', 'YouTuber'], sex: 'f', where: '?item wdt:P101 ?fw . VALUES ?fwL { "cosmetics"@en "beauty"@en "fashion"@en } ?fw rdfs:label ?fwL .' },

  // ---- Food
  fd_fast: { inst: CHAIN, human: false }, fd_dish: { inst: ['dish', 'national dish'], human: false }, fd_dessert: { inst: ['dessert', 'cake', 'pastry', 'frozen dessert', 'pudding'], human: false },
  fd_choc: { inst: ['chocolate bar', 'candy bar', 'brand of chocolate'], human: false }, fd_candy: { inst: ['candy', 'gummy candy', 'lollipop', 'hard candy', 'chewing gum', 'brand of confectionery'], human: false },
  fd_drinks: { inst: ['soft drink', 'cola', 'energy drink', 'carbonated soft drink', 'brand of soft drink'], country: ['uk', 'us', 'ie'], minLinks: 12, human: false }, fd_cereal: { inst: ['breakfast cereal', 'brand of breakfast cereal'], human: false },
  fd_us_fast: { inst: CHAIN, country: 'us', human: false }, fd_us_sit: { inst: CHAIN, country: 'us', human: false }, fd_us_candy: { inst: ['candy bar', 'chocolate bar', 'candy', 'gummy candy', 'lollipop', 'brand of confectionery'], country: 'us', human: false },
  fd_us_soda: { inst: ['soft drink', 'cola', 'root beer', 'carbonated soft drink'], country: 'us', minLinks: 10, human: false }, fd_us_food: { inst: ['dish', 'national dish'], country: 'us', human: false },
  fd_uk_food: { inst: ['dish', 'national dish'], country: 'uk', human: false }, fd_coffee: { inst: ['coffeehouse chain', 'coffeehouse', 'doughnut shop', 'bakery chain'], country: ['us', 'uk', 'ca', 'au', 'ie'], human: false },
  fd_pizza_chains: { inst: ['pizza chain', 'pizzeria chain', 'pizzeria'], country: ['us', 'uk', 'ca', 'au', 'ie'], human: false },

  // ---- Nature, cars, places, history, myths
  n_dogs: { inst: 'dog breed', human: false }, n_cats: { inst: 'cat breed', human: false },
  car_super: { sub: ['sports car', 'supercar', 'grand tourer', 'hypercar'], human: false }, car_brands: { inst: ['automobile manufacturer', 'automobile marque', 'car brand'], human: false },
  car_jdm: { sub: ['sports car', 'compact car', 'grand tourer', 'kei car'], where: '?item wdt:P176 ?mk . ?mk wdt:P17 wd:Q17 .', human: false },
  car_muscle: { sub: ['muscle car', 'pony car'], human: false }, car_trucks: { sub: ['pickup truck', 'full-size pickup truck', 'mid-size pickup truck'], human: false },
  car_ev: { sub: ['electric car', 'battery electric vehicle'], human: false }, car_hot: { sub: ['hot hatch'], human: false },
  car_usbrands: { inst: ['automobile manufacturer', 'automobile marque', 'car brand'], country: 'us', human: false },
  pl_cities: { inst: ['big city', 'megacity', 'global city', 'capital city', 'metropolis'], minLinks: 80, human: false }, pl_uk: { inst: ['city', 'big city', 'town', 'cathedral city'], country: 'uk', human: false },
  pl_us_cities: { inst: ['city of the United States', 'big city', 'city', 'consolidated city-county'], country: 'us', human: false },
  pl_wonders: { inst: ['mountain', 'waterfall', 'canyon', 'volcano', 'lake', 'glacier', 'coral reef'], human: false }, pl_parks: { inst: ['amusement park', 'theme park'], human: false },
  pl_stadiums: { inst: ['stadium', 'association football venue', 'multi-purpose stadium', 'sports venue'], human: false }, pl_natparks: { inst: ['national park of the United States', 'National Park of the United States', 'national park'], country: 'us', human: false },
  pl_states: { inst: 'U.S. state', human: false },
  hg_royals: { posHeld: ['monarch of England', 'monarch of the United Kingdom', 'monarch of Scotland', 'monarch of Great Britain', 'King of England', 'Queen of England', 'British monarch', 'King of the United Kingdom'], politicians: true },
  hg_empires: { inst: ['empire', 'historical country', 'colonial empire'], human: false }, hg_flags: { inst: 'sovereign state', human: false },
  hg_pres: { posHeld: 'President of the United States', politicians: true }, hg_civil: { occ: ['civil rights activist', 'human rights activist', 'abolitionist', "women's rights activist"], politicians: true },
  hg_science: { occ: ['physicist', 'chemist', 'inventor', 'mathematician', 'biologist', 'astronomer'], minLinks: 40 }, hg_space: { occ: 'astronaut' },
  m_greek: { inst: ['Greek deity', 'Olympian deity', 'primordial deity', 'Titan', 'Greek primordial deity'], human: false },
  m_heroes: { universe: 'Greek mythology', inst: ['mythological Greek character', 'legendary creature', 'Greek hero', 'demigod', 'mythological character', 'hero', 'monster'], human: false },
  m_norse: { universe: 'Norse mythology', inst: ['Æsir', 'Vanir', 'deity', 'Norse deity', 'jötunn', 'legendary creature', 'mythological character', 'giant'], human: false },
  m_egypt: { inst: ['Egyptian deity', 'deity', 'ancient Egyptian deity'], human: false }, m_creatures: { inst: ['legendary creature', 'mythical creature', 'creature'], human: false },
  m_cryptids: { inst: 'cryptid', human: false },
  // TV & game characters: things that appear in TV series (Q5398426) / Nintendo games (Q8093)
  tch_icons: { inst: ['television character', 'fictional human', 'fictional character', 'animated character'], where: '?item wdt:P1441 ?w . ?w wdt:P31 wd:Q5398426 .', human: false },
  tch_sitcom: { inst: ['television character', 'fictional human', 'fictional character'], where: '?item wdt:P1441 ?w . ?w wdt:P31 wd:Q5398426 . ?w wdt:P136 wd:Q170238 .', human: false },
  vg_nintendo: { inst: ['video game character', 'fictional character', 'player character'], where: '?item wdt:P1441 ?w . ?w wdt:P123 wd:Q8093 .', human: false },
  vg_villains: { inst: ['video game character', 'fictional character', 'supervillain'], where: '?item wdt:P1441 ?w . ?w wdt:P31 wd:Q7889 . ?item wdt:P31|wdt:P106|wdt:P2445 ?ev . VALUES ?evL { "antagonist"@en "villain"@en "supervillain"@en "final boss"@en } ?ev rdfs:label ?evL .', human: false },
};

/* ---- Relevance rules: a topped-up item's Wikidata description must match these. ---- */
const R = {
  football: 'footballer|football player|soccer|football \\(soccer\\)|goalkeeper', club: 'football club|association football|soccer club|football team',
  country: 'country|sovereign state|kingdom|republic|nation|island state|federation', basketball: 'basketball', nfl: 'american football|quarterback|football player',
  baseball: 'baseball', hockey: 'hockey', athlete: 'swimmer|sprinter|athlete|gymnast|skier|skater|snowboarder|runner|track|hurdler|jumper|decathlete|cyclist|olympi',
  music: 'singer|rapper|musician|songwriter|band|group|duo|artist|DJ|record producer|vocalist|trio', rap: 'rapper|hip hop|hip-hop|MC|grime|drill|songwriter',
  band: 'band|group|duo|trio|ensemble', album: 'album', actor: 'actor|actress|comedian|performer|entertainer|filmmaker',
  creator: 'YouTuber|YouTube|streamer|internet|influencer|vlogger|content creator|gamer|web personality|online|TikTok|podcaster|Twitch|social media|video',
  game: 'video game|game', character: 'character|fictional|protagonist|antagonist|villain|mascot|creature', chain: 'restaurant|fast food|fast-food|chain|coffeehouse|diner|eatery|franchise',
  dish: 'dish|food|cuisine|bread|sandwich|soup|pie|cake|pastry|dessert|stew|sausage|cheese|snack|meal|salad|pudding|curry|pasta|noodle|dumpling|sauce|condiment|fried|baked|roast',
  dessert: 'dessert|cake|pastry|pudding|sweet|confection|ice cream|pie|tart|biscuit|cookie|custard|mousse|doughnut|donut|chocolate',
  candy: 'candy|confection|sweet|lollipop|chewing gum|bubble gum|chocolate|toffee|licorice|liquorice|jelly|gummy|mint|caramel|fudge|marshmallow',
  drink: 'soft drink|soda|cola|beverage|drink|energy drink|lemonade|root beer|ginger ale', car: 'car|automobile|vehicle|truck|pickup|coupé|coupe|hatchback|roadster|sedan|saloon|SUV|supercar',
  carBrand: 'manufacturer|automaker|car|automobile|marque|vehicle|motor', city: 'city|capital|town|metropolis|borough|municipality', state: 'state of the United States|U\\.S\\. state|state',
};
const MUST = {
  fc_utd: R.football, fc_city: R.football, fc_liverpool: R.football, fc_arsenal: R.football, fc_chelsea: R.football, fc_spurs: R.football, fc_newcastle: R.football,
  fc_madrid: R.football, fc_barca: R.football, fc_bayern: R.football, fc_juve: R.football, f_all: R.football, f_now: R.football, f_prem: R.football, f_eng: R.football,
  f_liga: R.football, f_gk: R.football, f_mgr: 'manager|coach|football', f_ballon: R.football, f_lionesses: R.football, f_pl_clubs: R.club, f_eu_clubs: R.club, f_nations: R.country,
  b_all: R.basketball, b_mod: R.basketball, b_90: R.basketball, a_wnba: R.basketball, a_nfl_all: R.nfl, a_nfl_now: R.nfl, a_nfl_qbs: 'quarterback|american football',
  a_mlb: R.baseball, a_mlb_now: R.baseball, a_nhl: R.hockey, a_teamusa: R.athlete, g_olymp: R.athlete, a_college: '(college|university|collegiate|NCAA).*(football|basketball|team|athletic)|(football|basketball|athletic).*(college|university)',
  c_ufc_goat: 'martial|fighter|UFC|kickbox|wrestler', c_box: 'boxer|boxing', c_wwe_att: 'wrestler|wrestling', c_wwe_now: 'wrestler|wrestling', g_f1: 'racing driver|formula one|racer|motorsport',
  g_ten: 'tennis', g_darts: 'darts', g_snooker: 'snooker', g_golf: 'golf', g_cricket: 'cricket', g_rugby: 'rugby',
  mu_now: R.music, mu_pop: R.music, mu_rock: R.music, mu_divas: R.music, mu_rb: R.music, mu_country: R.music, uk_pop: R.music, md_2010: R.music, md_2000: R.music, md_1990: R.music, md_1980: R.music,
  mu_popgirls: R.music, mu_latin: R.music, mu_rnb00: R.music, mu_countrynow: R.music, mu_rap: R.rap, uk_grime: R.rap, mu_rapnow: R.rap, mu_90shiphop: R.rap,
  mu_kpop: 'K-pop|South Korean|Korean', uk_britpop: R.band, mb_all: R.band, mb_boy: 'band|group', mu_emo: R.band,
  al_greatest: R.album, al_modern: R.album, al_uk: R.album, al_hiphop: R.album, al_pop: R.album, al_rock: R.album,
  a_men: R.actor, a_women: R.actor, a_action: R.actor, a_brits: R.actor, a_com: 'comedian|actor|actress|comedy', a_rising: R.actor, a_legends: R.actor, a_kidstars: R.actor, a_disney: R.actor + '|singer',
  a_reality: 'television|reality|personality|socialite|star|influencer|media', a_standup: 'comedian|comedy', a_ceos: 'business|entrepreneur|executive|investor|founder|CEO|magnate|industrialist|billionaire',
  a_chefs: 'chef|cook|restaurateur|culinary|food writer|baker', a_models: 'model', tc_late: 'host|presenter|comedian|television|broadcaster', tc_snl: 'comedian|actor|actress|comedy',
  cr_us: R.creator, cr_uk: R.creator, cr_yt: R.creator, cr_stream: 'streamer|Twitch|gamer|YouTuber|internet|esports|content creator', cr_tiktok: R.creator, cr_gaming: 'streamer|gamer|esports|YouTuber|Twitch|video game|player',
  cr_pods: 'podcast|host|comedian|commentator|presenter|personality|broadcaster|journalist', cr_beauty: 'beauty|makeup|make-up|YouTuber|influencer|fashion|vlogger|cosmetic',
  vg_best: R.game, vg_mobile: R.game, vg_rockstar: R.game, vg_switch: R.game, vg_ps: R.game, vg_xbox: R.game, vg_horror: R.game, vg_shooters: R.game,
  vg_chars: R.character, vg_nintendo: R.character, vg_villains: R.character, vg_franchise: 'series|franchise', vg_consoles: 'console|handheld',
  mc_marvel: 'character|superhero|villain|comic', mc_dc: 'character|superhero|villain|comic', tch_icons: 'character', tch_sitcom: 'character',
  fd_fast: R.chain, fd_us_fast: R.chain, fd_us_sit: R.chain, fd_coffee: 'coffee|doughnut|donut|bakery|café|cafe|tea', fd_pizza_chains: 'pizza',
  fd_dish: R.dish, fd_us_food: R.dish, fd_uk_food: R.dish, fd_dessert: R.dessert, fd_choc: 'chocolate|candy bar|confection', fd_candy: R.candy, fd_us_candy: R.candy,
  fd_drinks: R.drink, fd_us_soda: R.drink, fd_cereal: 'cereal',
  n_dogs: 'dog|breed|hound|terrier|spaniel|retriever|sheepdog', n_cats: 'cat|breed',
  car_super: R.car, car_jdm: R.car, car_muscle: R.car, car_hot: R.car, car_ev: R.car, car_trucks: 'truck|pickup|vehicle|ute', car_brands: R.carBrand, car_usbrands: R.carBrand,
  pl_cities: R.city, pl_uk: R.city, pl_us_cities: R.city, pl_wonders: 'mountain|waterfall|canyon|volcano|lake|glacier|reef|falls|peak|gorge|cave|desert|river',
  pl_parks: 'amusement park|theme park|water park', pl_stadiums: 'stadium|arena|venue|ground|ballpark|park', pl_natparks: 'national park', pl_states: R.state,
  hg_royals: 'king|queen|monarch|sovereign', hg_empires: 'empire|kingdom|dynasty|state|caliphate|sultanate|khanate|realm', hg_flags: R.country, hg_pres: 'president',
  hg_civil: 'activist|leader|abolitionist|rights|campaigner|reformer|minister|suffragist', hg_science: 'physicist|chemist|inventor|mathematician|biologist|astronomer|scientist|naturalist|engineer|polymath',
  hg_space: 'astronaut|cosmonaut|aviator|pilot',
  m_greek: 'god|goddess|deity|titan|primordial', m_heroes: 'hero|monster|creature|king|queen|princess|nymph|demigod|giant|daughter|son|figure|character',
  m_norse: 'god|goddess|deity|giant|jötunn|valkyrie|wolf|serpent|dwarf|creature', m_egypt: 'god|goddess|deity', m_creatures: 'creature|monster|mythical|legendary|spirit|beast|being|folklore',
  m_cryptids: 'cryptid|creature|monster|ape|beast|serpent',
};
// Things that must never appear, whatever the description says.
const NOT = { fd_candy: 'company|corporation|manufacturer|founded|brand of beer|cigarette|tobacco', fd_us_candy: 'company|corporation|manufacturer|tobacco', fd_choc: 'company|corporation|manufacturer',
  fd_drinks: 'alcoholic|beer|wine|spirit|company|corporation|liqueur', fd_us_soda: 'alcoholic|beer|wine|company|corporation', fd_cereal: 'company|grain|crop|plant',
  fd_dish: 'company|restaurant chain', fd_us_food: 'company|restaurant chain', fd_uk_food: 'company|restaurant chain', vg_best: 'company|developer|publisher|series', vg_mobile: 'company|developer',
  pl_cities: 'county|province|district|region|state', pl_uk: 'county|district|region', n_cats: 'big cat|wild', car_super: 'company|manufacturer|racing team', car_jdm: 'company|manufacturer',
  mu_kpop: 'song|album|single', mb_all: 'song|album|single', al_greatest: 'song|single', al_modern: 'song|single' };
for (const [id, re] of Object.entries(MUST)) {
  if (!GROW[id]) continue;
  const add = g => ({ ...g, must: re, ...(NOT[id] ? { not: NOT[id] } : {}) });
  GROW[id] = Array.isArray(GROW[id]) ? GROW[id].map(add) : add(GROW[id]);
}
export const MUST_IDS = Object.keys(MUST);

/* ---- Audit fixes (every category reviewed) ---- */
// Wikidata's data is too thin/odd here: hand-picked lists only.
for (const id of ['fd_dessert', 'fd_candy', 'fd_choc', 'fd_drinks', 'fd_cereal', 'fd_uk_food', 'fd_us_candy', 'fd_us_soda', 'fd_coffee', 'fd_pizza_chains', 'car_hot',
  'cr_beauty', 'm_heroes', 'm_norse', 'al_uk', 'al_hiphop', 'al_rock', 'mu_now', 'mc_marvel']) delete GROW[id];
const ANGLO_MUSIC = ['us', 'uk', 'ca', 'au', 'ie', 'nz'];
const BRIT = 'British|English|Scottish|Welsh|Northern Irish|UK';
const patch = (id, extra) => { if (!GROW[id]) return; GROW[id] = Array.isArray(GROW[id]) ? GROW[id].map(g => ({ ...g, ...extra })) : { ...GROW[id], ...extra }; };
for (const id of ['mu_pop', 'mu_divas', 'mu_rb', 'mu_rock', 'mu_country', 'md_2010', 'md_2000', 'md_1990', 'md_1980', 'mu_popgirls', 'mu_rnb00', 'mu_90shiphop', 'mu_rap', 'mu_rapnow', 'mu_countrynow', 'mb_all']) patch(id, { country: ANGLO_MUSIC });
patch('mu_rap', { must: 'rapper|hip hop|hip-hop|MC' }); patch('mu_rapnow', { must: 'rapper|hip hop|hip-hop' }); patch('mu_90shiphop', { must: 'rapper|hip hop|hip-hop' });
patch('uk_grime', { must: 'rapper|grime|MC|drill', also: BRIT });
patch('mu_rock', { must: 'rock|metal|punk|grunge|guitarist|frontman|lead singer|vocalist' });
patch('mu_country', { must: 'country' }); patch('mu_countrynow', { must: 'country' });
patch('mu_divas', { must: 'singer' }); patch('mu_popgirls', { must: 'singer' }); patch('uk_pop', { must: 'singer|songwriter|musician', also: BRIT });
patch('mu_latin', { also: 'Latin|Puerto Ric|Colombian|Mexican|Spanish|Argentin|Cuban|Dominican|Venezuelan|Chilean|Peruvian|Brazilian|Panamanian|Ecuadorian|Uruguayan|Guatemalan' });
for (const id of ['al_greatest', 'al_modern', 'al_pop']) patch(id, { must: 'studio album', head: false, not: 'compilation|live album|soundtrack|EP|remix' });
patch('vg_chars', { must: 'video game|game character|Nintendo|Sega|Capcom|Pokémon|Mario|Sonic|Street Fighter|Mortal Kombat|Tekken|Final Fantasy|Zelda|Halo|Overwatch', head: false });
patch('vg_nintendo', { must: 'Nintendo|Mario|Zelda|Pokémon|Kirby|Donkey Kong|Metroid|Animal Crossing|Star Fox|Fire Emblem|Splatoon|Xenoblade|F-Zero|Pikmin|Wario|Yoshi|EarthBound|Kid Icarus', head: false });
patch('tch_icons', { not: 'Tolkien|legendarium|Conan Doyle|Star Wars|DC Comics|Marvel Comics|comic|novel|Journey to the West|literary|mytholog|video game|film series' });
patch('a_brits', { also: BRIT }); patch('a_com', { must: 'comedian|comedy|comic actor' });
patch('a_action', { where: '?item wdt:P106 ?o2 . VALUES ?o2L { "martial artist"@en "bodybuilder"@en "kickboxer"@en } ?o2 rdfs:label ?o2L .' });
patch('a_reality', { must: 'television personality|reality|socialite|media personality|TV personality|star of' });
patch('a_ceos', { must: 'business|entrepreneur|executive|investor|founder|CEO|magnate|industrialist|billionaire' });
patch('a_chefs', { must: 'chef|cook|restaurateur|culinary|baker|food writer' }); patch('a_models', { must: 'model' });
patch('tc_late', { must: 'talk show|television host|TV host|late-night|presenter|broadcaster|comedian|host' });
patch('cr_pods', { must: 'podcast|comedian|host|presenter|broadcaster', not: 'political|politic|conservative|commentator|pundit|activist|far-right|journalist' });
for (const id of ['cr_us', 'cr_uk', 'cr_yt', 'cr_stream', 'cr_gaming', 'cr_tiktok']) patch(id, { not: 'political|politic|commentator|pundit|activist|far-right' });
patch('c_ufc_goat', { must: 'mixed martial|UFC|MMA', not: 'kickboxer|influencer|professional wrestler' });
patch('c_box', { not: 'rugby|wrestler|actor' });
for (const id of ['a_nfl_all', 'a_nfl_now', 'a_nfl_qbs']) patch(id, { must: 'american football|quarterback|NFL|football player', not: 'association football|soccer|wrestler|sprinter|actor' });
patch('a_wnba', { sex: 'f' }); patch('g_olymp', { not: 'princess|royal' }); patch('g_rugby', { born: [1940] }); patch('g_golf', { born: [1900] });
patch('fd_fast', { country: ANGLO_MUSIC, must: 'fast food|fast-food|fast casual|quick-service|drive-in|hamburger|burger|fried chicken|pizza|sandwich|taco|doughnut|chicken', not: 'casual dining|steakhouse|family restaurant|theme restaurant|sports bar' });
patch('fd_us_fast', { must: 'fast food|fast-food|fast casual|quick-service|drive-in|hamburger|burger|fried chicken|pizza|sandwich|taco|chicken', not: 'casual dining|steakhouse|family restaurant|theme restaurant|sports bar|doughnut|coffee' });
patch('fd_us_sit', { must: 'casual dining|restaurant chain|steakhouse|diner|family restaurant|bar and grill|buffet|seafood|pancake', not: 'fast food|fast-food|fast casual|quick-service|pizza delivery|coffee|doughnut' });
patch('fd_dish', { minLinks: 40 }); patch('fd_us_food', { minLinks: 15 });
patch('car_brands', { must: 'car manufacturer|automobile manufacturer|automaker|car brand|marque|car maker|automotive', not: 'subsidiary|holding|motorcycle|truck manufacturer|division|group|tractor|bus', minLinks: 30 });
patch('car_usbrands', { must: 'car manufacturer|automobile manufacturer|automaker|car brand|marque|car maker|automotive|automobile', not: 'self-driving|motorcycle|truck manufacturer|tractor|bus|subsidiary|division' });
patch('car_jdm', { sub: ['sports car', 'grand tourer'] }); patch('car_trucks', { minLinks: 15 });
patch('car_ev', { must: 'electric|battery', not: 'scooter|^(class|type) of|motorcycle|bicycle' });
patch('pl_parks', { not: 'abandoned|ghost|city park|public park|garden' });
patch('hg_empires', { must: 'empire|dynasty|caliphate|khanate|sultanate' }); patch('hg_civil', { must: 'civil rights|abolitionist|suffrag|activist' });
patch('m_egypt', { also: 'Egypt' }); patch('m_greek', { also: 'Greek' }); patch('m_creatures', { minLinks: 15 });
patch('f_eu_clubs', { country: ['uk', 'es', 'it', 'de', 'fr', 'pt', 'nl', 'tr', 'be', 'gr', 'sc', 'at', 'ch', 'ru', 'ua'] });
