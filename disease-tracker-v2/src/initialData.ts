import { Disease, VaccineDetails, Outbreak, DataSource, NewsArticle } from "./types";

export const INITIAL_DISEASES: Disease[] = [
  {
    id: "covid-19",
    name: "COVID-19 (Coronavirus)",
    type: "Virus",
    firstDiscovered: "2019 in Wuhan, China",
    transmissionMethods: ["Air drops from coughing/sneezing", "Touching dirty surfaces and then touching face"],
    symptomsList: ["Fever", "Cough", "Loss of taste/smell", "Shortness of breath", "Fatigue"],
    riskGroups: ["Older adults", "People with weak immune systems", "People with chronic lung/heart problems"],
    treatmentMethods: ["Supportive rest", "Hydration", "Antiviral medicines like Paxlovid if prescribed", "Oxygen support"],
    vaccinationAvailable: true,
    mortalityRate: "0.5% - 1.2% (can vary based on vaccine status)",
    historicalOutbreaks: "Global Pandemic beginning late 2019, causing massive global quarantine and public health shifts.",
    
    // 10YL presentation
    whatIsIt: "COVID-19 is an illness caused by a tiny crown-shaped virus. It sits inside little droplets in the air and likes to reside in the lungs.",
    howItSpreads: "When someone coughs, sneezes, or talks, tiny invisible water droplets fly into the air. If you breathe those in or touch a spot where they landed and then touch your eyes, nose, or mouth, the virus can jump over to you!",
    symptoms10YL: [
      { name: "Fruity Cough", icon: "wind", descriptor: "A persistent cough that sounds dry like rattling leaves." },
      { name: "Warm Forehead", icon: "thermometer", descriptor: "Feeling hot and shivery like your body is fighting a mini-war." },
      { name: "Silly Nose", icon: "sniff", descriptor: "Suddenly being unable to smell delicious fresh cookies or taste sweet candy." }
    ],
    staySafe10YL: [
      "Wash your hands with soap while singing 'Happy Birthday' twice!",
      "Cough into the corner of your elbow like a cool superhero folding their cape.",
      "Wear a comfortable face mask when in crowded indoor places if there's a bug going around."
    ],
    isThereVaccine10YL: "Yes! Scientists made a clever health shield injection. It teaches your immune defenses to recognize the virus's spiked crown so they can zap it immediately.",
    whyCare10YL: "By staying protected, you don't miss school, you keep your playtime active, and most importantly, you protect your grandparents and baby brothers or sisters who are more fragile.",
    whatToDoNow10YL: [
      "Ask a parent if your immunizations are up to date.",
      "Practice washing your hands with bubbles today!",
      "Keep a small pocket hand sanitizer in your school bag."
    ],
    benefitsOfPrevention: [
      "Keep body strong and energized",
      "Protect elder grandparents",
      "Uninterrupted school and sports",
      "Stop virus from mutating further"
    ]
  },
  {
    id: "malaria",
    name: "Malaria",
    type: "Parasite",
    firstDiscovered: "Antiquity (identified as a parasite in 1880 by Alphonse Laveran)",
    transmissionMethods: ["Bites of infected female Anopheles mosquitoes"],
    symptomsList: ["High chills and fever", "Shaking", "Sweating", "Severe headache", "Anemia"],
    riskGroups: ["Young children under 5", "Pregnant women", "Travelers with no immunity"],
    treatmentMethods: ["Artemisinin-based combination therapies (ACTs)", "Chloroquine"],
    vaccinationAvailable: true,
    mortalityRate: "Around 0.3% (varies, high risk among untreated children)",
    historicalOutbreaks: "Endemic across Africa, Asia, and Latin America for thousands of years, causing hundreds of thousands of annual deaths.",
    
    // 10YL presentation
    whatIsIt: "Malaria is a sneaky blood bug caused by a tiny parasite. It gets carried around by mother mosquitoes who like to buzz in the night.",
    howItSpreads: "An infected female mosquito picks up the tiny parasites from one person and injects them into another person's arm while looking for a little blood snack.",
    symptoms10YL: [
      { name: "Solf Shivers", icon: "snowflake", descriptor: "Shaking like you're lost in a snowstorm, followed by feeling very hot and sweaty." },
      { name: "Sleepy Bones", icon: "activity", descriptor: "Feeling so heavy and tired that even your favorite toys seem too heavy to lift." },
      { name: "Tummy Ouchies", icon: "frown", descriptor: "Feeling sick to your stomach, sometimes with a headache." }
    ],
    staySafe10YL: [
      "Sleep under a special cozy bed net shaped like a protective canopy.",
      "Spray skin with bug repellent that has a citrusy smell to scare mosquitoes away.",
      "Wear long sleeves and long trousers when playing outside in the evening."
    ],
    isThereVaccine10YL: "Yes! Scientists recently invented the RTS,S and R21 vaccines. They teach your body's cells to catch the parasite before it reaches the liver.",
    whyCare10YL: "Preventing Malaria means you get to spend your evenings stargazing instead of lying in a hospital bed with bugs in your blood.",
    whatToDoNow10YL: [
      "Check that your windows have screen meshes without any holes.",
      "Avoid standing puddles of water outside where mosquito babies grow.",
      "If traveling to mosquito areas, ask a doctor for protective tiny pills to take."
    ],
    benefitsOfPrevention: [
      "Play outside safely in warm climates",
      "Eliminate annoying itchy insect bites",
      "Save families from high healthcare costs",
      "Build a safer neighborhood with fewer mosquitoes"
    ]
  },
  {
    id: "ebola",
    name: "Ebola Virus Disease",
    type: "Virus",
    firstDiscovered: "1976 near the Ebola River in the Democratic Republic of Congo",
    transmissionMethods: ["Direct contact with blood, body fluids, or tissues of infected people/animals"],
    symptomsList: ["Sudden fever", "Extreme muscle pain", "Severe sore throat", "Vomiting", "Unexplained bleeding"],
    riskGroups: ["Healthcare workers", "Family members of patients", "Mourners in close contact with deceased victims"],
    treatmentMethods: ["Monoclonal antibody therapies (Inmazeb, Ebanga)", "Active rehydration fluids"],
    vaccinationAvailable: true,
    mortalityRate: "25% - 90% (Average around 50%)",
    historicalOutbreaks: "West Africa Epidemic (2014-2016) with over 11,000 deaths; several smaller outbreaks in Central Africa since.",
    
    // 10YL presentation
    whatIsIt: "Ebola is a very strong, rare virus that makes people extremely sick. It lives in wild forest animals like fruit bats and occasionally jumps to humans.",
    howItSpreads: "Ebola doesn't fly through the air! It can only pass if you touch the actual bodily drops of someone who is active with the disease.",
    symptoms10YL: [
      { name: "Super Hot Sparks", icon: "zap", descriptor: "A sudden, extremely high fever that starts out of nowhere." },
      { name: "Bruised Muscles", icon: "shield", descriptor: "Feeling like you ran ten marathons because all your muscles ache." },
      { name: "Angry Throat", icon: "flame", descriptor: "Having a very sore throat that makes swallowing juice difficult." }
    ],
    staySafe10YL: [
      "Never touch wild animals, especially bats or monkeys found in the forest.",
      "Stay away from anyone who is very sick with fevers and vomiting, and alert an adult.",
      "Wash hands thoroughly with chlorinated water or strong soap."
    ],
    isThereVaccine10YL: "Yes! There is a highly effective vaccine (Ervebo) designed to create a powerful shield against the Zaïre Ebola virus. It's given immediately to communities near outbreaks.",
    whyCare10YL: "Because Ebola spreads so fast inside households, catching it early and knowing how to stay safe helps keep your entire city and the doctors who care for us completely out of danger.",
    whatToDoNow10YL: [
      "Learn to recognize what symptoms look like.",
      "Help clean toys with disinfectant wipes.",
      "Support healthcare hero workers with kind letters or drawings."
    ],
    benefitsOfPrevention: [
      "Contain dangerous outbreaks instantly",
      "Protect local clinics and laboratories",
      "Preserve precious wildlife and bio-safety barriers",
      "Keep local economies and travel open"
    ]
  },
  {
    id: "dengue",
    name: "Dengue Fever",
    type: "Virus",
    firstDiscovered: "1779 (first recorded in Asia, Africa, and North America)",
    transmissionMethods: ["Bites of infected Aedes aegypti and Aedes albopictus mosquitoes"],
    symptomsList: ["Severe joint and muscle pain ('breakbone fever')", "High fever", "Pain behind the eyes", "Red skin rash", "Nausea"],
    riskGroups: ["Infants", "People undergoing their second separate Dengue infection (high risk of hemorrhagic fever)"],
    treatmentMethods: ["Pain medication (Acetaminophen ONLY, avoid ibuprofen/aspirin)", "Plenty of rest", "IV fluids"],
    vaccinationAvailable: true,
    mortalityRate: "Less than 1% if treated early (can reach 20% if untreated hemorrhagic state occurs)",
    historicalOutbreaks: "Widespread globally, tropical regions suffer seasonal surges. Recent years have seen massive increases due to warming temperatures globally.",
    
    // 10YL presentation
    whatIsIt: "Dengue is a warm-weather fever nicknamed 'breakbone fever' because it makes your joints feel as sore as if you played too hard on the playground.",
    howItSpreads: "It spreads when a fancy striped mosquito (called Aedes, who active during sunny daytime hours) bites someone with Dengue and carries it to another kid.",
    symptoms10YL: [
      { name: "Rainbow Rash", icon: "grid", descriptor: "A flat red rash that covers your tummy, arms, and legs." },
      { name: "Ouchy Eyes", icon: "eye", descriptor: "An ache right behind your eyeballs when you try to look around." },
      { name: "Joint Creaks", icon: "scissors", descriptor: "Feeling stiff and creaky, like an old toy robot that needs some oil." }
    ],
    staySafe10YL: [
      "Empty out plant saucers, dog bowls, or old tires where standing water gathers, so mosquitoes can't lay eggs.",
      "Wear socks, long sleeves, and lightweight trousers when playing in gardens.",
      "Set up mosquito plug-ins or screen doors at home."
    ],
    isThereVaccine10YL: "Yes! There are vaccines (Dengvaxia and Qdenga) that help train the body. They are given to children who live in areas where Dengue mosquito bites are super common.",
    whyCare10YL: "Because Dengue is highly uncomfortable, keeping mosquitoes away means you can enjoy swimming pool parties and park games all summer long without any itchy, achy bugs.",
    whatToDoNow10YL: [
      "Go on a 'water hunt' in your garden and tilt over anything holding rainwater!",
      "Apply bug cream before going on forest hikes.",
      "Ensure rubbish bins are closed tightly so bugs don't hang around."
    ],
    benefitsOfPrevention: [
      "Bug-free summer camps and garden activities",
      "Prevention of severe medical emergencies",
      "Reduces mosquito populations in public parks",
      "Peace of mind during the rainy season"
    ]
  },
  {
    id: "measles",
    name: "Measles",
    type: "Virus",
    firstDiscovered: "9th Century (described by Persian physician Rhazes)",
    transmissionMethods: ["Extremely airborne droplets", "Breathing in air where an infected person was up to 2 hours ago"],
    symptomsList: ["High fever", "Cough", "Runny nose", "Red watery eyes", "Characteristic rash starting on face"],
    riskGroups: ["Unvaccinated children under 5", "Pregnant women", "Malnourished kids"],
    treatmentMethods: ["High-dose Vitamin A supplements", "Fever reducers", "Hydration", "Antibiotics if skin/ear infections occur"],
    vaccinationAvailable: true,
    mortalityRate: "0.1% - 0.2% (can rise to 10% in areas with severe malnutrition)",
    historicalOutbreaks: "Virtually universal among kids prior to vaccination; modern localized outbreaks happen in areas with low vaccination rates.",
    
    // 10YL presentation
    whatIsIt: "Measles is an incredibly catchy virus that loves to travel through the air. It causes lots of little red polka-dots to pop up all over your skin.",
    howItSpreads: "If a person with Measles coughs in a room and leaves, the virus can float in the air like an invisible cloud for a whole two hours, waiting for someone unvaccinated to breathe it in!",
    symptoms10YL: [
      { name: "Face Constellation", icon: "sparkles", descriptor: "Tiny red dots starting behind your ears and sliding down to cover your whole body." },
      { name: "Tomato Eyes", icon: "eye-off", descriptor: "Red, swollen, watery eyes that feel itchy when you look at bright lights." },
      { name: "Sniffly Tap", icon: "droplet", descriptor: "A sneezing runny nose that feels like an open dripping faucet." }
    ],
    staySafe10YL: [
      "The best superpower shield is getting your MMR vaccine when you are a toddler!",
      "Avoid sharing water bottles or juice boxes with people who are coughing.",
      "Stay home if you have red itchy eyes and a warm forehead."
    ],
    isThereVaccine10YL: "Absolutely! The MMR vaccine is one of the strongest vaccines ever made. Two quick pokes protect you almost 100% for the rest of your entire life!",
    whyCare10YL: "Measles is incredibly contagious. If you stand near it, you'll almost certainly catch it unless shielded. Getting vaccinated keeps your friends at school safe too.",
    whatToDoNow10YL: [
      "High-five your parents for getting you vaccinated when you were little!",
      "Read about immune system white blood cells (the body's tiny guards).",
      "Help raise awareness by teaching your siblings how the air carries germs."
    ],
    benefitsOfPrevention: [
      "Total eradication of a highly infectious disease",
      "Protection of tiny newborn babies who are too young for the injection",
      "Avoidance of ear infections and painful rashes",
      "Ensures classroom safety for children with sensitive health"
    ]
  },
  {
    id: "tuberculosis",
    name: "Tuberculosis (TB)",
    type: "Bacteria",
    firstDiscovered: "Ancient Egypt (discovered as bacterium in 1882 by Robert Koch)",
    transmissionMethods: ["Airborne particles from coughing or speaking by individuals with active disease"],
    symptomsList: ["Chronic cough (often with blood)", "Night sweats", "Weight loss", "Persistent fatigue", "Fever"],
    riskGroups: ["Tobacco smokers", "Malnourished people", "People living in crowded or poorly ventilated places"],
    treatmentMethods: ["Long-term course of multiple antibiotics (6+ months of Isoniazid, Rifampicin, etc.)"],
    vaccinationAvailable: true,
    mortalityRate: "Around 15% if untreated; drops below 2% with proper modern antibiotic treatment",
    historicalOutbreaks: "Historically known as the 'White Plague' or 'Consumption', it was a major cause of death in Europe and America in the 18th/19th centuries.",
    
    // 10YL presentation
    whatIsIt: "Tuberculosis (or TB for short) is a persistent cough illness caused by rod-shaped bacteria. They like to build tiny cities inside the lungs and sit there for a long time.",
    howItSpreads: "It floats through the air in tiny microscopic drops when an infected person speaks or sings. It's a slow bug, meaning you usually need to spend quite a lot of time in the same room with the sick person to catch it.",
    symptoms10YL: [
      { name: "Forever Cough", icon: "wind", descriptor: "A deep heavy cough that lasts for weeks and weeks and doesn't go away with cough syrup." },
      { name: "Night Rain", icon: "moon", descriptor: "Waking up in the middle of school holidays with pajamas damp from sweating, even in cool weather." },
      { name: "Shrinking Scale", icon: "arrow-down", descriptor: "Losing weight and feeling like you are shrinking because you have no appetite for dinner." }
    ],
    staySafe10YL: [
      "Keep windows open in classrooms and buses so plenty of fresh air sweeps germs away.",
      "Eat healthy fruit and veggies to keep your immune cells strong.",
      "Get a checkup if you have a friend who's coughing for more than two weeks."
    ],
    isThereVaccine10YL: "Yes, there is a vaccine called BCG! It is given to many babies early in life to protect them from the most severe forms of lung infections.",
    whyCare10YL: "Because TB takes a long time and lots of daily bitter pills to cure, keeping your lungs safe from it ensures you can run fast, sing loud, and play games without losing your breath.",
    whatToDoNow10YL: [
      "Ask teachers to crack school windows open for fresh, flowing air.",
      "Exercise and practice breathing big lung-fulls of crisp park air.",
      "Learn about how your body uses oxgyen from the blood!"
    ],
    benefitsOfPrevention: [
      "Keep breathing paths clean and super strong",
      "Avoid taking heavy medicines for half a year",
      "Healthy growth and easy sports activities",
      "Eradicate chronic illness in developing towns"
    ]
  },
  {
    id: "cholera",
    name: "Cholera",
    type: "Bacteria",
    firstDiscovered: "Ancient India (scientifically identified in 1854 by Filippo Pacini)",
    transmissionMethods: ["Ingestion of food or water contaminated with Vibrio cholerae bacteria"],
    symptomsList: ["Severe watery diarrhea ('rice-water stools')", "Rapid dehydration", "Muscle cramps", "Weak pulse", "Cold skin"],
    riskGroups: ["People living in camps with poor sanitation", "Communities without access to clean piped water"],
    treatmentMethods: ["Oral Rehydration Salts (ORS)", "Intravenous fluids", "Antibiotics in severe cases"],
    vaccinationAvailable: true,
    mortalityRate: "Can exceed 50% if untreated; falls below 1% with rapid, effective rehydration therapy",
    historicalOutbreaks: "Seven distinct pandemics over the last 200 years, regularly flaring up in humanitarian crises and natural disaster zones.",
    
    // 10YL presentation
    whatIsIt: "Cholera is a bacterium that sneaks into dirty water and makes your tummy very upset, causing all the water to drain from your body quickly.",
    howItSpreads: "If dirty water containing the cholera bacterium mixes into drinking water or washed fruits, and someone drinks it without boiling it first, the bacteria enter the stomach.",
    symptoms10YL: [
      { name: "Water Tummy", icon: "droplet", descriptor: "Suddenly having to run to the toilet with very watery stools several times." },
      { name: "Desert Mouth", icon: "sunset", descriptor: "Feeling incredibly thirsty, with dry lips and skin like you ran across a dry desert." },
      { name: "Crying Muscles", icon: "activity", descriptor: "Cramps in your legs and arms because your body is running out of minerals." }
    ],
    staySafe10YL: [
      "Only drink clean bottled water or tap water that has been boiled for a minute.",
      "Wash your hands with clean water before eating any snacks.",
      "Make sure street food is steamed hot and cooked thoroughly."
    ],
    isThereVaccine10YL: "Yes! There are bubbly, tasty oral vaccines (drinks) like Dukoral and Shanchol that coat your stomach with defensive antibodies to block cholera.",
    whyCare10YL: "It protects your body's plumbing! Staying free of cholera means you won't get dehydrated, and it ensures after a natural disaster or flood, communities get back on their feet safely.",
    whatToDoNow10YL: [
      "Learn how to mix a simple Oral Rehydration pinch of salt and sugar in water.",
      "Remind parents to boil camping creek water before cooking.",
      "Avoid playing in stagnant rain puddles after big storms."
    ],
    benefitsOfPrevention: [
      "Safe drinking water for rural districts",
      "Prevents rapid dehydration emergencies",
      "Protects holiday campers and travelers",
      "Safe community recovery after floods or earthquakes"
    ]
  },
  {
    id: "nipah",
    name: "Nipah Virus Infection",
    type: "Virus",
    firstDiscovered: "1999 during an outbreak in Malaysia and Singapore",
    transmissionMethods: ["Direct contact with infected pigs or fruit bats", "Eating food contaminated by bat saliva/urine (like raw date palm sap)"],
    symptomsList: ["Fever", "Headache", "Drowsiness", "Confusion", "Encephalitis (brain swelling)", "Coma"],
    riskGroups: ["Pig farmers", "People climbing infected date palm trees", "Family caregivers of patients"],
    treatmentMethods: ["Supportive intensive care", "Monoclonal antibodies (investigational)"],
    vaccinationAvailable: false,
    mortalityRate: "40% - 75% (Varies by outbreak; highly lethal)",
    historicalOutbreaks: "Severe periodic seasonal outbreaks in Bangladesh and West Bengal, India, associated with consuming raw date palm sap.",
    
    // 10YL presentation
    whatIsIt: "Nipah is a rare, very powerful virus that bats carry. It can make key parts of your head feel extremely sleepy and foggy.",
    howItSpreads: "If a fruit bat bites a juicy piece of fruit in a tree or drinks sap from a bucket, it leaves saliva behind. If a pig or human eats that same fruit or raw sap, the virus leaps into them.",
    symptoms10YL: [
      { name: "Fizzy Headache", icon: "activity", descriptor: "A very sore head accompanied by feeling dizzy and confused." },
      { name: "Cloudy Daze", icon: "eye-off", descriptor: "Feeling extremely sleepy, having trouble remembering what you are doing, or struggling to wake up." },
      { name: "Hot Shivers", icon: "thermometer-sun", descriptor: "A sudden rise in temperature with matching muscle shakes." }
    ],
    staySafe10YL: [
      "Never eat wild forest fruits that have tiny bite marks or look like they were chewed on.",
      "Avoid raw date palm juice; drink it boiled or pasteurized instead.",
      "Stay away from pigs listless or coughing in farms."
    ],
    isThereVaccine10YL: "Not yet! There is no vaccine available for humans, though scientists are working hard on them right now. Currently, we prevent it by educating farmers.",
    whyCare10YL: "Because Nipah causes very deep sleepiness (swelling in the brain), keeping fruit bats away and keeping our foods washed keeps our minds sharp and protected.",
    whatToDoNow10YL: [
      "Wash all purchased fruits with clean water before peeling or eating.",
      "Read about how bats are important for nature (eating mosquitoes!), even if we must not touch them.",
      "Tell friends never to eat fruits they find fallen directly on the ground!"
    ],
    benefitsOfPrevention: [
      "Protect your nervous system and brain",
      "Ensures veterinary health for farm pigs",
      "Halts high-danger viral transmission chains",
      "Guides safe harvesting of tropical orchard fruits"
    ]
  },
  {
    id: "h1n1",
    name: "H1N1 Influenza (Swine Flu)",
    type: "Virus",
    firstDiscovered: "2009 (pandemic strain originated in Mexico)",
    transmissionMethods: ["Inhaling respiratory droplets from coughing or sneezing", "Touching contaminated objects"],
    symptomsList: ["Swine flu symptoms are identical to seasonal influenza: fever, cough, body aches, chills, fatigue, sore throat"],
    riskGroups: ["Children under 5", "Pregnant women", "Asthmatics", "Obese individuals"],
    treatmentMethods: ["Antivirals (Oseltamivir/Tamiflu, Zanamivir)", "Fever management", "Bedrest"],
    vaccinationAvailable: true,
    mortalityRate: "0.02% (very low but highly contagious during surges)",
    historicalOutbreaks: "2009 Swine Flu Pandemic infected hundreds of millions worldwide, with standard H1N1 now a component of standard annual flu shots.",
    
    // 10YL presentation
    whatIsIt: "H1N1 is an flu bug that originally passed between pigs, but learned to hop to humans. It behaves like a heavy cold with extra muscle aches.",
    howItSpreads: "It acts just like a cold: floating in cough mist, hopping onto door handles from unwashed fingers, or visiting your hands when you high-five a sick classmate.",
    symptoms10YL: [
      { name: "Blanket Snuggles", icon: "activity", descriptor: "Feeling very cold and wanting to curl up under three blankets." },
      { name: "Scratchy Throat", icon: "flame", descriptor: "A tickly throat that feels dry and rough like sandpaper when you talk." },
      { name: "Heavy Legs", icon: "snowflake", descriptor: "Feeling achy all over your back, arms, and legs." }
    ],
    staySafe10YL: [
      "Get a quick annual flu prick (it usually contains H1N1 defenses inside!).",
      "Sneeze inside a tissue, throw the tissue in the bin, and wash your hands instantly.",
      "Avoid rubbing your eyes or nose with hands that touched public buttons or handrails."
    ],
    isThereVaccine10YL: "Yes! The annual flu vaccine (the nose spray or arm drop) is updated every single autumn to include protection against H1N1 strains.",
    whyCare10YL: "Avoiding the flu means you keep your energy up for swimming, football, video games, or reading, and prevents you from coughing near classmates.",
    whatToDoNow10YL: [
      "Request your yearly flu defense spray before winter starts.",
      "Have a tissue-shooting practice: toss them straight into the wastebasket after sneezing!",
      "Help clean shared keyboards or game controllers with sanitary wipes."
    ],
    benefitsOfPrevention: [
      "Avoid shivering winter cold bouts",
      "Keep standard classroom attendance full",
      "Reduces patient volume in pediatric clinics",
      "Build overall community immune resilience"
    ]
  },
  {
    id: "monkeypox",
    name: "Mpox (Monkeypox)",
    type: "Virus",
    firstDiscovered: "1958 in research monkeys (first human case in 1970 in DRC)",
    transmissionMethods: ["Direct skin-to-skin touch", "Touching contaminated bedding or clothing", "Close face-to-face breathing"],
    symptomsList: ["Painful skin blisters (pox lesions)", "Fever", "Swollen lymph nodes", "Backache", "Intense headaches"],
    riskGroups: ["Immunocompromised individuals", "People living in regions with household cases of Mpox"],
    treatmentMethods: ["Antiviral drug Tecovirimat (TPOXX)", "Supportive pain relief for blisters"],
    vaccinationAvailable: true,
    mortalityRate: "Less than 1% for Clade II; up to 10% for the endemic Clade I strain if untreated",
    historicalOutbreaks: "Global multi-country outbreak in 2022-2023 with Clade II; more severe Clade Ib emergence in Central Africa in 2024.",
    
    // 10YL presentation
    whatIsIt: "Mpox (formerly Monkeypox) is a virus that causes tiny, bumpy blisters that look like water beads on your skin, which can feel quite itchy and sore.",
    howItSpreads: "Mpox is a very tactile virus: it mostly spreads if you have direct, close skin touch with the blisters of an active patient, or cuddle on the same blankets or towels.",
    symptoms10YL: [
      { name: "Skin Orbs", icon: "sparkles", descriptor: "Firm, raised bumps that fill with clear fluid, scaling over as dry scabs." },
      { name: "Neck Swellings", icon: "user", descriptor: "Lumps that feel like small marbles on the side of your neck (these are your immunity stations fighting the bug!)." },
      { name: "Head Drumming", icon: "activity", descriptor: "A heavy, warm headache starting before the spots show up." }
    ],
    staySafe10YL: [
      "Do not touch rash bumps on anyone else's skin.",
      "Do not share pillows, sheets, or pajamas with anyone who is feeling unwell.",
      "Wash public gym mats or sports balls before playing with them."
    ],
    isThereVaccine10YL: "Yes! There is a vaccine (JYNNEOS) that works incredibly well. It is very safe and train your body's cells to lock the Mpox virus away before pox can form.",
    whyCare10YL: "Avoiding Mpox means you avoid itchy, tender blisters on your hands or body that require you to stay inside your bedroom away from friends for weeks until they heal.",
    whatToDoNow10YL: [
      "Be clean and wash up with soap after wrestling or close tag games.",
      "Check that your sports equipment is wiped down.",
      "If you notice a funny bump on your arm or neck, show a parent!"
    ],
    benefitsOfPrevention: [
      "Keep skin smooth, clear, and pain-free",
      "Avoid long isolation quarantines at home",
      "Stop skin infections from climbing further",
      "Maintains clean health standards in sports groups"
    ]
  },
  {
    id: "polio",
    name: "Polio (Poliomyelitis)",
    type: "Virus",
    firstDiscovered: "Antiquity (recorded in ancient Egyptian stone carvings; virus discovered in 1908)",
    transmissionMethods: ["Fecal-oral route (ingesting contaminated food, water, or dirty hands)"],
    symptomsList: ["Often asymptomatic, but can cause permanent muscle weakness/paralysis, difficulty breathing, fever"],
    riskGroups: ["Unvaccinated infant children under 5 years old"],
    treatmentMethods: ["Symptomatic care", "Physical therapy to help muscle function", "Ventilators ('iron lungs' historically) used for breathing support"],
    vaccinationAvailable: true,
    mortalityRate: "2% - 10% of paralyzed patients die due to breathing muscles shutting down",
    historicalOutbreaks: "Global crippler historically. Jonas Salk's 1953 vaccine triggered a massive global elimination campaign, leaving only tiny pockets worldwide.",
    
    // 10YL presentation
    whatIsIt: "Polio is a heavy tummy-to-muscle virus. In rare cases, it can turn off the wires that connect the brain to the legs, making it very hard to walk or run.",
    howItSpreads: "It travels through food or water that was touched by dirty fingers. If a child plays in dirt carrying the virus and forgets to scrub their hands with soap before sandwiches, Polio slides inside.",
    symptoms10YL: [
      { name: "Tired Hips", icon: "activity", descriptor: "Feeling like your legs are extremely heavy, floppy, or won't lift when you try to walk." },
      { name: "Floppy Stiff Back", icon: "shield-alert", descriptor: "A very stiff neck that makes nodding a bit painful." },
      { name: "Nausea Swivel", icon: "frown", descriptor: "Diligence is required when having a sore stomach or vomiting bugs." }
    ],
    staySafe10YL: [
      "Take your Polio vaccine drops on your tongue when a nurse or doctor invites you!",
      "Always use warm water and soap to scrub your hands after using the toilet toilet.",
      "Do not swim in slow canal waters or dirty river bends."
    ],
    isThereVaccine10YL: "Yes! There are two types: a tiny sweet drink of drops (Oral Polio Vaccine) or a quick protective poke (IPVs). They have almost completely wiped polio off the face of the Earth!",
    whyCare10YL: "By getting our drops, we prevent polio from ever returning. It ensures children everywhere can run, jump, ride bicycles, and grow strong legs without braces or wheel chairs.",
    whatToDoNow10YL: [
      "Ask parents to see your baby records vaccine card drop list.",
      "Sing a song with siblings while practicing scrubbing under fingernails.",
      "Learn about Jonas Salk, the scientist hero who gave Polio vaccines to the world for free!"
    ],
    benefitsOfPrevention: [
      "Total global eradication of paralysis in kids",
      "Ensure strong running and playing for life",
      "Safeguards drinking water systems",
      "Closes physical therapy hospitals for polio"
    ]
  }
];

export const INITIAL_VACCINES: VaccineDetails[] = [
  {
    diseaseId: "covid-19",
    diseaseName: "COVID-19",
    vaccineName: "mRNA Vaccines (Pfizer-BioNTech / Moderna)",
    available: true,
    doses: 2,
    ageRecommendation: "Everyone 6 months and older",
    boosterRequirements: "Once a year, especially for elderly & those with risk factors",
    effectiveness: "90%+ against severe lung sickness and hospitalization",
    sideEffects: ["Soreness in arm poked", "Slight feeling of tiredness or warm head for 24 hours", "Mild muscular stiffness"],
    whoRecommendation: "Strongly recommended worldwide as a primary defense to protect public health",
    countryAvailability: "Widely available globally at pharmacies, clinics, and school halls"
  },
  {
    diseaseId: "malaria",
    diseaseName: "Malaria",
    vaccineName: "RTS,S/AS01 (Mosquirix) and R21/Matrix-M",
    available: true,
    doses: 4,
    ageRecommendation: "Children starting from 5 months of age, living in high-risk zones",
    boosterRequirements: "Requires 4th dose 12-18 months after the 3rd dose to prolong defense",
    effectiveness: "75% reduction in symptomatic malaria episodes in high malaria countries",
    sideEffects: ["Red spot in arm", "Mild fevers for a few hours", "Irritability in infants"],
    whoRecommendation: "Recommended for control of malaria in areas with moderate to high transmission",
    countryAvailability: "Rollouts underway across Sub-Saharan Africa and high risk tropical environments"
  },
  {
    diseaseId: "ebola",
    diseaseName: "Ebola",
    vaccineName: "rVSV-ZEBOV (Ervebo)",
    available: true,
    doses: 1,
    ageRecommendation: "Adults and kids 1 year and older during surrounding outbreaks",
    boosterRequirements: "None registered for temporary outbreaking surges",
    effectiveness: "Nearly 97.5% effective in shielding exposed contacts",
    sideEffects: ["Arm stiffness", "Mild shivering", "Joint pains for 24 hours"],
    whoRecommendation: "Recommended for ring vaccination around active Ebola outbreaks",
    countryAvailability: "Managed in national strategic stockpiles; flown in immediately during emergency alerts"
  },
  {
    diseaseId: "dengue",
    diseaseName: "Dengue Fever",
    vaccineName: "Qdenga (TAK-003) & Dengvaxia",
    available: true,
    doses: 2,
    ageRecommendation: "Children aged 4 to 16 living in high risk regions",
    boosterRequirements: "Not currently requested for typical immunization decks",
    effectiveness: "80% reduction in dengue fever cases, prevents 90% of hospital stays",
    sideEffects: ["Dizziness", "Arm irritation", "Mild heat shivers"],
    whoRecommendation: "Recommended for introduction in highly endemic regions and tropical hot spots",
    countryAvailability: "Approved in the European Union, Brazil, Indonesia, Argentina, Thailand, and UK"
  },
  {
    diseaseId: "measles",
    diseaseName: "Measles",
    vaccineName: "MMR (Measles, Mumps, and Rubella Vaccine)",
    available: true,
    doses: 2,
    ageRecommendation: "First dose at 12 months, second dose at 4 to 6 years of age",
    boosterRequirements: "None needed! Two doses provide lifelong shield",
    effectiveness: "97% effective for absolute prevention",
    sideEffects: ["Slight pink cheek", "Short fever 5 days later", "Temporary skin spots"],
    whoRecommendation: "Standard cornerstone vaccine for all health systems worldwide",
    countryAvailability: "Available in every country globally, often fully free of charge"
  },
  {
    diseaseId: "tuberculosis",
    diseaseName: "Tuberculosis",
    vaccineName: "Bacille Calmette-Guérin (BCG)",
    available: true,
    doses: 1,
    ageRecommendation: "Babies at birth in countries with high TB risk",
    boosterRequirements: "No booster proven to add extra benefits",
    effectiveness: "Highly effective at protecting infants from severe brains/bone TB",
    sideEffects: ["A tiny bump on the shoulder that slowly heals and leaves a cute little circle scar", "Slight lymph swelling"],
    whoRecommendation: "Recommended at birth as a primary safety net in high-prevalence areas",
    countryAvailability: "Universally active across Asia, Africa, South America, and parts of Europe"
  },
  {
    diseaseId: "cholera",
    diseaseName: "Cholera",
    vaccineName: "Oral Cholera Vaccines (Dukoral, Shanchol, Euvichol-S)",
    available: true,
    doses: 2,
    ageRecommendation: "Ages 1 year and older, especially before traveling",
    boosterRequirements: "Every 2 years for travelers visiting risk zones",
    effectiveness: "Around 65% - 85% protection immediately after drinking the dose",
    sideEffects: ["Mild stomach rumbling for an hour", "Faint nausea in older kids"],
    whoRecommendation: "Used in combination with hygiene and water filters in alert areas",
    countryAvailability: "Supplied in humanitarian boxes during disasters; available at travel clinics"
  },
  {
    diseaseId: "nipah",
    diseaseName: "Nipah",
    vaccineName: "None (Investigational Only)",
    available: false,
    doses: 0,
    ageRecommendation: "N/A",
    boosterRequirements: "N/A",
    effectiveness: "N/A",
    sideEffects: [],
    whoRecommendation: "Recognized as a blue-ribbon 'priority pathogen' requiring rapid target testing",
    countryAvailability: "Clinical trials happening in Australia and Oxford University"
  },
  {
    diseaseId: "h1n1",
    diseaseName: "H1N1 (Swine Flu)",
    vaccineName: "Quadrivalent Influenza Vaccine",
    available: true,
    doses: 1,
    ageRecommendation: "Everyone 6 months and older, repeat once every autumn",
    boosterRequirements: "Requested yearly because winter flu viruses change coats",
    effectiveness: "Provides robust 50% - 70% avoidance block of viral strains",
    sideEffects: ["Mild nose blockage (if mist vaccine used)", "Poke site tightness"],
    whoRecommendation: "Part of the standard annual pediatric wellness program",
    countryAvailability: "Unrestricted availability at local clinics, pharmacies, and supermarkets"
  },
  {
    diseaseId: "monkeypox",
    diseaseName: "Mpox",
    vaccineName: "MVA-BN (JYNNEOS / Imvanex)",
    available: true,
    doses: 2,
    ageRecommendation: "High risk individuals, or ring vaccination around hot cases",
    boosterRequirements: "Not required under current healthcare guidelines unless highly exposed",
    effectiveness: "Around 85% protective in eliminating skin pox",
    sideEffects: ["Redness, swelling or a small itchy feeling where injected in arm", "Mild muscle tiredness"],
    whoRecommendation: "Recommended as an outbreak prevention weapon to shield close contact networks",
    countryAvailability: "Distributed via health departments and specialised state health units"
  },
  {
    diseaseId: "polio",
    diseaseName: "Polio",
    vaccineName: "OPV (Oral sweet drops) & IPV (Injected micro-dose)",
    available: true,
    doses: 4,
    ageRecommendation: "Given as baby series: 2, 4, 6 months and preschool boost",
    boosterRequirements: "Four booster points are standard to build life protection",
    effectiveness: "99% to 100% life immunization block",
    sideEffects: ["Mild skin warmth in poked shoulder", "OPV has virtually zero noticeable symptoms"],
    whoRecommendation: "Extremely critical cornerstone of global eradication protocol",
    countryAvailability: "Universally provided to infants globally; supported heavily by UNICEF/Rotary"
  }
];

export const INITIAL_OUTBREAKS: Outbreak[] = [
  {
    id: "ob-1",
    diseaseId: "dengue",
    diseaseName: "Dengue Fever",
    country: "Brazil",
    region: "Rio de Janeiro",
    city: "Copacabana Area",
    cases: 15420,
    deaths: 12,
    recovered: 14200,
    latitude: -22.9068,
    longitude: -43.1729,
    active: true,
    firstDetected: "2026-01-15",
    lastUpdated: "2026-05-28",
    riskLevel: "High"
  },
  {
    id: "ob-2",
    diseaseId: "ebola",
    diseaseName: "Ebola Virus Disease",
    country: "Uganda",
    region: "Mubende District",
    city: "Kikandwa Village",
    cases: 42,
    deaths: 21,
    recovered: 18,
    latitude: 0.5635,
    longitude: 31.3924,
    active: true,
    firstDetected: "2026-04-10",
    lastUpdated: "2026-05-30",
    riskLevel: "Critical"
  },
  {
    id: "ob-3",
    diseaseId: "malaria",
    diseaseName: "Malaria",
    country: "Nigeria",
    region: "Kano State",
    city: "Rural Outskirts",
    cases: 231400,
    deaths: 450,
    recovered: 228000,
    latitude: 12.0022,
    longitude: 8.5919,
    active: true,
    firstDetected: "2015-01-01",
    lastUpdated: "2026-05-25",
    riskLevel: "Medium"
  },
  {
    id: "ob-4",
    diseaseId: "monkeypox",
    diseaseName: "Mpox (Monkeypox)",
    country: "Democratic Republic of Congo",
    region: "South Kivu",
    city: "Kamituga Mining District",
    cases: 1250,
    deaths: 68,
    recovered: 920,
    latitude: -3.0642,
    longitude: 28.1818,
    active: true,
    firstDetected: "2024-09-12",
    lastUpdated: "2026-05-29",
    riskLevel: "High"
  },
  {
    id: "ob-5",
    diseaseId: "covid-19",
    diseaseName: "COVID-19 (Coronavirus)",
    country: "United States",
    region: "Northeast",
    city: "New York City Metro",
    cases: 8500,
    deaths: 15,
    recovered: 8100,
    latitude: 40.7128,
    longitude: -74.0060,
    active: true,
    firstDetected: "2026-05-01",
    lastUpdated: "2026-05-31",
    riskLevel: "Low"
  },
  {
    id: "ob-6",
    diseaseId: "cholera",
    diseaseName: "Cholera",
    country: "Haiti",
    region: "Port-au-Prince",
    city: "Cité Soleil Neighborhood",
    cases: 680,
    deaths: 34,
    recovered: 610,
    latitude: 18.5944,
    longitude: -72.3074,
    active: true,
    firstDetected: "2025-11-20",
    lastUpdated: "2026-05-27",
    riskLevel: "High"
  },
  {
    id: "ob-7",
    diseaseId: "nipah",
    diseaseName: "Nipah Virus Infection",
    country: "India",
    region: "Kerala State",
    city: "Kozhikode District",
    cases: 14,
    deaths: 11,
    recovered: 2,
    latitude: 11.2588,
    longitude: 75.7804,
    active: true,
    firstDetected: "2026-05-18",
    lastUpdated: "2026-05-31",
    riskLevel: "Critical"
  },
  {
    id: "ob-8",
    diseaseId: "measles",
    diseaseName: "Measles",
    country: "United Kingdom",
    region: "West Midlands",
    city: "Birmingham Area",
    cases: 310,
    deaths: 0,
    recovered: 295,
    latitude: 52.4862,
    longitude: -1.8904,
    active: true,
    firstDetected: "2026-03-05",
    lastUpdated: "2026-05-20",
    riskLevel: "Medium"
  },
  {
    id: "ob-9",
    diseaseId: "polio",
    diseaseName: "Polio (Poliomyelitis)",
    country: "Pakistan",
    region: "Khyber Pakhtunkhwa",
    city: "Waziristan District",
    cases: 4,
    deaths: 0,
    recovered: 4,
    latitude: 32.2281,
    longitude: 69.8551,
    active: true,
    firstDetected: "2026-02-12",
    lastUpdated: "2026-05-10",
    riskLevel: "Medium"
  }
];

export const INITIAL_SOURCES: DataSource[] = [
  {
    id: "source-1",
    name: "World Health Organization (WHO) Outbreak API",
    type: "API",
    url: "https://api.who.int/epidemic-surveillance/v1",
    reliabilityScore: 98,
    updateFrequency: "Daily",
    completenessScore: 95,
    active: true,
    status: "Fetched Successfully"
  },
  {
    id: "source-2",
    name: "CDC Morbidity and Mortality Surveillance Feeds",
    type: "API",
    url: "https://data.cdc.gov/surveillance/outbreaks.json",
    reliabilityScore: 96,
    updateFrequency: "Daily",
    completenessScore: 92,
    active: true,
    status: "Fetched Successfully"
  },
  {
    id: "source-3",
    name: "European Centre for Disease Prevention (ECDC) Reports",
    type: "RSS",
    url: "https://www.ecdc.europa.eu/en/taxonomy/term/1255/feed",
    reliabilityScore: 94,
    updateFrequency: "Weekly",
    completenessScore: 90,
    active: true,
    status: "Synced 4 hrs ago"
  },
  {
    id: "source-4",
    name: "GISAID Influenza and Pathogen Genome Database",
    type: "Dataset",
    url: "https://gisaid.org/surveillance-data-stream",
    reliabilityScore: 99,
    updateFrequency: "Real-time",
    completenessScore: 98,
    active: true,
    status: "Connected"
  },
  {
    id: "source-5",
    name: "HealthMap Outbreak News Aggregator Scraper",
    type: "Web Scraping",
    url: "https://healthmap.org/en/scrapes/global-news",
    reliabilityScore: 82,
    updateFrequency: "Hourly",
    completenessScore: 85,
    active: true,
    status: "Succeeded (robots.txt compliant)"
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "WHO coordinates emergency response for Nipah surge in India",
    source: "World Health Organization Bulletins",
    summary: "Public Health researchers are working hand-in-hand with state teams to restrict contact with fruit bats after high fever clusters were identified. Ring vaccination and containment strategies are completely operational.",
    sentiment: "Precautionary",
    url: "https://www.who.int/emergencies/disease-outbreak-news/item/nipah-india",
    date: "2026-05-30T10:00:00Z",
    trustScore: 98
  },
  {
    id: "news-2",
    title: "Severe seasonal Dengue surge registered in Brazil due to warmer climates",
    source: "Epidemic News Weekly",
    summary: "Health educators in Rio de Janeiro are advising families to do a daily 'Water Hunt' in gardens. Eliminating standing pots completely avoids Aedes aegypti mosquito breeding cycles.",
    sentiment: "Preventative Alert",
    url: "https://www.ecdc.europa.eu/en/news-events/dengue-brazil-surge",
    date: "2026-05-29T14:30:00Z",
    trustScore: 94
  },
  {
    id: "news-3",
    title: "Mpox immunization campaigns achieve 90% coverage in Congo high-risk sectors",
    source: "Global Health Alliance Reports",
    summary: "A robust vaccine network supplied thousands of JYNNEOS doses to local community members. Doctors report a significant downwards turn in the emergence of new water bead blisters.",
    sentiment: "Supportive",
    url: "https://www.cdc.gov/mpox/outbreaks/drc-vaccination.html",
    date: "2026-05-28T08:15:00Z",
    trustScore: 96
  }
];
