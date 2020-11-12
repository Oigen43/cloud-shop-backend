export const validationPassed = (body) => {
  const {
    description,
    title,
    price,
    count,
  } = body;

  return !(
    typeof description !== 'string'
    || typeof title !== 'string'
    || typeof price !== 'number'
    || typeof count !== 'number');
};
