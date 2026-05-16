import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://mydriveease.in';
const BRAND = 'DriveEase';

const seoByPath = {
  '/': {
    title: 'DriveEase - Hire Trusted Drivers Online in India',
    description:
      'Book verified professional drivers for local, hourly, outstation, and travel partner rides with DriveEase.',
  },
  '/hire-driver': {
    title: 'Hire a Driver Online - DriveEase',
    description:
      'Hire trained drivers for hourly, full-day, local, and outstation travel with simple booking and support.',
  },
  '/login': {
    title: 'Customer Login - DriveEase',
    description: 'Login to your DriveEase customer account to book and track rides.',
    noindex: true,
  },
  '/signup': {
    title: 'Customer Signup - DriveEase',
    description: 'Create a DriveEase account and book trusted drivers online.',
  },
  '/driver/login': {
    title: 'Driver Login - DriveEase',
    description: 'Driver login for DriveEase ride requests, earnings, and profile management.',
    noindex: true,
  },
  '/fleet/login': {
    title: 'Travel Partner Login - DriveEase',
    description: 'Travel partner login for fleet bookings, cab availability, and accepted rides.',
    noindex: true,
  },
  '/fleet/signup': {
    title: 'Travel Partner Signup - DriveEase',
    description: 'Register as a DriveEase travel partner and receive verified customer booking requests.',
  },
  '/drivers': {
    title: 'Verified Drivers - DriveEase',
    description: 'Find verified DriveEase drivers for safe local and outstation travel.',
  },
  '/book': {
    title: 'Book a Driver - DriveEase',
    description: 'Book a trusted driver with pickup, destination, fare estimate, and ride tracking.',
  },
  '/plans': {
    title: 'DriveEase Plans and Pricing',
    description: 'Compare DriveEase plans for priority booking, driver quality, and ride savings.',
  },
  '/insurance': {
    title: 'DriveEase Ride Coverage',
    description: 'Learn about DriveEase ride coverage and safer driver booking support.',
  },
  '/faqs': {
    title: 'DriveEase FAQs',
    description: 'Answers to common questions about DriveEase driver booking and support.',
  },
  '/terms': {
    title: 'Terms and Conditions - DriveEase',
    description: 'Read DriveEase terms and conditions for customers, drivers, and travel partners.',
  },
  '/privacy': {
    title: 'Privacy Policy - DriveEase',
    description: 'Read how DriveEase handles customer, driver, and booking data.',
  },
  '/payment': {
    title: 'Payments - DriveEase',
    description: 'Manage DriveEase ride payments and payment proof uploads.',
    noindex: true,
  },
  '/my-rides': {
    title: 'My Trips - DriveEase',
    description: 'View your DriveEase trip history and booking status.',
    noindex: true,
  },
  '/profile': {
    title: 'My Profile - DriveEase',
    description: 'Manage your DriveEase customer profile.',
    noindex: true,
  },
};

const getRouteSeo = (pathname) => {
  if (seoByPath[pathname]) return seoByPath[pathname];
  if (pathname.startsWith('/driver')) {
    return {
      title: 'Driver Dashboard - DriveEase',
      description: 'DriveEase driver dashboard for ride requests, trip history, and earnings.',
      noindex: true,
    };
  }
  if (pathname.startsWith('/fleet')) {
    return {
      title: 'Travel Partner Dashboard - DriveEase',
      description: 'DriveEase travel partner dashboard for bookings, cabs, and fleet operations.',
      noindex: true,
    };
  }
  if (pathname.startsWith('/track') || pathname.startsWith('/rate')) {
    return {
      title: 'Ride Status - DriveEase',
      description: 'Track or rate your DriveEase ride.',
      noindex: true,
    };
  }
  return seoByPath['/'];
};

const setMeta = (selector, attrs) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attrs.base || {}).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  Object.entries(attrs.values).forEach(([key, value]) => element.setAttribute(key, value));
};

const setLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const cleanPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
    const seo = getRouteSeo(cleanPath);
    const canonical = `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
    const title = seo.title.includes(BRAND) ? seo.title : `${seo.title} | ${BRAND}`;
    const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow';

    document.title = title;
    document.documentElement.lang = 'en-IN';

    setMeta('meta[name="description"]', {
      base: { name: 'description' },
      values: { content: seo.description },
    });
    setMeta('meta[name="robots"]', {
      base: { name: 'robots' },
      values: { content: robots },
    });
    setMeta('meta[property="og:title"]', {
      base: { property: 'og:title' },
      values: { content: title },
    });
    setMeta('meta[property="og:description"]', {
      base: { property: 'og:description' },
      values: { content: seo.description },
    });
    setMeta('meta[property="og:url"]', {
      base: { property: 'og:url' },
      values: { content: canonical },
    });
    setMeta('meta[name="twitter:title"]', {
      base: { name: 'twitter:title' },
      values: { content: title },
    });
    setMeta('meta[name="twitter:description"]', {
      base: { name: 'twitter:description' },
      values: { content: seo.description },
    });
    setLink('canonical', canonical);

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: BRAND,
      url: SITE_URL,
      telephone: '+917007515654',
      areaServed: 'India',
      description: seoByPath['/'].description,
      sameAs: ['https://www.instagram.com/mydriveease', 'https://wa.me/917007515654'],
    };

    let script = document.head.querySelector('#driveease-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'driveease-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [location.pathname]);

  return null;
}
