/* =====================================================================
   STAVSJÖ — site content. Edit text, products and contacts here.
   ===================================================================== */
const CONTACT = {
  email:     "chenming20020808@gmail.com",
  whatsapp:  "+44 7796 648635",     // shown on the page
  waNumber:  "447796648635",        // digits only, for the wa.me link
  instagram: "yuanwangdesign",
  tiktok:    "hotspring_equipment",
  web:       "www.yuanwangspa.com",
  office:    "chenlian1607@gmail.com",   // company office email
  phone:     "+86 186 1252 1168",
  wechat:    "18612521168",
  address:   "Rm. 1605–1607, Tower B, Youshige, No. 8 Guangqumen Outer St., Chaoyang District, Beijing, China"
};

/* ---------- company profile (from the company information sheet) ---------- */
const COMPANY = {
  slogan: "Professional hot spring equipment solutions for commercial spa and wellness projects.",
  intro:  "Beijing Yuanwang specializes in hot spring and spa equipment for international markets. We provide complete system solutions including water treatment, circulation, heating and control systems, designed for stable operation, energy efficiency and long-term use in commercial spa and wellness projects.",
  systems:[
    ["01","Water treatment","Filtration, disinfection and dosing sized to the source water and bather load."],
    ["02","Circulation","Pumps, pipework, overflow channels and balance tanks engineered as one hydraulic system."],
    ["03","Heating","Heat exchangers, heat pumps and cascade use of geothermal water."],
    ["04","Control","PLC cabinets, touch screens, remote alarms and logged water-quality records."]
  ]
};

/* ---------- factory (new photographs, Nov 2026) ---------- */
const FACTORY = [
  ["fac/laser-line","Fibre-laser cutting line","Large-format laser cutter with exchange table, chiller and air supply"],
  ["fac/bending-hall","Bending hall","CNC press brakes and shears for long stainless panels"],
  ["fac/laser-operator","Laser cell","Operator loading stainless sheet; sheets stay film-protected until welding"],
  ["fac/ctl-1","Control-cabinet workshop","Cabinet frames and wiring in our automatic-control factory · 远望自动控制工厂"],
  ["fac/ctl-2","Stainless enclosures","Control boxes ready for wiring · 不锈钢控制箱"],
  ["fac/ctl-3","Assembly line","Cabinets and enclosures in production"],
  ["fac/ctl-4","Sheet-metal cell","Laser-cut stainless parts for cabinets"],
  ["fac/campus-building","Factory campus","Production building, Beijing"],
  ["fac/campus-gate","Campus entrance","Main gate of the factory campus"]
];

/* ---------- collections (one page each) ---------- */
const COLLECTIONS = [
 {key:"stainless-pools", cat:"pool", name:"Stainless Steel Pools", short:"Pools", img:"wh/pool-palm", studio:"pool", form:"Stainless steel swimming pool",
  tagline:"Welded steel swimming pools for villas, terraces, hotels and resorts.",
  intro:"A STAVSJÖ pool is a welded stainless steel vessel made in our factory and installed on site. The shell itself is the waterproofing: water touches only metal, so there is no coating or membrane to age, crack and leak.",
  facts:[["304 / 316L","Steel grade chosen from your water analysis"],["≥ 2 mm","Plate recommended for busy commercial pools"],["3 edges","Infinity, deck-level overflow or raised wall"],["Factory-built","Prefabricated, then installed on site"]],
  specs:[["Material","SUS 304 as standard. SUS 316 / 316L for seaside sites, high-chloride or sulphur water and heavy commercial use."],
         ["Construction","Fully welded shell (argon-arc / TIG), passivated after welding. Large pools are built in sections and joined on site."],
         ["Plate & structure","From 2 mm for frequent commercial use. Final thickness and reinforcement follow project loads."],
         ["Finish","Brushed, mirror or matte."],
         ["Edge styles","Vanishing (infinity) edge · deck-level overflow · raised wall."],
         ["Options","LED lighting, acrylic viewing panels, steps, handrails, benches, jets."],
         ["Combines with","Stone, timber, glass, mosaic, microcement and acrylic surrounds."],
         ["Scope of supply","Water testing, design, fabrication, installation, commissioning and maintenance support."]],
  apps:["Private villas","Rooftops & terraces","Hotels & resorts","Refurbishment of old concrete pools"]},
 {key:"hot-tubs", cat:"tub", name:"Hot Tubs & Spas", short:"Hot Tubs", img:"wh/spa-round-deck", studio:"tub", form:"Stainless steel hot tub / spa",
  tagline:"Prefabricated spa pools for suites, courtyards and wellness areas.",
  intro:"Factory-made stainless steel spa pools with rolled rim, seating, hydro jets and lighting. They arrive as a finished welded shell, which makes them ideal for hotel suites, private courtyards and refurbishments.",
  facts:[["Zero leaks","Welded shell — no waterproof layer to fail"],["Hygienic","Non-porous surface, rinses clean"],["Any shape","Round, square, oval or to your drawing"],["Fast","Delivered prefabricated, quick to install"]],
  specs:[["Material","SUS 304 as standard; SUS 316 / 316L for demanding water."],
         ["Construction","Fully welded and passivated shell with integrated bench and overflow or raised rim."],
         ["Finish","Brushed, mirror or matte. Coloured finishes — bronze, copper and patina effects — on request."],
         ["Hydrotherapy","Water jets, air bubbling, underwater lighting; filtration, heating and controls coordinated per project."],
         ["Access","Steps, handrails and seating to suit the installation."],
         ["Surrounds","Stone coping, timber decks, glass panels, microcement or acrylic viewing sections."],
         ["Before manufacture","We confirm dimensions, usable volume, water chemistry, plate thickness, finish, access, structural loads and filtration."]],
  apps:["Hotel suites","B&B courtyards","Spa & wellness centres","Private gardens"]},
 {key:"designer-tubs", cat:"art", name:"Designer Tubs", short:"Designer Tubs", img:"wh/moon-tub", studio:"designer", form:"Sculpture / designer tub",
  tagline:"Sculptural steel bathing pieces — a bath and a landmark in one.",
  intro:"One-piece sculpted tubs and spa pools in mirror-polished stainless steel. Each is formed, welded and polished by hand as a functional bath that also works as the visual centre of a suite, courtyard or lobby.",
  facts:[["One-off","Each piece is made to order"],["Mirror","Hand-polished, or brushed / matte"],["Forms","Wave, boat, crescent, droplet, cloud, ring"],["Indoor / outdoor","For suites, courtyards and gardens"]],
  specs:[["Material","Stainless steel, grade selected for the water and setting."],
         ["Forms","Wave, boat, crescent moon, water drop, cloud, ring, shell and heart forms — or your own design."],
         ["Finish","Mirror polish as standard; brushed or matte on request. Coloured finishes — bronze, copper, patina and textured — from our finish sample range."],
         ["Features","Seating, lighting, water jets and mist effects can be integrated."],
         ["Design process","Concept image → engineering drawing → approval → fabrication. Final dimensions and fittings follow the approved drawing."]],
  apps:["Signature hotel suites","Photo-worthy B&B rooms","Courtyards & lobbies","Themed resorts"]},
 {key:"saunas", cat:"sauna", name:"Saunas & Thermal Rooms", short:"Saunas", img:"wh/sauna-art", studio:"sauna", form:"Sauna / steam room",
  tagline:"Sauna, steam, salt and ice rooms designed as complete interiors.",
  intro:"Thermal rooms supplied as a designed interior: timber sauna, infrared, herbal steam, salt and ice rooms, and themed spaces from caves to sculpted timber. Lighting, heaters and controls are part of the package.",
  facts:[["7+ types","Sauna, infrared, steam, salt, ice, cave, art"],["Custom","Any room size and bench layout"],["Lighting","Hidden LED lines and feature walls"],["Home to hotel","From family rooms to public spa halls"]],
  specs:[["Room types","Timber sauna · infrared sauna · herbal steam room · Himalayan salt room · ice room · cave-style rooms · sculpted art sauna."],
         ["Interior","Tiered timber benches, backrests and wall cladding; salt brick, stone or themed finishes."],
         ["Heating","Sauna heater with stones, infrared panels or steam generator, to suit the room type."],
         ["Lighting","Concealed LED light lines, back-lit walls and scene lighting."],
         ["Controls","Local temperature and lighting controls; can connect to a central plant-room control system."],
         ["Hot & cold cycle","Ice rooms and cold plunges can be planned beside the heat rooms."]],
  apps:["Hotel spa floors","Wellness & recovery centres","Hot spring resorts","Private homes"]},
 {key:"water-treatment", cat:"wt", name:"Water Treatment Systems", short:"Water Treatment", img:"eng/wt-plant-shaft", studio:null, form:"Water treatment / plant room",
  tagline:"Filtration, disinfection and heating — engineered with every pool and spa.",
  intro:"Water treatment is where the group began in 2002. We design the plant room together with the pool: filtration, disinfection dosing, heating and controls are sized for your water source, bather load and climate, then delivered as one coordinated system.",
  facts:[["Since 2002","Water treatment for geothermal water, hot springs and pools"],["One system","Plant room designed together with the pool"],["Certified supply","Equipment from ISO-certified manufacturers"],["Compact","Shaft and wall-mounted plant for tight sites"]],
  specs:[["Filtration","Sand filtration, including vacuum sand filter plant; filter sizing to turnover and bather load."],
         ["Disinfection & dosing","Chlorine / ORP and pH monitoring with automatic dosing units."],
         ["Heating","Heat exchangers, heat pumps and geothermal wellhead equipment."],
         ["Pumps & controls","Circulation pumps, control cabinets and sensors; can connect to a central control system."],
         ["Plant room formats","Separate plant room, underground equipment shaft next to the pool, or compact equipment wall."],
         ["Water first","Source-water analysis decides materials, treatment chemistry and steel grade."],
         ["Support","Commissioning with water quality report, operator training and a written maintenance schedule — see After-Sales."]],
  apps:["Hot spring resorts","Hotel pools & spas","Private villas","Refurbishment of old plant rooms"]},
 {key:"acrylic-pools", cat:"acrylic", name:"Acrylic Feature Pools", short:"Acrylic Pools", img:"acr-cliff", studio:null, form:"Acrylic / glass feature pool",
  tagline:"Transparent pools that turn the view into the experience.",
  intro:"Clear acrylic pools and bathing pieces for landmark settings: cantilevered over a view, set into a forest slope or glowing in a courtyard at night. Every project is engineered individually.",
  facts:[["Transparent","Walls that keep the view open"],["Landmark","Built to be photographed"],["Engineered","Structure calculated per project"],["Lighting","Starlight and colour effects"]],
  specs:[["Concepts","Rooftop cantilever pool · cliffside viewing pool · cylindrical private bath · boat-shaped tub · illuminated ring pool · dome pool."],
         ["Engineering","Structural loading, acrylic thickness and waterproofing are calculated for each project."],
         ["Design review","Covers support geometry, access, interfaces with the building and cleaning."],
         ["Lighting & effects","Underwater lights, starlight effects and programmable colour scenes."],
         ["Combination","Acrylic viewing sections can also be built into stainless steel pools."]],
  apps:["Resort landmarks","Rooftop bars & pools","Private suite courtyards","Themed hotels"]},
 {key:"spa-shows", cat:"show", name:"Immersive Spa Shows", short:"Spa Shows", img:"wh/show-clouds", studio:null, form:"Immersive spa show",
  tagline:"Water, light and projection that turn bathing into a show.",
  intro:"Immersive bathing rooms that combine wall projection, mist, underwater lighting and wave jets under programmed control. Guests bathe inside a moving scene — from drifting clouds to a glowing sea.",
  facts:[["5–10 m²","Compact interactive rooms"],["Themes","Nature, starry sky, deep sea, children"],["Programmed","PLC-controlled scenes"],["Interactive","Responsive content and effects"]],
  specs:[["Storm series","Drifting clouds · glowing blue sea · thunderstorm · ocean vortex."],
         ["Meteor series","Meteor fall · volcano · volcanic ash · blue lava · tsunami."],
         ["5D interactive rooms","Compact 5–10 m² rooms with nature, starry-sky, deep-sea, children's and minimalist themes."],
         ["Water shows","Water-dance stages, floating shows, digital waterfalls and synchronised projection."],
         ["Technology","Projection and holographic imagery, mist and fog machines, underwater lights, wave jets and air blowers."],
         ["Control","Control cabinets with PLC logic and touchscreen operation; scenes run to a programmed sequence."]],
  apps:["Hot spring resorts","Family attractions","Signature private baths","Spa show stages"]}
];

/* ---------- products ---------- */
const PRODUCTS = [
  /* ---- stainless steel pools ---- */
  {cat:"pool",img:"wh/pool-palm",name:"Infinity Edge Pool",text:"Mirror-polished vanishing edge over the view.",badge:"Best seller"},
  {cat:"pool",img:"wh/pool-cliff-neon",name:"Neon Edge Cliff Pool",text:"Curved stainless rim with a hidden colour LED line.",badge:"Trending"},
  {cat:"pool",img:"wh/pool-sea",name:"Seaside Overflow Pool",text:"Flush overflow edge facing the sea."},
  {cat:"pool",img:"wh/pool-city-neon",name:"City Night Pool",text:"Freeform rooftop pool with violet underwater light."},
  {cat:"pool",img:"wh/pool-gold-led",name:"Gold Line Lap Pool",text:"Raised steel wall with a warm LED base line."},
  {cat:"pool",img:"wh/pool-violet",name:"Glass-Step Pool",text:"Stainless pool with a clear acrylic side and colour light."},
  {cat:"pool",img:"wh/pool-glass-night",name:"Glass-Wall Pool",text:"Acrylic viewing window set into a steel wall."},
  {cat:"pool",img:"wh/pool-deck-night",name:"Deck Pool with Steps",text:"Built-in entry steps and underwater lights."},
  {cat:"pool",img:"wh/pool-forest-dawn",name:"Forest Panorama Pool",text:"Raised overflow pool with a lit stainless band."},
  {cat:"pool",img:"wh/pool-lawn",name:"Garden Freeform Pool",text:"Rounded freeform pool on a lawn terrace."},
  {cat:"pool",img:"wh/pool-sunset",name:"Sunset Infinity Pool",text:"Thin stainless edge that disappears at dusk."},
  {cat:"pool",img:"wh/pool-alpine",name:"Alpine Lap Pool",text:"Heated steel pool for snow-country resorts."},
  {cat:"pool",img:"wh/pool-lodge",name:"Resort Lodge Pool",text:"Large freeform pool for hotels and lodges."},
  {cat:"pool",img:"wh/pool-courtyard",name:"Timber-Deck Infinity Pool",text:"Infinity pool set flush into a timber deck."},
  {cat:"pool",img:"wh/pool-infinity-deck",name:"Glasshouse Spa Pool",text:"Indoor stainless pool under a glass roof."},
  {cat:"pool",img:"pool-infinity",name:"Overflow Terrace Pool",text:"Polished overflow pool for villa terraces."},
  {cat:"pool",img:"eng/install-mountain",name:"Hillside Lap Pool",text:"Factory photo — steel lap pool set into a mountain site.",badge:"Factory photo"},
  /* ---- hot tubs & spas ---- */
  {cat:"tub",img:"wh/spa-round-deck",name:"Round Deck Spa",text:"Flush round spa with rail, set into a timber deck.",badge:"Best value"},
  {cat:"tub",img:"wh/spa-round-garden",name:"Garden Overflow Spa",text:"Free-standing round spa with jets and rail."},
  {cat:"tub",img:"wh/spa-round-indoor",name:"Indoor Round Spa",text:"Sunken spa ringed by a stainless overflow grating."},
  {cat:"tub",img:"wh/spa-pebble",name:"Pebble-Ring Spa",text:"Round soaking pool edged with river pebbles."},
  {cat:"tub",img:"wh/spa-freeform",name:"Freeform Garden Spa",text:"Curved spa with raised stainless rim."},
  {cat:"tub",img:"wh/hex-garden",name:"Hexagon Garden Spa",text:"Polished hexagon spa with warm garden lighting."},
  {cat:"tub",img:"wh/zen-steam",name:"Zen Courtyard Tub",text:"Mirror hot spring tub for Japanese-style courtyards."},
  {cat:"tub",img:"proc/tub",name:"Round Courtyard Spa",text:"Brushed round spa with wide rolled rim and inner bench.",badge:"Factory photo"},
  {cat:"tub",img:"proj/hr-finished",name:"Hotel Courtyard Tub",text:"As supplied to a hotel in Huairou, Beijing.",badge:"Factory photo"},
  {cat:"tub",img:"proc/faceted-spa",name:"Faceted Spa",text:"Multi-sided spa with folded panel walls.",badge:"Factory photo"},
  {cat:"tub",img:"eng/spa-waterfall",name:"Waterfall Spa",text:"Stainless spa with steel waterfall spouts and overflow grating."},
  {cat:"tub",img:"eng/spa-round-rail",name:"Round Spa with Rail",text:"Round stainless spa with handrail and timber step."},
  {cat:"tub",img:"eng/spa-indoor-steps",name:"Indoor Overflow Spa",text:"Indoor overflow spa with built-in steps."},
  {cat:"tub",img:"tub-rooftop",name:"Glass-Front Rooftop Spa",text:"Square spa with acrylic window."},
  /* ---- designer (trending) tubs ---- */
  {cat:"art",img:"wh/moon-tub",name:"Moon Waterfall Tub",text:"Crescent-moon arch that pours a waterfall into the bowl.",badge:"Trending"},
  {cat:"art",img:"wh/wave-tub",name:"Wave Mirror Bathtub",text:"Hand-formed rippled surface in mirror steel.",badge:"Trending"},
  {cat:"art",img:"wh/cloud-spa",name:"Floating Cloud Spa",text:"Round spa wrapped in mist, with steps up to the rim.",badge:"Trending"},
  {cat:"art",img:"wh/cloud-stair",name:"Cloud Rain Spa",text:"A misting cloud canopy rains gently over the spa."},
  {cat:"art",img:"wh/boat-tub",name:"Boat Mirror Tub",text:"Long boat-shaped tub with lifted bow and stern."},
  {cat:"art",img:"wh/drop-spa",name:"Water Drop Spa",text:"Teardrop sculpture you can sit inside — for lakesides."},
  {cat:"art",img:"wh/heart-spa",name:"Heart Spa",text:"Mirror heart arch over a round pool — for honeymoon suites."},
  {cat:"art",img:"wh/crescent-tub",name:"Crescent Wave Tub",text:"Free-standing C-curve tub in polished steel."},
  {cat:"art",img:"wh/forest-mist",name:"Forest Mist Pool",text:"Flowing organic rim for woodland settings."},
  {cat:"art",img:"wh/aurora-spa",name:"Aurora Hot Spring",text:"Freeform steel hot spring pool for night skies."},
  {cat:"art",img:"wh/shell-spa",name:"Shell Spa",text:"Scalloped mirror rim, made for glasshouses and terraces."},
  {cat:"art",img:"wh/flower-spa",name:"Petal Spa",text:"Flower-shaped tub for garden pavilions."},
  {cat:"art",img:"wh/glass-wave",name:"Glass Wave Spa",text:"Raised acrylic basin on a curved steel wave."},
  {cat:"art",img:"wh/sunset-round",name:"Pedestal Mirror Tub",text:"Round mirror tub lifted on a slim base."},
  {cat:"art",img:"wh/bamboo-rain",name:"Bamboo Rain Tub",text:"Mirror tub under a ceiling rain shower."},
  {cat:"art",img:"wh/faceted-mirror",name:"Faceted Mirror Tub",text:"Folded-panel tub for minimalist bathrooms."},
  {cat:"art",img:"wh/neon-rooftop",name:"Neon Rooftop Pool",text:"Stepped rooftop pool with colour-changing light."},
  {cat:"art",img:"sc/bronze-tub",name:"Bronze-Finish Tub",text:"Stainless tub with a bronze-tone coloured finish.",badge:"New finish"},
  /* ---- saunas ---- */
  {cat:"sauna",img:"wh/sauna-art",name:"Sculpted Art Sauna",text:"Flowing curved timber benches with hidden light.",badge:"Popular"},
  {cat:"sauna",img:"wh/sauna-salt-glow",name:"Himalayan Salt Cave",text:"Glowing salt-brick cave for relaxation."},
  {cat:"sauna",img:"wh/sauna-salt-cave",name:"White Salt Grotto",text:"Carved salt grotto with lit benches."},
  {cat:"sauna",img:"wh/sauna-cave-light",name:"Crystal Cave Steam Room",text:"Stone cave with light-lined benches."},
  {cat:"sauna",img:"wh/sauna-ice",name:"Ice Room",text:"Cool-down room for the hot and cold cycle."},
  {cat:"sauna",img:"wh/sauna-ice-hall",name:"Snow Hall",text:"Snow and ice room with a central cold well."},
  {cat:"sauna",img:"wh/sauna-volcano",name:"Volcano Sauna",text:"Lava-themed heat room with fire feature."},
  {cat:"sauna",img:"sauna-wood",name:"Nordic Sauna Room",text:"Tiered benches with hidden LED light lines."},
  {cat:"sauna",img:"sauna-glow",name:"Glow Wall Sauna",text:"Timber sauna with back-lit salt feature wall."},
  {cat:"sauna",img:"sauna-future",name:"Future Capsule Sauna",text:"Capsule seats and cool light lines."},
  /* ---- acrylic ---- */
  {cat:"acrylic",img:"acr-cliff",name:"Cantilever Sky Pool",text:"Clear pool projecting over the view.",badge:"Signature"},
  {cat:"acrylic",img:"acr-forest",name:"Forest Glass Pool",text:"Transparent walls in a forest slope."},
  {cat:"acrylic",img:"acr-dome",name:"Starlight Dome Pool",text:"360° pool with dome and star lights."},
  {cat:"acrylic",img:"acr-ring",name:"Light Ring Pool",text:"Illuminated acrylic ring pool."},
  {cat:"acrylic",img:"acr-moon",name:"Moon Night Pool",text:"Crescent moon feature pool."},
  {cat:"acrylic",img:"acr-boat",name:"Boat Hot Spring Tub",text:"Clear boat-shaped tub on a pebble bed."},
  {cat:"acrylic",img:"acr-cube",name:"Starry Cube Pool",text:"Cube pool with sparkling light."},
  {cat:"acrylic",img:"acr-crystal",name:"Crystal Cave Spa",text:"Crystal-cave setting around a round spa."},
  /* ---- water treatment ---- */
  {cat:"wt",img:"eng/wt-vacuum-filter",name:"Vacuum Sand Filter Plant",text:"Enclosed filtration plant for commercial pools."},
  {cat:"wt",img:"eng/wt-plant-shaft",name:"Equipment Shaft",text:"Underground plant chamber beside the pool."},
  {cat:"wt",img:"eng/wt-plant-wall",name:"Compact Equipment Wall",text:"Filter, pump and controls in a slim garden enclosure."},
  /* ---- immersive spa shows ---- */
  {cat:"show",img:"wh/show-clouds",name:"Drifting Clouds",text:"Wrap-around LED sea and sky — a cloud drifts overhead.",badge:"Immersive"},
  {cat:"show",img:"wh/show-tsunami",name:"Rising Wave",text:"A giant wave builds around the pool."},
  {cat:"show",img:"wh/show-vortex2",name:"Ocean Vortex",text:"Wave jets and a whirlpool scene."},
  {cat:"show",img:"wh/show-thunder-sea",name:"Thunderstorm",text:"Lightning, rain and thunder synchronised with the room."},
  {cat:"show",img:"wh/show-volcano",name:"Fire and Sea",text:"Lava flows meet the ocean on the screens."},
  {cat:"show",img:"wh/show-dark-rain",name:"Eruption Sky",text:"A volcano lights the clouds at dusk."},
  {cat:"show",img:"wh/show-night-sea",name:"Night Shore",text:"Moonlit coast with glowing water."},
  {cat:"show",img:"wh/show-thunder",name:"Storm Pool",text:"Indoor pool under a lightning ceiling."},
  {cat:"show",img:"wh/show-sunset",name:"Sunset Bay",text:"Wall-to-wall sunset over a calm bay."},
  {cat:"show",img:"wh/show-rain-curtain",name:"Rain Curtain Pool",text:"A circle of falling water under a skylight."},
  {cat:"show",img:"wh/show-lounge",name:"Light Rain Lounge",text:"Heated lounger under coloured rain."},
  {cat:"show",img:"wh/spa-cave-glow",name:"Art Ceiling Pool",text:"Lap pool under an illuminated art ceiling."}
];

/* ---------- engineering gallery (Factory & Engineering page) ---------- */
const ENG = {
  fabrication:[["../proj/fac-hall","Our workshop","Cutting and assembly floor in China"],["../proj/fac-cnc","CNC cutting","Plates cut by CNC for clean, accurate edges"],["../proj/fac-press","Press brake","Panels formed on hydraulic press brakes"],["../proj/fac-bench","Welding bench","Sub-assemblies prepared for TIG welding"],["fab-hall","Fabrication hall","Lap pools and spa shells in production"],["fab-lap-pool","Lap pool shell","Welded shell with lane markings, before dispatch"],["fab-freeform","Freeform pool","Curved wall panels on a reinforcing frame"],["fab-curved-spa","Curved spa shell","Formed and welded spa body"],["fab-overflow-spa","Overflow spa","Spa with perimeter grating on its support frame"],["fab-spa-jets","Jets & benches","Jet fittings and bench seats welded in place"],["fab-spa-interior","Spa interior","Seat, footwell and overflow channel"],["spa-waterfall","Waterfall spa","Steel spouts over a grated overflow edge"],["spa-bench-grating","Bench detail","Contoured seat, jets and overflow grating"]],
  drawings:[["draw-wall-section","Wall section","Overflow grating, overflow channel, insulated wall construction and space for poured concrete"],["draw-skimmer","Skimmer system","Wall panels with integrated skimmer on a modular support frame"],["draw-overflow-frame","Overflow system","Panel frame with integrated overflow channel"],["draw-curved-panel","Curved wall panels","Bolted and welded curved panel segments"],["draw-overflow-pool","Overflow pool","Rectangular overflow pool with steps and insulated base"],["draw-octagon-spa","Octagonal spa","Spa with bench, steps and acrylic window"],["draw-terrace-spa","Terraced spa","Multi-level spa with seating steps"],["draw-rooftop-sketch","Rooftop scheme","Concept sketch for a rooftop pool and spa"]],
  details:[["../proj/det-curve","Curved overflow edge","Grating follows the curve of the pool"],["../proj/det-grating","Overflow grating","Stainless grating at the water line"],["../proj/det-steps","Entry steps","Anti-slip steps with stainless handrail"],["../proj/det-channel","Overflow channel","Grating and channel, flush with the deck"],["../proj/det-grille","Grille detail","Removable stainless grille, easy to clean"]],
  install:[["install-crane","Rooftop delivery","A finished pool lifted onto a city rooftop"],["install-onsite","Setting the shell","Prefabricated shell lowered into the prepared pit"],["install-mountain","Remote site","Lap pool installed on a mountain plot"],["install-waterpark","Water park","Multiple steel pools during installation"]],
  refurb:[["refurb-relining","Old pool, new lining","Stainless steel lining installed inside an existing concrete pool"],["refurb-site","Garden pool","Freeform pool during installation"]]
};

/* ---------- certified supply chain ---------- */
const CERTS = [
  {holder:"Ningbo Dongchuan Swimming Pool Equipments Co., Ltd.",place:"Ningbo, Zhejiang, China",scope:"Manufacture of appliances for swimming pool cleaning and purifying",issuer:"TÜV Rheinland Cert GmbH",verify:"www.cnca.gov.cn",
   items:[["ISO 9001:2015","Quality management","01 100 2332801","4 Jun 2024 – 3 Jun 2027","dongchuan-iso9001"],["ISO 14001:2015","Environmental management","01 104 2332801","29 May 2024 – 28 May 2027","dongchuan-iso14001"],["ISO 45001:2018","Occupational health & safety","01 213 2332801","29 May 2024 – 28 May 2027","dongchuan-iso45001"]]},
  {holder:"Fluidra Global Distribution, S.L.",place:"Sant Cugat de Valles, Barcelona, Spain",scope:"Procurement, marketing and distribution of swimming pool and water treatment products",issuer:"LRQA Limited",verify:"Certificate identity no. 10561915",
   items:[["ISO 9001:2015","Quality management","ISO 9001 – 00041015","Issued 14 Jun 2025 · expires 11 Jan 2027","fluidra-iso9001"]]}
];

/* =====================================================================
   v6 — project case studies, production process, component partners,
   smart controls. Image paths are relative to img/ (no extension).
   Clips: [video name in media/, title, caption, "v" vertical | "h" landscape]
   ===================================================================== */

/* extra photos for the featured Arxan (Inner Mongolia) project */
const ARXAN_GAL=[
  ["proj/arx-hall-wide","Hot spring hall","Domed hall with curved pools, hydromassage loungers and stainless channels"],
  ["proj/arx-hall-loungers","Lounger pools","In-water loungers set in a curved pool"],
  ["proj/arx-dome","During fit-out","The domed hall while pools and pipework were installed"],
  ["proj/arx-pools","Before filling","Curved pools, feature fountain and neck-massage spouts"],
  ["proj/arx-jets","Jet bench","A row of hydromassage jets along the pool bench"],
  ["proj/arx-stairs","Pool stairs","Stainless steel stairs and handrails"],
  ["proj/im-acrylic","Pool construction","Curved acrylic panels with stainless channel"],
  ["proj/im-build","Spa pools in progress","Benches, jet connections and stone cladding"],
  ["proj/arx-plant","Plant room","Filtration, pumps and pipework behind the hall"],
  ["proj/im-filters","Filtration","Filter tanks and pipework being installed"],
  ["proj/arx-gauges","Pressure testing","Pipework pressure-tested before commissioning"],
  ["proj/arx-cabinet","Control cabinet","PLC control for pumps, heating and dosing"],
  ["proj/arx-heatpumps","Heat pumps","Air-source heat pumps beside the building"],
  ["proj/arx-sauna","Sauna room","Timber sauna with glass front"],
  ["proj/arx-saltwall","Salt-wall room","Back-lit salt-brick relaxation room"],
  ["proj/im-finished","Ready for water","Finished pool before filling"],
  ["proj/arx-site","The setting","The resort in the Greater Khingan mountains"]
];
const ARXAN_CLIPS=[["arx-pool","Pool hall on site","Pools and channels before the hall opened","v"],["arx-build","Acrylic pool build","Curved acrylic pool wall under construction","v"]];

/* project case studies (Projects page) */
const CASES=[
 {id:"pj-chc",kicker:"Changchun, Jilin",title:"Rooftop hot spring terrace,",em:"Siji Nanhe",
  lead:"A hotel rooftop turned into an outdoor hot spring deck: stainless spa pools, lounge pools and a lap pool under steel canopies that glow at night. We prepared the stainless pool method statement and built the pools on a steel grid set over the roof slab.",
  img:"proj/chc-night",
  facts:[["550,000 m²","Riverside cultural, tourism and retail complex"],["24,000 m²","High-end hot spring zone"],["4 seasons","Ice & snow, riverside holidays, hot spring wellness"]],
  spec:[["Project","Siji Nanhe Riverside Park"],["Location","Yitong River bank, Jingyue High-tech Zone, Changchun, Jilin Province"],["Type","Rooftop hot spring and pool terrace"],["Our scope","Stainless steel spa pools — design, factory fabrication, on-site welding, grinding and closed-water testing · steel support grid on the roof · method statement"],["Method","Water-tightness test of at least 24 hours (48 hours for pools above 100 m³) with a level drop of no more than 2 mm in 24 hours"]],
  gal:[["proj/chc-canopy","Spa terrace","Spa pools under the round canopies"],["proj/chc-dusk-pool","Pool at dusk","Rooftop pool with underwater lighting"],["proj/chc-night","Canopies at night","Colour-lit canopies over the spa pools"],["proj/chc-terrace","Daytime","Round spa, planting and glass balustrade"],["proj/chc-lounge-pools","Lounge pools","Shallow lounge pools with in-water seats"],["proj/chc-spa-night","Evening","Spa pools and lighting at night"],["proj/chc-bar","Pool bar","Bar and seating beside the pools"],["proj/chc-pool","Lap pool","Rooftop pool looking over the town"],["proj/chc-grid","Steel grid","Support grid over the roof slab before the pools"],["proj/chc-curved-frame","Curved frame","Steel frame following the curved pool edge"],["proj/chc-ring","Canopy structure","Ring frame of a canopy being erected"],["proj/chc-pool-frame","Pool frame","Frame for a freeform pool on the roof"]],
  clips:[["chc-frame","Roof works","Steel grid set out on the roof","v"]],
  form:"Full hot spring / spa project|Similar to the Siji Nanhe rooftop hot spring terrace"},
 {id:"pj-hr",kicker:"Huairou, Beijing",title:"Private courtyard spas,",em:"Manxin Mansion, Water Great Wall",
  lead:"Round stainless steel hot tubs for the private hot spring courtyards of a resort hotel beside the Huanghuacheng Water Great Wall, north of Beijing. Each tub was formed, welded and polished in our factory, crated, and set into its courtyard — then finished with stone, bamboo screens and planting.",
  img:"proj/hr-terrace",
  facts:[["59","Guest rooms"],["Private","Hot spring courtyards for the suites"],["2022","Opened"]],
  spec:[["Project","Huanghuacheng Water Great Wall Manxin Mansion (Manxin Hotel)"],["Location","Shihuyu, Jiuduhe Town, Huairou District, Beijing"],["Type","Resort hotel — private-courtyard hot tubs"],["Facilities","Private hot spring courtyards, swimming pool, restaurant, meeting room, gym"],["Our scope","Design, fabrication of round spa tubs with rolled rim and inner bench · drain and fittings · delivery · setting in place and connection"],["Finish","Brushed stainless steel"]],
  gal:[["proj/hr-finished","Finished tub","Round spa with wide rolled rim, before dispatch"],["proj/hr-factory","In our factory","Two spa bodies during fabrication"],["proj/hr-bowl","Inner bowl","Bench and footwell of a round spa"],["proj/hr-rim","Rim welding","Rolled rim fitted to the spa body"],["proj/hr-drain","Drain fitting","Stainless drain plate welded into the floor"],["proj/hr-crated","Ready to ship","Tubs crated on frames for transport"],["proj/hr-terrace","On site","Courtyard terraces along the hotel"],["proj/hr-install","Installation","Setting a tub into its courtyard"],["proj/hr-placed","In place","Tub set in its base, ready for finishing"]],
  clips:[["hr-bamboo","Bamboo courtyard","Finished tub with stone and bamboo screen","h"],["hr-wisteria","Garden courtyard","Tub framed by planting and wisteria","h"],["hr-deck","Timber deck","Tub set into a curved timber deck","h"]],
  form:"Stainless steel hot tub / spa|Similar to the Huairou hotel courtyard spas"},
 {id:"pj-gb",kicker:"Gubei Water Town, Beijing",title:"Castle hot spring,",em:"Gubei Water Town",
  lead:"An outdoor hot spring pool below the Simatai Great Wall, with a mosaic whale floor. The details people touch every day — overflow channel, gratings, entry steps and handrails — are stainless steel.",
  img:"proj/ref-whale-pool",
  facts:[["9 km²","International tourism resort"],["430,000 m²","Courtyard buildings in the mountains"],["2014","Opened"]],
  spec:[["Project","Gubei Water Town (Simatai Great Wall) International Tourism Resort"],["Location","Simatai Village, Gubeikou Town, Miyun District, Beijing"],["Resort","Hotels, guesthouses, shops, dining and cultural experience zones at the foot of the Simatai Great Wall"],["Type","Outdoor resort hot spring pool"],["Our scope","Stainless overflow channel and gratings · anti-slip entry steps · handrails · water systems"]],
  gal:[["proj/ref-whale-pool","The pool","Outdoor pool with mosaic whale floor"],["proj/det-curve","Curved overflow edge","Grating follows the curve of the pool"],["proj/gb-steps","Entry steps","Steps with stainless nosing and rail"],["proj/gb-rail-steps","Steps and rail","Stainless handrail over the entry steps"],["proj/det-grating","Overflow grating","Stainless grating at the water line"],["proj/det-channel","Overflow channel","Grating and channel, flush with the deck"]],
  clips:[],
  form:"Stainless steel swimming pool|Similar to the Gubei Water Town hot spring pool"},
 {id:"pj-bj",kicker:"Beijing",title:"Rooftop private spas,",em:"Beijing",
  lead:"Square stainless spa pools for a residential rooftop. The welded shells sit on stainless frames and are clad in large-format stone, with an inner bench and step.",
  img:"proj/bj-clad",
  spec:[["Location","Beijing"],["Type","Rooftop private spa pools"],["Our scope","Welded square spa shells · support frames · fill testing · stone cladding interface"]],
  gal:[["proj/bj-clad","Finished","Square spa clad in grey stone"],["proj/bj-bench","Inside","Bench and step inside the spa"],["proj/bj-frame","Frame and panels","Shell on its stainless frame before cladding"],["proj/bj-fill","Fill test","Spa filled for the water-tightness test"],["proj/bj-panels","Panels","Insulated panels fixed to the frame"]],
  clips:[["bj-clad","Cladding","Stone cladding fitted to the spa","v"]],
  form:"Stainless steel hot tub / spa|Similar to the Beijing rooftop spas"},
 {id:"pj-ly",kicker:"Linyi, Shandong",title:"Water show venue,",em:"Langya Ancient City",
  lead:"Stainless steel water systems for the Dongyi Water Show in Langya Ancient City — a real-scene water-and-fire performance on Dongyi legends and one of the city's four signature shows. Large-diameter stainless ducts were delivered to site and welded in the show basement by our installation team.",
  img:"proj/ly-site",
  facts:[["500 t","Water used in the show effects"],["Water + fire","Water screens, jets, flame effects, iron-flower art"],["Top 4","Signature performances of Langya Ancient City"]],
  spec:[["Project","Water Show of Langya Ancient City (Dongyi Water Show)"],["Location","Langya Ancient City Scenic Area, Hedong District, Linyi, Shandong"],["Show","Water screens and projection, high-pressure jets, flame effects, traditional iron-flower and fire-kettle acts, dance and mechanical stage sets"],["Type","Water show venue"],["Our scope","Large-diameter stainless ducts and pipework · on-site welding and installation · steel structure"],["Status","In progress"]],
  gal:[["proj/ly-site","The site","Show building with themed rock scenery"],["proj/ly-ducts","Delivered","Large-diameter stainless ducts on site"],["proj/ly-weld","Welding","Ducts welded in the show basement"],["proj/ly-install","Installation","Ducts lifted into position on scaffolding"],["proj/ly-steel","Steel structure","Structure for the show stage"],["proj/ly-team","Our team","Installation crew on site"]],
  clips:[["ly-site","Site walk","The show site during construction","h"]],
  form:"Full hot spring / spa project|Water show / themed venue — similar to Langya Ancient City"},
 {id:"pj-bv",kicker:"Chengde, Hebei",title:"Wellness &amp; hot spring resort,",em:"Beijing Valley",
  lead:"A PowerChina Real Estate wellness resort in the hills of Xinglong County, combining medical care with hot spring holidays. The first phase includes the Tantang Hot Spring Pavilion and private in-room hot springs fed by medical-grade spring water from 2,600 m underground, alongside a rehabilitation hospital, a resort street, a kids' park and a star-gazing camp.",
  img:null,
  facts:[["6,600 mu","Total site · 3,800 mu construction land"],["RMB 20 bn+","Total investment"],["2,600 m","Depth of the medical-grade hot spring"]],
  spec:[["Project","Beijing Valley — PowerChina wellness &amp; tourism resort, incl. Tantang Hot Spring Pavilion"],["Location","Beikanzi Village, Liudaohe Town, Xinglong County, Chengde, Hebei Province"],["Phase 1","About 600 mu: Tantang Hot Spring Pavilion · private in-room hot springs · PowerChina Rehabilitation Hospital · resort street · kids' park · star-gazing camp"],["Our scope","Hot spring equipment — product details are not published for this project"]],
  gal:[],clips:[],
  form:"Full hot spring / spa project|Wellness / hot spring resort — similar to Beijing Valley"}
];

/* featured Arxan project — facts from the project information sheet */
const ARXAN={name:"Arxan Linhai Yitang Wellness Hotel",
  facts:[["28,218 m²","Total floor area"],["156","Five-star wellness rooms"],["4,200 m²","Hot spring pools · 11 outdoor"],["Aug 2026","Opened"]]};

/* project index (Projects page + home) — order shown */
const PROJECT_INDEX=[
  ["pj-arx","proj/arx-hall-wide","Arxan, Inner Mongolia","Linhai Yitang Wellness Hotel","4,200 m² hot spring pools"],
  ["pj-chc","proj/chc-night","Changchun, Jilin","Siji Nanhe","24,000 m² hot spring zone"],
  ["pj-hr","poster/hr-bamboo","Huairou, Beijing","Manxin Mansion, Water Great Wall","59 rooms · private courtyards"],
  ["pj-gb","proj/ref-whale-pool","Miyun, Beijing","Gubei Water Town","9 km² resort"],
  ["pj-ly","proj/ly-site","Linyi, Shandong","Langya Ancient City Water Show","500 t water effects"],
  ["pj-bv",null,"Chengde, Hebei","Beijing Valley","2,600 m medical-grade spring"],
  ["pj-bj","proj/bj-clad","Beijing","Rooftop private spas","Square stainless spa pools"]
];

/* production process (Factory & Engineering page) */
const PROCESS=[
  ["proc/sheet","Stainless sheet","304 or 316L plate, checked against its mill certificate"],
  ["proc/drawing","Drawing & programming","Every part is drawn and programmed before cutting"],
  ["proc/press","Cutting & bending","CNC cutting and hydraulic press brakes"],
  ["proc/rolled","Rolled curves","Curved wall panels rolled to radius"],
  ["proc/tig","TIG welding","Argon-arc welding with matched filler wire"],
  ["proc/curve-weld","Curved sections","Curved wall segments welded in sequence"],
  ["proc/frame","Reinforcing frames","Painted steel frames for freeform pools"],
  ["proc/polish","Grinding & polishing","Welds ground flush, surfaces polished"],
  ["proc/tub","Finished body","A round spa ready for inspection"],
  ["proc/pack","Protected","Film, foam and frames for transport"],
  ["proc/truck","Shipped","Loaded on flatbed trucks"],
  ["proc/site-ribs","Site assembly","Freeform pool ribs assembled on site"],
  ["proc/glasshouse","Large projects","A freeform pool hall under a glasshouse"],
  ["proc/install","Set in place","A spa set into a garden courtyard"]
];
const PROCESS_CLIPS=[["proc-curve","Curved panels","Curved wall panels on the welding bench","h"],["proc-press","Press brake","Bending a stainless panel","h"],["proc-tub","Spa body","Inside a finished round spa","v"]];

/* component partners (Quality & Supply Chain page) */
const PARTNERS=[
  {title:"Coloured stainless finishes",text:"Bronze, copper, patina and textured finishes on stainless sheet — for designer tubs, wall panels and trims. Ask for the sample range.",
   gal:[["sc/bronze-tub","Bronze-tone tub","Coloured finish on a stainless tub"],["sc/patina","Patina effect","Blue-green patina finish"],["sc/copper","Copper tone","Copper-tone sheet samples"],["sc/samples-1","Sample range","Coloured and textured finish samples"],["sc/samples-2","Sample range","Metallic and etched finishes"],["sc/samples-3","Sample range","Brushed, hammered and patina finishes"]]},
  {title:"Interactive LED floors & displays",text:"Walkable LED floor screens that react to bathers' steps, and waterproof LED walls for immersive spa shows and water-show stages.",
   gal:[["sc/floor-1","LED floor","Walkable LED floor in a public atrium"],["sc/floor-2","Interactive floor","Content reacts to footsteps"],["sc/floor-3","Koi pond floor","Interactive water-garden content"],["sc/led-panels","LED modules","Display modules before installation"]],
   clips:[["sc-floor","Interactive floor","LED floor reacting to visitors","v"]]},
  {title:"Lighting, jets & fittings",text:"Underwater LED lights, LED jets and air-bubble fittings, waste-and-overflow sets, and water temperature sensors from specialist bath-fitting makers.",
   gal:[["sc/fittings","Waste & overflow","Bath waste-and-overflow fittings"],["proj/arx-jets","Jets in use","Hydromassage jets along a pool bench"]]},
  {title:"Controls & electronics",text:"Touch-screen panels, control boards and PLC control cabinets, programmed with our own control logic for spas, pools and plant rooms — see Smart controls on the Technology page.",
   gal:[["proj/arx-cabinet","Control cabinet","PLC cabinet for pumps, heating and dosing"]]}
];

/* home page best sellers — names must match PRODUCTS above */
const HOME_PICKS=["Moon Waterfall Tub","Floating Cloud Spa","Wave Mirror Bathtub","Neon Edge Cliff Pool","Round Deck Spa","Water Drop Spa","Sculpted Art Sauna","Drifting Clouds"];

/* design portfolio (Design page) — renderings from design proposals */
const DESIGNS=[
 {id:"ds-hlg",nav:"Hailuogou",kicker:"Hailuogou, Sichuan · Eco-tourism hot spring",title:"Glacier hot spring,",em:"Hailuogou",text:"A hot spring village below the Hailuogou glacier: stone-edged pools, timber lodges and covered bathing pavilions set into the forest, lit for night bathing.",scope:"Master plan · landscape · pools · night lighting · changing and dining interiors",
  gal:[["design/d01-019","Island pool","Round pool with a stone island seat"],["design/d01-006","Master plan view","Pools and lodges along the valley"],["design/d01-014","Lodge pool","Freeform pool beside a timber lodge"],["design/d01-021","Pavilion pool","Pool with a shade pavilion"],["design/d01-038","By night","Pool village lit after dark"],["design/d01-044","Night bathing","Round pool under the stars"]]},
 {id:"ds-gh",nav:"Genhe",kicker:"Genhe, Inner Mongolia · Hot spring hotel",title:"Forest hot spring hotel,",em:"Aoluguya",text:"A hot spring hotel in the far-north forest, themed on the reindeer-herding Evenki culture: a tree-canopy hydrotherapy hall, indoor pools, a children's water area and teepee-style outdoor pools.",scope:"Positioning · interiors · indoor and outdoor pools · children's water play · four-season operating plan",
  gal:[["design/d02-044","Hydrotherapy hall","Round hydrotherapy pool under a timber tree canopy"],["design/d02-020","The hotel","Brick-and-timber hotel exterior"],["design/d02-046","Indoor pool","Arched white pool hall with planting"],["design/d02-049","Children's pool","Pink arches and a shallow play pool"],["design/d03-015","Teepee pools","Outdoor pools in tent-shaped shelters"],["design/d03-018","Tree court","Outdoor pool around a sculpted tree"]]},
 {id:"ds-xj",nav:"Xinjiang",kicker:"Xinjiang · Hot spring hotel",title:"City hot spring hotel,",em:"Xinjiang",text:"Indoor and outdoor hot springs for a city hotel: a water bar, a spa hall with suspended light domes, an immersive LED pool, children's water play and a rooftop-style garden with pools and grottos.",scope:"Indoor hot spring interiors · outdoor hot spring landscape · arrival landscape",
  gal:[["design/d05-021","Spa hall","Pools under suspended light domes"],["design/d07-005","Hotel and grounds","Aerial view of the hotel and gardens"],["design/d05-014","Water bar","Bar and shop beside the pools"],["design/d06-015","Water play","Outdoor children's pool with play features"],["design/d06-029","Garden domes","White canopy domes in the outdoor garden"],["design/d06-038","Grotto pool","Rock grotto pool at night"]]},
 {id:"ds-nk",nav:"Nilka",kicker:"Nilka, Ili, Xinjiang · Concept plan",title:"Mountain hot spring resort,",em:"Nilka",text:"A concept plan for a hot spring resort below the Tianshan peaks: a timber-and-stone hotel with terraced outdoor pools stepping down the slope.",scope:"Concept plan · hotel · terraced outdoor hot springs",
  gal:[["design/d08-043","Mountain pool","Outdoor pool facing the snow peaks"],["design/d08-042","Hotel and pools","Hotel with pools at its foot"],["design/d08-045","Terraced pools","Hot spring terraces on the slope"]]},
 {id:"ds-yq",nav:"Yanqing hotel",kicker:"Yanqing, Beijing · Hotel spa",title:"Hotel spa,",em:"Yanqing",text:"A calm, dark-stone hotel spa: indoor hot spring pool with loungers, a fireplace lounge, a back-lit salt-brick room and a star-ceiling steam room.",scope:"Spa interiors · indoor pool · thermal rooms · changing areas",
  gal:[["design/d04-019","Indoor pool","Hot spring pool with loungers"],["design/d04-006","Reception","Spa reception and retail"],["design/d04-025","Fireplace lounge","Rest area with an open fire"],["design/d04-028","Salt room","Back-lit Himalayan salt walls"],["design/d04-030","Star room","Steam room with a starlit ceiling"]]},
 {id:"ds-rlw",nav:"Ruilinwan",kicker:"Beijing · Hot spring resort",title:"Garden hot spring,",em:"Ruilinwan",text:"Upgrading a hot spring resort: a tropical glasshouse with pools and children's water play, and an outdoor garden of pools, bamboo nests and a children's playground.",scope:"Indoor glasshouse landscape · outdoor pools · children's areas",
  gal:[["design/d10-009","Glasshouse pools","Indoor pools among tropical planting"],["design/d10-018","Indoor water play","Slides and play pool under glass"],["design/d10-023","Outdoor pool","Rock-edged pool in the garden"],["design/d10-027","Bamboo nests","Woven nest seats beside the pools"],["design/d10-042","Playground","Children's play area"]]},
 {id:"ds-zs",nav:"Zishan Lake",kicker:"Xianning, Hubei · Resort hotel",title:"Hot spring &amp; water play,",em:"Zishan Lake",text:"A concept for a lakeside resort hotel: a glass-roofed hall with jellyfish lanterns over a lap pool and children's water play, and hot spring gardens with a lazy river outside.",scope:"Indoor hot spring and water-play concept · outdoor hot spring gardens",
  gal:[["design/d13-011","Lantern hall","Glass-roofed pool hall with jellyfish lanterns"],["design/d13-012","Lap pool","Lap pool and lounge pods"],["design/d13-015","Spa garden","Outdoor hot spring pools"],["design/d13-018","Lazy river","Aerial view of the outdoor water garden"]]},
 {id:"ds-sm",nav:"Small projects",kicker:"Guesthouses, rooms and refits",title:"Smaller spaces,",em:"same care",text:"Boutique projects: a hillside guesthouse with an infinity pool and a cave-style spa, a hot spring hall refit in Chongqing, and new thermal rooms for the Arxan resort.",scope:"Guesthouse spa · indoor hot spring refit · salt and grotto rooms",
  gal:[["design/d12-002","Hillside guesthouse","Infinity pool cantilevered over the valley"],["design/d12-007","Cave spa","Grotto pool with a waterfall"],["design/d12-010","Cave lounge","Fire pit beside the cave pool"],["design/d12-026","Screen terrace","Sunken lounge with outdoor screen"],["design/d11-005","Chongqing pool hall","Hydrotherapy pool with river view"],["design/d11-007","Pool bar","Pool and bar under pendant lights"],["design/d09-004","Salt cave","Arxan — salt cave room"],["design/d09-005","Grotto pool","Arxan — planted grotto pool"]]},
 {id:"ds-wp",nav:"Water parks",kicker:"Water parks · themed design",title:"Indoor water parks,",em:"Chengdu &amp; Jinan",text:"Theming and interior packages for two large indoor water parks: wave pools, lazy rivers, play towers and hot spring areas, with themed changing rooms, shops and dining.",scope:"Theming · interiors · wave pool and play areas · hot spring zone",
  gal:[["design/wp-cd-aerial","Chengdu — overview","Model view of the water park"],["design/wp-cd-wave","Chengdu — wave pool","Snow-mountain themed wave pool"],["design/wp-cd-ice","Chengdu — ice bowls","Hot spring bowls in an ice landscape"],["design/wp-cd-play","Chengdu — play tower","Themed water-play tower"],["design/wp-jn-aerial","Jinan — overview","Model view of the water park"],["design/wp-jn-wave","Jinan — wave pool","Tropical wave pool"],["design/wp-jn-infinity","Jinan — lagoon","Palm-lined lagoon pool"],["design/wp-jn-spa","Jinan — hot springs","Hot spring area with themed pavilions"]]}
];

/* energy centres (Projects page) — key figures from project records */
const ENERGY=[
 {title:"Tianjin Dongjiang Port",place:"Dongjiang Free Trade Port, Tianjin · hotel",facts:[["70 °C","Spring water, 2 wells × 100 m³/h"],["½","Heating cost of a gas boiler"],["2024","Built and commissioned"]],
  text:"Spring water first heats domestic hot water and keeps the pools warm, then tops up the pools, then runs the floor heating at 50/40 °C. What is left feeds water-source heat pumps for air-conditioning hot water at 60/50 °C — and the same heat pumps cool the building in summer.",
  gal:[["energy/tj-3","Pump room","Circulation pumps and pipework"],["energy/tj-4","Heat pump","Water-source heat pump unit"],["energy/tj-5","Heat pumps","Units and valve sets"],["energy/tj-6","Manifolds","Distribution headers"]]},
 {title:"Xinzhou Qingliangwan",place:"Hot spring town, Xinzhou, Shanxi",facts:[["60 °C","Spring water, 55 m³/h"],["2,440 kW","Pool heating from heat pumps"],["≈ ¥300k","Saved per year vs heat recovery"]],
  text:"60 °C spring water gives 500 kW to domestic hot water through plate heat exchangers, then tops up the pools. The remainder is cooled to 8/15 °C as the source for water-source heat pumps that heat the pools at 60/50 °C, and supply about 2,200 kW of cooling in summer — enough for some 22,000 m².",
  gal:[["energy/xz-2","Heat pump units","Water-source heat pumps"],["energy/xz-3","Pool pumps","Filtration and circulation pumps"],["energy/xz-5","Valve sets","Insulated pipework and valves"],["energy/xz-6","Controls","Automatic make-up and pool controls"]]},
 {title:"Jinyu Badaling Hot Spring Resort",place:"Yanqing, Beijing · hotel for the 2022 Winter Olympics",facts:[["68 °C","Spring water from a 2,006 m well"],["4 stages","Cascade use down to 22 °C"],["3,767 kW","Heating after the heat pump upgrade"]],
  text:"A four-stage cascade: hotel heating and hot water first, then air-conditioning heat at 60/50 °C, then heat-pump peak support, and finally water-source heat pumps that cool the water to 22 °C before reinjection. New high- and low-temperature heat pumps (heating COP up to 6.2) let the resort run on one boiler in most winter conditions and add 2,047 kW of cooling on peak summer days.",
  gal:[]}
];

/* smart controls (Technology page) */
const CONTROLS=[
  {n:"01",title:"Private spa: level & temperature",items:["Four water levels watched continuously: refill starts 10 mm below the set level and stops at it; overflow drain at +10 mm; pumps stop at −50 mm","Holds 38–42 °C by blending hot and cold make-up water","Night mode returns water to an insulated tank and refills before opening — over 30% less heat loss","Self-clean after closing: drain, spray disinfectant, rinse","7-inch IP65 touch screen, phone app and remote alarms"]},
  {n:"02",title:"Pool water treatment",items:["Free chlorine 1.0–3.0 ppm, pH 7.2–7.8, ORP 650–750 mV and turbidity below 1 NTU, dosed automatically","Filters backwash when pressure difference exceeds 0.05 MPa or after 48 hours","Variable-speed pumps: full flow when open, half flow when closed — 20–30% energy saving","Duplicate chlorine and pH probes; heater interlocked to flow","Water quality records kept for at least two years"]},
  {n:"03",title:"Heating & cooling plant room",items:["Supply temperature held within ±0.5 °C","Chillers, heat pumps and boilers staged by load, with run-time balancing","Weather-compensated heating and free cooling in mild seasons","Frost, pressure and flow protection with safe start and stop sequences","Typical saving of 25–40% against manual operation"]},
  {n:"04",title:"Storm-rain hydrotherapy room",items:["One button runs a timed storm scene","Rain from light drizzle to downpour, with wind, waves and lightning in sync","Surround sound and waterproof high-refresh LED screens","Water kept around 30 °C with continuous filtration","Emergency stop and over-temperature cut-off"]}
];
