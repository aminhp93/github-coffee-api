export const getRequest = (token?: string, url?: string) => {
  if (!url) return null;
  if (token) {
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url,
    };
  }
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    url,
  };
};
