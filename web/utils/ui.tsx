import React, { useState, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";

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
