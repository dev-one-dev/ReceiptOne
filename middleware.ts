export const config = {
  matcher: ["/"],
};

export default function middleware(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");
  const url = new URL(request.url);

  if (country === "US") {
    url.pathname = "/us";
    return Response.redirect(url.toString(), 302);
  }

  url.pathname = "/ca";
  return Response.redirect(url.toString(), 302);
}
