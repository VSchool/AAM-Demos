"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RenderChip = (
  value: string,
  opts: { onRemove?: () => void },
) => ReactNode;

interface CommonProps {
  options: string[];
  renderChip: RenderChip;
  placeholder?: string;
  maxLength?: number;
  addLabel?: string;
  emptyLabel?: string;
}

interface SingleProps extends CommonProps {
  multi?: false;
  value: string;
  onChange: (next: string) => void;
}

interface MultiProps extends CommonProps {
  multi: true;
  value: string[];
  onChange: (next: string[]) => void;
}

type Props = SingleProps | MultiProps;

const POPOVER_STYLE: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 30,
  minWidth: "240px",
  background: "var(--cream, #FFFDF5)",
  color: "var(--ink, #0A0A0A)",
  border: "1px solid rgba(10,10,10,0.18)",
  borderRadius: "8px",
  boxShadow: "0 12px 28px rgba(10,10,10,0.22)",
  padding: "6px",
};

const SEARCH_STYLE: CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  background: "rgba(10,10,10,0.04)",
  border: "1px solid rgba(10,10,10,0.15)",
  borderRadius: "6px",
  fontSize: "13px",
  fontFamily: "var(--font-sans)",
  color: "inherit",
  marginBottom: "6px",
  boxSizing: "border-box",
};

const OPTION_BTN_STYLE: CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  background: "transparent",
  border: 0,
  borderRadius: "4px",
  fontSize: "13px",
  fontFamily: "var(--font-sans)",
  color: "inherit",
  cursor: "pointer",
  width: "100%",
};

const TRIGGER_BTN_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  background: "rgba(10,10,10,0.04)",
  border: "1px dashed rgba(10,10,10,0.35)",
  borderRadius: "999px",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  color: "rgba(10,10,10,0.65)",
  cursor: "pointer",
};

export default function TagPicker(props: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected: string[] = props.multi
    ? props.value
    : props.value
      ? [props.value]
      : [];

  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  const available = useMemo(() => {
    const taken = new Set(selected.map((s) => s.toLowerCase()));
    return props.options
      .filter((o) => !taken.has(o.toLowerCase()))
      .filter((o) => !lower || o.toLowerCase().includes(lower));
  }, [props.options, selected, lower]);

  const canCreate =
    trimmed.length > 0 &&
    !props.options.some((o) => o.toLowerCase() === lower) &&
    !selected.some((s) => s.toLowerCase() === lower);

  const choose = (val: string) => {
    if (props.multi) {
      if (!props.value.some((v) => v.toLowerCase() === val.toLowerCase())) {
        props.onChange([...props.value, val]);
      }
      setQuery("");
      inputRef.current?.focus();
    } else {
      props.onChange(val);
      setQuery("");
      setOpen(false);
    }
  };

  const remove = (val: string) => {
    if (props.multi) {
      props.onChange(props.value.filter((v) => v !== val));
    } else {
      props.onChange("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (available.length > 0) choose(available[0]);
      else if (canCreate) choose(trimmed);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    } else if (e.key === "Backspace" && !query && props.multi && props.value.length > 0) {
      remove(props.value[props.value.length - 1]);
    }
  };

  const triggerLabel =
    props.addLabel ??
    (props.multi ? "+ Add" : selected.length > 0 ? "Change" : "+ Select");

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {selected.map((v) => (
          <Fragment key={v}>
            {props.renderChip(v, { onRemove: () => remove(v) })}
          </Fragment>
        ))}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={TRIGGER_BTN_STYLE}
          aria-expanded={open}
        >
          {triggerLabel}
        </button>
      </div>

      {open && (
        <div style={POPOVER_STYLE} role="listbox">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={props.placeholder ?? "Search or add…"}
            maxLength={props.maxLength}
            style={SEARCH_STYLE}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {available.length === 0 && !canCreate && (
              <div style={{ padding: "6px 8px", fontSize: "12px", opacity: 0.55 }}>
                {props.emptyLabel ?? "No matches."}
              </div>
            )}
            {available.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                style={OPTION_BTN_STYLE}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(10,10,10,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {opt}
              </button>
            ))}
            {canCreate && (
              <button
                type="button"
                onClick={() => choose(trimmed)}
                style={{
                  ...OPTION_BTN_STYLE,
                  marginTop: available.length > 0 ? "4px" : 0,
                  paddingTop: available.length > 0 ? "8px" : "6px",
                  borderTop:
                    available.length > 0
                      ? "1px solid rgba(10,10,10,0.10)"
                      : "0",
                  fontWeight: 600,
                }}
              >
                + Create &quot;{trimmed}&quot;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
