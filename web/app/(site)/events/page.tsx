import type { Metadata } from "next";
import EventsStage from "@/components/events/EventsStage";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Talks, panels, and public appearances by Rodrigo Scharp — Java, Spring Boot, public-sector tech, and startup life.",
};

export default function EventsPage() {
  return <EventsStage />;
}
