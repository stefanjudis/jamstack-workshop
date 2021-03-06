import Container from "./container";
import cn from "classnames";

export default function Alert({ preview }) {
  return (
    <div
      className={cn("border-b mb-4", {
        "bg-accent-7 border-accent-7 text-white": preview,
        "bg-accent-1 border-accent-2": !preview,
      })}>
      <Container>
        <div className="py-2 text-sm text-center">
          {preview ? (
            <>
              This is page is a preview.{" "}
              <a
                href="/api/exit-preview"
                className="underline transition-colors duration-200 hover:text-cyan">
                Click here
              </a>{" "}
              to exit preview mode.
            </>
          ) : (
            <>
              The source code for this blog is{" "}
              <a
                href={`https://github.com/stefanjudis/jamstack-workshop`}
                className="underline transition-colors duration-200 hover:text-success">
                available on GitHub
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
