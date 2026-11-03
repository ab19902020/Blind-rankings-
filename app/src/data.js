// Category & challenge data
export const THEME = { 
            movies: { primary: '#FFB800', secondary: '#FF3D5A', shadow: 'rgba(255, 184, 0, 0.5)' }, 
            tv: { primary: '#D946EF', secondary: '#7C3AED', shadow: 'rgba(217, 70, 239, 0.5)' },
            anime: { primary: '#FF4500', secondary: '#FF8C00', shadow: 'rgba(255, 69, 0, 0.5)' },
            sports: { primary: '#00D4FF', secondary: '#0066FF', shadow: 'rgba(0, 212, 255, 0.5)' }, 
            creators: { primary: '#FF0000', secondary: '#AA0000', shadow: 'rgba(255, 0, 0, 0.5)' },
            music: { primary: '#FF0080', secondary: '#FFB800', shadow: 'rgba(255, 0, 128, 0.5)' },
            games: { primary: '#00FF41', secondary: '#008F11', shadow: 'rgba(0, 255, 65, 0.5)' },
            food: { primary: '#FF5722', secondary: '#FFC107', shadow: 'rgba(255, 87, 34, 0.5)' },
            history: { primary: '#D4AF37', secondary: '#8B4513', shadow: 'rgba(212, 175, 55, 0.5)' },
            nature: { primary: '#10B981', secondary: '#047857', shadow: 'rgba(16, 185, 129, 0.5)' },
            actors: { primary: '#F43F5E', secondary: '#BE123C', shadow: 'rgba(244, 63, 94, 0.5)' },
            myths: { primary: '#8B5CF6', secondary: '#4C1D95', shadow: 'rgba(139, 92, 246, 0.5)' },
            
            utd: { primary: '#DA291C', secondary: '#000000', shadow: 'rgba(218, 41, 28, 0.5)' },
            madrid: { primary: '#FEBE10', secondary: '#FFFFFF', shadow: 'rgba(254, 190, 16, 0.5)' },
            barca: { primary: '#A50044', secondary: '#004D98', shadow: 'rgba(165, 0, 68, 0.5)' },
            arsenal: { primary: '#EF0107', secondary: '#FFFFFF', shadow: 'rgba(239, 1, 7, 0.5)' },
            chelsea: { primary: '#034694', secondary: '#C1D8FF', shadow: 'rgba(3, 70, 148, 0.5)' },
            liverpool: { primary: '#C8102E', secondary: '#00B2A9', shadow: 'rgba(200, 16, 46, 0.5)' },
            city: { primary: '#6CABDD', secondary: '#1C2C5B', shadow: 'rgba(108, 171, 221, 0.5)' },
            bayern: { primary: '#DC052D', secondary: '#0066B2', shadow: 'rgba(220, 5, 45, 0.5)' }
        };

export const MENU_DATA = {
            domain: [
                { type: 'nav', id: 'movies', name: 'MOVIES', icon: 'popcorn', desc: 'FRANCHISES, CHARACTERS' },
                { type: 'nav', id: 'tv', name: 'TV SHOWS', icon: 'tv', desc: 'NETWORKS, CARTOONS' },
                { type: 'nav', id: 'anime', name: 'ANIME', icon: 'star', desc: 'SHONEN, GHIBLI, LEGENDS' },
                { type: 'nav', id: 'actors', name: 'CELEBS', icon: 'users', desc: 'A-LISTERS, HOLLYWOOD' },
                { type: 'nav', id: 'sports', name: 'SPORTS', icon: 'trophy', desc: 'FOOTBALL, NBA, UFC, F1' },
                { type: 'nav', id: 'creators', name: 'CREATORS', icon: 'play', desc: 'YOUTUBE, TWITCH' },
                { type: 'nav', id: 'music', name: 'MUSIC', icon: 'music', desc: 'POP, RAP, ROCK, K-POP' },
                { type: 'nav', id: 'games', name: 'GAMING', icon: 'gamepad', desc: 'CHARACTERS, BOSSES' },
                { type: 'nav', id: 'nature', name: 'NATURE', icon: 'leaf', desc: 'DOGS, DINOS, DEADLY' },
                { type: 'nav', id: 'food', name: 'FOOD', icon: 'burger', desc: 'FAST FOOD, CEREAL, CANDY' },
                { type: 'nav', id: 'history', name: 'HISTORY', icon: 'globe', desc: 'LANDMARKS, FLAGS, FIGURES' },
                { type: 'nav', id: 'myths', name: 'MYTHS', icon: 'zap', desc: 'GREEK GODS, CRYPTIDS' }
            ],
            
            // --- NEW DOMAINS ---
            nature: [
                { type: 'wiki', id: 'n_dogs', name: 'Dog Breeds', icon: '🐕', items: ["Golden Retriever", "German Shepherd", "Pug", "Siberian Husky", "Bulldog", "Poodle", "Beagle", "Rottweiler", "Dachshund", "Pembroke Welsh Corgi", "Dobermann", "Great Dane", "Shih Tzu", "Boxer (dog)", "Chihuahua (dog)", "Border Collie", "Australian Shepherd", "French Bulldog", "Shiba Inu", "Dalmatian (dog)"] },
                { type: 'wiki', id: 'n_deadly', name: 'Deadliest Animals', icon: '🦈', items: ["Great white shark", "Hippopotamus", "Saltwater crocodile", "Polar bear", "Lion", "Tiger", "King cobra", "Black mamba", "Grizzly bear", "Leopard", "Orca", "Box jellyfish", "Mosquito", "Komodo dragon", "Cape buffalo", "African elephant", "Tsetse fly", "Stonefish", "Deathstalker"] },
                { type: 'wiki', id: 'n_dinos', name: 'Dinosaurs', icon: '🦖', items: ["Tyrannosaurus", "Triceratops", "Velociraptor", "Stegosaurus", "Brachiosaurus", "Spinosaurus", "Ankylosaurus", "Diplodocus", "Allosaurus", "Pteranodon", "Iguanodon", "Parasaurolophus", "Carnotaurus", "Dilophosaurus", "Baryonyx"] }
            ],
            actors: [
                { type: 'custom', id: 'a_men', name: 'Leading Men', icon: '🕴️', queries: [{ q: "Leonardo DiCaprio", n: "Leonardo DiCaprio", t: "person" }, { q: "Brad Pitt", n: "Brad Pitt", t: "person" }, { q: "Tom Cruise", n: "Tom Cruise", t: "person" }, { q: "Denzel Washington", n: "Denzel Washington", t: "person" }, { q: "Christian Bale", n: "Christian Bale", t: "person" }, { q: "Matthew McConaughey", n: "Matthew McConaughey", t: "person" }, { q: "Ryan Gosling", n: "Ryan Gosling", t: "person" }, { q: "Johnny Depp", n: "Johnny Depp", t: "person" }, { q: "Will Smith", n: "Will Smith", t: "person" }, { q: "Tom Hanks", n: "Tom Hanks", t: "person" }, { q: "Keanu Reeves", n: "Keanu Reeves", t: "person" }, { q: "Hugh Jackman", n: "Hugh Jackman", t: "person" }, { q: "Chris Hemsworth", n: "Chris Hemsworth", t: "person" }, { q: "Cillian Murphy", n: "Cillian Murphy", t: "person" }, { q: "Timothée Chalamet", n: "Timothée Chalamet", t: "person" }] },
                { type: 'custom', id: 'a_women', name: 'Leading Ladies', icon: '💃', queries: [{ q: "Margot Robbie", n: "Margot Robbie", t: "person" }, { q: "Zendaya", n: "Zendaya", t: "person" }, { q: "Scarlett Johansson", n: "Scarlett Johansson", t: "person" }, { q: "Jennifer Lawrence", n: "Jennifer Lawrence", t: "person" }, { q: "Emma Stone", n: "Emma Stone", t: "person" }, { q: "Natalie Portman", n: "Natalie Portman", t: "person" }, { q: "Angelina Jolie", n: "Angelina Jolie", t: "person" }, { q: "Charlize Theron", n: "Charlize Theron", t: "person" }, { q: "Anne Hathaway", n: "Anne Hathaway", t: "person" }, { q: "Meryl Streep", n: "Meryl Streep", t: "person" }, { q: "Florence Pugh", n: "Florence Pugh", t: "person" }, { q: "Anya Taylor-Joy", n: "Anya Taylor-Joy", t: "person" }, { q: "Sydney Sweeney", n: "Sydney Sweeney", t: "person" }, { q: "Ana de Armas", n: "Ana de Armas", t: "person" }] },
                { type: 'custom', id: 'a_com', name: 'Comedy Stars', icon: '😂', queries: [ { q: "Jim Carrey", n: "Jim Carrey", t: "person" }, { q: "Will Ferrell", n: "Will Ferrell", t: "person" }, { q: "Mike Myers", n: "Mike Myers", t: "person" }, { q: "Rowan Atkinson", n: "Rowan Atkinson", t: "person" }, { q: "Sacha Baron Cohen", n: "Sacha Baron Cohen", t: "person" }, { q: "Jack Black", n: "Jack Black", t: "person" }, { q: "Adam Sandler", n: "Adam Sandler", t: "person" }, { q: "Steve Carell", n: "Steve Carell", t: "person" }, { q: "Robin Williams", n: "Robin Williams", t: "person" }, { q: "Kevin Hart", n: "Kevin Hart", t: "person" }, { q: "Seth Rogen", n: "Seth Rogen", t: "person" }, { q: "Jonah Hill", n: "Jonah Hill", t: "person" }, { q: "Melissa McCarthy", n: "Melissa McCarthy", t: "person" } ]}
            ],
            myths: [
                { type: 'wiki', id: 'm_greek', name: 'Greek Gods', icon: '⚡', items: ["Zeus", "Poseidon", "Hades", "Athena", "Ares", "Apollo", "Artemis", "Aphrodite", "Hermes", "Hera", "Hephaestus", "Dionysus", "Demeter", "Hestia", "Persephone"] },
                { type: 'wiki', id: 'm_cryptids', name: 'Cryptids & Legends', icon: '👁️', items: ["Bigfoot", "Loch Ness Monster", "Mothman", "Chupacabra", "Yeti", "Kraken", "Wendigo", "Jersey Devil", "Jackalope", "Slender Man", "Mongolian death worm", "Thunderbird (mythology)"] }
            ],

            // --- EXPANDED EXISTING DOMAINS ---
            movies: [
                { type: 'game', id: 'm_trend', name: 'TRENDING NOW', icon: '🔥', endpoint: '/discover/movie?sort_by=popularity.desc&primary_release_date.gte=2024-01-01&vote_count.gte=100' },
                { type: 'game', id: 'm_pop', name: 'ALL-TIME GREATS', icon: '⭐', endpoint: '/discover/movie?sort_by=vote_count.desc&vote_average.gte=8' },
                { type: 'nav', id: 'm_chars', name: 'CHARACTERS', icon: '🦹‍♂️', desc: 'VILLAINS, HEROES, DISNEY' },
                { type: 'nav', id: 'm_franchises', name: 'FRANCHISES', icon: '🍿', desc: 'MCU, STAR WARS' },
                { type: 'nav', id: 'm_genres', name: 'BY GENRE', icon: '🎭', desc: 'SCIFI, HORROR' },
                { type: 'nav', id: 'm_dirs', name: 'DIRECTORS', icon: '🎬', desc: 'NOLAN, TARANTINO' },
                { type: 'nav', id: 'm_studios', name: 'STUDIOS', icon: '🏰', desc: 'A24, DISNEY, WB' },
                { type: 'nav', id: 'm_decades', name: 'DECADES', icon: '⏳', desc: '80s, 90s, 00s' },
            ],
            m_chars: [
                { type: 'custom', id: 'mc_villains', name: 'Movie Villains', icon: '😈', queries: [ { q: "Heath Ledger", n: "The Joker", t: "person" }, { q: "Ralph Fiennes", n: "Voldemort", t: "person" }, { q: "Mads Mikkelsen", n: "Hannibal Lecter", t: "person" }, { q: "Josh Brolin", n: "Thanos", t: "person" }, { q: "Christoph Waltz", n: "Hans Landa", t: "person" }, { q: "Javier Bardem", n: "Anton Chigurh", t: "person" }, { q: "Christian Bale", n: "Patrick Bateman", t: "person" }, { q: "Tom Hiddleston", n: "Loki", t: "person" }, { q: "Willem Dafoe", n: "Green Goblin", t: "person" }, { q: "Tom Hardy", n: "Bane", t: "person" }, { q: "Rosamund Pike", n: "Amy Dunne", t: "person" }, { q: "Anthony Hopkins", n: "Hannibal", t: "person" }, { q: "Jack Nicholson", n: "Jack Torrance", t: "person" }, { q: "Anthony Perkins", n: "Norman Bates", t: "person" }, { q: "Robert Englund", n: "Freddy Krueger", t: "person" }, { q: "James Earl Jones", n: "Darth Vader", t: "person" }, { q: "Hugo Weaving", n: "Agent Smith", t: "person" }, { q: "Robert Patrick", n: "T-1000", t: "person" }, { q: "Ian McKellen", n: "Magneto", t: "person" }, { q: "Bill Skarsgård", n: "Pennywise", t: "person" }, { q: "Tobin Bell", n: "Jigsaw", t: "person" }, { q: "Gunnar Hansen", n: "Leatherface", t: "person" }, { q: "Andy Serkis", n: "Gollum", t: "person" }, { q: "Ian McDiarmid", n: "Emperor Palpatine", t: "person" } ]},
                { type: 'custom', id: 'mc_heroes', name: 'Movie Heroes', icon: '🦸‍♂️', queries: [ { q: "Harrison Ford", n: "Indiana Jones", t: "person" }, { q: "Keanu Reeves", n: "Neo", t: "person" }, { q: "Robert Downey Jr", n: "Iron Man", t: "person" }, { q: "Chris Evans", n: "Captain America", t: "person" }, { q: "Daniel Craig", n: "James Bond", t: "person" }, { q: "Sigourney Weaver", n: "Ellen Ripley", t: "person" }, { q: "Sylvester Stallone", n: "Rocky Balboa", t: "person" }, { q: "Hugh Jackman", n: "Wolverine", t: "person" }, { q: "Henry Cavill", n: "Superman", t: "person" }, { q: "Tom Holland", n: "Spider-Man", t: "person" }, { q: "Tom Cruise", n: "Ethan Hunt", t: "person" }, { q: "Chris Hemsworth", n: "Thor", t: "person" }, { q: "Mark Hamill", n: "Luke Skywalker", t: "person" }, { q: "Daniel Radcliffe", n: "Harry Potter", t: "person" }, { q: "Christian Bale", n: "Bruce Wayne", t: "person" }, { q: "Gal Gadot", n: "Diana Prince", t: "person" }, { q: "Viggo Mortensen", n: "Aragorn", t: "person" }, { q: "Bruce Willis", n: "John McClane", t: "person" } ]},
                { type: 'custom', id: 'mc_killers', name: 'Horror Killers', icon: '🔪', queries: [ { q: "Halloween 1978", n: "Michael Myers", t: "movie" }, { q: "A Nightmare on Elm Street 1984", n: "Freddy Krueger", t: "movie" }, { q: "Friday the 13th 1980", n: "Jason Voorhees", t: "movie" }, { q: "The Texas Chain Saw Massacre", n: "Leatherface", t: "movie" }, { q: "Scream 1996", n: "Ghostface", t: "movie" }, { q: "Child's Play 1988", n: "Chucky", t: "movie" }, { q: "It 2017", n: "Pennywise", t: "movie" }, { q: "Saw 2004", n: "Jigsaw", t: "movie" }, { q: "Psycho 1960", n: "Norman Bates", t: "movie" }, { q: "The Ring", n: "Samara", t: "movie" }, { q: "Hellraiser", n: "Pinhead", t: "movie" }, { q: "Candyman", n: "Candyman", t: "movie" } ]},
                { type: 'wiki', id: 'mc_finalgirls', name: 'Horror Final Girls', icon: '🩸', items: ["Laurie Strode", "Sidney Prescott", "Ellen Ripley", "Nancy Thompson", "Sally Hardesty", "Alice Hardy", "Ginny Field", "Kirsty Cotton", "Julie James", "Gale Weathers", "Erin (You're Next)", "Tree Gelbman", "Grace Le Domas", "Dani Ardor", "Maxine Minx", "Mia Allen", "Needy Lesnicki", "Clear Rivers", "Marybeth Dunston", "Sarah Carter (The Descent)", "Suzy Bannion", "Chris MacNeil"] },
                { type: 'wiki', id: 'mc_disney', name: 'Disney & Pixar', icon: '✨', items: ["Mickey Mouse", "Donald Duck", "Goofy", "Woody (Toy Story)", "Buzz Lightyear", "Simba", "Ariel (The Little Mermaid)", "Belle (Disney)", "Cinderella (Disney character)", "Snow White (Disney character)", "Mulan (Disney character)", "Elsa (Frozen)", "Anna (Frozen)", "Moana (character)", "Rapunzel (Tangled)", "Aladdin (Disney character)", "Genie (Disney)", "Peter Pan (Disney character)", "Winnie the Pooh (Disney character)", "Stitch (Lilo & Stitch)", "Nemo (Finding Nemo)", "Dory (Finding Nemo)", "Mr. Incredible", "Elastigirl", "Wall-E (character)", "Lightning McQueen", "Mike Wazowski", "James P. Sullivan", "Joy (Inside Out)", "Sadness (Inside Out)", "Miguel (Coco)"] }
            ],
            m_franchises: [
                { type: 'game', id: 'fr_mcu', name: 'Marvel Cinematic Universe', icon: '🦸‍♂️', endpoint: '/discover/movie?with_companies=420' },
                { type: 'game', id: 'fr_sw', name: 'Star Wars Universe', icon: '⚔️', endpoint: '/discover/movie?with_companies=1&with_keywords=11195' },
                { type: 'game', id: 'fr_lotr', name: 'Lord of the Rings', icon: '🧝‍♂️', endpoint: '/discover/movie?with_keywords=1190' },
                { type: 'game', id: 'fr_bond', name: 'James Bond (007)', icon: '🕵️‍♂️', endpoint: '/discover/movie?with_keywords=10620' },
                { type: 'game', id: 'fr_dc', name: 'DC Universe', icon: '🦇', endpoint: '/discover/movie?with_companies=12806,9993,429' },
                { type: 'game', id: 'fr_hp', name: 'Harry Potter', icon: '⚡', endpoint: '/discover/movie?with_keywords=6956' },
            ],
            m_genres: [
                { type: 'game', id: 'g_act', name: 'Action', icon: '💥', endpoint: '/discover/movie?with_genres=28&vote_count.gte=1000' },
                { type: 'game', id: 'g_hor', name: 'Horror', icon: '🔪', endpoint: '/discover/movie?with_genres=27&vote_count.gte=1000' },
                { type: 'game', id: 'g_com', name: 'Comedy', icon: '😂', endpoint: '/discover/movie?with_genres=35&vote_count.gte=1000' },
                { type: 'game', id: 'g_sci', name: 'Sci-Fi', icon: '👽', endpoint: '/discover/movie?with_genres=878&vote_count.gte=1000' },
                { type: 'game', id: 'g_rom', name: 'Romance', icon: '❤️', endpoint: '/discover/movie?with_genres=10749&vote_count.gte=1000' },
                { type: 'game', id: 'g_dra', name: 'Drama', icon: '🍷', endpoint: '/discover/movie?with_genres=18&vote_count.gte=1500' },
            ],
            m_dirs: [
                { type: 'game', id: 'd_nolan', name: 'C. Nolan', icon: '⏳', endpoint: '/discover/movie?with_crew=525' },
                { type: 'game', id: 'd_taran', name: 'Q. Tarantino', icon: '🩸', endpoint: '/discover/movie?with_crew=138' },
                { type: 'game', id: 'd_scors', name: 'M. Scorsese', icon: '🕴️', endpoint: '/discover/movie?with_crew=224' },
                { type: 'game', id: 'd_spiel', name: 'S. Spielberg', icon: '🦖', endpoint: '/discover/movie?with_crew=488' },
                { type: 'game', id: 'd_kubri', name: 'S. Kubrick', icon: '👁️', endpoint: '/discover/movie?with_crew=240' },
                { type: 'game', id: 'd_finch', name: 'D. Fincher', icon: '📦', endpoint: '/discover/movie?with_crew=7467' },
            ],
            m_studios: [
                { type: 'game', id: 's_a24', name: 'A24', icon: '✨', endpoint: '/discover/movie?with_companies=3166|41077&vote_count.gte=200' },
                { type: 'game', id: 's_dis', name: 'Disney', icon: '🏰', endpoint: '/discover/movie?with_companies=2&with_genres=16&vote_count.gte=500' },
                { type: 'game', id: 's_pix', name: 'Pixar', icon: '💡', endpoint: '/discover/movie?with_companies=3&vote_count.gte=500' },
                { type: 'game', id: 's_ghi', name: 'Ghibli', icon: '🍃', endpoint: '/discover/movie?with_companies=10342' },
                { type: 'game', id: 's_wb', name: 'Warner Bros', icon: '🛡️', endpoint: '/discover/movie?with_companies=174&vote_count.gte=1000' },
            ],
            m_decades: [
                { type: 'game', id: 'dec_2020', name: '2020s', icon: '🔥', endpoint: '/discover/movie?primary_release_date.gte=2020-01-01&sort_by=popularity.desc&vote_count.gte=1000' },
                { type: 'game', id: 'dec_2010', name: '2010s', icon: '📱', endpoint: '/discover/movie?primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&sort_by=popularity.desc&vote_count.gte=2000' },
                { type: 'game', id: 'dec_2000', name: '2000s', icon: '💿', endpoint: '/discover/movie?primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&sort_by=popularity.desc&vote_count.gte=1500' },
                { type: 'game', id: 'dec_1990', name: '90s', icon: '📼', endpoint: '/discover/movie?primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&sort_by=popularity.desc&vote_count.gte=1000' },
                { type: 'game', id: 'dec_1980', name: '80s', icon: '🕹️', endpoint: '/discover/movie?primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31&sort_by=popularity.desc&vote_count.gte=500' },
            ],
            tv: [
                { type: 'game', id: 'tv_trend', name: 'TRENDING NOW', icon: '🔥', endpoint: '/discover/tv?sort_by=popularity.desc&first_air_date.gte=2024-01-01&vote_count.gte=100' },
                { type: 'game', id: 'tv_pop', name: 'TOP RATED TV', icon: '⭐', endpoint: '/discover/tv?sort_by=vote_count.desc&vote_average.gte=8' },
                { type: 'nav', id: 'tv_cartoons', name: 'NOSTALGIA CARTOONS', icon: '🧸', desc: 'CN, NICK, DISNEY' },
                { type: 'nav', id: 'tv_nets', name: 'NETWORKS', icon: '📡', desc: 'HBO, NETFLIX, AMC' },
                { type: 'nav', id: 'tv_gens', name: 'BY GENRE', icon: '🎭', desc: 'SITCOMS, SCIFI' },
                { type: 'nav', id: 'tv_real', name: 'REALITY TV', icon: '🎤', desc: 'DATING, COOKING' },
            ],
            tv_cartoons: [
                { type: 'custom', id: 'ct_cn', name: 'Cartoon Network', icon: '🔲', queries: [ { q: "Ben 10", n: "Ben 10", t: "tv" }, { q: "Teen Titans", n: "Teen Titans", t: "tv" }, { q: "Regular Show", n: "Regular Show", t: "tv" }, { q: "Adventure Time", n: "Adventure Time", t: "tv" }, { q: "Dexter's Laboratory", n: "Dexter's Laboratory", t: "tv" }, { q: "The Powerpuff Girls", n: "The Powerpuff Girls", t: "tv" }, { q: "Samurai Jack", n: "Samurai Jack", t: "tv" }, { q: "Ed, Edd n Eddy", n: "Ed, Edd n Eddy", t: "tv" }, { q: "Courage the Cowardly Dog", n: "Courage the Cowardly Dog", t: "tv" }, { q: "Codename: Kids Next Door", n: "Codename: Kids Next Door", t: "tv" }, { q: "The Amazing World of Gumball", n: "The Amazing World of Gumball", t: "tv" }, { q: "Foster's Home for Imaginary Friends", n: "Foster's Home", t: "tv" } ]},
                { type: 'custom', id: 'ct_nick', name: 'Nickelodeon', icon: '🟧', queries: [ { q: "SpongeBob SquarePants", n: "SpongeBob", t: "tv" }, { q: "Avatar: The Last Airbender", n: "Avatar: TLA", t: "tv" }, { q: "The Fairly OddParents", n: "Fairly OddParents", t: "tv" }, { q: "Danny Phantom", n: "Danny Phantom", t: "tv" }, { q: "Jimmy Neutron", n: "Jimmy Neutron", t: "tv" }, { q: "Rugrats", n: "Rugrats", t: "tv" }, { q: "Hey Arnold!", n: "Hey Arnold!", t: "tv" }, { q: "Invader Zim", n: "Invader Zim", t: "tv" }, { q: "CatDog", n: "CatDog", t: "tv" }, { q: "The Ren & Stimpy Show", n: "Ren & Stimpy", t: "tv" }, { q: "Drake & Josh", n: "Drake & Josh", t: "tv" }, { q: "iCarly", n: "iCarly", t: "tv" } ]},
                { type: 'custom', id: 'ct_disney', name: 'Disney Channel', icon: '✨', queries: [ { q: "Phineas and Ferb", n: "Phineas and Ferb", t: "tv" }, { q: "Gravity Falls", n: "Gravity Falls", t: "tv" }, { q: "The Suite Life of Zack & Cody", n: "Suite Life", t: "tv" }, { q: "Wizards of Waverly Place", n: "Wizards of Waverly Place", t: "tv" }, { q: "Hannah Montana", n: "Hannah Montana", t: "tv" }, { q: "Kim Possible", n: "Kim Possible", t: "tv" }, { q: "That's So Raven", n: "That's So Raven", t: "tv" }, { q: "The Proud Family", n: "The Proud Family", t: "tv" }, { q: "Lizzie McGuire", n: "Lizzie McGuire", t: "tv" }, { q: "Good Luck Charlie", n: "Good Luck Charlie", t: "tv" } ]}
            ],
            tv_nets: [
                { type: 'game', id: 'n_hbo', name: 'HBO Prestige', icon: '👑', endpoint: '/discover/tv?with_networks=49&vote_count.gte=500' },
                { type: 'game', id: 'n_net', name: 'Netflix', icon: 'N', endpoint: '/discover/tv?with_networks=213&vote_count.gte=500' },
                { type: 'game', id: 'n_amc', name: 'AMC Dramas', icon: '🧟', endpoint: '/discover/tv?with_networks=174&vote_count.gte=300' },
                { type: 'game', id: 'n_app', name: 'Apple TV+', icon: '🍎', endpoint: '/discover/tv?with_networks=2552&vote_count.gte=100' },
                { type: 'game', id: 'n_prim', name: 'Amazon Prime', icon: '📦', endpoint: '/discover/tv?with_networks=1024&vote_count.gte=200' },
            ],
            tv_gens: [
                { type: 'game', id: 'g_sit', name: 'Sitcoms', icon: '🛋️', endpoint: '/discover/tv?with_genres=35&vote_count.gte=500' },
                { type: 'game', id: 'g_dra', name: 'Drama', icon: '🍷', endpoint: '/discover/tv?with_genres=18&vote_count.gte=500' },
                { type: 'game', id: 'g_sci', name: 'Sci-Fi/Fantasy', icon: '🐉', endpoint: '/discover/tv?with_genres=10765&vote_count.gte=500' },
                { type: 'game', id: 'g_cri', name: 'Crime/Mystery', icon: '🔍', endpoint: '/discover/tv?with_genres=80,9648&vote_count.gte=300' },
            ],
            tv_real: [
                { type: 'game', id: 'rt_all', name: 'All Reality', icon: '📺', endpoint: '/discover/tv?with_genres=10764&vote_count.gte=50' },
                { type: 'game', id: 'rt_comp', name: 'Competition', icon: '🏆', endpoint: '/discover/tv?with_genres=10764&with_keywords=271217' },
                { type: 'game', id: 'rt_date', name: 'Dating', icon: '💔', endpoint: '/discover/tv?with_genres=10764&with_keywords=10636' },
            ],
            anime: [
                { type: 'game', id: 'an_trend', name: 'TRENDING ANIME', icon: '🔥', endpoint: '/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&first_air_date.gte=2024-01-01' },
                { type: 'game', id: 'an_pop', name: 'TOP RATED ANIME', icon: '⭐', endpoint: '/discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_count.desc' },
                { type: 'wiki', id: 'an_shonen', name: 'Shonen Legends', icon: '⚔️', items: ["Naruto Uzumaki", "Monkey D. Luffy", "Goku", "Ichigo Kurosaki", "Izuku Midoriya", "Tanjiro Kamado", "Yuji Itadori", "Eren Yeager", "Edward Elric", "Gon Freecss", "Yusuke Urameshi", "Asta", "Saitama (One Punch Man)", "Light Yagami", "Lelouch vi Britannia", "Gintoki Sakata", "Levi Ackerman", "Sasuke Uchiha", "Vegeta", "Roronoa Zoro", "Killua Zoldyck", "Kakashi Hatake", "Itachi Uchiha", "Gojo Satoru"] },
                { type: 'game', id: 'an_ghibli', name: 'Studio Ghibli', icon: '🍃', endpoint: '/discover/movie?with_companies=10342' },
            ],
            creators: [
                { type: 'wiki', id: 'cr_yt', name: 'Top YouTubers', icon: '▶️', items: ["MrBeast", "PewDiePie", "Markiplier", "Jacksepticeye", "KSI", "Logan Paul", "Jake Paul", "Dude Perfect", "Emma Chamberlain", "Marques Brownlee", "Smosh", "Ryan Higa", "Lilly Singh", "David Dobrik", "Casey Neistat", "Ninja (gamer)", "Dream (YouTuber)", "TommyInnit", "Fidelitas", "Rhett and Link", "DanTDM", "ZHC", "LazarBeam", "Airrack", "IShowSpeed", "Kai Cenat", "xQc", "Pokimane", "Valkyrae", "Ludwig Ahgren"] },
                { type: 'wiki', id: 'cr_stream', name: 'Twitch Legends', icon: '🟪', items: ["Ninja (gamer)", "Shroud (gamer)", "xQc", "Kai Cenat", "Pokimane", "Summit1g", "TimTheTatman", "Dr Disrespect", "Nickmercs", "Lirik", "SypherPK", "Asmongold", "HasanAbi", "Ludwig Ahgren", "Valkyrae", "Kyedae", "Tarik", "TenZ", "Amouranth", "QTCinderella", "Maya Higa", "Ironmouse", "Gawr Gura", "MoistCr1TiKaL", "Jerma985"] }
            ],
            sports: [
                { type: 'nav', id: 'sp_foot_clubs', name: 'FOOTBALL CLUBS', icon: '🛡️', desc: 'MAN UTD, MADRID, CITY' },
                { type: 'nav', id: 'sp_foot', name: 'FOOTBALL LEGENDS', icon: '⚽', desc: 'PREMIER LEAGUE, LA LIGA' },
                { type: 'nav', id: 'sp_basket', name: 'BASKETBALL', icon: '🏀', desc: 'NBA LEGENDS, TEAMS' },
                { type: 'nav', id: 'sp_combat', name: 'COMBAT SPORTS', icon: '🥊', desc: 'UFC, BOXING, WWE' },
                { type: 'nav', id: 'sp_amer', name: 'US SPORTS', icon: '🏈', desc: 'NFL, BASEBALL' },
                { type: 'nav', id: 'sp_global', name: 'GLOBAL SPORTS', icon: '🌍', desc: 'F1, TENNIS, GOLF' },
            ],
            sp_foot_clubs: [
                { type: 'wiki', id: 'fc_utd', themeOverride: 'utd', name: 'Man United', icon: '😈', items: ["Wayne Rooney", "Ryan Giggs", "Paul Scholes", "George Best", "Eric Cantona", "Roy Keane", "Peter Schmeichel", "Rio Ferdinand", "David Beckham", "Ruud van Nistelrooy", "Nemanja Vidić", "Marcus Rashford", "Paul Pogba", "Edwin van der Sar", "Patrice Evra"] },
                { type: 'wiki', id: 'fc_madrid', themeOverride: 'madrid', name: 'Real Madrid', icon: '👑', items: ["Cristiano Ronaldo", "Alfredo Di Stéfano", "Raúl (footballer)", "Zinedine Zidane", "Iker Casillas", "Sergio Ramos", "Luka Modrić", "Roberto Carlos", "Luís Figo", "Karim Benzema", "Gareth Bale", "Vinícius Júnior", "Toni Kroos", "Marcelo (footballer, born 1988)"] },
                { type: 'wiki', id: 'fc_barca', themeOverride: 'barca', name: 'Barcelona', icon: '🔴', items: ["Lionel Messi", "Xavi", "Andrés Iniesta", "Ronaldinho", "Johan Cruyff", "Carles Puyol", "Dani Alves", "Luis Suárez", "Neymar", "Rivaldo", "Sergio Busquets", "Gerard Piqué", "Samuel Eto'o", "Víctor Valdés", "Jordi Alba"] },
                { type: 'wiki', id: 'fc_city', themeOverride: 'city', name: 'Man City', icon: '🦅', items: ["Kevin De Bruyne", "Sergio Agüero", "David Silva", "Vincent Kompany", "Yaya Touré", "Erling Haaland", "Phil Foden", "Raheem Sterling", "Bernardo Silva", "Ederson", "Ruben Dias", "Rodri", "Ilkay Gündogan", "Kyle Walker", "John Stones", "Joe Hart", "Pablo Zabaleta", "Fernandinho"] },
                { type: 'wiki', id: 'fc_bayern', themeOverride: 'bayern', name: 'Bayern Munich', icon: '🥨', items: ["Franz Beckenbauer", "Gerd Müller", "Thomas Müller", "Manuel Neuer", "Philipp Lahm", "Bastian Schweinsteiger", "Franck Ribéry", "Arjen Robben", "Robert Lewandowski", "Oliver Kahn", "Karl-Heinz Rummenigge", "Lothar Matthäus", "Sepp Maier", "Joshua Kimmich", "Jamal Musiala", "Alphonso Davies"] },
                { type: 'wiki', id: 'fc_arsenal', themeOverride: 'arsenal', name: 'Arsenal', icon: '🎯', items: ["Thierry Henry", "Dennis Bergkamp", "Patrick Vieira", "Tony Adams", "Ian Wright", "Robert Pires", "David Seaman", "Sol Campbell", "Cesc Fàbregas", "Robin van Persie", "Bukayo Saka", "Jens Lehmann", "Freddie Ljungberg", "Ashley Cole", "Gilberto Silva"] },
                { type: 'wiki', id: 'fc_chelsea', themeOverride: 'chelsea', name: 'Chelsea', icon: '🦁', items: ["Frank Lampard", "John Terry", "Didier Drogba", "Petr Čech", "Eden Hazard", "Ashley Cole", "Gianfranco Zola", "Claude Makélélé", "N'Golo Kanté", "Michael Essien", "Branislav Ivanović", "Ricardo Carvalho", "John Obi Mikel"] },
                { type: 'wiki', id: 'fc_liverpool', themeOverride: 'liverpool', name: 'Liverpool', icon: '🦅', items: ["Steven Gerrard", "Kenny Dalglish", "Ian Rush", "Mohamed Salah", "Virgil van Dijk", "John Barnes", "Robbie Fowler", "Jamie Carragher", "Sadio Mané", "Luis Suárez", "Alisson", "Trent Alexander-Arnold", "Roberto Firmino", "Michael Owen", "Kevin Keegan"] },
            ],
            sp_foot: [
                { type: 'wiki', id: 'f_all', name: 'All-Time Greats', icon: '🐐', items: ["Lionel Messi", "Cristiano Ronaldo", "Pelé", "Diego Maradona", "Zinedine Zidane", "Ronaldo (Brazilian footballer)", "Ronaldinho", "Johan Cruyff", "Thierry Henry", "Andrés Iniesta", "Paolo Maldini", "Lev Yashin", "Franz Beckenbauer", "Alfredo Di Stéfano", "Michel Platini"] },
                { type: 'wiki', id: 'f_prem', name: 'Prem Icons', icon: '🦁', items: ["Thierry Henry", "Alan Shearer", "Wayne Rooney", "Sergio Agüero", "Steven Gerrard", "Frank Lampard", "Kevin De Bruyne", "Ryan Giggs", "Didier Drogba", "Eden Hazard", "Paul Scholes", "Roy Keane", "Eric Cantona", "Patrick Vieira", "David Silva"] },
                { type: 'wiki', id: 'f_liga', name: 'La Liga Icons', icon: '🇪🇸', items: ["Lionel Messi", "Cristiano Ronaldo", "Andrés Iniesta", "Xavi", "Zinedine Zidane", "Ronaldinho", "Sergio Ramos", "Karim Benzema", "Luka Modrić", "Luis Suárez", "Iker Casillas", "Raúl (footballer)", "Roberto Carlos", "Rivaldo", "Dani Alves"] },
            ],
            sp_basket: [
                { type: 'wiki', id: 'b_all', name: 'NBA All-Time', icon: '🐐', items: ["Michael Jordan", "LeBron James", "Kobe Bryant", "Kareem Abdul-Jabbar", "Magic Johnson", "Larry Bird", "Shaquille O'Neal", "Tim Duncan", "Wilt Chamberlain", "Stephen Curry", "Bill Russell", "Hakeem Olajuwon", "Oscar Robertson", "Kevin Durant", "Karl Malone"] },
                { type: 'wiki', id: 'b_mod', name: 'Modern Stars', icon: '🔥', items: ["LeBron James", "Stephen Curry", "Kevin Durant", "Giannis Antetokounmpo", "Nikola Jokić", "Luka Dončić", "Joel Embiid", "Jayson Tatum", "Anthony Edwards (basketball)", "Devin Booker", "Shai Gilgeous-Alexander", "Damian Lillard", "Jimmy Butler", "Kawhi Leonard", "Kyrie Irving"] },
                { type: 'wiki', id: 'b_90', name: '90s & 00s', icon: '📼', items: ["Michael Jordan", "Kobe Bryant", "Shaquille O'Neal", "Allen Iverson", "Vince Carter", "Tracy McGrady", "Kevin Garnett", "Dirk Nowitzki", "Steve Nash", "Jason Kidd", "Tim Duncan", "Paul Pierce", "Ray Allen", "Dwyane Wade", "Carmelo Anthony"] },
            ],
            sp_combat: [
                { type: 'wiki', id: 'c_ufc_goat', name: 'UFC GOATs', icon: '🥋', items: ["Jon Jones", "Georges St-Pierre", "Khabib Nurmagomedov", "Anderson Silva", "Demetrious Johnson", "Amanda Nunes", "Conor McGregor", "Daniel Cormier", "José Aldo", "Max Holloway", "Alexander Volkanovski", "Kamaru Usman", "Israel Adesanya", "Stipe Miocic", "Ronda Rousey"] },
                { type: 'wiki', id: 'c_box', name: 'Boxing Legends', icon: '🥊', items: ["Muhammad Ali", "Mike Tyson", "George Foreman", "Joe Frazier", "Evander Holyfield", "Lennox Lewis", "Tyson Fury", "Oleksandr Usyk", "Deontay Wilder", "Sugar Ray Robinson", "Floyd Mayweather Jr.", "Manny Pacquiao", "Roberto Durán", "Thomas Hearns", "Canelo Álvarez"] },
                { type: 'wiki', id: 'c_wwe_att', name: 'WWE Attitude', icon: '💀', items: ["Stone Cold Steve Austin", "Dwayne Johnson", "The Undertaker", "Mick Foley", "Triple H", "Shawn Michaels", "Ric Flair", "Chris Jericho", "Kurt Angle", "Kane (wrestler)", "Big Show", "Edge (wrestler)", "Christian Cage", "Hardy Boyz", "Dudley Boyz"] },
            ],
            sp_amer: [
                { type: 'wiki', id: 'a_nfl_all', name: 'NFL All-Time', icon: '🏈', items: ['Tom Brady', 'Peyton Manning', 'Aaron Rodgers', 'Patrick Mahomes', 'Jerry Rice', 'Rob Gronkowski', 'Brett Favre', 'Drew Brees', 'Lawrence Taylor', 'Jim Brown', 'Randy Moss', 'Deion Sanders', 'Joe Montana', 'Dan Marino', 'Emmitt Smith'] },
                { type: 'wiki', id: 'a_mlb', name: 'MLB Legends', icon: '⚾', items: ['Babe Ruth', 'Willie Mays', 'Hank Aaron', 'Ted Williams', 'Barry Bonds', 'Ken Griffey Jr.', 'Derek Jeter', 'Mike Trout', 'Shohei Ohtani', 'Albert Pujols', 'Mickey Mantle', 'Lou Gehrig', 'Jackie Robinson', 'Sandy Koufax', 'Pedro Martínez'] },
            ],
            sp_global: [
                { type: 'wiki', id: 'g_f1', name: 'Formula 1', icon: '🏎️', items: ['Lewis Hamilton', 'Michael Schumacher', 'Ayrton Senna', 'Max Verstappen', 'Sebastian Vettel', 'Fernando Alonso', 'Niki Lauda', 'Charles Leclerc', 'Lando Norris', 'Alain Prost', 'Nigel Mansell', 'Jackie Stewart', 'Jim Clark', 'Juan Manuel Fangio', 'Nelson Piquet'] },
                { type: 'wiki', id: 'g_ten', name: 'Tennis', icon: '🎾', items: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Serena Williams', 'Andy Murray', 'Pete Sampras', 'Andre Agassi', 'Maria Sharapova', 'Steffi Graf', 'Carlos Alcaraz', 'Jannik Sinner', 'Daniil Medvedev', 'Björn Borg', 'John McEnroe', 'Jimmy Connors'] },
                { type: 'wiki', id: 'g_golf', name: 'Golf', icon: '⛳', items: ['Tiger Woods', 'Rory McIlroy', 'Jack Nicklaus', 'Arnold Palmer', 'Phil Mickelson', 'Gary Player', 'Ben Hogan', 'Sam Snead', 'Seve Ballesteros', 'Brooks Koepka', 'Scottie Scheffler', 'Jon Rahm', 'Dustin Johnson', 'Jordan Spieth', 'Justin Thomas'] },
            ],
            music: [
                { type: 'nav', id: 'mu_genres', name: 'BY GENRE', icon: '🎧', desc: 'POP, RAP, ROCK, K-POP' },
                { type: 'nav', id: 'mu_bands', name: 'BANDS/GROUPS', icon: '🎸', desc: 'BEATLES, QUEEN...' },
                { type: 'nav', id: 'mu_decades', name: 'BY DECADE', icon: '⏳', desc: '80s, 90s, 00s...' },
            ],
            mu_genres: [
                { type: 'wiki', id: 'mu_pop', name: 'Pop Icons', icon: '🎤', items: ['Michael Jackson', 'Madonna', 'Taylor Swift', 'Lady Gaga', 'Ariana Grande', 'Justin Bieber', 'Katy Perry', 'Britney Spears', 'Adele', 'Beyoncé', 'Ed Sheeran', 'Bruno Mars', 'Dua Lipa', 'Harry Styles', 'The Weeknd'] },
                { type: 'wiki', id: 'mu_rap', name: 'Rap Legends', icon: '🔥', items: ['Eminem', 'Jay-Z', 'Tupac Shakur', 'Snoop Dogg', 'Nas', 'Dr. Dre', 'Kendrick Lamar', 'J. Cole', 'Lil Wayne', '50 Cent', 'The Notorious B.I.G.', 'Ice Cube', 'Tyler, the Creator', 'Drake (musician)', 'Kanye West'] },
                { type: 'wiki', id: 'mu_rock', name: 'Rock Frontmen', icon: '🤘', items: ['Freddie Mercury', 'Mick Jagger', 'Kurt Cobain', 'Paul McCartney', 'John Lennon', 'Elvis Presley', 'David Bowie', 'Jimi Hendrix', 'Elton John', 'Bruce Springsteen', 'Axl Rose', 'Ozzy Osbourne', 'Mick Fleetwood', 'Steven Tyler', 'Robert Plant'] },
                { type: 'wiki', id: 'mu_rb', name: 'R&B / Soul', icon: '🎷', items: ['Whitney Houston', 'Mariah Carey', 'Stevie Wonder', 'Aretha Franklin', 'James Brown', 'Marvin Gaye', 'Ray Charles', 'Alicia Keys', 'John Legend', 'Usher (musician)', 'Rihanna', 'Luther Vandross', 'Frank Ocean', 'SZA', 'Mary J. Blige'] },
                { type: 'wiki', id: 'mu_kpop', name: 'K-Pop Legends', icon: '✨', items: ["BTS", "Blackpink", "EXO", "Twice", "Red Velvet", "Seventeen (South Korean band)", "Stray Kids", "NCT", "Tomorrow X Together", "ENHYPEN", "aespa", "ITZY", "NewJeans", "LE SSERAFIM", "IVE", "Girls' Generation", "Big Bang (South Korean band)", "Super Junior", "SHINee", "2NE1", "G-Dragon", "IU (singer)", "Taeyeon", "Jungkook", "V (singer)", "Jimin", "Lisa (rapper, born 1997)", "Jennie (singer)"] },
            ],
            mu_bands: [
                { type: 'wiki', id: 'mb_all', name: 'Greatest Bands', icon: '🎸', items: ['The Beatles', 'Queen (band)', 'The Rolling Stones', 'Pink Floyd', 'Led Zeppelin', 'Nirvana (band)', 'AC/DC', 'Metallica', 'U2', 'Coldplay', 'Red Hot Chili Peppers', 'Fleetwood Mac', 'Guns N\' Roses', 'Eagles (band)', 'Aerosmith'] },
                { type: 'wiki', id: 'mb_boy', name: 'Boy/Girl Groups', icon: '🕺', items: ['One Direction', 'Backstreet Boys', 'NSYNC', 'BTS', 'Spice Girls', 'Destiny\'s Child', 'TLC (group)', 'Blackpink', 'Boyz II Men', 'Fifth Harmony', 'Jonas Brothers', 'New Edition', 'The Jackson 5', 'The Pussycat Dolls', 'Little Mix'] },
            ],
            mu_decades: [
                { type: 'wiki', id: 'md_2010', name: '2010s Hits', icon: '📱', items: ['Taylor Swift', 'Drake (musician)', 'Adele', 'Ed Sheeran', 'Justin Bieber', 'Ariana Grande', 'Bruno Mars', 'Katy Perry', 'The Weeknd', 'Rihanna', 'Kendrick Lamar', 'Post Malone', 'Imagine Dragons', 'Maroon 5', 'Shawn Mendes'] },
                { type: 'wiki', id: 'md_2000', name: '2000s Nostalgia', icon: '💿', items: ['Eminem', 'Britney Spears', 'Beyoncé', 'Justin Timberlake', 'Usher (musician)', '50 Cent', 'Jay-Z', 'Pink (singer)', 'Christina Aguilera', 'Alicia Keys', 'Linkin Park', 'Avril Lavigne', 'Green Day', 'Black Eyed Peas', 'Outkast'] },
                { type: 'wiki', id: 'md_1990', name: '90s Legends', icon: '📼', items: ['Nirvana (band)', 'Tupac Shakur', 'Mariah Carey', 'Celine Dion', 'The Notorious B.I.G.', 'Snoop Dogg', 'Garth Brooks', 'Shania Twain', 'TLC (group)', 'Dr. Dre', 'Oasis (band)', 'Radiohead', 'Spice Girls', 'Backstreet Boys', 'Pearl Jam'] },
            ],
            games: [
                { type: 'wiki', id: 'vg_chars', name: 'Gaming Icons', icon: '🍄', items: ['Mario', 'Master Chief (Halo)', 'Kratos (God of War)', 'Sonic the Hedgehog', 'Link (The Legend of Zelda)', 'Pikachu', 'Lara Croft', 'Doomguy', 'Pac-Man', 'Geralt of Rivia', 'Samus Aran', 'Cloud Strife', 'Solid Snake', 'Marcus Fenix', 'Arthur Morgan'] },
                { type: 'wiki', id: 'vg_bosses', name: 'Soulsborne Bosses', icon: '⚔️', items: ["Malenia", "Nameless King", "Slave Knight Gael", "Artorias the Abysswalker", "Ornstein and Smough", "Ludwig, the Holy Blade", "Lady Maria of the Astral Clocktower", "Sister Friede", "Radahn", "Maliketh, the Black Blade", "Godfrey, First Elden Lord", "Gwyn, Lord of Cinder", "Isshin, the Sword Saint", "Genichiro Ashina", "Father Gascoigne"] },
                { type: 'wiki', id: 'vg_consoles', name: 'Consoles', icon: '🎮', items: ['PlayStation 2', 'Xbox 360', 'Nintendo 64', 'Game Boy', 'Super Nintendo Entertainment System', 'PlayStation 4', 'Nintendo Switch', 'Wii', 'Sega Genesis', 'GameCube', 'Dreamcast', 'PlayStation 5', 'Xbox Series X', 'Nintendo DS', 'PlayStation Portable'] },
                { type: 'wiki', id: 'vg_pokemon', name: 'Original Pokémon', icon: '🐉', items: ['Charizard', 'Blastoise', 'Venusaur', 'Pikachu', 'Mewtwo', 'Gengar', 'Snorlax', 'Dragonite', 'Alakazam', 'Gyarados', 'Eevee', 'Jigglypuff', 'Mew', 'Squirtle', 'Charmander'] }
            ],
            food: [
                { type: 'wiki', id: 'fd_fast', name: 'Fast Food Chains', icon: '🍔', items: ['McDonald\'s', 'Burger King', 'KFC', 'Taco Bell', 'Wendy\'s', 'Subway (restaurant)', 'Domino\'s Pizza', 'Starbucks', 'Chipotle Mexican Grill', 'Pizza Hut', 'Chick-fil-A', 'Popeyes', 'Dunkin\' Donuts', 'Dairy Queen', 'Papa John\'s'] },
                { type: 'wiki', id: 'fd_cereal', name: 'Cereals', icon: '🥣', items: ['Cinnamon Toast Crunch', 'Frosted Flakes', 'Froot Loops', 'Lucky Charms', 'Cheerios', "Cap'n Crunch", "Reese's Puffs", 'Apple Jacks', 'Corn Pops', 'Trix (cereal)', 'Cocoa Puffs', 'Honey Nut Cheerios', 'Fruity Pebbles', 'Cocoa Pebbles', 'Rice Krispies'] },
                { type: 'wiki', id: 'fd_candy', name: 'Candy & Sweets', icon: '🍫', items: ['Snickers', 'Twix', 'Kit Kat', "M&M's", "Reese's Peanut Butter Cups", 'Skittles (candy)', 'Sour Patch Kids', 'Starburst (candy)', 'Milky Way (chocolate bar)', 'Butterfinger', 'Toblerone', 'Haribo', 'Nerds (candy)', 'Swedish Fish', 'Twizzlers'] },
                { type: 'wiki', id: 'fd_snacks', name: 'Popular Snacks', icon: '🍿', items: ['Doritos', 'Cheetos', 'Oreo', 'Lay\'s', 'Pringles', 'Cheez-It', 'Ruffles', 'Tostitos', 'Fritos', 'Funyuns', 'Rold Gold', 'Takis', 'Slim Jim (snack food)', 'Pop-Tarts', 'Goldfish (cracker)'] }
            ],
            history: [
                { type: 'wiki', id: 'hg_lands', name: 'World Landmarks', icon: '🗽', items: ['Eiffel Tower', 'Great Pyramid of Giza', 'Great Wall of China', 'Colosseum', 'Taj Mahal', 'Statue of Liberty', 'Big Ben', 'Machu Picchu', 'Mount Everest', 'Stonehenge', 'Sydney Opera House', 'Christ the Redeemer (statue)', 'Petra', 'Acropolis of Athens', 'Chichen Itza'] },
                { type: 'wiki', id: 'hg_flags', name: 'World Flags', icon: '🌍', items: ['Flag of the United States', 'Flag of the United Kingdom', 'Flag of Japan', 'Flag of Brazil', 'Flag of Canada', 'Flag of France', 'Flag of Germany', 'Flag of Italy', 'Flag of Australia', 'Flag of India', 'Flag of Mexico', 'Flag of South Korea', 'Flag of China', 'Flag of Spain', 'Flag of Argentina'] },
                { type: 'wiki', id: 'hg_figs', name: 'Historical Figures', icon: '📜', items: ['Albert Einstein', 'Abraham Lincoln', 'Cleopatra', 'Julius Caesar', 'Leonardo da Vinci', 'Mahatma Gandhi', 'Nelson Mandela', 'Joan of Arc', 'Winston Churchill', 'Napoleon', 'William Shakespeare', 'Martin Luther King Jr.', 'Alexander the Great', 'George Washington', 'Isaac Newton'] }
            ]
        };
