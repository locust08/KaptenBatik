import type { ReactNode } from "react";
import styles from "./product-detail-mobile-accordions.module.css";

type WhyLoveItem = {
  description: string;
  title: string;
};

type ProductDetailMobileAccordionsProps = {
  careNotes: string[];
  description: string[];
  whyLove: WhyLoveItem[];
};

type AccordionSection = {
  content: ReactNode;
  defaultOpen?: boolean;
  key: string;
  label: string;
};

export function ProductDetailMobileAccordions({
  careNotes,
  description,
  whyLove,
}: ProductDetailMobileAccordionsProps) {
  const sections: AccordionSection[] = [];

  if (description.length) {
    sections.push({
      content: description.map((paragraph) => <p key={paragraph}>{paragraph}</p>),
      defaultOpen: true,
      key: "description",
      label: "Description",
    });
  }

  if (whyLove.length) {
    sections.push({
      content: (
        <div className={styles.whyList}>
          {whyLove.map((item) => (
            <div className={styles.whyItem} key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ),
      key: "why-love",
      label: "Why You'll Love It",
    });
  }

  if (careNotes.length) {
    sections.push({
      content: (
        <ul>
          {careNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ),
      key: "care-notes",
      label: "Care Notes",
    });
  }

  if (!sections.length) {
    return null;
  }

  return (
    <div aria-label="Product details" className={styles.root}>
      {sections.map((section) => (
        <details className={styles.section} key={section.key} open={section.defaultOpen || undefined}>
          <summary className={styles.summary}>
            <span>{section.label}</span>
            <span aria-hidden="true" className={styles.icon}>
              +
            </span>
          </summary>
          <div className={styles.content}>{section.content}</div>
        </details>
      ))}
    </div>
  );
}
