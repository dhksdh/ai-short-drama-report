import React, { useState, useEffect } from "react";

export function preheatFlourish() {}

export function FlourishEmbed({
  src,
  className = "",
  ariaLabel = "flourish visualization",
  style,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const url = `https://flo.uri.sh/${src}/embed`;

  useEffect(() => {
    setStatus("loading");
    const timer = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "error" : prev));
    }, 8000);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className={`relative ${className}`} style={style}>
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1A1225]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs text-primary/60 tracking-widest">图表加载中</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1A1225]">
          <span className="text-xs text-white/40">图表加载失败</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary border border-primary/30 px-3 py-1 hover:bg-primary/10 transition-colors"
          >
            直接查看 →
          </a>
        </div>
      )}
      <iframe
        src={url}
        title={ariaLabel}
        allowFullScreen
        frameBorder="0"
        scrolling="no"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "inherit",
          border: "none",
          opacity: status === "loaded" ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}
