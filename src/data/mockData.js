export const categories = [
  "Freshwater",
  "Saltwater",
  "Aquascaping",
  "Planted Tank",
  "Fish Disease",
  "Equipment",
  "DIY",
  "Shrimp",
  "Breeding",
  "Beginner Help",
];

export const currentUser = {
  id: 1,
  name: "Maya Rivers",
  username: "maya_rivers",
  email: "maya@example.com",
  role: "Common User",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  bio: "Freshwater hobbyist keeping planted nano tanks, shrimp colonies, and peaceful community fish.",
  favoriteFish: "Honey gourami",
  location: "Yangon",
  joinedAt: "2026-01-18",
  stats: {
    posts: 18,
    comments: 126,
    followers: 42,
    following: 19,
  },
};

export const users = [
  currentUser,
  {
    id: 2,
    name: "Leo Tan",
    username: "reefleo",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    bio: "Reef keeper focused on beginner-friendly saltwater setups and stable water parameters.",
    favoriteFish: "Ocellaris clownfish",
    location: "Mandalay",
    joinedAt: "2025-11-02",
    stats: { posts: 32, comments: 284, followers: 118, following: 36 },
  },
  {
    id: 3,
    name: "Nora Chen",
    username: "nora_scapes",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    bio: "Aquascaper documenting low-tech planted tanks and trimming routines.",
    favoriteFish: "Celestial pearl danio",
    location: "Bago",
    joinedAt: "2025-09-14",
    stats: { posts: 27, comments: 190, followers: 96, following: 24 },
  },
];

export const posts = [
  {
    id: 101,
    title: "Is my 20 gallon planted tank ready for shrimp?",
    excerpt:
      "Cycle is complete, ammonia and nitrite are zero. I am checking whether the GH/KH range is safe before adding blue dreams.",
    content:
      "My 20 gallon planted tank has been running for six weeks. Ammonia and nitrite are zero, nitrate stays around 10 ppm, and the plants are finally putting out new growth. I want to add blue dream shrimp next week. Would you adjust GH/KH first, or is stability more important at this stage?",
    category: "Shrimp",
    tags: ["neocaridina", "cycling", "water-parameters"],
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80",
    authorId: 1,
    createdAt: "2026-07-06T10:30:00",
    likes: 24,
    bookmarked: true,
    locked: false,
    comments: [
      {
        id: 1,
        userId: 3,
        body: "Your nitrogen cycle sounds ready. I would make any mineral changes slowly and avoid chasing perfect numbers.",
        createdAt: "2026-07-06T11:04:00",
        replies: [
          {
            id: 11,
            userId: 1,
            body: "That makes sense. I will retest after a water change and keep the first group small.",
            createdAt: "2026-07-06T11:20:00",
          },
        ],
      },
    ],
  },
  {
    id: 102,
    title: "Simple hospital tank setup for treating ich",
    excerpt:
      "A quick checklist for a bare-bottom quarantine tank, heater placement, aeration, and avoiding medication in the display tank.",
    content:
      "For beginners, a hospital tank does not need to be fancy. Use a bare-bottom container or spare tank, heater, sponge filter or air stone, hiding place, and a separate net. Keep the water matched to the main tank and observe closely during treatment.",
    category: "Fish Disease",
    tags: ["ich", "quarantine", "beginner"],
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80",
    authorId: 2,
    createdAt: "2026-07-05T15:15:00",
    likes: 51,
    bookmarked: false,
    locked: false,
    comments: [
      {
        id: 2,
        userId: 1,
        body: "This is exactly the kind of checklist I wish I had during my first disease outbreak.",
        createdAt: "2026-07-05T16:10:00",
        replies: [],
      },
    ],
  },
  {
    id: 103,
    title: "Low-tech carpet alternatives that do not melt immediately",
    excerpt:
      "Comparing marsilea, dwarf sag, and crypt parva for tanks without CO2 injection.",
    content:
      "If you are not running CO2, avoid judging the tank by high-tech carpeting standards. Marsilea grows slowly but reliably, dwarf sag spreads faster with root tabs, and crypt parva is very steady once established.",
    category: "Planted Tank",
    tags: ["low-tech", "plants", "aquascaping"],
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    authorId: 3,
    createdAt: "2026-07-04T09:00:00",
    likes: 38,
    bookmarked: true,
    locked: false,
    comments: [],
  },
];

export const userById = (id) => users.find((user) => user.id === Number(id));

export const postsByUser = (id) =>
  posts.filter((post) => post.authorId === Number(id));

export const notifications = [
  {
    id: 1,
    type: "comment",
    actorId: 3,
    text: "commented on your shrimp cycling question",
    postId: 101,
    createdAt: "2026-07-08T19:30:00",
    unread: true,
  },
  {
    id: 2,
    type: "like",
    actorId: 2,
    text: "liked your planted tank update",
    postId: 101,
    createdAt: "2026-07-08T18:12:00",
    unread: true,
  },
  {
    id: 3,
    type: "reply",
    actorId: 3,
    text: "replied to your comment about stable GH/KH",
    postId: 101,
    createdAt: "2026-07-07T21:45:00",
    unread: false,
  },
  {
    id: 4,
    type: "follow",
    actorId: 2,
    text: "started following your tank journals",
    postId: null,
    createdAt: "2026-07-07T09:10:00",
    unread: false,
  },
];

export const communityStats = [
  { label: "Members", value: "12.8k" },
  { label: "Posts this week", value: "428" },
  { label: "Solved questions", value: "91%" },
];
