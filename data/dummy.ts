export type Property = {
  id: string;
  title: string;
  address: string;
  price: number;
  images: string[];
  status: 'published' | 'draft' | 'closed';
  rooms: number;
  rating?: number;
  city?: string;
  shortDesc?: string;
  description?: string;
};

/* Dummy user */
export const dummyUser = {
  id: 'u_1',
  name: 'Robert A. Onyango',
  email: 'owner@example.com',
  avatar: '',
  role: 'owner'
};

export const dummyProperties: Property[] = [
  {
    id: 'p_1',
    title: 'Kitwa Suites — A Modern African Retreat',
    address: 'Juja Rd, Nairobi, Kenya',
    price: 85,
    images: [
      '/property5.jpg',
      '/property3.jpeg'
    ],
    status: 'published',
    rooms: 2,
    rating: 4.6,
    city: 'Nairobi',
    shortDesc: "This is a mistake. What if document.referrer had an apostrophe in?",
    description: "This is a mistake. What if document.referrer had an apostrophe in? Or various other characters that have special meaning in HTML. In the worst case, attacker code in the referrer could inject JavaScript into your page, which is a XSS security hole."
  },
  {
    id: 'p_2',
    title: 'Serene Studio in CBD',
    address: 'Central Business District, Nairobi',
    price: 55,
    images: ['/property2.jpeg'],
    status: 'draft',
    rooms: 1,
    rating: 4.1,
    city: 'Nairobi',
        shortDesc: "This is a mistake. What if document.referrer had an apostrophe in?",
    description: "This is a mistake. What if document.referrer had an apostrophe in? Or various other characters that have special meaning in HTML. In the worst case, attacker code in the referrer could inject JavaScript into your page, which is a XSS security hole."
  },
  {
    id: 'p_3',
    title: 'Ocean View Apartment',
    address: 'Mombasa Beachfront',
    price: 120,
    images: ['/property1.jpeg'],
    status: 'closed',
    rooms: 3,
    rating: 4.8,
    city: 'Mombasa',
        shortDesc: "This is a mistake. What if document.referrer had an apostrophe in?",
    description: "This is a mistake. What if document.referrer had an apostrophe in? Or various other characters that have special meaning in HTML. In the worst case, attacker code in the referrer could inject JavaScript into your page, which is a XSS security hole."
  }
];
