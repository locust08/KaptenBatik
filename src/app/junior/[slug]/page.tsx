import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JuniorProductDetailPage } from "@/components/junior-product-detail-page";
import {
  getJuniorProductDetail,
  juniorProductSlugs,
} from "@/data/junior-product-details";

type JuniorProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return juniorProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: JuniorProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getJuniorProductDetail(slug);

  if (!product) {
    return {
      title: "Junior Collection | Kapten Batik",
    };
  }

  return {
    title: `${product.title} | Kapten Batik`,
    description: product.description[0],
  };
}

export default async function JuniorProductPage({ params }: JuniorProductPageProps) {
  const { slug } = await params;
  const product = getJuniorProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <JuniorProductDetailPage product={product} />;
}
