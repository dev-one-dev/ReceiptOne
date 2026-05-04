import notAllCa from "@/assets/figma/not-all-ca.svg";

export function NotAll() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-3 pt-4 pb-20 sm:px-6 sm:pt-8 sm:pb-[132px]">
      <img
        src={notAllCa}
        alt="And this is not all — six ReceiptOne benefit cards for Canadian users"
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </section>
  );
}
