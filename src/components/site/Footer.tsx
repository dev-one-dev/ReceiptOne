import footerSvg from "@/assets/figma/footer.svg";

export function Footer() {
  return (
    <footer className="w-full">
      <img
        src={footerSvg}
        alt="Claim your free trial now — ReceiptOne"
        className="block h-auto w-full"
      />
    </footer>
  );
}
