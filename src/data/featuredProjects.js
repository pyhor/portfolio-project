const base = import.meta.env.BASE_URL

export const FEATURED_PROJECTS = [
  {
    id: 'hotel-website-2023',
    titleKey: 'proj_hotel_title',
    metaKey: 'proj_hotel_meta',
    descKey: 'proj_hotel_desc',
    contribKey: 'proj_hotel_contrib',
    techKey: 'proj_hotel_tech',
    githubUrl: 'https://github.com/pyhor/hotel-website-2023',
    liveUrl: 'https://pyhor.github.io/hotel-website-2023/',
    media: [
      `${base}image/hotel-website-2023/home-page.jpeg`,
      `${base}image/hotel-website-2023/events.jpeg`,
      `${base}image/hotel-website-2023/faqs.jpeg`,
      `${base}image/hotel-website-2023/homepage-demo.gif`,
      `${base}image/hotel-website-2023/event-demo.gif`,
      `${base}image/hotel-website-2023/faq-demo.gif`,
    ],
  },
  {
    id: 'cinema-mgmt-system-2020',
    titleKey: 'proj_cinema_title',
    metaKey: 'proj_cinema_meta',
    descKey: 'proj_cinema_desc',
    contribKey: 'proj_cinema_contrib',
    techKey: 'proj_cinema_tech',
    githubUrl: 'https://github.com/pyhor/cinema-mgmt-system-2020',
    liveUrl: null,
    media: [
      `${base}image/cinema-mgmt-system-2020/Customer Registration Form.png`,
      `${base}image/cinema-mgmt-system-2020/Customer Login Form.png`,
      `${base}image/cinema-mgmt-system-2020/File Import Program-Script.png`,
    ],
  },
]
