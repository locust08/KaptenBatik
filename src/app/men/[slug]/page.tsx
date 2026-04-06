import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenProductDetailPage } from "@/components/men-product-detail-page";
import { getMenProductDetail, menProductSlugs } from "@/data/men-product-details";

type MenProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return menProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MenProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMenProductDetail(slug);

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

export default async function MenProductPage({ params }: MenProductPageProps) {
  const { slug } = await params;
  const product = getMenProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <MenProductDetailPage product={product} />;
}
