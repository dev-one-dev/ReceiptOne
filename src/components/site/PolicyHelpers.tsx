import type { ReactNode } from "react";

export function PolicySection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-b border-border/70 pb-10 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Section {number}</p>
        <h2 className="font-display text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="font-display text-xl font-semibold tracking-normal text-foreground">{title}</h3>
      <div className="space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-foreground">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium sm:px-5">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card text-muted-foreground">
            {rows.map((row) => (
              <tr key={row.join("-")} className="align-top">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 sm:px-5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
