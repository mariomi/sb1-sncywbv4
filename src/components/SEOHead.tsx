import { Helmet } from 'react-helmet-async';
import { useLanguage, type Language } from '../lib/i18n';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
  availableLanguages?: Language[];
}

const BASE_URL = 'https://www.ristorantealgobbodirialto.it';
const DEFAULT_IMAGE = `${BASE_URL}/images/hero/al-gobbo-rialto.jpg`;
const SITE_NAME = 'Ristorante Al Gobbo di Rialto';
const DEFAULT_DESCRIPTION = 'Authentic Venetian cuisine near Rialto Bridge in Venice. Seafood, traditional recipes and family hospitality since 1955. Book your table online.';
const LOCALES: Record<Language, string> = {
  en: 'en_GB',
  it: 'it_IT',
  fr: 'fr_FR',
  de: 'de_DE',
  es: 'es_ES',
};

export function SEOHead({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  structuredData,
  availableLanguages = ['en', 'it', 'fr', 'de', 'es'],
}: SEOHeadProps) {
  const { language } = useLanguage();
  const effectiveLanguage = availableLanguages.includes(language) ? language : availableLanguages[0];
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Cucina Veneziana dal 1955 – Venezia`;

  const canonicalPath = canonical || '/';
  const canonicalBase = `${BASE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;
  const canonicalUrl = effectiveLanguage === 'en' ? canonicalBase : `${canonicalBase}?lang=${effectiveLanguage}`;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet htmlAttributes={{ lang: effectiveLanguage }}>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />
      {availableLanguages.map(locale => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={locale === 'en' ? canonicalBase : `${canonicalBase}?lang=${locale}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalBase} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Ristorante Al Gobbo di Rialto in Venice" />
      <meta property="og:locale" content={LOCALES[effectiveLanguage]} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
