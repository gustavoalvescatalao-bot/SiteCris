// Catalog data extracted from "2026 Catalog WC.pdf" (WC Knots & Crafts Decor).
// Images live in /public/images/catalog and are named p{page}-{n}.jpg, ordered
// top-to-bottom / left-to-right as they appear on the catalog page.
// Copy is bilingual ({ en, pt }); material names are translated in src/i18n/materials.ts.

import type { L } from '../i18n'

export const BRAND = {
  name: 'WC Knots & Crafts Decor',
  short: 'WC',
  year: 2026,
  slogan: {
    en: 'Where Brazilian artistry meets luxury organic decor.',
    pt: 'Onde a arte brasileira encontra a decoração orgânica de luxo.',
  } as L,
  manifesto: [
    {
      en: 'Our collection was created to bring warmth, texture, and sophisticated natural elegance into modern interiors through unique handmade pieces crafted with natural stones and organic elements.',
      pt: 'Nossa coleção foi criada para trazer calor, textura e uma elegância natural sofisticada para interiores modernos, por meio de peças únicas feitas à mão com pedras naturais e elementos orgânicos.',
    },
    {
      en: 'Each piece is carefully selected and developed in collaboration with a Brazilian artist, celebrating authentic craftsmanship and timeless design.',
      pt: 'Cada peça é cuidadosamente selecionada e desenvolvida em colaboração com um talento artístico brasileiro, celebrando o artesanato autêntico e o design atemporal.',
    },
    {
      en: 'Inspired by earthy aesthetics and refined minimalism, our creations are designed to transform spaces with subtle luxury and artistic presence.',
      pt: 'Inspiradas por uma estética terrosa e por um minimalismo refinado, nossas criações são pensadas para transformar ambientes com luxo sutil e presença artística.',
    },
  ] as L[],
  signoff: { en: 'Handmade in Brazil.', pt: 'Feito à mão no Brasil.' } as L,
  instagram: 'wcknotscraftsdecor',
  instagramUrl: 'https://instagram.com/wcknotscraftsdecor',
  instagramDm: 'https://ig.me/m/wcknotscraftsdecor',
  qr: '/images/catalog/p26-1.jpg',
  // Digits only, with country code — used to build wa.me links.
  whatsapp: '17869284040',
  whatsappDisplay: '+1 (786) 928-4040',
}

/** wa.me link to the studio's WhatsApp, optionally with a pre-filled message. */
export const whatsappLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const PALETTE = {
  sand: '#DFD3C3',
  travertine: '#F4EFE6',
  terracotta: '#8C4A32',
  sage: '#6B7B6E',
  indigo: '#2C3545',
  onyx: '#1C1B1A',
  mocha: '#5A4A42',
  honey: '#B08A55',
} as const

export type CategoryId = 'fiber' | 'wood' | 'totem' | 'acrylic'

export interface Category {
  id: CategoryId
  index: string
  title: L
  short: L
  kicker: L
  description: L
  bg: string
  fg: string
  cover: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'fiber',
    index: '01',
    title: { en: 'Signature Fiber & Stone', pt: 'Fibra & Pedra Assinatura' },
    short: { en: 'Fibers', pt: 'Fibras' },
    kicker: { en: 'Tabletop Sculptures', pt: 'Esculturas de Mesa' },
    description: {
      en: 'Hand-pleated silk fiber poured across the table like a river, bound by selenite rings, agates and polished river stones.',
      pt: 'Fibra de seda plissada à mão, derramada sobre a mesa como um rio, presa por anéis de selenita, ágatas e pedras de rio polidas.',
    },
    bg: PALETTE.terracotta,
    fg: PALETTE.travertine,
    cover: '/images/generated/cover-fiber.jpg',
  },
  {
    id: 'wood',
    index: '02',
    title: { en: 'Organic Wood & Stone', pt: 'Madeira & Pedra Orgânicas' },
    short: { en: 'Wood & Tassels', pt: 'Madeira & Borlas' },
    kicker: { en: 'Accents & Book Sculptures', pt: 'Objetos & Esculturas para Livros' },
    description: {
      en: 'Turned wooden beads, raw gemstones and silk tassels — quiet accents for shelves, books and console tables.',
      pt: 'Contas de madeira torneada, pedras brutas e borlas de seda — detalhes silenciosos para estantes, livros e aparadores.',
    },
    bg: PALETTE.sage,
    fg: PALETTE.travertine,
    cover: '/images/generated/cover-wood.jpg',
  },
  {
    id: 'totem',
    index: '03',
    title: { en: 'Vertical Stone Totems', pt: 'Totens Verticais de Pedra' },
    short: { en: 'Stone Totems', pt: 'Totens de Pedra' },
    kicker: { en: 'Balanced on Acrylic', pt: 'Equilibrados no Acrílico' },
    description: {
      en: 'Eight inches of balance: citrine, quartz, jasper and tiger’s eye stacked by hand on a crystal-clear acrylic base.',
      pt: 'Oito polegadas de equilíbrio: citrino, quartzo, jaspe e olho de tigre empilhados à mão sobre uma base de acrílico cristalino.',
    },
    bg: PALETTE.indigo,
    fg: PALETTE.travertine,
    cover: '/images/generated/cover-totem.jpg',
  },
  {
    id: 'acrylic',
    index: '04',
    title: { en: 'Acrylic Box Sculptures', pt: 'Esculturas em Caixa de Acrílico' },
    short: { en: 'Acrylic Boxes', pt: 'Caixas de Acrílico' },
    kicker: { en: 'Suspended Agates', pt: 'Ágatas Suspensas' },
    description: {
      en: 'Agate slices, geodes and stone stacks suspended on a gold pin inside museum-clear acrylic vitrines.',
      pt: 'Fatias de ágata, geodos e pilhas de pedras suspensos em uma haste dourada dentro de vitrines de acrílico com transparência de museu.',
    },
    bg: PALETTE.onyx,
    fg: PALETTE.travertine,
    cover: '/images/generated/cover-acrylic.jpg',
  },
]

export interface Product {
  id: string
  name: L
  category: CategoryId
  pages: number[]
  /** Size in inches as printed in the catalog (undefined when not stated). */
  size?: number
  price: number
  startingFrom?: boolean
  /** English material names — translated at render time. */
  materials: string[]
  description: L
  images: string[]
  /** Tone used for the showcase background when this piece is active. */
  tone: string
  featured?: boolean
}

const img = (...names: string[]) => names.map((n) => `/images/catalog/${n}.jpg`)

export const PRODUCTS: Product[] = [
  // ——— 01 · Signature Fiber & Stone Tabletop Sculptures ———
  {
    id: 'copper-river-jasper',
    name: { en: 'Copper River with Jasper Cluster', pt: 'Rio de Cobre com Cacho de Jaspe' },
    category: 'fiber',
    pages: [3],
    size: 90,
    price: 329,
    materials: ['Copper silk fiber', 'Selenite', 'Red jasper', 'Moonstone'],
    description: {
      en: 'A sweeping copper fiber wave gathered by a selenite cuff and a cascade of red jasper and pearly stones.',
      pt: 'Uma ampla onda de fibra cobre, reunida por uma ponteira de selenita e uma cascata de jaspe vermelho e pedras peroladas.',
    },
    images: img('p03-1'),
    tone: PALETTE.terracotta,
    featured: true,
  },
  {
    id: 'sage-twin-teal-agate',
    name: { en: 'Sage Twin with Teal Agate', pt: 'Dupla Sálvia com Ágata Azul-Petróleo' },
    category: 'fiber',
    pages: [4],
    size: 90,
    price: 329,
    materials: ['Sage silk fiber', 'Natural wood', 'Teal agate slice', 'Amazonite'],
    description: {
      en: 'Two sage-green streams finished in natural wood caps, teal stones and a luminous teal agate slice.',
      pt: 'Dois fluxos verde-sálvia finalizados com ponteiras de madeira natural, pedras azul-petróleo e uma luminosa fatia de ágata.',
    },
    images: img('p04-1'),
    tone: PALETTE.sage,
    featured: true,
  },
  {
    id: 'onyx-cascade-selenite',
    name: { en: 'Onyx Cascade with Selenite Ring', pt: 'Cascata Ônix com Anel de Selenita' },
    category: 'fiber',
    pages: [5],
    size: 90,
    price: 419,
    materials: ['Onyx silk fiber', 'Selenite ring', 'Smoky quartz', 'Black river stones'],
    description: {
      en: 'A deep onyx fiber cascade drawn through a raw selenite ring and finished with smoky quartz and black stones.',
      pt: 'Uma cascata de fibra ônix profunda, passada por um anel de selenita bruta e finalizada com quartzo fumê e pedras pretas.',
    },
    images: img('p05-1'),
    tone: PALETTE.onyx,
    featured: true,
  },
  {
    id: 'copper-duet-pebbles',
    name: { en: 'Copper Duet with River Pebbles & Agate', pt: 'Dueto de Cobre com Seixos & Ágata' },
    category: 'fiber',
    pages: [6],
    size: 90,
    price: 329,
    materials: ['Copper silk fiber', 'Brass cuffs', 'White river pebbles', 'Agate slice'],
    description: {
      en: 'Shown in four arrangements: a copper fiber duet ending in brass cuffs, white river pebbles and a natural agate slice.',
      pt: 'Mostrado em quatro composições: um dueto de fibra cobre com ponteiras de latão, seixos de rio brancos e uma fatia de ágata natural.',
    },
    images: img('p06-1', 'p06-2', 'p06-3', 'p06-4'),
    tone: PALETTE.terracotta,
  },
  {
    id: 'terracotta-flow-obsidian',
    name: { en: 'Terracotta Flow with Selenite & Obsidian', pt: 'Fluxo Terracota com Selenita & Obsidiana' },
    category: 'fiber',
    pages: [7],
    size: 90,
    price: 419,
    materials: ['Terracotta silk fiber', 'Selenite ring', 'Smoky quartz', 'Obsidian', 'Gold accent'],
    description: {
      en: 'A sculptural terracotta flow anchored by a selenite ring, smoky quartz, polished obsidian and a gold finial.',
      pt: 'Um fluxo escultural terracota ancorado por um anel de selenita, quartzo fumê, obsidiana polida e um arremate dourado.',
    },
    images: img('p07-1'),
    tone: PALETTE.terracotta,
    featured: true,
  },
  {
    id: 'braided-terracotta-agate',
    name: { en: 'Braided Terracotta & Agate', pt: 'Trança Terracota & Ágata' },
    category: 'fiber',
    pages: [8],
    size: 67,
    price: 299,
    materials: ['Braided terracotta fiber', 'Natural wood', 'Red agate', 'Jasper'],
    description: {
      en: 'A hand-braided terracotta rope finished in a wooden cap and generous red agate and jasper stones.',
      pt: 'Uma corda terracota trançada à mão, finalizada com ponteira de madeira e generosas pedras de ágata vermelha e jaspe.',
    },
    images: img('p08-1', 'p08-2'),
    tone: '#7A3E2A',
  },
  {
    id: 'mocha-wave-agate',
    name: { en: 'Mocha Wave with Agate Slice', pt: 'Onda Moca com Fatia de Ágata' },
    category: 'fiber',
    pages: [9],
    size: 90,
    price: 329,
    materials: ['Mocha silk fiber', 'Agate slice', 'Smoky stones', 'Gold accent'],
    description: {
      en: 'A soft mocha wave finished with stacked smoky stones on one end and a framed agate slice on the other.',
      pt: 'Uma onda suave cor moca, com pedras fumê empilhadas em uma ponta e uma fatia de ágata emoldurada na outra.',
    },
    images: img('p09-1', 'p09-2'),
    tone: PALETTE.mocha,
  },
  {
    id: 'copper-tide-twin-selenite',
    name: { en: 'Copper Tide with Twin Selenite', pt: 'Maré de Cobre com Selenita Dupla' },
    category: 'fiber',
    pages: [10],
    size: 90,
    price: 419,
    materials: ['Copper silk fiber', 'Twin selenite rings', 'Labradorite', 'Gold accent'],
    description: {
      en: 'An abundant copper tide gathered by two selenite rings and a column of dark labradorite-toned stones.',
      pt: 'Uma maré abundante de cobre reunida por dois anéis de selenita e uma coluna de pedras escuras em tom de labradorita.',
    },
    images: img('p10-1'),
    tone: '#9A5536',
  },
  {
    id: 'indigo-selenite-gold',
    name: { en: 'Indigo Blue Selenite & Gold', pt: 'Índigo com Selenita Azul & Ouro' },
    category: 'fiber',
    pages: [11],
    size: 115,
    price: 459,
    materials: ['Indigo silk fiber', 'Blue selenite', 'Blue aventurine', 'Gold rings'],
    description: {
      en: 'The statement piece of the collection: 115 inches of indigo fiber, a blue selenite crown, blue stones and gold rings.',
      pt: 'A peça de destaque da coleção: 115 polegadas de fibra índigo, uma coroa de selenita azul, pedras azuis e anéis dourados.',
    },
    images: img('p11-1'),
    tone: PALETTE.indigo,
    featured: true,
  },
  {
    id: 'moss-selenite-jasper',
    name: { en: 'Moss Selenite with Green Jasper', pt: 'Musgo com Selenita & Jaspe Verde' },
    category: 'fiber',
    pages: [12],
    size: 90,
    price: 419,
    materials: ['Moss silk fiber', 'Twin selenite rings', 'Green jasper'],
    description: {
      en: 'Moss-green fiber pooled across the table, bound by twin selenite rings and a strand of green jasper.',
      pt: 'Fibra verde-musgo espalhada sobre a mesa, presa por dois anéis de selenita e um fio de jaspe verde.',
    },
    images: img('p12-1', 'p12-2'),
    tone: PALETTE.sage,
  },
  {
    id: 'compact-golden-knot',
    name: { en: 'Compact Golden Knot', pt: 'Nó Dourado Compacto' },
    category: 'fiber',
    pages: [13],
    price: 219,
    materials: ['Golden silk fiber', 'Natural wood', 'Brass cuffs'],
    description: {
      en: 'A compact tabletop knot in golden fiber, finished with wooden beads and brushed brass cuffs.',
      pt: 'Um nó de mesa compacto em fibra dourada, finalizado com contas de madeira e ponteiras de latão escovado.',
    },
    images: img('p13-1', 'p13-2'),
    tone: PALETTE.honey,
  },
  {
    id: 'copper-drift-onyx',
    name: { en: 'Copper Drift on Onyx Base', pt: 'Deriva de Cobre sobre Base de Ônix' },
    category: 'fiber',
    pages: [14],
    size: 78,
    price: 279,
    materials: ['Copper silk fiber', 'Honey onyx block'],
    description: {
      en: 'A wind-swept copper drift rising from a translucent honey-onyx block — sculpture as landscape.',
      pt: 'Uma onda de cobre soprada pelo vento, nascendo de um bloco translúcido de ônix mel — escultura como paisagem.',
    },
    images: img('p14-1'),
    tone: '#8A4A2E',
  },
  {
    id: 'dual-tone-knot',
    name: { en: 'Dual-Tone Interlocked Knot', pt: 'Nó Entrelaçado Bicolor' },
    category: 'fiber',
    pages: [15],
    size: 46,
    price: 179,
    materials: ['Terracotta fiber', 'Natural straw fiber', 'Brass cuff'],
    description: {
      en: 'Terracotta and natural fibers interlocked in a classic sailor’s knot, gathered by a single brass cuff.',
      pt: 'Fibras terracota e natural entrelaçadas em um clássico nó de marinheiro, reunidas por uma única ponteira de latão.',
    },
    images: img('p15-1'),
    tone: '#7C4B35',
  },
  {
    id: 'woven-seed-braid',
    name: { en: 'Woven Seed & Braided Fiber', pt: 'Trança de Fibra com Sementes' },
    category: 'fiber',
    pages: [16],
    size: 50,
    price: 229,
    materials: ['Braided fiber', 'Natural seeds', 'Wooden beads', 'Wood ring'],
    description: {
      en: 'A long braid woven with natural seeds and tiny wooden beads, finished with a carved wooden ring.',
      pt: 'Uma longa trança tecida com sementes naturais e pequenas contas de madeira, finalizada com uma argola de madeira entalhada.',
    },
    images: img('p16-1'),
    tone: '#6E3A28',
  },
  {
    id: 'copper-wave-wall',
    name: { en: 'Copper Wave Wall Sculpture', pt: 'Escultura de Parede Onda de Cobre' },
    category: 'fiber',
    pages: [17],
    size: 78,
    price: 269,
    materials: ['Copper silk fiber', 'Wooden finials'],
    description: {
      en: 'A floating copper wave for the wall, shown in four light conditions — from brick to plaster.',
      pt: 'Uma onda de cobre que flutua na parede, mostrada em quatro luzes diferentes — do tijolo ao reboco.',
    },
    images: img('p17-1', 'p17-2', 'p17-3', 'p17-4'),
    tone: '#94522F',
  },

  // ——— 02 · Organic Wood & Stone Accents ———
  {
    id: 'wooden-bead-sculpture',
    name: { en: 'Natural Wooden Bead Sculpture', pt: 'Escultura de Contas de Madeira Natural' },
    category: 'wood',
    pages: [18],
    size: 46,
    price: 259,
    materials: ['Hand-turned wooden beads', 'Carved wood hanger'],
    description: {
      en: 'Cascading strands of hand-turned wooden beads on a carved wooden hanger — draped, coiled or hung.',
      pt: 'Fios em cascata de contas de madeira torneadas à mão em um suporte de madeira entalhada — para drapear, enrolar ou pendurar.',
    },
    images: img('p18-1', 'p18-2', 'p18-3', 'p18-4'),
    tone: '#7A5A3A',
    featured: true,
  },
  {
    id: 'tassel-quartz-agate',
    name: { en: 'Clear Quartz & Agate Book Sculpture', pt: 'Escultura para Livros de Quartzo & Ágata' },
    category: 'wood',
    pages: [19],
    price: 99,
    startingFrom: true,
    materials: ['Clear quartz', 'Natural agate slice'],
    description: {
      en: 'Raw clear quartz chips ending in a natural agate slice — made to rest across a stack of books.',
      pt: 'Lascas de quartzo transparente bruto terminando em uma fatia de ágata natural — feita para repousar sobre uma pilha de livros.',
    },
    images: img('p19-2'),
    tone: PALETTE.sage,
  },
  {
    id: 'tassel-white-gold',
    name: { en: 'White Stone & Silk Tassel', pt: 'Pedras Brancas com Borla de Seda' },
    category: 'wood',
    pages: [19],
    price: 99,
    startingFrom: true,
    materials: ['White howlite', 'Silk tassel (gold or sky blue)'],
    description: {
      en: 'Polished white stones finished with a long silk tassel — shown in gold and in sky blue.',
      pt: 'Pedras brancas polidas finalizadas com uma longa borla de seda — mostrada em dourado e em azul-céu.',
    },
    images: img('p19-1', 'p19-4'),
    tone: PALETTE.sage,
  },
  {
    id: 'tassel-malachite',
    name: { en: 'Malachite & Gold Silk Tassel', pt: 'Malaquita com Borla de Seda Dourada' },
    category: 'wood',
    pages: [19],
    price: 99,
    startingFrom: true,
    materials: ['Malachite', 'Gold silk tassel'],
    description: {
      en: 'Deep green malachite nuggets on a fluid line, finished with a gold silk tassel.',
      pt: 'Pepitas de malaquita verde-profundo em uma linha fluida, finalizadas com uma borla de seda dourada.',
    },
    images: img('p19-3'),
    tone: '#4F6355',
  },
  {
    id: 'tassel-onyx-black',
    name: { en: 'Black Onyx & Silk Tassel', pt: 'Ônix Preto com Borla de Seda' },
    category: 'wood',
    pages: [20, 21],
    price: 99,
    startingFrom: true,
    materials: ['Black onyx', 'Black silk tassel', 'Wood & gold accents'],
    description: {
      en: 'Black onyx stones and beads finished with a black silk tassel — graphic and quiet.',
      pt: 'Pedras e contas de ônix preto finalizadas com uma borla de seda preta — gráfica e silenciosa.',
    },
    images: img('p20-2', 'p21-1'),
    tone: '#3B3A36',
  },
  {
    id: 'tassel-carnelian',
    name: { en: 'Carnelian & Gold Silk Tassel', pt: 'Cornalina com Borla de Seda Dourada' },
    category: 'wood',
    pages: [20],
    price: 99,
    startingFrom: true,
    materials: ['Carnelian', 'Gold silk tassel'],
    description: {
      en: 'Glowing carnelian stones graded from honey to ember, ending in a gold silk tassel.',
      pt: 'Pedras de cornalina luminosas em degradê do mel à brasa, terminando em uma borla de seda dourada.',
    },
    images: img('p20-1'),
    tone: '#8C4A32',
  },
  {
    id: 'tassel-sodalite-heart',
    name: { en: 'Sodalite Chip & Heart', pt: 'Lascas de Sodalita com Coração' },
    category: 'wood',
    pages: [20],
    price: 99,
    startingFrom: true,
    materials: ['Raw sodalite', 'Sodalite heart'],
    description: {
      en: 'Raw sodalite chips gathered into a strand and finished with a carved sodalite heart.',
      pt: 'Lascas de sodalita bruta reunidas em um fio e finalizadas com um coração de sodalita esculpido.',
    },
    images: img('p20-3'),
    tone: PALETTE.indigo,
  },
  {
    id: 'tassel-golden-druzy',
    name: { en: 'Golden Bead & Druzy Agate', pt: 'Contas Douradas & Ágata Drusa' },
    category: 'wood',
    pages: [20],
    price: 99,
    startingFrom: true,
    materials: ['Golden wooden beads', 'Druzy agate'],
    description: {
      en: 'Clusters of golden beads tumbling into a sparkling druzy agate slice.',
      pt: 'Cachos de contas douradas que deságuam em uma cintilante fatia de ágata drusa.',
    },
    images: img('p20-4'),
    tone: PALETTE.honey,
  },

  // ——— 03 · Vertical Stone Totems ———
  ...(
    [
      ['citrine-pyrite', { en: 'Citrine & Pyrite', pt: 'Citrino & Pirita' }, ['Citrine', 'Pyrite'], 'p22-1', '#B08A3E'],
      ['raw-quartz-pyrite', { en: 'Raw Quartz & Pyrite', pt: 'Quartzo Bruto & Pirita' }, ['Raw clear quartz', 'Pyrite'], 'p22-2', '#5E6470'],
      ['earth-agate', { en: 'Earth Agate', pt: 'Ágata Terra' }, ['Banded agate', 'Gold accent'], 'p22-3', '#6B5A4E'],
      ['green-quartz', { en: 'Green Quartz', pt: 'Quartzo Verde' }, ['Green quartz', 'Aventurine'], 'p22-4', '#4F6B5E'],
      ['red-jasper', { en: 'Red Jasper', pt: 'Jaspe Vermelho' }, ['Red jasper', 'Gold accent'], 'p23-1', '#5E2A26'],
      ['tigers-eye', { en: 'Tiger’s Eye', pt: 'Olho de Tigre' }, ['Tiger’s eye'], 'p23-2', '#6E5232'],
      ['black-stone', { en: 'Black Stone', pt: 'Pedra Negra' }, ['Black river stones', 'Gold accent'], 'p23-4', '#26272B'],
    ] as const
  ).map(
    ([id, name, materials, image, tone]): Product => ({
      id: `totem-${id}`,
      name: { en: `${name.en} Balanced Totem`, pt: `Totem Equilibrado ${name.pt}` },
      category: 'totem',
      pages: [Number(image.slice(1, 3))],
      size: 8,
      price: 79,
      materials: [...materials, 'Acrylic base'],
      description: {
        en: `Hand-balanced ${name.en.toLowerCase()} stones stacked on a clear acrylic base — eight inches of quiet equilibrium.`,
        pt: `Pedras naturais (${name.pt.toLowerCase()}) equilibradas à mão sobre uma base de acrílico transparente — oito polegadas de equilíbrio silencioso.`,
      },
      images: img(image),
      tone,
      featured: id === 'citrine-pyrite' || id === 'red-jasper' || id === 'green-quartz',
    }),
  ),

  // ——— 04 · Acrylic Box Sculptures ———
  ...(
    [
      ['sodalite-blue-agate', { en: 'Sodalite & Blue Agate', pt: 'Sodalita & Ágata Azul' }, ['Raw sodalite', 'Blue agate slice'], ['p21-2'], [21], PALETTE.indigo],
      ['black-stone-agate', { en: 'Black Stone & Agate Slice', pt: 'Pedras Pretas & Fatia de Ágata' }, ['Black stones', 'Grey agate slice'], ['p23-3'], [23], '#34322F'],
      ['rose-quartz-geode', { en: 'Rose Quartz & Geode', pt: 'Quartzo Rosa & Geodo' }, ['Rose quartz', 'Quartz geode'], ['p24-1'], [24], '#7A5B55'],
      ['honey-agate-slice', { en: 'Honey Agate Slice', pt: 'Fatia de Ágata Mel' }, ['Natural agate slice', 'Gold pin'], ['p24-2'], [24], '#8A6A44'],
      ['gold-plate-geode', { en: 'Gold Plate & Geode', pt: 'Placa Dourada & Geodo' }, ['Quartz geode', 'Gold-leaf plate'], ['p24-3'], [24], '#5C5248'],
      ['tigers-eye-tassel', { en: 'Tiger’s Eye & Gold Tassel', pt: 'Olho de Tigre & Borla Dourada' }, ['Tiger’s eye', 'Gold silk tassel'], ['p24-4'], [24], '#6E5232'],
      ['twin-totems-onyx', { en: 'Twin Onyx & Quartz', pt: 'Dupla de Ônix & Quartzo' }, ['Black onyx', 'Clear quartz', 'Gold pyrite'], ['p25-1'], [25], '#3A3836'],
      ['midnight-agate', { en: 'Midnight Agate & Sodalite', pt: 'Ágata Meia-Noite & Sodalita' }, ['Sodalite', 'Black agate slice'], ['p25-2'], [25], PALETTE.indigo],
      ['moonstone-geode', { en: 'White Stone & Geode Column', pt: 'Coluna de Pedras Brancas & Geodo' }, ['White stones', 'Quartz geode', 'Gold pin'], ['p25-3'], [25], '#5E5A55'],
      ['sodalite-pyrite', { en: 'Sodalite & Pyrite Column', pt: 'Coluna de Sodalita & Pirita' }, ['Raw sodalite', 'Pyrite'], ['p25-4'], [25], '#2F3A52'],
    ] as const
  ).map(
    ([id, name, materials, images, pages, tone], i): Product => ({
      id: `box-${id}`,
      name: { en: `${name.en} Acrylic Box`, pt: `Caixa de Acrílico ${name.pt}` },
      category: 'acrylic',
      pages: [...pages],
      price: 69,
      startingFrom: true,
      materials: [...materials, 'Acrylic vitrine'],
      description: {
        en: `${name.en} suspended on a gold pin inside a museum-clear acrylic box.`,
        pt: `${name.pt} — suspensão em haste dourada dentro de uma caixa de acrílico com transparência de museu.`,
      },
      images: img(...images),
      tone,
      featured: i === 1 || i === 3 || i === 7,
    }),
  ),
]

export const SIZES = [8, 46, 50, 67, 78, 90, 115]
export const PRICE_MIN = 69
export const PRICE_MAX = 459

export const PILLARS: L[] = [
  { en: 'Natural Agates', pt: 'Ágatas Naturais' },
  { en: 'Brazilian Artistry', pt: 'Arte Brasileira' },
  { en: 'Raw Crystals', pt: 'Cristais Brutos' },
  { en: 'Handwoven Fibers', pt: 'Fibras Tecidas à Mão' },
  { en: 'Timeless Minimalism', pt: 'Minimalismo Atemporal' },
  { en: 'Selenite & Gold', pt: 'Selenita & Ouro' },
  { en: 'One of a Kind', pt: 'Peças Únicas' },
]

export const productsBy = (c: CategoryId) => PRODUCTS.filter((p) => p.category === c)
