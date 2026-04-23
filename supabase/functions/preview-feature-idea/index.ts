import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface IdeaRow {
  id: string;
  title: string;
  description: string;
  votes_count: number;
  status: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string" || input.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Input too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // 1) Ask AI to normalize into title + description via tool calling
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You normalize raw feature requests for ReceiptOne (an expense / receipt / mileage / tax-report app for freelancers and small businesses). Output a clean, neutral product title (max 80 chars) and a short, specific description (max 220 chars). No marketing fluff. No emoji.",
          },
          { role: "user", content: input.slice(0, 1000) },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "normalize_idea",
              description: "Return normalized feature title and description.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", maxLength: 80 },
                  description: { type: "string", maxLength: 220 },
                },
                required: ["title", "description"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "normalize_idea" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      throw new Error("AI gateway error");
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;
    const title: string = (args?.title || input.slice(0, 80)).slice(0, 80);
    const description: string = (args?.description || input).slice(0, 220);

    // 2) Find similar ideas via simple keyword search
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const tokens = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 5);

    let similar: IdeaRow[] = [];
    if (tokens.length > 0) {
      const orFilter = tokens
        .map((t) => `title.ilike.%${t}%,description.ilike.%${t}%`)
        .join(",");
      const { data, error } = await supabase
        .from("feature_ideas")
        .select("id, title, description, votes_count, status")
        .or(orFilter)
        .order("votes_count", { ascending: false })
        .limit(3);
      if (error) console.error("similar search error", error);
      similar = (data as IdeaRow[]) ?? [];
    }

    return new Response(
      JSON.stringify({ title, description, similar }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("preview-feature-idea error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});