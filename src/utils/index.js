export const transformCapitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const formatArea = (area) => {
  const [head, tail] = area.split(" - ");
  return `${head} - ${tail.toLowerCase()}`;
};
