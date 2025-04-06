import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ":kekw:",
  description: ":kekw:",
  icons: {
    icon: "/kekw.png",
  },
  openGraph: {
    title: ":kekw:",
    images: [
      {
        url: "/kekw.png",
      },
    ]
  }
};

export default function Home() {
  return (
    <>
      <iframe
        src="https://chiv.tardis.ac/grafana/d/aei1q42n15jpcc/3a-kekw3a?orgId=1&viewPanel=1"
        className="w-full h-screen"
      />
    </>
  )
}
