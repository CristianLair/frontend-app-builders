import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Presto - Préstamos y créditos con inteligencia",
    short_name: "Presto",
    description:
      "Préstamos, créditos, inversiones y asistencia con IA en una sola app.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    dir: "ltr",
    lang: "es",
    background_color: "#0f0728",
    theme_color: "#0f0728",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Pedir crédito",
        short_name: "Créditos",
        description: "Simulá y solicitá un préstamo",
        url: "/creditos",
      },
      {
        name: "Invertir",
        short_name: "Inversiones",
        description: "Simulá rendimiento e invertí",
        url: "/inversiones",
      },
      {
        name: "Transferir",
        short_name: "Transferencias",
        description: "Recibí y enviá dinero",
        url: "/transferencias",
      },
    ],
  };
}