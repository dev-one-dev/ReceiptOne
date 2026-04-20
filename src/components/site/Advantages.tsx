import advantagesSvg from "@/assets/figma/advantages.svg";

export function Advantages() {
  return (
    <section className="w-full">
      <img
        src={advantagesSvg}
        alt="What is our advantages — Save 10+ hours, never miss mileage deductions, accountant-ready reports, documentation ready, mobile + web in sync"
        className="block h-auto w-full"
      />
    </section>
  );
}
