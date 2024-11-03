export const FMarketUrls: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any[]) => string;
} = {
  getNavHistory: () => `/res/product/get-nav-history`,
  // https://api.fmarket.vn/res/products/filter
  filterProducts: () => `/res/products/filter`,
};
