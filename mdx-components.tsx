// import { CodeBlock, CodeBlockProps } from "fumadocs-ui/components/codeblock";
import { CodeBlock } from "./components/codeblock";
import { Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { HTMLAttributes } from "react";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
  };
}

// export function getMDXComponents(components?: MDXComponents): MDXComponents {
//   return {
//     ...defaultMdxComponents,
//     ...components,
//     pre: ({ title, className, icon, allowCopy, ...props }) => (
//       <CodeBlock
//         className={` ${className || ""}`}
//         title={title}
//         icon={icon}
//         allowCopy={allowCopy}
//       >
//         <Pre className={` ${className || ""}`} {...props} />
//       </CodeBlock>
//     ),
//   };
// }
