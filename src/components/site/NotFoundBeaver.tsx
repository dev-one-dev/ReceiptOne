import beaverNotFound from "@/assets/figma/beaver-404.jpeg";

export function NotFoundBeaver() {
  return (
    <img
      src={beaverNotFound}
      alt="404 - Page not found. Looks like this dam is broken. Try again!"
      className="mx-auto w-full max-w-2xl"
    />
  );
}
