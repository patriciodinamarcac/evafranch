export type Property = {
  id: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  location: string;
  price: {
    clp: number;
    uf: number;
  };
  expenses: number;
  specs: {
    bedrooms: number;
    bathrooms: number;
    totalM2: number;
    usableM2: number;
    parking: number;
    yearBuilt: number;
  };
  featuresEs: string[];
  featuresEn: string[];
  descriptionEs: string;
  descriptionEn: string;
  images: string[];
  type: "apartment" | "house" | "office";
  status: "for-sale" | "for-rent" | "sold";
  link?: string;
};

export const properties: Property[] = [
  {
    id: "triplex-ines-suarez",
    titleEs: "Tríplex Inés de Suárez",
    titleEn: "Inés de Suárez Triplex",
    subtitleEs: "Con Quincho Privado",
    subtitleEn: "With Private Rooftop BBQ",
    location: "Providencia, Santiago",
    price: {
      clp: 298414483,
      uf: 7490,
    },
    expenses: 340000,
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      totalM2: 120,
      usableM2: 84,
      parking: 2,
      yearBuilt: 2018,
    },
    featuresEs: [
      "Azotea privada con quincho techado",
      "Terraza en primer nivel",
      "Balcón",
      "Piscina en edificio",
      "Gimnasio",
      "Conserjería 24/7",
      "Bodega interior",
      "Sala multiuso",
      "Estacionamientos de visitas",
    ],
    featuresEn: [
      "Private rooftop with covered BBQ area",
      "First-floor terrace",
      "Balcony",
      "Building swimming pool",
      "Gym",
      "24/7 concierge",
      "Interior storage",
      "Multipurpose room",
      "Visitor parking",
    ],
    descriptionEs:
      "Ubicado en uno de los sectores más cotizados de Providencia, a pasos del Parque Inés de Suárez y con excelente conexión a servicios, restaurantes y metro. Un tríplex de diseño que distribuye en tres niveles una propuesta de vida que equilibra comodidad, estética y ubicación privilegiada.",
    descriptionEn:
      "Located in one of the most sought-after areas of Providencia, steps from Parque Inés de Suárez with excellent access to services, restaurants, and the metro. A design triplex distributed across three levels, balancing comfort, aesthetics, and a privileged location.",
    images: [
      "/properties/triplex/main.jpg",
      "/properties/triplex/terraza.jpg",
      "/properties/triplex/vista.jpg",
      "/properties/triplex/living.jpg",
      "/properties/triplex/balcon.jpg",
      "/properties/triplex/salon.jpg",
      "/properties/triplex/edificio.jpg",
    ],
    type: "apartment",
    status: "for-sale",
    link: "https://www.remax.cl/es-cl/propiedades/departamento/venta/providencia/1028050230-2",
  },
];

export function formatPrice(clp: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}
