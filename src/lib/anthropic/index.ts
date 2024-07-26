import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
}

const claudeClient = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

export default claudeClient;
