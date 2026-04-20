import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey || apiKey === "your_serpapi_key_here") {
      console.warn("SerpApi key not found, using mock data.");
      return NextResponse.json(getMockData(query));
    }

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
        query
      )}&api_key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SerpApi error:", response.status, errorText);
      
      if (response.status === 401 || response.status === 403) {
        console.warn("Invalid API key, falling back to mock data.");
        return NextResponse.json(getMockData(query));
      }
      
      throw new Error(`Failed to fetch from SerpApi: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("SerpApi response data keys:", Object.keys(data));
    const normalizedData = normalizeSerpApiData(query, data);

    return NextResponse.json(normalizedData);
  } catch (error: any) {
    console.error("Error fetching comparison data:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison data", details: error.message },
      { status: 500 }
    );
  }
}

function normalizeSerpApiData(query: string, data: any) {
  const shoppingResults = data.shopping_results || [];

  const results = shoppingResults.map((item: any) => ({
    store: item.source || "Unknown Store",
    price: item.price || "N/A",
    rating: item.rating ? `${item.rating}/5` : "N/A",
    delivery: item.delivery || "Check site",
    link: item.link || "#",
    thumbnail: item.thumbnail || "",
  }));

  // Simple logic to find best, cheapest, etc.
  const prices = results
    .map((r: any) => parseFloat(r.price.replace(/[^0-9.]/g, "")))
    .filter((p: any) => !isNaN(p));
  
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const cheapest = results.find((r: any) => 
    parseFloat(r.price.replace(/[^0-9.]/g, "")) === minPrice
  );

  return {
    product: query,
    results: results.slice(0, 10), // Limit to top 10
    best_deal: cheapest?.store || "N/A",
    price_savings: prices.length > 1 ? `$${(maxPrice - minPrice).toFixed(2)}` : "$0",
    recommendation: cheapest 
      ? `We recommend buying from ${cheapest.store} at ${cheapest.price} for the best price.`
      : "No clear recommendation available."
  };
}

function getMockData(query: string) {
  return {
    product: query,
    results: [
      {
        store: "Amazon",
        price: "$299.99",
        rating: "4.5/5",
        delivery: "2-day shipping",
        link: "https://amazon.com",
        thumbnail: "https://placehold.co/100x100?text=Amazon"
      },
      {
        store: "Best Buy",
        price: "$310.00",
        rating: "4.7/5",
        delivery: "Free shipping",
        link: "https://bestbuy.com",
        thumbnail: "https://placehold.co/100x100?text=BestBuy"
      },
      {
        store: "Walmart",
        price: "$285.50",
        rating: "4.2/5",
        delivery: "3-day shipping",
        link: "https://walmart.com",
        thumbnail: "https://placehold.co/100x100?text=Walmart"
      }
    ],
    best_deal: "Walmart",
    price_savings: "$24.50",
    recommendation: `Walmart offers the lowest price for ${query} with a saving of $24.50 compared to the highest price.`
  };
}
