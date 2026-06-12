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
