import { Link, createFileRoute } from "@tanstack/react-router";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "ReceiptOne Sign Up" },
      { name: "description", content: "Create your ReceiptOne account." },
      { property: "og:title", content: "ReceiptOne Sign Up" },
      { property: "og:description", content: "Create your ReceiptOne account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <Link to="/ca" className="mx-auto flex items-center gap-2">
          <img src={logoMark} alt="" aria-hidden className="block size-10" />
          <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
        </Link>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Personal cabinet</p>
            <h1 className="font-display text-3xl font-semibold tracking-normal">Join now</h1>
            <p className="text-sm leading-6 text-muted-foreground">Create your account to start tracking receipts and generating tax-ready reports.</p>
          </div>

          <form className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Full name</label>
              <input id="name" type="text" placeholder="Alex Johnson" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</label>
              <input id="signup-email" type="email" placeholder="you@example.com" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</label>
              <input id="signup-password" type="password" placeholder="Create a password" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" />
            </div>

            <button type="button" className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}