import { siteConfig, sameAs, skills, education, experience } from "@/lib/site";
import type { PostMeta } from "@/lib/blog";

// schema.org Person — helps Google associate the site with you as an entity.
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.summary,
    email: `mailto:${siteConfig.email}`,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location,
    },
    worksFor: { "@type": "Organization", name: experience[0]?.company },
    alumniOf: education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    knowsAbout: skills.flatMap((g) => g.items),
    sameAs,
  };
}

// schema.org WebSite — declares the canonical site and its name, and
// registers the on-site search (BlogExplorer, wired to read ?q=) so Google
// can offer a Sitelinks Search Box.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    author: { "@type": "Person", name: siteConfig.fullName },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// schema.org BlogPosting — makes individual posts eligible for rich results.
export function blogPostingSchema(post: PostMeta) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    image: `${url}/opengraph-image`,
    author: {
      "@type": "Person",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  };
}

// schema.org BreadcrumbList — surfaces the page's place in the site
// hierarchy in search results. `items` is home-to-current, in order.
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Renders a JSON-LD object as a <script> tag (use inside a component).
export function jsonLdProps(data: object) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
