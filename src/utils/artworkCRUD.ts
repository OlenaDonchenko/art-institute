// fetch all by page and limit
export const fetchAll = async (
  setIsLoading: Function,
  setError: Function,
  API_URL: string,
  pageN: number,
  setArtworks: Function
) => {
  setIsLoading(true);
  setError(null);

  try {
    const res = await fetch(
      `${API_URL}?has_image=1&limit=10&skip=${(pageN - 1) * 10}`
    );

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    setArtworks(data.data ?? []);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    setError('Failed to load artworks. Please try again later.');
  } finally {
    setIsLoading(false);
  }
};
