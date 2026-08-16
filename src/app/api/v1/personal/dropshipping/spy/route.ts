import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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
      products: realProducts
    });

  } catch (error: any) {
    console.error('Error fetching live store spy data:', error);
    return NextResponse.json({
      error: 'Failed to inspect store. Ensure domain is a valid Shopify store.',
      message: error.message
    }, { status: 500 });
  }
}
