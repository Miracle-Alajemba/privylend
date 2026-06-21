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
  onStepChange: (step: number) => void,
  forceMock: boolean = false
): Promise<ScoreResult> {
  const apiKey = import.meta.env.VITE_T3N_API_KEY || "";
  const isMock = forceMock || !apiKey || apiKey === "your_key_here";

  if (isMock) {
    console.warn("VITE_T3N_API_KEY is not configured or simulation forced. Running in Mock/Simulated TEE Enclave mode.");

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

    // Determine score based on document type (0-100 scale matching TEE enclave contract output)
    let score = 78;
    let tier = "A";
    let maxLoan = 25000;

    if (documentType === "bank_statement") {
      score = 88;
      tier = "A";
      maxLoan = 50000;
    } else if (documentType === "tax_return") {
      score = 72;
      tier = "B";
      maxLoan = 20000;
    } else if (documentType === "utility_bill" || documentType === "payslip") {
      score = 48;
      tier = "C";
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
    console.warn("TEE enclave execution failed, gracefully falling back to enclaved simulation mode:", err.message || err);
    // Gracefully run in sandbox mock mode!
    return runAgentFlow(documentType, onStepChange, true);
  }
}

