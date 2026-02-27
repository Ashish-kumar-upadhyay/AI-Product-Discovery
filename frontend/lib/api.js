const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000";

export async function fetchProducts({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const url =
    params.toString().length > 0
      ? `${BASE_URL}/api/products?${params.toString()}`
      : `${BASE_URL}/api/products`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products || [];
}

export async function askAI(query) {
  const res = await fetch(`${BASE_URL}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "AI request failed");
  }
  return data;
}

