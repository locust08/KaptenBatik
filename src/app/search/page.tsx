import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { collectionOrder, collections, type CollectionKey, type CollectionPerson } from "@/data/collection-content";

type SearchPageProps = {
  searchParams: Promise<{
    collection?: string;
  }>;
};

type ClothItem = {
  collectionKey: CollectionKey;
  href: string;
  label: string;
};

function createPersonHref(collectionKey: CollectionKey, person: CollectionPerson) {
  if (person.detailPath) {
    return person.detailPath;
  }

  return `/?collection=${collectionKey}#collection`;
}

function isCollectionKey(value: string | undefined): value is CollectionKey {
  return value === "men" || value === "women" || value === "junior";
}

function buildClothItems(): ClothItem[] {
  return collectionOrder.flatMap((collectionKey) =>
    collections[collectionKey].people.map((person) => ({
      collectionKey,
      href: createPersonHref(collectionKey, person),
      label: person.name,
    })),
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const activeFilter = isCollectionKey(params.collection) ? params.collection : null;
  const clothItems = buildClothItems();
  const results = activeFilter
    ? clothItems.filter((item) => item.collectionKey === activeFilter)
    : clothItems;

  return (
    <main className="collection-page">
      <SiteHeader logoHref="/" />

      <section className="search-page">
        <div className="search-page-inner">
          <p className="search-page-eyebrow">Browse by Collection</p>
          <h1 className="search-page-title">All Clothes</h1>
          <p className="search-page-copy">
            Browse every cloth name first, or filter the list by Men, Women, or Junior.
          </p>

          <div className="search-page-filters" aria-label="Collection filters">
            {collectionOrder.map((collectionKey) => (
              <Link
                className={`search-page-filter ${activeFilter === collectionKey ? "is-active" : ""}`}
                href={`/search?collection=${collectionKey}`}
                key={collectionKey}
              >
                {collections[collectionKey].label}
              </Link>
            ))}
          </div>

          <p className="search-page-summary">
            {activeFilter
              ? `${results.length} ${collections[activeFilter].label.toLowerCase()} items`
              : `${results.length} total items shown before filtering`}
          </p>

          <div className="search-page-results is-compact">
            {results.map((item) => (
              <Link className="search-page-card is-compact" href={item.href} key={`${item.collectionKey}-${item.label}`}>
                <span className="search-page-card-meta">{collections[item.collectionKey].label}</span>
                <h2>{item.label}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
