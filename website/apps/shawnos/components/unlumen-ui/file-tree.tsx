"use client";

// Vendored from Unlumen UI (ui.unlumen.com/components/file-tree), adapted for
// the Vault: nodes may carry an href (files render as prefetched Links), an
// activeId pins the aura highlight to the open file, and colors run through
// the site tokens instead of the shadcn theme scale.
import * as React from "react";
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  FileCog,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@shawnos/shared/lib/utils";
import { Link } from "../../i18n/navigation";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type FileTreeElement = {
  id: string;
  name: string;
  /** Omit or set to "file" for a leaf node; "folder" renders a collapsible branch. */
  type?: "folder" | "file";
  children?: FileTreeElement[];
  /** Custom icon component (receives a `className` prop). */
  icon?: React.ComponentType<{ className?: string }>;
  /** Tints the item with the highlight color to mark it as new / relevant. */
  highlight?: boolean;
  /** Whether this folder starts expanded. */
  defaultOpen?: boolean;
  /** When set, the file row renders as a client-side Link. */
  href?: string;
};

// ─── Context ───────────────────────────────────────────────────────────────────

type FileTreeCtx = {
  highlightColor: string;
  indentSize: number;
  showIcons: boolean;
  defaultOpenIds: Set<string>;
  activeId?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  highlightBounds: HighlightBounds | null;
  setHighlightBounds: React.Dispatch<
    React.SetStateAction<HighlightBounds | null>
  >;
};

type HighlightBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const FileTreeContext = React.createContext<FileTreeCtx | null>(null);

function useFileTree() {
  const context = React.useContext(FileTreeContext);
  if (!context) {
    throw new Error("File tree components must be used within <FileTree />");
  }
  return context;
}

type FolderCtx = {
  isOpen: boolean;
  toggle: () => void;
};

const FolderContext = React.createContext<FolderCtx | null>(null);

function useFolder() {
  const context = React.useContext(FolderContext);
  if (!context) {
    throw new Error("Folder components must be used within a folder item");
  }
  return context;
}

// ─── Icon resolution ───────────────────────────────────────────────────────────

const EXT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tsx: FileCode,
  ts: FileCode,
  jsx: FileCode,
  js: FileCode,
  py: FileCode,
  json: FileJson,
  md: FileText,
  mdx: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  svg: FileImage,
  webp: FileImage,
  config: FileCog,
  toml: FileCog,
  yaml: FileCog,
  yml: FileCog,
  env: FileCog,
};

function resolveFileIcon(
  name: string,
  custom?: React.ComponentType<{ className?: string }>,
): React.ComponentType<{ className?: string }> {
  if (custom) return custom;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_ICONS[ext] ?? File;
}

// ─── Shared highlight/collapse pieces ──────────────────────────────────────────

function FileTreeHoverHighlight({ className }: { className?: string }) {
  const { highlightBounds } = useFileTree();

  return (
    <AnimatePresence>
      {highlightBounds && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            top: highlightBounds.top,
            left: highlightBounds.left,
            width: highlightBounds.width,
            height: highlightBounds.height,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 0,
            background: "color-mix(in srgb, var(--canvas-subtle) 80%, transparent)",
            border: "1px solid var(--canvas-border)",
            borderRadius: 8,
          }}
        />
      )}
    </AnimatePresence>
  );
}

function useHighlightTarget() {
  const { containerRef, setHighlightBounds } = useFileTree();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMouseEnter = React.useCallback(() => {
    const element = ref.current;
    const container = containerRef.current;
    if (!element || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    setHighlightBounds({
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      height: elementRect.height,
    });
  }, [containerRef, setHighlightBounds]);

  return { ref, onMouseEnter };
}

function FolderIcon({
  closeIcon,
  openIcon,
}: {
  closeIcon: React.ReactNode;
  openIcon: React.ReactNode;
}) {
  const { isOpen } = useFolder();

  return (
    <span className="inline-flex shrink-0 relative size-[1.125rem]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isOpen ? "open" : "close"}
          className="inline-flex"
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8,
          }}
        >
          {isOpen ? openIcon : closeIcon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FolderContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useFolder();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Node renderers ────────────────────────────────────────────────────────────

function FileTreeFile({ node }: { node: FileTreeElement }) {
  const { highlightColor, showIcons, activeId } = useFileTree();
  const Icon = resolveFileIcon(node.name, node.icon);
  const highlightTarget = useHighlightTarget();
  const isActive = activeId != null && activeId === node.id;

  const row = (
    <div
      className="flex items-center gap-2 p-2"
      style={{
        pointerEvents: "none",
        color: isActive
          ? "var(--aura-strong)"
          : node.highlight
            ? highlightColor
            : undefined,
      }}
    >
      {showIcons && (
        <span className="inline-flex shrink-0">
          <Icon className="size-4.5" />
        </span>
      )}
      <span className="text-sm">{node.name}</span>
    </div>
  );

  return (
    <div
      ref={highlightTarget.ref}
      className="relative z-10"
      onMouseEnter={highlightTarget.onMouseEnter}
      style={
        isActive
          ? {
              background: "color-mix(in srgb, var(--aura) 12%, transparent)",
              borderLeft: "2px solid var(--aura)",
              borderRadius: 8,
            }
          : undefined
      }
    >
      {node.href ? (
        <Link
          href={node.href}
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
          aria-current={isActive ? "page" : undefined}
        >
          {row}
        </Link>
      ) : (
        row
      )}
    </div>
  );
}

function FileTreeFolder({ node }: { node: FileTreeElement }) {
  const { defaultOpenIds, highlightColor, indentSize, showIcons } =
    useFileTree();
  const highlightTarget = useHighlightTarget();
  const [isOpen, setIsOpen] = React.useState(
    node.defaultOpen ?? defaultOpenIds.has(node.id),
  );
  const toggle = React.useCallback(() => setIsOpen((open) => !open), []);

  return (
    <FolderContext.Provider value={{ isOpen, toggle }}>
      <div data-value={node.id} className="relative z-10">
        <button type="button" className="w-full text-start" onClick={toggle}>
          <div
            ref={highlightTarget.ref}
            onMouseEnter={highlightTarget.onMouseEnter}
          >
            <div className="flex items-center gap-2 p-2 pointer-events-none">
              {showIcons && (
                <FolderIcon
                  closeIcon={<Folder className="size-4.5" />}
                  openIcon={<FolderOpen className="size-4.5" />}
                />
              )}
              <span
                className="text-sm"
                style={node.highlight ? { color: highlightColor } : undefined}
              >
                {node.name}
              </span>
            </div>
          </div>
        </button>
        <div
          className="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:h-full before:bg-border"
          style={indentSize !== 24 ? { marginLeft: indentSize } : undefined}
        >
          <FolderContent>
            {(node.children ?? []).map((child) => (
              <FileTreeNode key={child.id} node={child} />
            ))}
          </FolderContent>
        </div>
      </div>
    </FolderContext.Provider>
  );
}

function FileTreeNode({ node }: { node: FileTreeElement }) {
  if (node.type === "folder") {
    return <FileTreeFolder node={node} />;
  }
  return <FileTreeFile node={node} />;
}

// ─── Public API ────────────────────────────────────────────────────────────────

export type FileTreeProps = {
  elements: FileTreeElement[];
  className?: string;
  /** Highlight color for items with `highlight: true`. Defaults to pink (#f472b6). */
  highlightColor?: string;
  /** Horizontal indent per nesting level in px. Defaults to 24. */
  indentSize?: number;
  /** Whether to show file/folder icons. Defaults to true. */
  showIcons?: boolean;
  /** Folder ids that should be open on first render. */
  defaultOpenIds?: string[];
  /** File id that gets the persistent aura active treatment. */
  activeId?: string;
};

export function FileTree({
  elements,
  className,
  highlightColor = "#f472b6",
  indentSize = 24,
  showIcons = true,
  defaultOpenIds = [],
  activeId,
}: FileTreeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [highlightBounds, setHighlightBounds] =
    React.useState<HighlightBounds | null>(null);
  const defaultOpenIdSet = React.useMemo(
    () => new Set(defaultOpenIds),
    [defaultOpenIds],
  );

  return (
    <FileTreeContext.Provider
      value={{
        highlightColor,
        indentSize,
        showIcons,
        defaultOpenIds: defaultOpenIdSet,
        activeId,
        containerRef,
        highlightBounds,
        setHighlightBounds,
      }}
    >
      <div
        className={cn("rounded-xl overflow-hidden", className)}
        style={{ border: "1px solid var(--canvas-border)", fontFamily: "var(--font-mono)" }}
      >
        <div
          ref={containerRef}
          className="p-2 w-full relative isolate"
          onMouseLeave={() => setHighlightBounds(null)}
        >
          <FileTreeHoverHighlight />
          {elements.map((node) => (
            <FileTreeNode key={node.id} node={node} />
          ))}
        </div>
      </div>
    </FileTreeContext.Provider>
  );
}
