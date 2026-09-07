import type { Meta } from "../src/types"

export const kayakTracker: Meta = {
  slug: "kayak-tracker",
  title: "Building a waterproof GPS tracker with 6 months battery life",
  date: "2026-09-05T12:00:00Z",
  description:
    "Embedded firmware, cellular telemetry, remote updates, and automated power testing. In field trials on rental kayaks in Norway.",
  image: "/images/kayak-tracker/on-kayak.jpg",
  tags: [],
}

export const localPosts = [
  { id: "kayak-tracker", meta: kayakTracker, recordMap: null },
]
