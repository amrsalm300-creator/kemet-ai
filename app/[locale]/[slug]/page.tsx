import { notFound } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import AreaMap from '@/components/AreaMap'; // تم إضافة استدعاء خريطة جوجل

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// تعريف هياكل البيانات لضمان دعم جميع اللغات والحقول
type LocalizedString = Record<string, string>;

interface StatItem {
  title: LocalizedString;
  value: LocalizedString;
}

interface TimelineItem {
  era: LocalizedString;
  desc: LocalizedString;
}

interface AttractionItem {
  slug: string;
  categoryName: LocalizedString;
  title: LocalizedString;
  desc: LocalizedString;
  badge: LocalizedString;
}

interface GovernorateData {
  image: string;
  category: LocalizedString;
  name: LocalizedString;
  description: LocalizedString;
  longDescription?: LocalizedString;
  history: LocalizedString;
  historicalDoc?: {
    title: LocalizedString;
    desc: LocalizedString;
  };
  cultureAndFood?: {
    food: LocalizedString;
    crafts: LocalizedString;
  };
  bestTime: LocalizedString;
  duration: LocalizedString;
  stats?: StatItem[];
  timelineCivilizations?: TimelineItem[];
  funFacts?: LocalizedString[];
  whyVisit?: LocalizedString;
  attractions: AttractionItem[];
}

const richGovernoratesData: Record<string, GovernorateData> = {
  'cairo-giza': {
    image: '/cairogiza.webp',
    category: {
      ar: 'مهد الحضارة والتاريخ الفرعوني والإسلامي',
      en: 'Cradle of Pharaonic & Islamic History',
      ru: 'Колыбель фараонской и исламской истории',
      fr: 'Berceau de l’histoire pharaonique et islamique',
      de: 'Wiege der pharaonischen und islamischen Geschichte',
      it: 'Culla della storia faraonica e islamica',
      es: 'Cuna de la historia faraónica e islámica',
      pt: 'Berço da história faraônica e islâmica'
    },
    name: {
      ar: 'القاهرة والجيزة - عاصمة التاريخ والأساطير',
      en: 'Cairo & Giza - Capital of History & Legends',
      ru: 'Каир и Гиза - Столица истории и легенд',
      fr: 'Le Caire et Gizeh - Capitale de l’histoire',
      de: 'Kairo & Gizeh - Hauptstadt der Geschichte',
      it: 'Il Cairo e Giza - Capitale della storia',
      es: 'El Cairo y Giza - Capital de la historia',
      pt: 'Cairo e Gizé - Capital da história'
    },
    description: {
      ar: 'حيث يلتقي عظمة التاريخ الفرعوني مع سحر العمارة الإسلامية في قلب عاصمة لا تنام. تضم أهرامات الجيزة الخالدة، أبو الهول الشامخ، والمتحف المصري الكبير.',
      en: 'Where ancient Pharaonic majesty meets Islamic architecture in a sleepless capital. Home to the Giza Pyramids, the Sphinx, and the Grand Egyptian Museum.',
      ru: 'Где древнее фараонское величие встречается с исламской архитектурой.',
      fr: 'Où la majesté pharaonique rencontre l’architecture islamique.',
      de: 'Wo pharaonische Erhabenheit auf islamische Architektur trifft. Heimat der Pyramiden von Gizeh.',
      it: 'Dove la maestosità faraonica incontra l’architettura islamica.',
      es: 'Donde la majestad faraónica se encuentra con la arquitectura islámica. Hogar de las pirámides.',
      pt: 'Onde a majestade faraônica encontra a arquitectura islâmica. Lar das pirâmides de Gizé.'
    },
    longDescription: {
      ar: 'تعد القاهرة الكبرى واحدة من أعرق العواصم وأكثرها تنوعاً ثقافياً ومعمارياً عبر التاريخ البشري، حيث تمتزج قلاع المماليك ومساجد الفاطميين بأعظم أهرامات الفراعنة.',
      en: 'Greater Cairo is one of the most prestigious and culturally diverse capitals in human history, where Mamluk citadels and Fatimid mosques blend with the greatest pharaonic pyramids.',
      ru: 'Большой Каир — одна из самых престижных и культурно разнообразных столиц в истории человечества.',
      fr: 'Le Grand Caire est l\'une des capitales les plus prestigieuses et culturellement diverses de l\'histoire humaine.',
      de: 'Groß-Kairo ist eine der geschichtsträchtigsten und kulturell vielfältigsten Hauptstädte der Menschheitsgeschichte.',
      it: 'Il Grande Cairo è una delle capitali più prestigiose e culturalmente diverse della storia umana.',
      es: 'El Gran Cairo es una de las capitales más prestigiosas y culturalmente diversas de la historia humana.',
      pt: 'A Grande Cairo é uma das capitais mais prestigiosas e culturalmente diversas da história humana.'
    },
    history: {
      ar: 'تعد المنطقة موطناً لأقدم عواصم التاريخ الموحد على يد الملك نعرمر. تعاقبت عليها العصور الفرعونية، اليونانية، الرومانية، وصولاً العصر الإسلامي وتأسيس القاهرة المعزية.',
      en: 'Home to the oldest united capital founded by King Narmer, spanning Pharaonic, Greek, Roman, and Islamic eras including the founding of Fatimid Cairo.',
      ru: 'Родина древнейшей объединенной столицы, основанной царем Нармером.',
      fr: 'Maison de la plus ancienne capitale unifiée fondée par le roi Narmer.',
      de: 'Heimat der ältesten vereinten Hauptstadt, gegründet von König Narmer.',
      it: 'Casa della capitale unificata più antica fondata dal re Narmer.',
      es: 'Hogar de la capital unificada más antigua fundada por el rey Narmer.',
      pt: 'Lar da capital unificada mais antiga fundada pelo Rei Narmer.'
    },
    historicalDoc: {
      title: { ar: 'لوحة نارمر (توحيد القطرين)', en: 'Narmer Palette' },
      desc: { ar: 'وثيقة أثرية تثبت التوحيد السياسي والتاريخي لمصر العليا والسفلية.', en: 'An archaeological document proving the political unification of Egypt.' }
    },
    cultureAndFood: {
      food: { ar: 'الكشري المصري، الحواوشي، والفتة المصرية الأصيلة.', en: 'Egyptian Koshary, Hawawshi, and traditional Fatteh.' },
      crafts: { ar: 'صناعة الحلي الفضية، منتجات النحاس والخيامية التراثية.', en: 'Silver jewelry, copperware, and traditional Khayamiya crafts.' }
    },
    bestTime: { ar: 'أكتوبر إلى أبريل', en: 'October to April' },
    duration: { ar: '4 إلى 6 أيام', en: '4 to 6 Days' },
    stats: [
      { title: { ar: 'سنة التأسيس', en: 'Foundation Year' }, value: { ar: '3100 ق.م', en: '3100 BC' } },
      { title: { ar: 'الموقع', en: 'Location' }, value: { ar: 'ضفاف نهر النيل', en: 'Nile Banks' } },
      { title: { ar: 'عدد السكان', en: 'Population' }, value: { ar: 'أكثر من 20 مليون', en: 'Over 20M' } },
      { title: { ar: 'اللقب', en: 'Nickname' }, value: { ar: 'مدينة الألف مأذنة', en: 'City of Minarets' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'العصر الفرعوني', en: 'Pharaonic Era' }, desc: { ar: 'بناء الأهرامات وتأسيس أول عاصمة موحدة.', en: 'Building the pyramids and first united capital.' } },
      { era: { ar: 'العصر اليوناني الروماني', en: 'Greco-Roman Era' }, desc: { ar: 'تأسيس حصن بابليون والمعالم الكلاسيكية.', en: 'Establishment of Babylon Fortress.' } },
      { era: { ar: 'العصر الإسلامي', en: 'Islamic Era' }, desc: { ar: 'تأسيس الفسطاط، العسكر، القطائع، والقاهرة الفاطمية.', en: 'Founding of Fustat, Al-Askar, and Cairo.' } },
      { era: { ar: 'العصر الحديث', en: 'Modern Era' }, desc: { ar: 'تطور كعاصمة سياسية وثقافية كبرى للشرق الأوسط.', en: 'Developed as a major modern political and cultural capital.' } }
    ],
    funFacts: [
      { ar: 'تضم أهرامات الجيزة العجيبة الوحيدة الباقية من عجائب الدنيا السبع القديمة.', en: 'Home to the Giza Pyramids, the last surviving wonder of the ancient world.' },
      { ar: 'تحتوي القاهرة التاريخية على أكبر تجمع للآثار الإسلامية في العالم.', en: 'Historic Cairo contains the largest concentration of Islamic monuments in the world.' }
    ],
    whyVisit: {
      ar: 'لأنها تجمع بين أعظم عجائب الدنيا التاريخية وسحر الفنون الإسلامية في رحلة استثنائية.',
      en: 'Because it combines the greatest historical wonders of the world with the magic of Islamic arts in an exceptional journey.'
    },
    attractions: [
      {
        slug: 'giza-pyramids-sphinx',
        categoryName: { ar: 'الأهرامات الكبرى', en: 'Major Pyramids' },
        title: { ar: 'أهرامات الجيزة وأبو الهول', en: 'Giza Pyramids & Sphinx' },
        desc: { ar: 'العجيبة الوحيدة الباقية من عجائب الدنيا السبع القديمة.', en: 'The last remaining wonder of the ancient world.' },
        badge: { ar: 'عجيبة الخالدة', en: 'Ancient Wonder' }
      },
      {
        slug: 'al-muizz-street',
        categoryName: { ar: 'القاهرة الإسلامية', en: 'Islamic Cairo' },
        title: { ar: 'شارع المعز لدين الله', en: 'Al-Muizz Street' },
        desc: { ar: 'أكبر متحف مفتوح للعمارة الإسلامية والتاريخية في العالم.', en: 'The largest open-air museum of Islamic architecture.' },
        badge: { ar: 'تاريخ حي', en: 'Living History' }
      }
    ]
  },
  'luxor-aswan': {
    image: '/luxoraswan.webp',
    category: {
      ar: 'متحف العالم المفتوح والتاريخ النيلي',
      en: 'Open-Air Museum & Nile History',
      ru: 'Музей под открытым небом и история Нила',
      fr: 'Musée en plein air et histoire du Nil',
      de: 'Freilichtmuseum & Nil-Geschichte',
      it: 'Museo all’aperto e storia del Nilo',
      es: 'Museo al aire libre e historia del Nilo',
      pt: 'Museu ao ar livre e história do Nilo'
    },
    name: {
      ar: 'الأقصر وأسوان - عظمة الضفاف الخالدة',
      en: 'Luxor & Aswan - Timeless Nile Banks',
      ru: 'Луксор и Асуан - Вечные берега Нила',
      fr: 'Louxor et Assouan - Rives intemporelles du Nil',
      de: 'Luxor & Assuan - Zeitlose Nilufer',
      it: 'Luxor e Assuan - Sponde senza tempo del Nilo',
      es: 'Luxor y Asuán - Orillas atemporales del Nilo',
      pt: 'Luxor e Assuã - Margens atemporais do Nilo'
    },
    description: {
      ar: 'رحلة ساحرة عبر الزمن في جنوب مصر، حيث يتركز ثلث آثار العالم. معابد الكرنك، وادي الملوك، وسحر الطبيعة النوبية.',
      en: 'A magical journey through southern Egypt, home to a third of world monuments. Karnak, Valley of the Kings, and Nubian magic.',
      ru: 'Волшебное путешествие по южному Египту.',
      fr: 'Un voyage magique dans le sud de l’Égypte.',
      de: 'Eine magische Reise durch Südägypten.',
      it: 'Un viaggio magico attraverso l’Egitto meridionale.',
      es: 'Un viaje mágico por el sur de Egipto.',
      pt: 'Uma viagem mágica pelo sul do Egito.'
    },
    longDescription: {
      ar: 'حيث يروي كل حجر قصة من قصص الفراعنة الخالدين على ضفاف نهر النيل العظيم في صعيد مصر الساحر.',
      en: 'Where every stone tells a story of immortal pharaohs along the banks of the great Nile in enchanting Upper Egypt.',
      ru: 'Где каждый камень рассказывает историю бессмертных фараонов.',
      fr: 'Où chaque pierre raconte l\'histoire de pharaons immortels.',
      de: 'Wo jeder Stein die Geschichte unsterblicher Pharaonen erzählt.',
      it: 'Dove ogni pietra racconta la storia di faraoni immortali.',
      es: 'Donde cada piedra cuenta una historia de faraones inmortales.',
      pt: 'Onde cada pedra conta a história de faraós imortais.'
    },
    history: {
      ar: 'كانت طيبة (الأقصر حالياً) عاصمة مصر في عصر الدولة الحديثة، ومقر عبادة الإله آمون، بينما كانت أسوان البوابة الجنوبية النابضة بالحياة.',
      en: 'Thebes (modern Luxor) was the capital during the New Kingdom and the center of Amun worship, while Aswan served as the vibrant southern gateway.',
      ru: 'Фивы были столицей Нового царства, а Асуан — южными воротами.',
      fr: 'Thèbes était la capitale du Nouvel Empire et Assouan la porte sud.',
      de: 'Theben war die Hauptstadt während des Neuen Reiches und Assuan das südliche Tor.',
      it: 'Tebe era la capitale durante il Nuovo Regno e Assuan la porta meridionale.',
      es: 'Tebas fue la capital durante el Imperio Nuevo y Asuán la puerta sur.',
      pt: 'Tebas foi a capital durante o Novo Império e Assuã a porta sul.'
    },
    historicalDoc: {
      title: { ar: 'بردية تورين الملكية (قائمة الملوك)', en: 'Turin King List Papyrus' },
      desc: { ar: 'وثيقة تاريخية بردياتية تحصي أسماء ملوك مصر بتسلسل دقيق.', en: 'A historical papyrus document listing Egypt\'s kings accurately.' }
    },
    cultureAndFood: {
      food: { ar: 'العيش الشمسي الصعيدي والمأكولات النوبية الأصيلة بالتوابل.', en: 'Saidi solar bread and authentic Nubian spice dishes.' },
      crafts: { ar: 'صناعة الأطباق الملونة من السعف والفخار المنحوت.', en: 'Colored palm-leaf baskets and carved pottery.' }
    },
    bestTime: { ar: 'نوفمبر إلى فبراير', en: 'November to February' },
    duration: { ar: '5 إلى 7 أيام', en: '5 to 7 Days' },
    stats: [
      { title: { ar: 'الآثار العالمية', en: 'World Monuments' }, value: { ar: 'ثلث آثار العالم', en: '1/3 of World Heritage' } },
      { title: { ar: 'الموقع', en: 'Location' }, value: { ar: 'صعيد مصر', en: 'Upper Egypt' } },
      { title: { ar: 'الاسم التاريخي', en: 'Historical Name' }, value: { ar: 'طيبة العريقة', en: 'Ancient Thebes' } },
      { title: { ar: 'النهر', en: 'River' }, value: { ar: 'نهر النيل الخالد', en: 'The Timeless Nile' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'عصر الدولة الحديثة', en: 'New Kingdom Era' }, desc: { ar: 'بناء أعظم معابد التاريخ ووادي الملوك.', en: 'Building history\'s greatest temples and Valley of the Kings.' } },
      { era: { ar: 'العصر البطلمي والروماني', en: 'Greco-Roman Era' }, desc: { ar: 'تشييد معبد فيلة ومعابد كوم أمبو وإدفو.', en: 'Construction of Philae and Kom Ombo temples.' } }
    ],
    funFacts: [
      { ar: 'تحتوي الأقصر على ثلث آثار العالم بأسره في متحف مفتوح فريد.', en: 'Luxor contains a third of all antiquities in the world in a unique open-air museum.' },
      { ar: 'تضم أسوان السد العالي وبحيرة ناصر العظيمة.', en: 'Aswan is home to the High Dam and the magnificent Lake Nasser.' }
    ],
    whyVisit: {
      ar: 'لأنها تتيح لك الغوص في قلب التاريخ الفرعوني الأصيل ومشاهدة أعظم المعابد الخالدة تحت سماء الصعيد الساحرة.',
      en: 'Because it allows you to dive into the heart of authentic Pharaonic history and see immortal temples under the charming Upper Egypt sky.'
    },
    attractions: [
      {
        slug: 'karnak-temple',
        categoryName: { ar: 'معابد الأقصر', en: 'Luxor Temples' },
        title: { ar: 'معبد الكرنك', en: 'Karnak Temple' },
        desc: { ar: 'أكبر دور عبادة قديمة في التاريخ البشري وأعمدتها العملاقة.', en: 'The largest ancient religious site in human history.' },
        badge: { ar: 'عظمة العمارة', en: 'Architectural Giant' }
      }
    ]
  },
  'red-sea': {
    image: '/theredseahurghada.webp',
    category: {
      ar: 'سحر الشواطئ الفيروزية وعالم الشعاب المرجانية',
      en: 'Turquoise Beaches & Coral Reef Wonderland',
      ru: 'Бирюзовые пляжи и коралловые рифы',
      fr: 'Plages turquoises et récifs coralliens',
      de: 'Türkisblaue Strände & Korallenriff-Wunderland',
      it: 'Spiagge turchesi e barriera corallina',
      es: 'Playas turquesas y arrecifes de coral',
      pt: 'Praias turquesas e recifes de coral'
    },
    name: {
      ar: 'البحر الأحمر والغردقة - سحر السواحل والشعاب المرجانية',
      en: 'Red Sea & Hurghada - Coastal Magic & Coral Reefs',
      ru: 'Красное море и Хургада - Магия побережья',
      fr: 'Mer Rouge et Hurghada - Magie côtière et récifs',
      de: 'Rotes Meer & Hurghada - Küstenzauber & Korallen',
      it: 'Mar Rosso e Hurghada - Magia costiera',
      es: 'Mar Rojo y Hurghada - Magia costera y arrecifes',
      pt: 'Mar Vermelho e Hurghada - Magia costeira'
    },
    description: {
      ar: 'وجهة عالمية للغوص والاسترخاء، تتميز بمياهها الفيروزية الصافية، الشعاب المرجانية النادرة، والحياة البحرية النابضة بالحياة في الغردقة.',
      en: 'A world-class destination for diving and relaxation, featuring crystal-clear turquoise waters and rare coral reefs in Hurghada.',
      ru: 'Мировое направление для дайвинга и отдыха с кристально чистой водой.',
      fr: 'Une destination de classe mondiale pour la plongée et la détente.',
      de: 'Ein weltweites Reiseziel zum Tauchen und Entspannen.',
      it: 'Una destinazione di classe mondiale per le immersioni.',
      es: 'Un destino de clase mundial para el buceo y la relajación.',
      pt: 'Um destino de classe mondiale para mergulho.'
    },
    longDescription: {
      ar: 'حيث تتعانق جبال الصحراء الشرقية الساحرة مع مياه البحر الأحمر الصافية لتشكل جنة عالمية لعشاق السياحة الشاطئية.',
      en: 'Where the charming Eastern Desert mountains embrace the clear waters of the Red Sea to form a global paradise for beach lovers.',
      ru: 'Где очаровательные горы Восточной пустыни встречаются с водами Красного моря.',
      fr: 'Où les montagnes du désert oriental embrassent les eaux de la mer Rouge.',
      de: 'Wo die Berge der östlichen Wüste auf das Rote Meer treffen.',
      it: 'Dove le montagne del Deserto Orientale abbracciano il Mar Rosso.',
      es: 'Donde las montañas del desierto oriental abrazan el Mar Rojo.',
      pt: 'Onde as montanhas do deserto oriental abraçam o Mar Vermelho.'
    },
    history: {
      ar: 'اشتهرت منطقة البحر الأحمر منذ العصور القديمة كممر تجاري ومناجم للفيروز والذهب تربط بين وادي النيل وشرق أفريقيا.',
      en: 'Famous since ancient times as an important trade route and turquoise/gold mining hub connecting the Nile Valley to East Africa.',
      ru: 'Известна с древних времен как торговый путь и центр добычи полезных ископаемых.',
      fr: 'Célèbre depuis l’Antiquité comme route commerciale et centre minier.',
      de: 'Seit der Antike als Handelsweg und Bergbauzentrum bekannt.',
      it: 'Famosa sin dall’antichità come via commerciale e centro minerario.',
      es: 'Famosa desde la antigüedad como ruta comercial y centro minero.',
      pt: 'Famosa desde a antiguidade como rota comercial e centro de mineração.'
    },
    bestTime: { ar: 'طوال العام (سبتمبر إلى مايو الأفضل)', en: 'Year-round (Sep to May ideal)' },
    duration: { ar: '3 إلى 5 أيام', en: '3 to 5 Days' },
    stats: [
      { title: { ar: 'نوع الساحل', en: 'Coast Type' }, value: { ar: 'شواطئ فيروزية', en: 'Turquoise Beaches' } },
      { title: { ar: 'النشاط العالمي', en: 'Global Activity' }, value: { ar: 'عاصمة الغوص', en: 'Diving Capital' } },
      { title: { ar: 'الطبيعة', en: 'Nature' }, value: { ar: 'جبال وبحر', en: 'Mountains & Sea' } },
      { title: { ar: 'الجو', en: 'Weather' }, value: { ar: 'مشمس دائماً', en: 'Always Sunny' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'عصور المناجم القديمة', en: 'Ancient Mining Era' }, desc: { ar: 'استخراج الفيروز والذهب واستخدام الطرق التجارية.', en: 'Extraction of turquoise and gold.' } },
      { era: { ar: 'العصر الحديث', en: 'Modern Era' }, desc: { ar: 'تحول الساحل إلى أهم وجهة عالمية للسياحة البحرية والغوص.', en: 'Transformed into a global marine tourism destination.' } }
    ],
    funFacts: [
      { ar: 'يضم البحر الأحمر أكثر من 1200 نوع من الأسماك والشعاب المرجانية الفريدة.', en: 'The Red Sea hosts over 1,200 species of fish and unique coral reefs.' },
      { ar: 'تعد الغردقة واحدة من أفضل الوجهات العالمية للرياضات المائية.', en: 'Hurghada is ranked among the best global destinations for water sports.' }
    ],
    whyVisit: {
      ar: 'لأنها الجنة الأولى لعشاق الغوص، الشواطئ الساحرة، والمغامرات الصحراوية تحت أشعة الشمس الدافئة.',
      en: 'Because it is the ultimate paradise for diving lovers, charming beaches, and desert adventures under warm sunlight.'
    },
    attractions: [
      {
        slug: 'hurghada-marina',
        categoryName: { ar: 'السياحة الشاطئية', en: 'Beach Tourism' },
        title: { ar: 'مارينا الغردقة', en: 'Hurghada Marina' },
        desc: { ar: 'وجهة نابضة بالحياة تضم اليخوت الفاخرة، المطاعم والمقاهي المطلة على البحر.', en: 'A vibrant destination featuring luxury yachts, restaurants, and cafes.' },
        badge: { ar: 'الغردقة', en: 'Hurghada' }
      }
    ]
  },
  'south-sinai': {
    image: '/southsinai.webp',
    category: {
      ar: 'أرض الفيروز والطبيعة الجبلية الساحرة',
      en: 'Land of Turquoise & Magical Mountain Nature',
      ru: 'Земля бирюзы и горной природы',
      fr: 'Terre de turquoise et de nature montagneuse',
      de: 'Land des Türkis & magischer Bergwelt',
      it: 'Terra di turchese e natura montana',
      es: 'Tierra de turquesa y naturaleza montañosa',
      pt: 'Terra de turquesa e natureza montanhosa'
    },
    name: {
      ar: 'جنوب سيناء - شرم الشيخ ودهب وتاريخ سانت كاترين',
      en: 'South Sinai - Sharm, Dahab & St. Catherine',
      ru: 'Южный Синай - Шарм-эль-Шейх, Дахаб и Сант-Катрин',
      fr: 'Sud-Sinaï - Charm el-Cheikh, Dahab et Sainte-Catherine',
      de: 'Süd-Sinai - Scharm El-Scheich, Dahab & St. Katharina',
      it: 'Sud del Sinai - Sharm el-Sheikh, Dahab e Santa Caterina',
      es: 'Sur del Sinaí - Sharm el-Sheikh, Dahab y Santa Catalina',
      pt: 'Sul do Sinai - Sharm el-Sheikh, Dahab e Santa Catarina'
    },
    description: {
      ar: 'تجمع جنوب سيناء بين روعة الشواطئ العالمية للغوص في شرم الشيخ ودهب، وعراقة التاريخ الديني في دير سانت كاترين وجبل موسى.',
      en: 'South Sinai combines world-class diving beaches in Sharm El Sheikh and Dahab with deep religious history in St. Catherine.',
      ru: 'Южный Синай сочетает пляжи для дайвинга и историю.',
      fr: 'Le Sud-Sinaï combine plages de plongée et histoire religieuse.',
      de: 'Der Süd-Sinai verbindet Tauchstrände mit religiöser Geschichte.',
      it: 'Il Sud del Sinai combina spiagge per immersioni e storia.',
      es: 'El Sur del Sinaí combina playas de buceo e historia.',
      pt: 'O Sul do Sinai combina praias de mergulho e história.'
    },
    longDescription: {
      ar: 'حيث ترتفع القمم الجبلية الوعرة لتلامس السماء، وتتألق محمياتها البحرية كواحدة من أروع العجائب الطبيعية على وجه الأرض.',
      en: 'Where rugged mountain peaks touch the sky, and marine reserves shine as one of the most stunning natural wonders on Earth.',
      ru: 'Где горные вершины касаются неба, а морские заповедники сияют.',
      fr: 'Où les sommets montagneux touchent le ciel et les réserves marines brillent.',
      de: 'Wo schroffe Berggipfel den Himmel berühren.',
      it: 'Dove le cime montuose toccano il cielo.',
      es: 'Dónde los picos montañosos tocan el cielo.',
      pt: 'Onde os picos das montanhas tocam o céu.'
    },
    history: {
      ar: 'شهدت سيناء أهم الأحداث الدينية والتاريخية عبر العصور، وتضم دير سانت كاترين الذي يعد أقدم دير مسكون في العالم.',
      en: 'Sinai witnessed major religious and historical events across ages and houses St. Catherine Monastery, the oldest inhabited monastery.',
      ru: 'Синай стал свидетелем важнейших религиозных и исторических событий.',
      fr: 'Le Sinaï a été le témoin d\'événements religieux et historiques majeurs.',
      de: 'Der Sinai erlebte bedeutende religiöse und historische Ereignisse.',
      it: 'Il Sinai è stato testimone di importanti eventi religiosi e storici.',
      es: 'El Sinai fue testigo de importantes acontecimientos religiosos y históricos.',
      pt: 'O Sinai testemunhou importantes eventos religiosos e históricos.'
    },
    bestTime: { ar: 'سبتمبر إلى مايو', en: 'September to May' },
    duration: { ar: '4 إلى 6 أيام', en: '4 to 6 Days' },
    stats: [
      { title: { ar: 'الطبيعة', en: 'Nature' }, value: { ar: 'جبال وبحر', en: 'Mountains & Sea' } },
      { title: { ar: 'القداسة', en: 'Sanctity' }, value: { ar: 'بقعة مقدسة', en: 'Sacred Land' } },
      { title: { ar: 'الرياضة', en: 'Sport' }, value: { ar: 'عاصمة الغوص', en: 'Diving Capital' } },
      { title: { ar: 'التاريخ', en: 'History' }, value: { ar: 'دير أثري', en: 'Ancient Monastery' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'التاريخ الديني القديم', en: 'Ancient Religious History' }, desc: { ar: 'رحلة نبي الله موسى وتجلي العناية الإلهية على الجبل.', en: 'The journey of Prophet Moses.' } },
      { era: { ar: 'العصر البيزنطي', en: 'Byzantine Era' }, desc: { ar: 'بناء دير سانت كاترين بناءً على أمر الإمبراطور جستنيان.', en: 'Building St. Catherine Monastery.' } }
    ],
    funFacts: [
      { ar: 'يُعد جبل موسى في سيناء مكاناً مقدساً مقصوداً لمشاهدة أجمل شروق للشمس في العالم.', en: 'Mount Sinai is a sacred spot to witness one of the world\'s most breathtaking sunrises.' },
      { ar: 'تضم محمية رأس محمد شعاباً مرجانية لا مثيل لها عالمياً.', en: 'Ras Mohamed National Park features unmatched coral reefs globally.' }
    ],
    whyVisit: {
      ar: 'لأنها تمنحك مزيجاً روحياً وطبيعياً فريداً بين تسلق الجبال المقدسة والغوص في أعماق شواطئ شرم الشيخ ودهب الساحرة.',
      en: 'Because it gives you a unique spiritual and natural blend between climbing sacred mountains and diving in Sharm and Dahab.'
    },
    attractions: [
      {
        slug: 'st-catherine',
        categoryName: { ar: 'السياحة الدينية والجبلية', en: 'Religious & Mountain Tourism' },
        title: { ar: 'دير سانت كاترين وجبل موسى', en: 'St. Catherine Monastery & Mount Sinai' },
        desc: { ar: 'أقدم دير مأهول في العالم ووجهة روحية وجبلية فريدة.', en: 'The oldest continuously inhabited monastery in the world.' },
        badge: { ar: 'سانت كاترين', en: 'St. Catherine' }
      }
    ]
  },
  'siwa-oasis': {
    image: '/siwaoasis.webp',
    category: {
      ar: 'واحة السحر والغموض في الصحراء الغربية',
      en: 'Oasis of Magic & Mystery in Western Desert',
      ru: 'Оазис магии и тайны в Западной пустыне',
      fr: 'Oasis de magie et de mystère dans le désert occidental',
      de: 'Oase der Magie & des Geheimnisses in der westlichen Wüste',
      it: 'Oasi di magia e mistero nel deserto occidentale',
      es: 'Oasis de magia y mistero en el deserto occidental',
      pt: 'Oásis de magia e mistério no deserto ocidental'
    },
    name: {
      ar: 'واحة سيوة - عراقة التراث الأمازيغي وسحر العيون الطبيعية',
      en: 'Siwa Oasis - Amazigh Heritage & Natural Springs',
      ru: 'Оазис Сива - Амазигское наследие и источники',
      fr: 'Oasis de Siwa - Patrimoine amazigh et sources naturelles',
      de: 'Siwa-Oase - Amazigh-Erbe & natürliche Quellen',
      it: 'Oasi di Siwa - Patrimonio amazigh e sorgenti naturali',
      es: 'Oasis de Siwa - Patrimonio bereber y manantiales naturales',
      pt: 'Oásis de Siwa - Patrimônio amazigh e nascentes naturais'
    },
    description: {
      ar: 'واحة عزلتها الطبيعة فحافظت على فرادتها الثقافية والأمازيغية، وتتميز بعيون المياه الكبريتية، بحيرات الملح، ومعبد الإسكندر الأكبر.',
      en: 'An isolated oasis preserving its unique Amazigh cultural heritage, featuring sulfur springs, salt lakes, and the Oracle Temple.',
      ru: 'Изолированный оазис, сохранивший уникальное культурное наследие.',
      fr: 'Une oasis isolée préservant son patrimoine culturel.',
      de: 'Eine isolierte Oase mit kulturellem Erbe.',
      it: 'Un’oasi isolata che preserva il suo patrimonio.',
      es: 'Un oasis aislado que preserva su patrimonio.',
      pt: 'Um oásis isolado que preserva seu patrimônio.'
    },
    longDescription: {
      ar: 'حيث تمتزج الكثبان الرملية الذهبية ببساتين النخيل والزيتون، وتتدفق الينابيع العذبة والكبريتية لترسم لوحة من الخيال.',
      en: 'Where golden sand dunes blend with palm and olive groves, and fresh sulfur springs flow to paint an imaginative masterpiece.',
      ru: 'Где золотые дюны сливаются с рощами.',
      fr: 'Où les dunes de sable doré se mélancent aux palmeraies.',
      de: 'Wo goldene Sanddünen mit Palmenhainen verschmelzen.',
      it: 'Dove le dune di sabbia dorata si fondono con i palmeti.',
      es: 'Donde las dunas de arena dorada se funden con los palmerales.',
      pt: 'Onde as dunas de areia dourada se fundem com os pomares.'
    },
    history: {
      ar: 'اشتهرت سيوة قديماً بكونها مركزاً مهماً لزيارة معبد آمون واستشارة "وحي أوراكل" الذي زاره القائد الإسكندر الأكبر.',
      en: 'Siwa was historically famous for the Temple of Amun and consulting the Oracle of Amun, visited by Alexander the Great.',
      ru: 'Сива исторически славилась храмом Амона и оракулом.',
      fr: 'Siwa était historiquement célèbre pour le temple d\'Amon et l\'oracle.',
      de: 'Siwa war historisch berühmt für den Amun-Tempel und das Orakel.',
      it: 'Siwa era storicamente famosa per il tempio di Amone.',
      es: 'Siwa era históricamente famosa por el Templo de Amón.',
      pt: 'Siwa era historicamente famosa pelo Templo de Amom.'
    },
    bestTime: { ar: 'أكتوبر إلى مارس', en: 'October to March' },
    duration: { ar: '3 إلى 4 أيام', en: '3 to 4 Days' },
    stats: [
      { title: { ar: 'الموقع', en: 'Location' }, value: { ar: 'الصحراء الغربية', en: 'Western Desert' } },
      { title: { ar: 'الثقافة', en: 'Culture' }, value: { ar: 'تراث أمازيغي', en: 'Amazigh Heritage' } },
      { title: { ar: 'المياه', en: 'Water' }, value: { ar: 'عيون كبريتية', en: 'Sulfur Springs' } },
      { title: { ar: 'الطبيعة', en: 'Nature' }, value: { ar: 'بحيرات ملح', en: 'Salt Lakes' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'العصر الفرعوني', en: 'Pharaonic Era' }, desc: { ar: 'بناء معبد الوحي وزيارة الملوك.', en: 'Building the Oracle Temple.' } },
      { era: { ar: 'العصر الحديث', en: 'Modern Era' }, desc: { ar: 'محمية طبيعية ووجهة عالمية للسياحة البيئية.', en: 'Natural reserve and ecotourism hub.' } }
    ],
    funFacts: [
      { ar: 'يمكنك الطفو بسهولة فائقة في بحيرات الملح بسيوة بسبب نسبة الملوحة العالية.', en: 'You can effortlessly float in Siwa\'s salt lakes due to high salinity.' },
      { ar: 'زار الإسكندر الأكبر واحة سيوة ليُعلن ابناً للإله آمون عام 331 ق.م.', en: 'Alexander the Great visited Siwa to be proclaimed son of Amun in 331 BC.' }
    ],
    whyVisit: {
      ar: 'لأنها الواحة الأكثر سحراً وعزلة في مصر، حيث الهدوء المطلق، عيون المياه الطبيعية، والتراث الأمازيغي الأصيل.',
      en: 'Because it is the most magical and isolated oasis in Egypt, offering absolute quiet, natural springs, and authentic Amazigh heritage.'
    },
    attractions: [
      {
        slug: 'shali-fortress',
        categoryName: { ar: 'التراث السيوي', en: 'Siwan Heritage' },
        title: { ar: 'قلعة شالي التاريخية', en: 'Shali Fortress' },
        desc: { ar: 'قلعة أثرية مبنية بـ الكرشف (مخلوط الملح والطين).', en: 'Historic fortress built from kershef.' },
        badge: { ar: 'سيوة', en: 'Siwa' }
      }
    ]
  },
  'alexandria-north-coast': {
    image: '/alexandria.webp',
    category: {
      ar: 'لؤلؤة البحر المتوسط والتاريخ اليوناني الروماني',
      en: 'Pearl of the Mediterranean & Greco-Roman History',
      ru: 'Жемчужина Средиземноморья и греко-римская история',
      fr: 'Perle de la Méditerranée et histoire gréco-romaine',
      de: 'Perle des Mittelmeers & griechisch-römische Geschichte',
      it: 'Perla del Mediterraneo e storia greco-romana',
      es: 'Perla del Mediterráneo e historia grecorromana',
      pt: 'Pérola do Mediterrâneo e história greco-romana'
    },
    name: {
      ar: 'الإسكندرية والساحل الشمالي - عروس البحر الأبيض المتوسط',
      en: 'Alexandria & North Coast - Bride of the Mediterranean',
      ru: 'Александрия и Северное побережье - Невеста Средиземноморья',
      fr: 'Alexandrie et Côte Nord - Fiancée de la Méditerranée',
      de: 'Alexandria & Nordküste - Braut des Mittelmeers',
      it: 'Alessandria e Costa Nord - Sposa del Mediterraneo',
      es: 'Alejandría y Costa Norte - Novia del Mediterráneo',
      pt: 'Alexandria e Costa Norte - Noiva do Mediterrâneo'
    },
    description: {
      ar: 'الإسكندرية ليست مجرد مدينة ساحلية على البحر المتوسط، بل هي واحدة من أقدم المدن في العالم وأكثرها تأثيرًا في التاريخ الإنساني. أسسها الإسكندر الأكبر عام 331 ق.م.',
      en: 'Alexandria is not just a coastal city on the Mediterranean, but one of the oldest and most influential cities in human history, founded by Alexander the Great in 331 BC.',
      ru: 'Александрия — один из старейших и наиболее влиятельных городов в истории.',
      fr: 'Alexandrie est l\'une des plus anciennes et influentes villes de l\'histoire.',
      de: 'Alexandria ist eine der ältesten und einflussreichsten Städte der Geschichte.',
      it: 'Alessandria è una delle città più antiche e influenti della storia.',
      es: 'Alejandría es una de las ciudades más antiguas e influyentes de la historia.',
      pt: 'Alexandria é uma das cidades mais antigas e influentes da história.'
    },
    longDescription: {
      ar: 'حيث يلتقي عبق التاريخ السكندري العريق مع سحر الشواطئ الساحرة للساحل الشمالي. تضم مكتبة الإسكندرية، قلعة قايتباي، وعراقة الفن والثقافة.',
      en: 'Where ancient Alexandrian history meets the charming beaches of the North Coast. Home to the Bibliotheca Alexandrina, Citadel of Qaitbay, and rich culture.',
      ru: 'Где древняя александрийская история встречается с пляжами Северного побережья.',
      fr: 'Où l\'histoire alexandrine rencontre les plages de la Côte Nord.',
      de: 'Wo alexandrinische Geschichte auf Strände trifft.',
      it: 'Dove la storia alessandrina incontra le spiagge.',
      es: 'Donde la historia alejandrina se encuentra con las playas.',
      pt: 'Onde a história alexandrina encontra as praias.'
    },
    history: {
      ar: 'أسسها الإسكندر الأكبر عام 331 ق.م لتكون عاصمة لمصر، وكانت مركزاً ثقافياً وعلْمياً عالمياً تضم مكتبة الإسكندرية القديمة ومنارة فاروس، وتعاقبت عليها العصور البطلمية والرومانية والبيزنطية والإسلامية والحديثة.',
      en: 'Founded by Alexander the Great in 331 BC as Egypt’s capital, it was a global cultural center featuring the ancient Library and Lighthouse, followed by Ptolemaic, Roman, Byzantine, Islamic, and modern eras.',
      ru: 'Основана Александром Великим в 331 г. до н.э., став глобальным культурным центром.',
      fr: 'Fondée par Alexandre le Grand en 331 av. J.-C. comme capitale.',
      de: 'Gegründet von Alexander dem Großen im Jahr 331 v. Chr.',
      it: 'Fondata da Alessandro Magno nel 331 a.C. come capitale.',
      es: 'Fundada por Alejandro Magno en 331 a. C. como capital.',
      pt: 'Fundada por Alexandre, o Grande, em 331 a.C. como capital.'
    },
    historicalDoc: {
      title: { ar: 'مكتبة الإسكندرية القديمة ومنارة فاروس', en: 'Ancient Library of Alexandria & Lighthouse' },
      desc: { ar: 'رموز العلم والمعمار القديم التي جعلت من الإسكندرية منارة للعالم القديم وملتقى للعلماء والفلاسفة.', en: 'Symbols of ancient science and architecture that made Alexandria a beacon.' }
    },
    cultureAndFood: {
      food: { ar: 'الأسماك والمأكولات البحرية السكندرية، الكبدة الإسكندراني، والحلويات الشهيرة.', en: 'Alexandrian seafood, Iskandarani liver, and famous desserts.' },
      crafts: { ar: 'الصناعات البحرية اليدوية، التطريز الساحلي، ومنتجات الأصداف.', en: 'Handmade marine crafts, coastal embroidery, and shell products.' }
    },
    bestTime: { ar: 'يونيو إلى سبتمبر', en: 'June to September' },
    duration: { ar: '3 إلى 5 أيام', en: '3 to 5 Days' },
    stats: [
      { title: { ar: 'سنة التأسيس', en: 'Foundation Year' }, value: { ar: '331 ق.م', en: '331 BC' } },
      { title: { ar: 'الموقع الساحلي', en: 'Coastal Location' }, value: { ar: 'أكثر من 70 كم', en: 'Over 70 km' } },
      { title: { ar: 'عدد السكان', en: 'Population' }, value: { ar: 'أكثر من 5 ملايين', en: 'Over 5 Million' } },
      { title: { ar: 'أهم ميناء', en: 'Main Port' }, value: { ar: 'البوابة الرئيسية', en: 'Main Gateway' } }
    ],
    timelineCivilizations: [
      { era: { ar: 'الحضارة المصرية', en: 'Pharaonic Civilization' }, desc: { ar: 'منطقة مأهولة ارتبطت بمدينة راقودة القديمة.', en: 'Inhabited area linked to Rakhody.' } },
      { era: { ar: 'الحضارة اليونانية', en: 'Greek Civilization' }, desc: { ar: 'العصر الذهبي وعاصمة الدولة البطلمية.', en: 'Golden age and Ptolemaic capital.' } },
      { era: { ar: 'الحضارة الرومانية', en: 'Roman Civilization' }, desc: { ar: 'تحولت إلى واحدة من أهم مدن الإمبراطورية الرومانية.', en: 'Key city of the Roman Empire.' } },
      { era: { ar: 'العصر الحديث', en: 'Modern Era' }, desc: { ar: 'العاصمة الاقتصادية الثانية لمصر وأهم مقصد سياحي.', en: 'Second economic capital and premier tourist destination.' } }
    ],
    funFacts: [
      { ar: 'كانت الإسكندرية ثاني أكبر مدينة في العالم بعد روما في فترة من التاريخ.', en: 'Alexandria was the second largest city in the world after Rome at one point.' },
      { ar: 'احتضنت أول مكتبة عالمية تجمع المعرفة من مختلف الحضارات.', en: 'It hosted the first global library gathering knowledge from various civilizations.' }
    ],
    whyVisit: {
      ar: 'سواء كنت من عشاق التاريخ، أو محبي البحر، أو الباحثين عن الثقافة والفنون، فإن الإسكندرية تقدم تجربة سياحية متكاملة.',
      en: 'Whether you are a history lover, a sea enthusiast, or a seeker of culture and arts, Alexandria offers an integrated tourist experience.'
    },
    attractions: [
      {
        slug: 'bibliotheca-alexandrina',
        categoryName: { ar: 'معالم الإسكندرية الثقافية', en: 'Alexandria Cultural Landmarks' },
        title: { ar: 'مكتبة الإسكندرية الحديثة', en: 'Bibliotheca Alexandrina' },
        desc: { ar: 'منارة ثقافية وعلمية عملاقة على شاطئ المتوسط.', en: 'A giant cultural and scientific beacon on the Mediterranean shore.' },
        badge: { ar: 'منارة العلم', en: 'Beacon of Science' }
      },
      {
        slug: 'qaitbay-citadel',
        categoryName: { ar: 'القلاع التاريخية', en: 'Historical Citadels' },
        title: { ar: 'قلعة قايتباي', en: 'Citadel of Qaitbay' },
        desc: { ar: 'حصن دفاعي تاريخي على شاطئ البحر الأبيض المتوسط.', en: 'A historic defensive fortress on the Mediterranean coast.' },
        badge: { ar: 'تاريخ عريق', en: 'Rich History' }
      }
    ]
  }
};

export default async function GovernorateDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const isRtl = locale === 'ar';

  let governorate = richGovernoratesData[slug];
  if (!governorate) {
    notFound();
  }

  // --- دمج استعلام الإحداثيات من سانتي بناءً على الرابط الحالي ---
  const query = `*[_type == "area" && slug.current == $slug][0]{
    lat,
    lng
  }`;
  const sanityData = await client.fetch(query, { slug });
  // -------------------------------------------------------------

  const getLocalized = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[locale] || obj['en'] || Object.values(obj)[0] || '';
  };

  const title = getLocalized(governorate.name);
  const description = getLocalized(governorate.description);
  const longDesc = getLocalized(governorate.longDescription);
  const categoryLabel = getLocalized(governorate.category);
  const bestTimeText = getLocalized(governorate.bestTime);
  const durationText = getLocalized(governorate.duration);
  const historyText = getLocalized(governorate.history);
  const whyVisitText = getLocalized(governorate.whyVisit);
  
  const docTitle = getLocalized(governorate.historicalDoc?.title);
  const docDesc = getLocalized(governorate.historicalDoc?.desc);

  const foodText = getLocalized(governorate.cultureAndFood?.food);
  const craftsText = getLocalized(governorate.cultureAndFood?.crafts);

  const uiTexts: Record<string, any> = {
    ar: { 
      back: 'العودة للرئيسية', overview: 'نظرة عامة على الوجهة', historyTitle: 'تاريخ المحافظة وأبرز العصور', 
      docHeader: 'وثيقة تاريخية أثرية', cultureHeader: 'الثقافة المحلية، الأكلات، والحرف', foodLabel: 'أشهر الأكلات والمذاقات', 
      craftsLabel: 'الحرف والتراث اليدوي', attractions: 'أبرز معالم الجذب في هذه المحافظة', exploreBtn: 'استكشف المعلم بالتفصيل', 
      allAttractionsBtn: 'تعرف على كل المناطق السياحية', bookTitle: 'احجز جولتك الخاصة', 
      bookDesc: 'احصل على برنامج مخصص، باقة تنقلات VIP، ومرشد سياحي خاص.', bookBtn: 'تأكيد حجز الرحلة الآن',
      statsTitle: 'معالم بالأرقام', timelineTitle: 'التسلسل الزمني للحضارات', factsTitle: 'حقائق مذهلة', whyVisitTitle: 'لماذا يجب عليك زيارتها؟',
      mapTitle: 'الموقع على الخريطة' // إضافة عنوان الخريطة
    },
    en: { 
      back: 'Back to Home', overview: 'Destination Overview', historyTitle: 'History & Eras', 
      docHeader: 'Historical Document & Artifact', cultureHeader: 'Local Culture, Food & Crafts', foodLabel: 'Famous Local Food', 
      craftsLabel: 'Traditional Crafts', attractions: 'Top Attractions in this Governorate', exploreBtn: 'Explore Attraction Details', 
      allAttractionsBtn: 'Explore All Tourist Attractions', bookTitle: 'Book Your Private Tour', 
      bookDesc: 'Secure a customized itinerary, VIP transport, and a private tour guide.', bookBtn: 'Confirm Tour Booking Now',
      statsTitle: 'In Numbers', timelineTitle: 'Civilizations Timeline', factsTitle: 'Fun Facts', whyVisitTitle: 'Why Visit?',
      mapTitle: 'Location on Map' // إضافة عنوان الخريطة
    },
    de: { 
      back: 'Zurück zur Startseite', overview: 'Reiseziel-Übersicht', historyTitle: 'Geschichte', 
      docHeader: 'Historisches Dokument', cultureHeader: 'Kultur, Küche & Handwerk', foodLabel: 'Lokale Speisen', 
      craftsLabel: 'Handwerk', attractions: 'Top-Attraktionen', exploreBtn: 'Details erkunden', 
      allAttractionsBtn: 'Alle Sehenswürdigkeiten entdecken', bookTitle: 'Private Tour buchen', 
      bookDesc: 'Sichern Sie sich eine maßgeschneiderte Reiseroute.', bookBtn: 'Tour jetzt buchen',
      statsTitle: 'In Zahlen', timelineTitle: 'Zeitleiste', factsTitle: 'Fakten', whyVisitTitle: 'Warum besuchen?',
      mapTitle: 'Standort auf der Karte'
    },
    es: { 
      back: 'Volver al inicio', overview: 'Descripción general', historyTitle: 'Historia', 
      docHeader: 'Documento histórico', cultureHeader: 'Cultura y gastronomía', foodLabel: 'Comida local', 
      craftsLabel: 'Artesanía', attractions: 'Principales atracciones', exploreBtn: 'Explorar detalles', 
      allAttractionsBtn: 'Explorar todas las atracciones', bookTitle: 'Reservar tour privado', 
      bookDesc: 'Asegura un itinerario personalizado.', bookBtn: 'Confirmar reserva',
      statsTitle: 'En Números', timelineTitle: 'Cronología', factsTitle: 'Curiosidades', whyVisitTitle: '¿Por qué visitar?',
      mapTitle: 'Ubicación en el mapa'
    },
    pt: { 
      back: 'Voltar ao início', overview: 'Visão geral', historyTitle: 'História', 
      docHeader: 'Documento histórico', cultureHeader: 'Cultura e culinária', foodLabel: 'Comida local', 
      craftsLabel: 'Artesanato', attractions: 'Principales atrações', exploreBtn: 'Explorar detalhes', 
      allAttractionsBtn: 'Explorar todas as atrações', bookTitle: 'Reservar tour privado', 
      bookDesc: 'Garanta um roteiro personalizado.', bookBtn: 'Confirmar reserva',
      statsTitle: 'Em Números', timelineTitle: 'Cronologia', factsTitle: 'Curiosidades', whyVisitTitle: 'Por que visitar?',
      mapTitle: 'Localização no mapa'
    },
    fr: {
      back: 'Retour à l’accueil', overview: 'Aperçu', historyTitle: 'Histoire', docHeader: 'Document historique',
      cultureHeader: 'Culture & Cuisine', foodLabel: 'Plats locaux', craftsLabel: 'Artisanat', attractions: 'Attractions',
      exploreBtn: 'Explorer', allAttractionsBtn: 'Découvrir toutes les attractions', bookTitle: 'Réserver', bookDesc: 'Service VIP.', bookBtn: 'Confirmer',
      statsTitle: 'En Chiffres', timelineTitle: 'Chronologie', factsTitle: 'Faits Amusants', whyVisitTitle: 'Pourquoi Visiter?',
      mapTitle: 'Emplacement sur la carte'
    },
    it: {
      back: 'Torna alla home', overview: 'Panoramica', historyTitle: 'Storia', docHeader: 'Documento storico',
      cultureHeader: 'Cultura e cucina', foodLabel: 'Cibo locale', craftsLabel: 'Artigianato', attractions: 'Attrazioni',
      exploreBtn: 'Esplora', allAttractionsBtn: 'Scopri tutte le attrazioni', bookTitle: 'Prenota', bookDesc: 'Servizio VIP.', bookBtn: 'Conferma',
      statsTitle: 'In Numeri', timelineTitle: 'Cronologia', factsTitle: 'Curiosità', whyVisitTitle: 'Perché Visitare?',
      mapTitle: 'Posizione sulla mappa'
    },
    ru: {
      back: 'Назад', overview: 'Обзор', historyTitle: 'История', docHeader: 'Исторический документ',
      cultureHeader: 'Культура', foodLabel: 'Еда', craftsLabel: 'Ремесла', attractions: 'Достопримечательности',
      exploreBtn: 'Подробнее', allAttractionsBtn: 'Все достопримечательности', bookTitle: 'Бронирование', bookDesc: 'VIP тур.', bookBtn: 'Забронировать',
      statsTitle: 'В цифрах', timelineTitle: 'Хронология', factsTitle: 'Интересные факты', whyVisitTitle: 'Почему стоит посетить?',
      mapTitle: 'Расположение на карте'
    }
  };

  const currentUi = uiTexts[locale] || uiTexts['en'];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-600 selection:text-white pb-28" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
        <img
          src={governorate.image}
          alt={title}
          className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-black/60" />
        
        <div className={`absolute top-6 ${isRtl ? 'right-6 md:right-12' : 'left-6 md:left-12'} z-20`}>
          <Link
            href={`/${locale}`}
            className="px-5 py-2.5 bg-white/90 backdrop-blur-md border border-gray-200 hover:border-red-600 text-gray-800 hover:text-red-600 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <span>{isRtl ? '←' : '→'}</span>
            <span>{currentUi.back}</span>
          </Link>
        </div>

        <div className="absolute bottom-12 right-6 md:right-16 left-6 md:left-16 z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full mb-4 text-red-600 text-xs font-bold tracking-wider uppercase shadow-sm">
            <span>✨</span>
            <span>{categoryLabel}</span>
          </div>
          
          <h1 className="text-3xl md:text-6xl font-black tracking-wide text-gray-900 mb-6 drop-shadow-sm">
            {title}
          </h1>

          <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-700 font-medium">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl flex items-center gap-2 shadow-md">
              📅 {bestTimeText}
            </span>
            <span className="px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl flex items-center gap-2 shadow-md">
              ⏳ {durationText}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT & SECTIONS */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
            <h2 className={`text-xl md:text-2xl font-black text-gray-900 mb-4 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
              {currentUi.overview}
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium relative z-10 mb-4">
              {description}
            </p>
            {longDesc && (
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium relative z-10">
                {longDesc}
              </p>
            )}
          </div>

          {/* Stats / Numbers Cards */}
          {governorate.stats && governorate.stats.length > 0 && (
            <div className="space-y-6">
              <h3 className={`text-xl md:text-2xl font-black text-gray-900 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.statsTitle}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {governorate.stats.map((stat, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 p-5 rounded-3xl text-center shadow-sm">
                    <div className="text-red-600 font-black text-base md:text-lg mb-1">{getLocalized(stat.value)}</div>
                    <div className="text-gray-600 text-xs font-bold">{getLocalized(stat.title)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {historyText && (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
              <h2 className={`text-xl md:text-2xl font-black text-gray-900 mb-4 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.historyTitle}
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium relative z-10">
                {historyText}
              </p>
            </div>
          )}

          {/* --- قسم الخريطة الجديد مع ربطه بـ Sanity --- */}
          {sanityData?.lat && sanityData?.lng && (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mt-10">
              <h2 className={`text-xl md:text-2xl font-black text-gray-900 mb-6 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.mapTitle}
              </h2>
              {/* إرسال الإحداثيات واللغة إلى مكون الخريطة */}
              <AreaMap lat={sanityData.lat} lng={sanityData.lng} currentLang={locale} />
            </div>
          )}

          {/* Timeline of Civilizations */}
          {governorate.timelineCivilizations && governorate.timelineCivilizations.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <h3 className={`text-xl md:text-2xl font-black text-gray-900 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.timelineTitle}
              </h3>
              <div className="space-y-4 relative border-s-2 border-red-200 ps-4 ms-2">
                {governorate.timelineCivilizations.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -start-[23px] top-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
                    <h4 className="text-sm font-black text-gray-900 mb-1">{getLocalized(item.era)}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{getLocalized(item.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fun Facts */}
          {governorate.funFacts && governorate.funFacts.length > 0 && (
            <div className="bg-gradient-to-br from-red-50/40 via-gray-50 to-gray-50 border border-red-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>💡</span>
                <span>{currentUi.factsTitle}</span>
              </h3>
              <ul className="space-y-3">
                {governorate.funFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-700 font-medium">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{getLocalized(fact)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Historical Doc */}
          {governorate.historicalDoc && (
            <div className="bg-gradient-to-br from-red-50/60 via-gray-50 to-gray-50 border border-red-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-5 py-2 bg-red-100 border-b border-l border-red-200 rounded-bl-2xl text-red-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span>📜</span>
                <span>{currentUi.docHeader}</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-3 mt-2">{docTitle}</h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium italic border-s-2 border-red-600 ps-4 py-1">
                "{docDesc}"
              </p>
            </div>
          )}

          {/* Culture & Food */}
          {governorate.cultureAndFood && (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <h2 className={`text-xl md:text-2xl font-black text-gray-900 mb-6 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.cultureHeader}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                  <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🍲</span>
                    <span>{currentUi.foodLabel}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">{foodText}</p>
                </div>
                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                  <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🏺</span>
                    <span>{currentUi.craftsLabel}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">{craftsText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Attractions */}
          {governorate.attractions && governorate.attractions.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className={`text-lg md:text-xl font-black text-gray-900 ${isRtl ? 'border-r-4 border-red-600 pr-3' : 'border-l-4 border-red-600 pl-3'}`}>
                {currentUi.attractions}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {governorate.attractions.map((attr: any, index: number) => {
                  const attrTitle = getLocalized(attr.title);
                  const attrDesc = getLocalized(attr.desc);
                  const attrBadge = getLocalized(attr.badge);
                  const categoryName = getLocalized(attr.categoryName);

                  return (
                    <div key={index} className="bg-gray-50 border border-gray-200 hover:border-red-600/80 p-6 rounded-3xl transition-all duration-500 shadow-xl group flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{attrBadge}</span>
                          {categoryName && <span className="text-[11px] font-bold text-gray-500 bg-gray-200/60 px-2.5 py-0.5 rounded-md">{categoryName}</span>}
                        </div>
                        <h4 className="text-base md:text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors mb-2">{attrTitle}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">{attrDesc}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <Link href={`/${locale}/attractions/${attr.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-red-600 transition-colors">
                          <span>{currentUi.exploreBtn}</span>
                          <span>{isRtl ? '←' : '→'}</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <Link
                  href={`/${locale}/attractions/${slug}`}
                  className="w-full py-5 px-8 bg-gray-900 hover:bg-red-600 text-white rounded-3xl font-black text-sm md:text-base shadow-xl hover:shadow-[0_0_35px_rgba(220,38,38,0.3)] transition-all duration-300 flex items-center justify-between group border border-gray-800 hover:border-red-500"
                >
                  <span className="flex items-center gap-3">
                    <span className="p-2 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors">🏛️</span>
                    <span>{currentUi.allAttractionsBtn}</span>
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform font-bold text-lg">
                    {isRtl ? '←' : '→'}
                  </span>
                </Link>
              </div>

            </div>
          )}

          {/* Why Visit / Marketing Conclusion */}
          {whyVisitText && (
            <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-4">
              <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl">✨</div>
              <h3 className="text-xl md:text-2xl font-black text-red-500">{currentUi.whyVisitTitle}</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                {whyVisitText}
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Booking Box */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl sticky top-6">
            <h3 className="text-lg font-black text-gray-900 mb-3">{currentUi.bookTitle}</h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">{currentUi.bookDesc}</p>
            <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-bold text-xs md:text-sm shadow-lg transition-all cursor-pointer">
              {currentUi.bookBtn}
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}