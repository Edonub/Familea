
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
