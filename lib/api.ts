export async function fetcher(url: string, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
    return response.json();
  }
  