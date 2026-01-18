export const selectCartProducts = (state) =>
  state.cart.cartProducts;

export const selectProductById = (state, productId) =>
  state.cart.cartProducts[productId];

export const selectProductTotal = (state, productId) => {
  const product = state.cart.cartProducts[productId];
  if (!product) return 0;
  return product.price * product.quantity;
};