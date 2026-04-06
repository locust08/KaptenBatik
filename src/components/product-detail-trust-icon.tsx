type ProductDetailTrustIconProps = {
  title: string;
};

function SecureCheckoutIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.5L18 6V11C18 15.02 15.55 18.47 12 20C8.45 18.47 6 15.02 6 11V6L12 3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.3 11.95L11.1 13.75L14.8 10.05"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 4.75H13.75L17 8V18.25H7V4.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M13.5 4.75V8.25H17" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M9.5 11.25H14.5M9.5 14.25H12.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PremiumIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.5 5.5H16.5L20 10L12 19.5L4 10L7.5 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7 10H17M10 5.5L8.5 10L12 19.5L15.5 10L14 5.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ProductDetailTrustIcon({ title }: ProductDetailTrustIconProps) {
  if (title === "Easy Order Review") {
    return <ReviewIcon />;
  }

  if (title === "Curated Premium Selection") {
    return <PremiumIcon />;
  }

  return <SecureCheckoutIcon />;
}
