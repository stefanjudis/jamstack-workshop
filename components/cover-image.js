import Image from "next/image";
import Link from "next/link";
import cn from "classnames";

export default function CoverImage({ title, url, slug, width, height, sizes }) {
  const image = (
    <div
      className={cn("drop-shadow-small", {
        "hover:drop-shadow-medium transition-drop-shadow duration-200": slug,
      })}
    >
      <Image
        layout={sizes ? "responsive" : "intrinsic"}
        sizes={sizes || ""}
        width={width}
        height={height}
        alt={`Cover Image for ${title}`}
        src={url}
      />
    </div>
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`}>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
