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
        className="absolute left-[16%] top-[86%] z-10 h-[10%] w-[19%] cursor-pointer rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/privacy"
        aria-label="Terms of Use"
        className="absolute left-[42.5%] top-[88.5%] z-10 h-[5%] w-[8%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/login"
        aria-label="Log in"
        className={`${hotspotClassName} left-[38%] top-[64%] h-[10%] w-[11.5%] !rounded-[40px]`}
      />

      <Link
        to="/signup"
        aria-label="Join now"
        className={`${hotspotClassName} left-[50.5%] top-[64%] h-[10%] w-[11.5%] !rounded-[40px]`}
      />

      <Link
        to="/terms"
        aria-label="Privacy Policy"
        className="absolute left-[51%] top-[88.5%] z-10 h-[5%] w-[9%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </footer>
  );
}
