"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useMeasure from "react-use-measure";
import {
  Zap as Brain,
  ChevronRight,
  CircleFadingArrowUp,
  Clock,
  FolderKanban,
  BookOpen,
  Puzzle as Lightbulb,
  LogOut,
  Bell as MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Focus", icon: Brain, iconClassName: "fill-current" },
  { title: "Progression", icon: TrendingUp, iconClassName: "stroke-3" },
  { title: "Ideas", icon: Lightbulb, iconClassName: "fill-current stroke-1" },
  { title: "Activity", icon: MessageSquare, iconClassName: "fill-current" },
  { title: "Profile", icon: User, iconClassName: "fill-current stroke-1" },
];

const profileitems = [
  { icon: User, label: "profile", iconClassName: "text-violet-500" },
  { icon: CircleFadingArrowUp, label: "upgrade" },
  { icon: FolderKanban, label: "projects" },
  { icon: BookOpen, label: "documentation" },
  { icon: LogOut, label: "logout", className: "text-red-500" },
];

const ideasData = [
  {
    title: "Adaptive color themes",
    desc: "Generate palettes from a single brand color using oklch",
    tag: "Design",
  },
  {
    title: "Micro-interaction library",
    desc: "Reusable spring animations for buttons, inputs and modals",
    tag: "Dev",
  },
  {
    title: "AI component naming",
    desc: "Use LLM to suggest semantic names for new components",
    tag: "AI",
  },
  {
    title: "Dark mode token audit",
    desc: "Review all CSS vars for contrast compliance in dark mode",
    tag: "Design",
  },
  {
    title: "Registry search",
    desc: "Fuzzy search across all registry items with hotkey",
    tag: "Dev",
  },
  {
    title: "Component usage heatmap",
    desc: "Track which components are used most in production",
    tag: "Analytics",
  },
];

const activityData = [
  {
    user: "Sarah",
    action: "commented on",
    target: "Design system audit",
    time: "3m ago",
    color: "bg-violet-500",
  },
  {
    user: "Alex",
    action: "merged",
    target: "feat/motion-tabs-menu",
    time: "18m ago",
    color: "bg-emerald-500",
  },
  {
    user: "You",
    action: "created",
    target: "Registry search idea",
    time: "1h ago",
    color: "bg-sky-500",
  },
  {
    user: "Marc",
    action: "reviewed",
    target: "Component usage heatmap",
    time: "2h ago",
    color: "bg-orange-500",
  },
  {
    user: "Sarah",
    action: "closed",
    target: "Dark mode token audit",
    time: "3h ago",
    color: "bg-rose-500",
  },
  {
    user: "Alex",
    action: "opened",
    target: "AI component naming spec",
    time: "5h ago",
    color: "bg-violet-500",
  },
  {
    user: "You",
    action: "pushed to",
    target: "main",
    time: "yesterday",
    color: "bg-sky-500",
  },
];

const barData = [
  { day: "M", pct: 85 },
  { day: "T", pct: 70 },
  { day: "W", pct: 50 },
  { day: "T", pct: 90 },
  { day: "F", pct: 35 },
  { day: "S", pct: 15 },
  { day: "S", pct: 0 },
];

const contentVariants = {
  initial: (direction: number) => ({ x: `${60 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${-60 * direction}%`, opacity: 0 }),
};

// springTransition is overridden per-instance via the `spring` memo below

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, type: "spring" as const, bounce: 0 },
  },
};

interface MotionTabsMenuProps {
  springDuration?: number;
  springBounce?: number;
  labelDelay?: number;
  tapScale?: number;
}

export default function MotionTabsMenu({
  springDuration = 0.45,
  springBounce = 0,
  labelDelay = 0.08,
  tapScale = 0.8,
}: MotionTabsMenuProps) {
  const [direction, setDirection] = useState(1);
  const [measureRef, bounds] = useMeasure();
  const [selected, setSelected] = useState<number | null>(null);
  const [lastContentHeight, setLastContentHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const spring = useMemo(
    () => ({
      duration: springDuration,
      type: "spring" as const,
      bounce: springBounce,
    }),
    [springDuration, springBounce],
  );

  // Dynamic width calculation (mirrors preview-panel approach)
  const collapsedButtonWidth = 36;
  const toolbarPaddingX = 8; // p-2 = 8px each side → 16px total, split as offset
  const itemGap = 4;
  const buttonCount = tabs.length;

  const collapsedToolbarWidth =
    toolbarPaddingX * 2 +
    buttonCount * collapsedButtonWidth +
    Math.max(buttonCount - 1, 0) * itemGap;

  const expandedLabelsWidth = useMemo(() => {
    if (selected === null) return 0;
    const label = tabs[selected]?.title ?? "";
    return label.length * 7 + 24;
  }, [selected]);

  const toolbarWidth = collapsedToolbarWidth + expandedLabelsWidth;

  // Click outside to close
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        selected !== null &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [selected]);

  function handleTabClick(index: number) {
    if (selected === null) {
      setSelected(index);
    } else if (selected === index) {
      setSelected(null);
    } else {
      setDirection(index > selected ? 1 : -1);
      setSelected(index);
    }
  }

  const tabContent = useMemo(() => {
    switch (selected) {
      case 0:
        return (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2.5 px-1"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="relative flex size-2.5">
                <span className="bg-accent-pro absolute inline-flex h-full w-full animate-ping rounded-2xl opacity-75" />
                <span className="bg-accent-pro relative inline-flex size-2.5 rounded-2xl" />
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                Current task
              </span>
            </motion.div>
            <motion.span
              variants={itemVariants}
              className="text-base font-semibold"
            >
              Design system audit
            </motion.span>
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      bounce: 0,
                      delay: 0.2,
                    }}
                    className="bg-foreground h-full rounded-full"
                  />
                </div>
                <span className="text-muted-foreground ml-2 bg-muted px-2 py-1 rounded-xl text-xs font-medium">
                  65%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="text-muted-foreground size-3" />
                <span className="text-muted-foreground text-xs">2h 15m</span>
              </div>
            </motion.div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2 px-1"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <span className="text-muted-foreground text-xs font-medium">
                This week
              </span>
              <span className="text-xs font-semibold text-emerald-400 ">
                12/15 tasks
              </span>
            </motion.div>
            <div className="flex h-26 items-end justify-center gap-1.5">
              {barData.map((bar, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(bar.pct * 0.67, 2)}px` }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      bounce: 0,
                      delay: 0.05 + i * 0.07,
                    }}
                    className={`w-full rounded-sm ${bar.pct > 0 ? "bg-foreground" : "bg-muted"}`}
                  />
                  <span className="text-muted-foreground text-center justify-center text-[10px]">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <div className="relative h-72">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="h-full py-3 overflow-y-auto flex flex-col gap-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {ideasData.map((idea) => (
                <motion.div
                  key={idea.title}
                  variants={itemVariants}
                  className="hover:bg-muted flex cursor-pointer flex-col gap-1.5 rounded-xl px-2.5 py-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{idea.title}</span>
                    <span className="bg-muted shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                      {idea.tag}
                    </span>
                  </div>
                  <span className="text-muted-foreground line-clamp-1 text-xs">
                    {idea.desc}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
          </div>
        );

      case 3:
        return (
          <div className="relative h-82">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="h-full py-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex flex-col">
                {activityData.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex hover:bg-accent rounded-xl items-start gap-3 py-2 px-1"
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`size-2 shrink-0 rounded-full ${item.color}`}
                      />
                      {i < activityData.length - 1 && (
                        <div
                          className="bg-border h-full mt-1 w-px flex-1 pb-0"
                          style={{ minHeight: "28px" }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex flex-1  items-baseline justify-between gap-2">
                      <p className="text-sm leading-snug">
                        <span className="font-semibold">{item.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>{" "}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <span className="text-muted-foreground shrink-0 bg-muted px-1 py-0.5 rounded-md text-[10px]">
                        {item.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
          </div>
        );

      case 4: {
        return (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-0.5"
          >
            {profileitems.map(({ icon: Icon, label, className }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className={`hover:bg-muted flex h-10 cursor-pointer items-center justify-between gap-2 rounded-xl px-2 text-sm font-medium ${className || ""}`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`text-muted-foreground size-4 ${className || ""}`}
                  />
                  <span className="capitalize">{label}</span>
                </div>
                <ChevronRight className="text-muted-foreground size-4" />
              </motion.div>
            ))}
          </motion.div>
        );
      }

      default:
        return null;
    }
  }, [selected]);

  // Tab bar height: h-9 (36px) + p-2 top+bottom (16px) = 52px
  const TAB_BAR_HEIGHT = 52;

  // Keep last stable content height to avoid jumps during AnimatePresence exit transitions
  useEffect(() => {
    if (bounds.height > 0) setLastContentHeight(bounds.height);
  }, [bounds.height]);
  const contentHeight = bounds.height > 0 ? bounds.height : lastContentHeight;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* mt-16 to clear the pseudo-element line */}
      <div className="mt-16">
        <div ref={containerRef}>
          <LayoutGroup>
            <motion.div
              initial={false}
              animate={{
                height:
                  selected === null
                    ? TAB_BAR_HEIGHT
                    : contentHeight + TAB_BAR_HEIGHT,
                width: toolbarWidth,
              }}
              transition={spring}
              className="bg-background relative overflow-hidden rounded-3xl"
            >
              {/* Content area — measureRef on stable wrapper, not on animated element */}
              <div ref={measureRef}>
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  {selected !== null && (
                    <motion.div
                      key={selected}
                      variants={contentVariants}
                      initial="initial"
                      animate="active"
                      exit="exit"
                      custom={direction}
                      transition={spring}
                      className="bg-background/80 p-4 pb-4"
                    >
                      {tabContent}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab bar */}
              <div className="bg-background absolute bottom-0 w-full p-2">
                <div className="flex h-9 w-full items-center justify-center gap-1">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = selected === index;
                    return (
                      <motion.button
                        key={tab.title}
                        initial={false}
                        whileTap={{
                          scaleY: tapScale,
                          transition: { duration: 0.2 },
                        }}
                        animate={{
                          gap: isActive ? ".5rem" : 0,
                          paddingLeft: isActive ? "1rem" : ".5rem",
                          paddingRight: isActive ? "1rem" : ".5rem",
                        }}
                        transition={spring}
                        onClick={() => handleTabClick(index)}
                        className={`flex h-full cursor-pointer items-center rounded-2xl text-sm font-medium transition-colors duration-300 ${
                          isActive
                            ? "bg-foreground/[0.04]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className={cn("size-4", tab.iconClassName)} />
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: "auto", opacity: 1 }}
                              exit={{ width: 0, opacity: 0 }}
                              transition={{
                                ...spring,
                                delay: labelDelay,
                              }}
                              className="overflow-hidden whitespace-nowrap font-medium tracking-tight"
                            >
                              {tab.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}