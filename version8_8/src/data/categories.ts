
export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export const categories: Category[] = [
  { id: "beach", name: "A pie de playa", icon: "https://a0.muscache.com/pictures/10ce1091-c854-40f3-a2fb-defc2995bcaf.jpg", slug: "playa" },
  { id: "iconic", name: "Iconos", icon: "https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg", slug: "iconos" },
  { id: "castles", name: "Castillos", icon: "https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg", slug: "castillos" },
  { id: "tiny", name: "Minicasas", icon: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg", slug: "minicasas" },
  { id: "famous", name: "Ciudades famosas", icon: "https://a0.muscache.com/pictures/ed8b9e47-609b-44c2-9768-33e6a22eccb2.jpg", slug: "ciudades-famosas" },
  { id: "piano", name: "Pianos de cola", icon: "https://a0.muscache.com/pictures/8eccb972-4bd6-43c5-ac83-27822c0d3dcd.jpg", slug: "pianos" },
  { id: "rural", name: "Casas rurales", icon: "https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg", slug: "rural" },
  { id: "cabins", name: "Cabañas", icon: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg", slug: "cabanas" },
  { id: "mansions", name: "Mansiones", icon: "https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg", slug: "mansiones" },
  { id: "dome", name: "Casas domo", icon: "https://a0.muscache.com/pictures/89faf9ae-bbbc-4bc4-aecd-cc15bf36cbca.jpg", slug: "domo" },
  { id: "tree", name: "Casas del árbol", icon: "https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg", slug: "arbol" },
  { id: "unique", name: "Singulares", icon: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg", slug: "singulares" },
];
