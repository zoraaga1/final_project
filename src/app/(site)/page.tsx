import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hmizate store",
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
