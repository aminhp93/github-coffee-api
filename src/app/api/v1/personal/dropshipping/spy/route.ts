import { NextResponse } from 'next/server';

// Real revenue/traffic estimate via Apify "Shopify Store Analyzer" actor
// (apivault_labs/shopify-store-analyzer, $7/1000 stores, https://apify.com/apivault_labs/shopify-store-analyzer).
// This replaces the previous domain-checksum formula. If APIFY_API_TOKEN is not
// configured, or the actor call fails, we report `available: false` instead of
// fabricating numbers.
async function fetchApifyRevenueEstimate(domainHost: string, includeRaw: boolean) {
  const apifyToken = process.env.APIFY_API_TOKEN;
  if (!apifyToken) {
    return { available: false, reason: 'APIFY_API_TOKEN chưa được cấu hình trên server' };
  }

  try {
    const actorId = 'apivault_labs~shopify-store-analyzer';
    const apifyRes = await fetch(
      `https://api.apify.com/v2/actors/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(apifyToken)}&timeout=90`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'analyze',
          storeUrls: [`https://${domainHost}`],
          conversionRate: 2.4,
          productSampleSize: 0,
          extractTraffic: true,
          extractRevenueEstimate: true,
          extractTechStack: false,
          extractProducts: false,
        }),
      }
    );

    if (!apifyRes.ok) {
      return { available: false, reason: `Apify API trả lỗi HTTP ${apifyRes.status}` };
    }

    const items = await apifyRes.json();
    const item = Array.isArray(items) ? items[0] : null;
    if (!item) {
      return { available: false, reason: 'Apify không trả về dữ liệu cho domain này (có thể không phải Shopify store)' };
    }

    // Field names are best-effort mapped from Apify's documented schema; the
    // actor may rename fields over time, so we fall back across a couple of
    // plausible variants and surface `raw` (via ?debug=1) to re-map if needed.
    const monthlyRevenueUsd =
      item?.revenue_estimate?.monthly_revenue_usd_est ??
      item?.revenueEstimate?.monthlyRevenueUsd ??
      null;
    const annualRevenueUsd =
      item?.revenue_estimate?.annualized_revenue_usd_est ??
      item?.revenueEstimate?.annualRevenueUsd ??
      (typeof monthlyRevenueUsd === 'number' ? monthlyRevenueUsd * 12 : null);
    const monthlyVisits =
      item?.traffic?.monthly_visits ??
      item?.traffic?.monthlyVisits ??
      null;
    const globalRank =
      item?.traffic?.global_rank ??
      item?.traffic?.globalRank ??
      null;
    const trafficSources =
      item?.traffic?.traffic_sources ??
      item?.traffic?.trafficSources ??
      null;

    if (monthlyRevenueUsd == null && monthlyVisits == null) {
      return {
        available: false,
        reason: 'Apify trả về dữ liệu nhưng thiếu trường revenue/traffic (schema actor có thể đã đổi)',
        raw: includeRaw ? item : undefined,
      };
    }

    return {
      available: true,
      source: 'apify:apivault_labs/shopify-store-analyzer',
      monthlyRevenueUsd,
      annualRevenueUsd,
      monthlyVisits,
      globalRank,
      trafficSources,
      raw: includeRaw ? item : undefined,
    };
  } catch (error: any) {
    console.warn(`Apify revenue estimate failed for ${domainHost}`, error);
    return { available: false, reason: error?.message || 'Apify request failed' };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeRaw = searchParams.get('debug') === '1';
  let rawDomain = searchParams.get('domain') || searchParams.get('url') || '';

  if (!rawDomain) {
    return NextResponse.json({ error: 'Domain or URL parameter is required' }, { status: 400 });
  }

  // Clean domain string
  rawDomain = rawDomain.trim().toLowerCase();
  if (!rawDomain.startsWith('http://') && !rawDomain.startsWith('https://')) {
    rawDomain = `https://${rawDomain}`;
  }

  try {
    const urlObj = new URL(rawDomain);
    const domainHost = urlObj.hostname;

    // 1. Live Fetch Target Store Homepage HTML
    const storeRes = await fetch(`https://${domainHost}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    const htmlText = storeRes.ok ? await storeRes.text() : '';

    // Detect Theme Name
    let themeName = 'Standard Shopify Theme';
    const themeNameMatch = htmlText.match(/Shopify\.theme\s*=\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i) ||
                           htmlText.match(/booster-theme/i) ||
                           htmlText.match(/cdn\.shopify\.com\/s\/files\/[^"']+\/themes\/[0-9]+\/assets\/([^"'?#]+)/i);
    
    if (htmlText.includes('Dawn') || htmlText.includes('dawn.css')) themeName = 'Dawn Theme (Official)';
    else if (htmlText.includes('Impulse') || htmlText.includes('impulse.css')) themeName = 'Impulse Theme (Premium)';
    else if (htmlText.includes('Prestige') || htmlText.includes('prestige.css')) themeName = 'Prestige Theme (Luxury)';
    else if (htmlText.includes('Motion') || htmlText.includes('motion.css')) themeName = 'Motion Theme';
    else if (themeNameMatch && themeNameMatch[1]) themeName = themeNameMatch[1];

    // Detect Installed Apps
    const detectedApps: string[] = [];
    if (/loox\.io|loox_reviews/i.test(htmlText)) detectedApps.push('Loox Photo Reviews');
    if (/judgeme|judge\.me/i.test(htmlText)) detectedApps.push('Judge.me Product Reviews');
    if (/klaviyo/i.test(htmlText)) detectedApps.push('Klaviyo Email Marketing');
    if (/pagefly/i.test(htmlText)) detectedApps.push('PageFly Page Builder');
    if (/gempages/i.test(htmlText)) detectedApps.push('GemPages Landing Page');
    if (/dsers/i.test(htmlText)) detectedApps.push('DSers Dropshipping App');
    if (/recharge/i.test(htmlText)) detectedApps.push('Recharge Subscriptions');
    if (/vitals/i.test(htmlText)) detectedApps.push('Vitals All-in-One');
    if (/tidio/i.test(htmlText)) detectedApps.push('Tidio Live Chat');
    if (/yotpo/i.test(htmlText)) detectedApps.push('Yotpo Product Reviews');
    if (/privy/i.test(htmlText)) detectedApps.push('Privy Popups');

    // Detect Pixel IDs
    const metaPixelMatch = htmlText.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]([0-9]+)['"]/i) || htmlText.match(/connect\.facebook\.net/i);
    const metaPixelId = metaPixelMatch && metaPixelMatch[1] ? metaPixelMatch[1] : (htmlText.includes('facebook') ? 'Detected (Active)' : 'Not Found');

    const tiktokPixelMatch = htmlText.match(/ttq\.load\s*\(\s*['"]([A-Z0-9]+)['"]/i);
    const tiktokPixelId = tiktokPixelMatch && tiktokPixelMatch[1] ? tiktokPixelMatch[1] : (htmlText.includes('tiktok') ? 'Detected (Active)' : 'Not Found');

    // 2. Live Fetch Public Shopify Products Endpoint (/products.json)
    let realProducts: any[] = [];
    try {
      const productsRes = await fetch(`https://${domainHost}/products.json?limit=50`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        if (prodData && Array.isArray(prodData.products)) {
          realProducts = prodData.products.map((p: any) => {
            const firstVariant = p.variants?.[0] || {};
            const price = parseFloat(firstVariant.price) || 0;
            const comparePrice = parseFloat(firstVariant.compare_at_price) || 0;
            const image = p.images?.[0]?.src || '';

            return {
              id: p.id,
              title: p.title,
              handle: p.handle,
              vendor: p.vendor,
              product_type: p.product_type,
              price: price,
              compare_at_price: comparePrice,
              est_cogs: (price * 0.25).toFixed(2), // Estimated 25% COGS benchmark
              margin: price > 0 ? `${Math.round(((price - price * 0.25) / price) * 100)}%` : 'N/A',
              created_at: p.created_at,
              published_at: p.published_at,
              tags: p.tags,
              image: image,
              url: `https://${domainHost}/products/${p.handle}`
            };
          });
        }
      }
    } catch (e) {
      console.warn(`Could not fetch products.json for ${domainHost}`, e);
    }

    // Calculate Real Pricing Analytics
    const prices = realProducts.map(p => p.price).filter(p => p > 0);
    const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 'N/A';
    const minPrice = prices.length ? Math.min(...prices).toFixed(2) : 'N/A';
    const maxPrice = prices.length ? Math.max(...prices).toFixed(2) : 'N/A';

    // 3. Revenue/Traffic estimate from a real third-party panel (Apify), not a
    // fabricated formula. See fetchApifyRevenueEstimate() above.
    const revenueEstimate = await fetchApifyRevenueEstimate(domainHost, includeRaw);

    return NextResponse.json({
      success: true,
      domain: domainHost,
      isShopify: realProducts.length > 0 || htmlText.includes('Shopify'),
      theme: themeName,
      metaPixel: metaPixelId,
      tiktokPixel: tiktokPixelId,
      apps: detectedApps,
      metrics: {
        totalProducts: realProducts.length,
        avgPrice: avgPrice,
        priceRange: `$${minPrice} - $${maxPrice}`,
        newestProductDate: realProducts[0]?.created_at ? new Date(realProducts[0].created_at).toLocaleDateString() : 'N/A'
      },
      products: realProducts,
      revenueEstimate
    });

  } catch (error: any) {
    console.error('Error fetching live store spy data:', error);
    return NextResponse.json({
      error: 'Failed to inspect store. Ensure domain is a valid Shopify store.',
      message: error.message
    }, { status: 500 });
  }
}
