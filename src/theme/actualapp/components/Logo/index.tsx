import logo from "@/theme/actualapp/assets/images/logo.webp";
import logoMobile from "@/theme/actualapp/assets/images/logo-mobile.webp";
import Link from "next/link";

type LogoProps = {
  mobile?: boolean;
  className?: string;
  locale: string;
};

const Logo = ({
  mobile = false,
  className = "no-custom-class",
  locale,
}: LogoProps) => {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_FRONT_DOMAIN}${
        locale !== "es" ? `/${locale}` : ""
      }`}
    >
      <picture>
        <source srcSet={logoMobile.src} media="(max-width: 1280px)" />
        <img
          src={mobile ? logoMobile.src : logo.src}
          alt="Logo"
          height={150}
          width={300}
          style={{ objectFit: "contain", width: "auto", height: "auto" }}
          className={className}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </Link>
  );
};

export default Logo;
