import { useEffect } from 'react';

const BASE_URL = 'https://gt-clothinghub.vercel.app';

export default function SEO({ title, description, keywords, image, path, schema }) {
  useEffect(() => {
    const defaultTitle = 'GT CLOTHING HUB | Modern Streetwear & Graphic T-Shirts';
    const defaultDesc = 'Discover premium 240 GSM heavyweight streetwear, graphic drop t-shirts, oversized boxy tees, and everyday staples. Crafted in India.';
    const defaultImage = `${BASE_URL}/og-image.jpg`;
    
    // Page Title
    document.title = title ? `${title} | GT CLOTHING HUB` : defaultTitle;

    // Canonical Link
    const currentPath = path || window.location.pathname;
    const canonicalUrl = `${BASE_URL}${currentPath}`;
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // Meta Helper Function
    const setMeta = (attrName, attrVal, contentVal) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Standard Meta
    setMeta('name', 'description', description || defaultDesc);
    if (keywords) setMeta('name', 'keywords', keywords);

    // OpenGraph Meta
    setMeta('property', 'og:site_name', 'GT CLOTHING HUB');
    setMeta('property', 'og:title', title ? `${title} | GT CLOTHING HUB` : defaultTitle);
    setMeta('property', 'og:description', description || defaultDesc);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', schema ? 'product' : 'website');
    setMeta('property', 'og:image', image || defaultImage);

    // Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title ? `${title} | GT CLOTHING HUB` : defaultTitle);
    setMeta('name', 'twitter:description', description || defaultDesc);
    setMeta('name', 'twitter:image', image || defaultImage);

    // JSON-LD Structured Data
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      // Provide Organization / WebSite default schema
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GT CLOTHING HUB',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: ['https://github.com/Code-With-Govind'],
      });
    }

  }, [title, description, keywords, image, path, schema]);

  return null;
}

