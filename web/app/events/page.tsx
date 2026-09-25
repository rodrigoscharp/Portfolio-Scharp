import type { Metadata } from "next";
import EventsStage from "@/components/events/EventsStage";

export const metadata: Metadata = { title: "Events — Rodrigo Scharp" };

export default function EventsPage() {
  return <EventsStage />;
}
