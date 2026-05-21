import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostic Trottinette Electrique | Identifiez la panne",
  description: "Diagnostiquez gratuitement votre trottinette electrique. Identifiez le probleme, trouvez la piece compatible. Dualtron, Kaabo, Xiaomi, Nami, Vsett.",
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
