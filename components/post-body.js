import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import markdownStyles from "./markdown-styles.module.css";
import { CodeBlock, dracula } from "react-code-blocks";
import Image from "next/image";

const getRenderOptions = (links) => {
  const blockAssets = new Map(
    links.assets.block.map((asset) => [asset.sys.id, asset])
  );

  const blockEntries = new Map(
    links.entries.block.map((entry) => [entry.sys.id, entry])
  );

  return {
    renderText: (text) => {
      return text.split("\n").reduce((children, textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    },
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // use the asset map and render a proper image element
        const asset = blockAssets.get(node.data.target.sys.id);
        const { url, width, height, description } = asset;
        return (
          <Image
            loader={({ src, width, quality }) => {
              return `${src}?w=${width}&q=${quality || 75}`;
            }}
            className="border"
            layout="responsive"
            sizes="(max-width: 740px) 98vw, 672px"
            src={url}
            width={width}
            height={height}
            alt={description}
          />
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        const entry = blockEntries.get(node.data.target.sys.id);

        if (entry.__typename === "Details") {
          return (
            <details>
              <summary>{entry.title}</summary>
              {documentToReactComponents(entry.body.json)}
            </details>
          );
        }

        if (entry.__typename === "CodeBlock") {
          return (
            <CodeBlock
              text={entry.code}
              language={entry.language !== "plain" ? entry.language : ""}
              showLineNumbers={true}
              theme={dracula}
            />
          );
        }
      },
    },
  };
};

export default function PostBody({ content }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className={markdownStyles["markdown"]}>
        {documentToReactComponents(
          content.json,
          getRenderOptions(content.links)
        )}
      </div>
    </div>
  );
}
