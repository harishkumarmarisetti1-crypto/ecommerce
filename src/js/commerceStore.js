const CART_KEY = "remarket_cart";
const WISHLIST_KEY = "remarket_wishlist";
const ORDERS_KEY = "remarket_orders";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
export const loadCart = () => read(CART_KEY, {});
export const loadWishlist = () => read(WISHLIST_KEY, []);
export const loadOrders = () => read(ORDERS_KEY, []);
export const saveCart = (cart) =>
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
export const saveWishlist = (wishlist) =>
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
export const saveOrders = (orders) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
