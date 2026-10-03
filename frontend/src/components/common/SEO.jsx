import { useEffect } from 'react';

export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    const defaultTitle = 'GT CLOTHING HUB - Premium Print-On-Demand Graphic Tees';
    document.title = title ? `${title} | GT CLOTHING HUB` : defaultTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Discover premium streetwear, heavyweight graphic t-shirts, and anime drop merchandise printed on demand.');
    }
  }, [title, description, keywords]);

  return null;
}
