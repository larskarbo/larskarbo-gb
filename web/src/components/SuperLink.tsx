import Link from "next/link";

export const SuperLink = ({ href, children, ...props }) => {
  return (
    <Link href={href}>
      <a
        {...(href.includes("http")
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        {...props}
      >
        {children}
      </a>
    </Link>
  );
};
