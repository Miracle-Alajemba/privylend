import { useState } from "react";
import { runAgentFlow, type ScoreResult } from "../agent/agentFlow";

export type StepState = "pending" | "active" | "success" | "error";

export interface ExecutionStep {
  name: string;
  status: StepState;
}

export function useT3Session() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [steps, setSteps] = useState<ExecutionStep[]>([
    { name: "Open TEE session", status: "pending" },
    { name: "Ingest documents", status: "pending" },
    { name: "Run credit scoring", status: "pending" },
    { name: "Issue verifiable credential", status: "pending" },
  ]);

  const resetSession = () => {
    setLoading(false);
    setError(null);
    setResult(null);
    setSteps([
      { name: "Open TEE session", status: "pending" },
      { name: "Ingest documents", status: "pending" },
      { name: "Run credit scoring", status: "pending" },
      { name: "Issue verifiable credential", status: "pending" },
    ]);
  };

  const startAnalysis = async (documentType: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Reset steps
    setSteps([
      { name: "Open TEE session", status: "pending" },
      { name: "Ingest documents", status: "pending" },
      { name: "Run credit scoring", status: "pending" },
      { name: "Issue verifiable credential", status: "pending" },
    ]);

    try {
      const scoreResult = await runAgentFlow(documentType, (activeStepIndex) => {
        setSteps((prevSteps) =>
          prevSteps.map((step, idx) => {
            if (idx < activeStepIndex) {
              return { ...step, status: "success" };
            } else if (idx === activeStepIndex) {
              return { ...step, status: "active" };
            } else {
              return { ...step, status: "pending" };
            }
          })
        );
      });

      // Mark all as success
      setSteps((prevSteps) => prevSteps.map((step) => ({ ...step, status: "success" })));
      setResult(scoreResult);
      return true;
    } catch (err: any) {
      setError(err.message || "An error occurred during T3 TEE analysis.");
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.status === "active" ? { ...step, status: "error" } : step
        )
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    steps,
    startAnalysis,
    resetSession,
  };
}
