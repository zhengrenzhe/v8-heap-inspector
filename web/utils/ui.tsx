import React, { useState, useRef, ReactNode } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { filterNotNullable } from "./common";

export function Copy(props: { value: string; cls: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  return (
    <CopyToClipboard
      text={props.value}
      onCopy={() => {
        window.clearTimeout(timer.current);
        setCopied(true);
        timer.current = window.setTimeout(() => {
          setCopied(false);
        }, 3000);
      }}
    >
      <span className={props.cls}>
        {copied ? <AiOutlineCheck /> : <AiOutlineCopy />}
      </span>
    </CopyToClipboard>
  );
}

export function joinElements(t: ReactNode[], split: ReactNode) {
  return t
    .filter(filterNotNullable)
    .reduce<ReactNode[]>(
      (acc, cur) => (acc.length === 0 ? [cur] : [acc, split, cur]),
      [],
    );
}
