type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={className ? `brand-logo-image ${className}` : "brand-logo-image"}
      src="/reference-assets/images/kapten-batik-logo-live.png"
    />
  );
}
