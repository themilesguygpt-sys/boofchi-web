import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  dir?: "rtl" | "ltr" | "auto";
}

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? (
              <Link href={item.href}>
                <bdi dir={item.dir ?? "auto"}>{item.label}</bdi>
              </Link>
            ) : (
              <span aria-current="page">
                <bdi dir={item.dir ?? "auto"}>{item.label}</bdi>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
