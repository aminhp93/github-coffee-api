export const getRequest = (token: string, url?: string) => {
  if (!url) return null;
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    url,
  };
};
