import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WomenProductDetailPage } from "@/components/women-product-detail-page";
import { getWomenProductDetail, womenProductSlugs } from "@/data/women-product-details";

export const dynamic = "force-dynamic";

type WomenProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return womenProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WomenProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getWomenProductDetail(slug);

  if (!product) {
    return {
      title: "Product Not Found | Kapten Batik",
    };
  }

  return {
    title: `${product.title} | Kapten Batik`,
    description: product.description[0],
  };
}

export default async function WomenProductPage({ params }: WomenProductPageProps) {
  const { slug } = await params;
  const product = getWomenProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <WomenProductDetailPage product={product} />;
}
