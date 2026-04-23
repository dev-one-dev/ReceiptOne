import { useCallback } from "react";
import { Link } from "@tanstack/react-router";
import footerSvg from "@/assets/figma/footer.svg";
import footerUsSvg from "@/assets/figma/footer-us.svg";

type FooterProps = {
  region?: "ca" | "us";
};

export function Footer({ region = "ca" }: FooterProps) {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const footerAsset = region === "us" ? footerUsSvg : footerSvg;
  const hotspotClassName = "absolute z-10 block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <footer className="relative w-full">
      <img
        src={footerAsset}
        alt="Claim your free trial now — ReceiptOne"
        className="block h-auto w-full"
      />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="absolute left-1/2 top-[6%] z-10 h-[14%] w-[28%] -translate-x-1/2 cursor-pointer rounded-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/privacy"
        aria-label="Terms of Use"
        className="absolute left-[34.8%] top-[87.4%] z-10 h-[6.2%] w-[13%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/login"
        aria-label="Log in"
        className={`${hotspotClassName} left-[61%] top-[86.9%] h-[7%] w-[10.8%]`}
      />

      <Link
        to="/signup"
        aria-label="Join now"
        className={`${hotspotClassName} left-[72.6%] top-[86.9%] h-[7%] w-[13%]`}
      />

      <Link
        to="/terms"
        aria-label="Privacy Policy"
        className="absolute left-[52.2%] top-[87.4%] z-10 h-[6.2%] w-[13.2%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </footer>
  );
}
