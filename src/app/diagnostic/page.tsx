"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ChevronRight, RotateCcw, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";

const BRANDS = [
  { id: "dualtron", name: "Dualtron", models: ["Thunder", "Victor", "Eagle", "Spider", "Mini", "Storm", "Achilleus", "X2"] },
  { id: "kaabo", name: "Kaabo", models: ["Mantis", "Wolf Warrior", "Wolf King", "Skywalker"] },
  { id: "xiaomi", name: "Xiaomi", models: ["M365", "Pro 2", "Essential", "Mi 4", "Mi 4 Pro"] },
  { id: "ninebot", name: "Ninebot", models: ["Max G30", "G2", "F2", "E2", "P100S"] },
  { id: "vsett", name: "Vsett", models: ["8", "9+", "10+", "11+"] },
  { id: "nami", name: "Nami", models: ["Burn-E", "Burn-E 2", "Klima", "Viper"] },
  { id: "teverun", name: "Teverun", models: ["Fighter", "Fighter Supreme", "Blade GT"] },
  { id: "kukirin", name: "Kukirin", models: ["G2 Pro", "G2 Max", "G4", "M5 Pro"] },
  { id: "minimotors", name: "Minimotors", models: ["Speedway 5", "Speedway Leger"] },
  { id: "etwow", name: "E-Twow", models: ["GT", "Booster S2", "Booster V"] },
  { id: "autre", name: "Autre marque", models: [] },
];

const PROBLEMS = [
  { id: "pneu", label: "Pneu creve / use", icon: "\u{1F6DE}", parts: ["Pneu", "Chambre a air", "Valve"] },
  { id: "frein", label: "Probleme de freinage", icon: "\u{1F6D1}", parts: ["Plaquettes de frein", "Disque de frein", "Cable de frein", "Levier de frein", "Frein hydraulique", "Fuite hydraulique"] },
  { id: "batterie", label: "Probleme de batterie", icon: "\u{1F50B}", parts: ["Batterie complete", "BMS", "Chargeur", "Connecteur batterie"] },
  { id: "moteur", label: "Probleme moteur", icon: "\u26A1", parts: ["Moteur complet", "Roulement moteur", "Cable moteur", "Capteur Hall"] },
  { id: "controleur", label: "Controleur / electronique", icon: "\u{1F5A5}\uFE0F", parts: ["Controleur", "Display/Afficheur", "Throttle/Accelerateur", "Cablage"] },
  { id: "suspension", label: "Suspension", icon: "\u{1F527}", parts: ["Amortisseur", "Ressort", "Silent bloc", "Axe de suspension"] },
  { id: "structure", label: "Structure / chassis", icon: "\u{1F529}", parts: ["Axe de roue", "Potence/Colonne", "Roulement de direction", "Deck/Plateau"] },
  { id: "eclairage", label: "Eclairage", icon: "\u{1F4A1}", parts: ["Phare avant", "Feu arriere", "Clignotants", "LED"] },
  { id: "autre", label: "Autre probleme", icon: "\u2753", parts: [] },
];

type Step = "brand" | "model" | "problem" | "part" | "result";

export default function DiagnosticPage() {
  const [step, setStep] = useState<Step>("brand");
  const [selectedBrand, setSelectedBrand] = useState<typeof BRANDS[0] | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedProblem, setSelectedProblem] = useState<typeof PROBLEMS[0] | null>(null);
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [customModel, setCustomModel] = useState("");

  function reset() {
    setStep("brand");
    setSelectedBrand(null);
    setSelectedModel("");
    setSelectedProblem(null);
    setSelectedPart("");
    setCustomModel("");
  }

  function handleBrandSelect(brand: typeof BRANDS[0]) {
    setSelectedBrand(brand);
    if (brand.id === "autre") {
      setStep("model"); // Will show custom input
    } else {
      setStep("model");
    }
  }

  function handleModelSelect(model: string) {
    setSelectedModel(model);
    setStep("problem");
  }

  function handleProblemSelect(problem: typeof PROBLEMS[0]) {
    setSelectedProblem(problem);
    if (problem.parts.length > 0) {
      setStep("part");
    } else {
      setStep("result");
    }
  }

  function handlePartSelect(part: string) {
    setSelectedPart(part);
    setStep("result");
  }

  const modelName = selectedModel || customModel;
  const fullName = selectedBrand ? `${selectedBrand.name} ${modelName}` : "";

  return (
    <div className="min-h-screen bg-noir-mat px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vert-neon/10 border border-vert-neon/20 mb-4">
            <Wrench size={16} className="text-vert-neon" />
            <span className="text-sm font-medium text-vert-neon">Assistant Diagnostic</span>
          </div>
          <h1 className="text-3xl font-bold text-blanc-casse mb-2">Diagnostiquez votre trottinette</h1>
          <p className="text-blanc-casse/60">Identifiez le probleme et trouvez la piece compatible en quelques clics</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["brand", "model", "problem", "part", "result"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full transition-colors ${
                ["brand", "model", "problem", "part", "result"].indexOf(step) >= i
                  ? "bg-vert-neon"
                  : "bg-white/20"
              }`} />
              {i < 4 && <div className={`h-0.5 w-6 transition-colors ${
                ["brand", "model", "problem", "part", "result"].indexOf(step) > i
                  ? "bg-vert-neon"
                  : "bg-white/10"
              }`} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Brand */}
          {step === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-blanc-casse mb-4">Quelle est la marque de votre trottinette ?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand)}
                    className="p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse hover:border-vert-neon/40 hover:bg-vert-neon/5 transition-all text-center"
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Model */}
          {step === "model" && (
            <motion.div
              key="model"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-blanc-casse mb-4">
                {selectedBrand?.id === "autre" ? "Entrez votre modele" : `Quel modele ${selectedBrand?.name} ?`}
              </h2>
              {selectedBrand?.id === "autre" ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="Ex: Inokim OX, Zero 10X..."
                    className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                  />
                  <button
                    onClick={() => { if (customModel.trim()) handleModelSelect(customModel.trim()); }}
                    disabled={!customModel.trim()}
                    className="w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Continuer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedBrand?.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => handleModelSelect(model)}
                      className="p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse hover:border-vert-neon/40 hover:bg-vert-neon/5 transition-all text-center"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Problem */}
          {step === "problem" && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-blanc-casse mb-1">Quel est le probleme ?</h2>
              <p className="text-sm text-blanc-casse/50 mb-4">{fullName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-gris-anthracite text-left text-sm font-medium text-blanc-casse hover:border-vert-neon/40 hover:bg-vert-neon/5 transition-all"
                  >
                    <span className="text-2xl">{problem.icon}</span>
                    <span>{problem.label}</span>
                    <ChevronRight size={16} className="ml-auto text-blanc-casse/30" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Part */}
          {step === "part" && (
            <motion.div
              key="part"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-blanc-casse mb-1">Quelle piece pensez-vous avoir besoin ?</h2>
              <p className="text-sm text-blanc-casse/50 mb-4">{fullName} - {selectedProblem?.label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProblem?.parts.map((part) => (
                  <button
                    key={part}
                    onClick={() => handlePartSelect(part)}
                    className="p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse hover:border-vert-neon/40 hover:bg-vert-neon/5 transition-all text-center"
                  >
                    {part}
                  </button>
                ))}
                <button
                  onClick={() => { setSelectedPart("Je ne sais pas"); setStep("result"); }}
                  className="p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse/60 hover:border-vert-neon/40 hover:bg-vert-neon/5 transition-all text-center"
                >
                  Je ne sais pas
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Result */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-vert-neon/20 bg-vert-neon/5 p-6">
                <h2 className="text-lg font-semibold text-vert-neon mb-4">Diagnostic complete</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-blanc-casse/60">Trottinette</span>
                    <span className="text-blanc-casse font-medium">{fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blanc-casse/60">Probleme</span>
                    <span className="text-blanc-casse font-medium">{selectedProblem?.label}</span>
                  </div>
                  {selectedPart && (
                    <div className="flex justify-between text-sm">
                      <span className="text-blanc-casse/60">Piece identifiee</span>
                      <span className="text-blanc-casse font-medium">{selectedPart}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-sm font-medium text-blanc-casse mb-3">Nos recommandations :</h3>
                  <ul className="space-y-2 text-sm text-blanc-casse/70">
                    <li className="flex items-start gap-2">
                      <span className="text-vert-neon mt-0.5">{"\u2713"}</span>
                      <span>Nous avons peut-etre cette piece en stock. Consultez notre boutique ou contactez-nous.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-vert-neon mt-0.5">{"\u2713"}</span>
                      <span>Si vous souhaitez que nous fassions la reparation, demandez un devis gratuit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-vert-neon mt-0.5">{"\u2713"}</span>
                      <span>Pour un diagnostic plus precis, envoyez-nous des photos du probleme.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={`/boutique?search=${encodeURIComponent(selectedPart || selectedProblem?.label || "")}`}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-vert-neon text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag size={16} />
                  Voir dans la boutique
                </Link>
                <Link
                  href={`/reparations?marque=${encodeURIComponent(selectedBrand?.name || "")}&modele=${encodeURIComponent(modelName)}&probleme=${encodeURIComponent(selectedProblem?.label || "")}&piece=${encodeURIComponent(selectedPart || "")}`}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse hover:border-vert-neon/40 transition-colors"
                >
                  <Wrench size={16} />
                  Demander une reparation
                </Link>
                <a
                  href="https://wa.me/33786757963?text=Bonjour, j'ai un probleme avec ma trottinette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse hover:border-vert-neon/40 transition-colors"
                >
                  <MessageSquare size={16} />
                  Nous contacter
                </a>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-gris-anthracite text-sm font-medium text-blanc-casse/60 hover:border-white/20 transition-colors"
                >
                  <RotateCcw size={16} />
                  Nouveau diagnostic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button */}
        {step !== "brand" && step !== "result" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              if (step === "model") setStep("brand");
              else if (step === "problem") setStep("model");
              else if (step === "part") setStep("problem");
            }}
            className="mt-6 text-sm text-blanc-casse/50 hover:text-blanc-casse transition-colors"
          >
            {"\u2190"} Retour
          </motion.button>
        )}
      </div>
    </div>
  );
}
