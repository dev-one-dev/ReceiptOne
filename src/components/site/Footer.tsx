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
        className="absolute left-1/2 top-[10.5%] h-[31%] w-[17%] -translate-x-1/2 cursor-pointer rounded-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/privacy"
        aria-label="Terms of Use"
        className="absolute left-[36%] top-[88.5%] h-[4.8%] w-[11%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/login"
        aria-label="Log in"
        className="absolute left-[61.5%] top-[88%] h-[5.4%] w-[9.6%] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/signup"
        aria-label="Join now"
        className="absolute left-[73%] top-[88%] h-[5.4%] w-[11.5%] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Link
        to="/terms"
        aria-label="Privacy Policy"
        className="absolute left-[53.4%] top-[88.5%] h-[4.8%] w-[11.8%] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </footer>
  );
}
