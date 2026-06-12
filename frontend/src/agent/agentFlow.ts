import { createT3Client } from "./t3Client";
import { tenantDidHex } from "@terminal3/t3n-sdk";

export interface ScoreResult {
  tier: string;
  score: number;
  maxLoan: number;
  vcHash: string;
}

export async function runAgentFlow(
  documentType: string,
  onStepChange: (step: number) => void
): Promise<ScoreResult> {
  const apiKey = import.meta.env.VITE_T3N_API_KEY || "";
  const isMock = !apiKey || apiKey === "your_key_here";

  if (isMock) {
    console.warn("VITE_T3N_API_KEY is not configured. Running in Mock/Simulated TEE Enclave mode.");

    // Step 0: Open TEE session
    onStepChange(0);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 1: Ingest documents
    onStepChange(1);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 2: Run credit scoring
    onStepChange(2);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Issue verifiable credential
    onStepChange(3);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Determine score based on document type
    let score = 780;
    let tier = "Tier A";
    let maxLoan = 25000;

    if (documentType === "bank_statement") {
      score = 820;
      tier = "Tier A";
      maxLoan = 50000;
    } else if (documentType === "tax_return") {
      score = 710;
      tier = "Tier B";
      maxLoan = 20000;
    } else if (documentType === "utility_bill" || documentType === "payslip") {
      score = 610;
      tier = "Tier C";
      maxLoan = 5000;
    }

    const vcHash = "0x" + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    return {
      tier,
      score,
      maxLoan,
      vcHash,
    };
  }

  try {
    // Step 1: Open TEE session
    onStepChange(0); // TEE session opened (active)
    const { client, tenantDid } = await createT3Client();
    const tenantId = tenantDidHex(tenantDid);
    onStepChange(1); // Documents ingested (active)

    // Step 2: Call client.execute() with agent-auth-update to authorize the contract
    // scriptName is format: z:<tenantId>:privylend-contract
    const scriptName = `z:${tenantId}:privylend-contract`;
    console.log("Authorizing contract...", scriptName);

    await client.execute({
      action: "agent-auth-update",
      agentDid: tenantDid, // Using tenant DID as agent DID
      scriptName,
      functions: ["score-credit"],
      allowedHosts: [],
    });

    onStepChange(2); // Running credit scoring (active)

    // Step 3: Call client.executeAndDecode() with function_name: "score-credit" and input { documentType }
    console.log("Executing scoring logic inside TEE...");

    if (!client.executeAndDecode) {
      throw new Error("T3 Client does not support executeAndDecode");
    }

    const result = await client.executeAndDecode<ScoreResult>({
      function_name: "score-credit",
      input: {
        documentType,
      },
    });

    console.log("Scoring result received:", result);

    onStepChange(3); // Issue verifiable credential (active)
    return result;
  } catch (err: any) {
    console.error("Error in T3 Agent Orchestration:", err);
    throw err;
  }
}
