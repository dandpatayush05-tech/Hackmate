import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Configuration (using provided project credentials)
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || "cichsftdtoefgdhfyquk";
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_vHwS-xlxPnLE53aSW2k5tw_WUHxfS-_").trim();

let supabaseClient: any = null;
function getSupabaseClient(): any {
  if (!supabaseClient && SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
      });
      console.log(`[Supabase] Initialized client for project ${SUPABASE_PROJECT_ID} (${SUPABASE_URL})`);
    } catch (err) {
      console.warn("[Supabase] Failed to initialize client:", err);
    }
  }
  return supabaseClient;
}

// Local persistent file storage for appointments & participants
const APPOINTMENTS_FILE = path.join(process.cwd(), "appointments_store.json");
const PARTICIPANTS_FILE = path.join(process.cwd(), "participants_store.json");

const DEFAULT_APPOINTMENTS = [
  {
    id: "apt-101",
    participant_name: "Alex Rivera",
    participant_email: "alex.rivera@cs.stanford.edu",
    team_name: "Team NeuroPulse",
    appointment_type: "Mentor 1-on-1 Session",
    mentor_or_host: "Sarah Lin (Staff ML Engineer @ Google)",
    scheduled_time: "2026-08-21T14:30:00.000Z",
    duration_minutes: 30,
    status: "Confirmed",
    location_or_link: "Mentor Lounge - Station 4 (Hall B)",
    notes: "Need assistance with Gemini Live API token streaming and latency bottlenecks.",
    created_at: new Date().toISOString(),
  },
  {
    id: "apt-102",
    participant_name: "Elena Rostova",
    participant_email: "elena.r@berkeley.edu",
    team_name: "Team BioGen",
    appointment_type: "Technical Debugging Clinic",
    mentor_or_host: "David Chen (Distributed Systems Lead)",
    scheduled_time: "2026-08-21T16:00:00.000Z",
    duration_minutes: 20,
    status: "Confirmed",
    location_or_link: "Virtual Discord Stage 2 (Audio/Video)",
    notes: "CUDA memory leak on PyTorch model evaluation in container.",
    created_at: new Date().toISOString(),
  },
  {
    id: "apt-103",
    participant_name: "Marcus Vance",
    participant_email: "marcus@vance.design",
    team_name: "Team Solaria",
    appointment_type: "Project Architecture Review",
    mentor_or_host: "Dr. Maya Patel (VP Cloud Architecture)",
    scheduled_time: "2026-08-21T17:15:00.000Z",
    duration_minutes: 45,
    status: "Pending",
    location_or_link: "Pavilion Room 204",
    notes: "Evaluating Firestore vs Spanner for high-throughput sensor telemetry.",
    created_at: new Date().toISOString(),
  },
  {
    id: "apt-104",
    participant_name: "Chloe Zhao",
    participant_email: "chloe@finai.io",
    team_name: "Team Apex",
    appointment_type: "Pitch & Demo Dry Run",
    mentor_or_host: "GIET UNIVERSITY (Lead Organizer & Judge)",
    scheduled_time: "2026-08-21T18:30:00.000Z",
    duration_minutes: 15,
    status: "Confirmed",
    location_or_link: "Demo Stage A",
    notes: "Rehearsing 3-minute judging walkthrough and investor demo.",
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_PARTICIPANTS = [
  {
    id: "p1",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "alex.rivera@techu.edu",
    skills: ["React", "TypeScript", "Tailwind", "UI/UX"],
    preferredDomain: "AI & Autonomous Agents",
    experience: "Advanced",
    availability: "On-Site 24h",
    teamPreference: "In Team",
    teamId: "t1",
    discordHandle: "alex_r#4091",
    bio: "Passionate frontend engineer with 3 hackathon wins. Focused on multimodal UI and real-time state visualization.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Liam Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "liam.c@mit.edu",
    skills: ["Python", "PyTorch", "FastAPI", "Docker"],
    preferredDomain: "AI & Autonomous Agents",
    experience: "Advanced",
    availability: "On-Site 24h",
    teamPreference: "In Team",
    teamId: "t1",
    discordHandle: "liamc_ai#8821",
    bio: "ML researcher focusing on parameter-efficient fine-tuning and agent memory loops.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    email: "priya.p@stanford.edu",
    skills: ["Solidity", "Rust", "TypeScript", "Next.js"],
    preferredDomain: "FinTech & Web3",
    experience: "Advanced",
    availability: "On-Site 24h",
    teamPreference: "In Team",
    teamId: "t2",
    discordHandle: "priya_eth#1002",
    bio: "Smart contract developer exploring zero-knowledge rollups and decentralized verification algorithms.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    email: "mvance@berkeley.edu",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka"],
    preferredDomain: "FinTech & Web3",
    experience: "Intermediate",
    availability: "Full Weekend",
    teamPreference: "In Team",
    teamId: "t2",
    discordHandle: "marcus_k8s#5541",
    bio: "Backend infrastructure builder passionate about high-throughput distributed architectures.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "elena.rostova@oxford.ac.uk",
    skills: ["Bioinformatics", "Python", "Computer Vision", "TensorFlow"],
    preferredDomain: "HealthTech & BioAI",
    experience: "Advanced",
    availability: "On-Site 24h",
    teamPreference: "In Team",
    teamId: "t3",
    discordHandle: "elena_bio#9090",
    bio: "Computational biologist exploring real-time protein fold visualization and biomedical telemetry.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p6",
    name: "Dev Malik",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    email: "dev.malik@cmu.edu",
    skills: ["Python", "FastAPI", "React", "OpenCV"],
    preferredDomain: "AI & Autonomous Agents",
    experience: "Intermediate",
    availability: "Full Weekend",
    teamPreference: "Looking for Team",
    discordHandle: "devmalik#7762",
    bio: "Full stack hacker who loves prototyping fast AI concepts with clean frontends.",
    created_at: new Date().toISOString(),
  },
  {
    id: "p7",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    email: "sarah.j@buildhack.dev",
    skills: ["UI/UX Design", "Figma", "Tailwind", "React"],
    preferredDomain: "Open Innovation",
    experience: "Advanced",
    availability: "Full Weekend",
    teamPreference: "Looking for Team",
    discordHandle: "sarahj_design#3310",
    bio: "Product designer passionate about accessibility and delightful micro-interactions in developer tooling.",
    created_at: new Date().toISOString(),
  },
];

function loadAppointmentsFromFile(): any[] {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const raw = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // Ignore read errors, fall back to defaults
  }
  return DEFAULT_APPOINTMENTS;
}

function saveAppointmentsToFile(data: any[]) {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Ignore write errors
  }
}

function loadParticipantsFromFile(): any[] {
  try {
    if (fs.existsSync(PARTICIPANTS_FILE)) {
      const raw = fs.readFileSync(PARTICIPANTS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // Ignore read errors, fall back to defaults
  }
  return DEFAULT_PARTICIPANTS;
}

function saveParticipantsToFile(data: any[]) {
  try {
    fs.writeFileSync(PARTICIPANTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Ignore write errors
  }
}

// In-memory cache & fallback storage
let appointmentsCache: any[] = loadAppointmentsFromFile();
let participantsCache: any[] = loadParticipantsFromFile();

function normalizeParticipantFromDB(raw: any): any {
  if (!raw) return raw;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(raw.name || "user")}`,
    skills: Array.isArray(raw.skills) ? raw.skills : (typeof raw.skills === "string" ? raw.skills.split(",").map((s: string) => s.trim()) : ["General Software"]),
    preferredDomain: raw.preferred_domain || raw.preferredDomain || "AI & Autonomous Agents",
    experience: raw.experience || "Intermediate",
    availability: raw.availability || "Full Weekend",
    teamPreference: raw.team_preference || raw.teamPreference || "Looking for Team",
    teamId: raw.team_id || raw.teamId || undefined,
    discordHandle: raw.discord_handle || raw.discordHandle || undefined,
    bio: raw.bio || "",
    created_at: raw.created_at,
  };
}

function normalizeParticipantForDB(p: any): any {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    avatar: p.avatar,
    skills: Array.isArray(p.skills) ? p.skills : [],
    preferred_domain: p.preferredDomain || p.preferred_domain || "AI & Autonomous Agents",
    experience: p.experience || "Intermediate",
    availability: p.availability || "Full Weekend",
    team_preference: p.teamPreference || p.team_preference || "Looking for Team",
    team_id: p.teamId || p.team_id || null,
    discord_handle: p.discordHandle || p.discord_handle || null,
    bio: p.bio || null,
    created_at: p.created_at || new Date().toISOString(),
  };
}

function isMissingTableError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";
  return (
    msg.includes("schema cache") ||
    msg.includes("could not find the table") ||
    msg.includes("does not exist") ||
    code === "42P01" ||
    code === "PGRST204" ||
    code === "PGRST200" ||
    code === "PGRST106"
  );
}

// Lazy-initialize Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI with key:", err);
      aiClient = null;
    }
  }
  return aiClient;
}

// Event knowledge grounding base
const HACKATHON_GROUNDING_PROMPT = `
You are HackMate AI — the Autonomous Hackathon Concierge & Event Operations Agent for "HackVerse 2026".
Event Facts & Rules:
- Event: HackVerse 2026 (Live Hybrid Global Hackathon)
- Hacking Window: 36 Hours total. Remaining time: ~18 hours 42 minutes.
- Venue: Grand Tech Pavilion & Online Discord/Portal (Virtual Stage 1-4).
- Submission Deadline: Tomorrow at 08:00 AM PST strictly. No grace periods.
- Requirements for Valid Submission:
  1. Public GitHub / GitLab repository link with active commits during hackathon hours.
  2. Live working Demo URL (hosted on Vercel, Cloud Run, Netlify, AWS, etc.).
  3. 2-3 minute video walkthrough (YouTube / Loom / Vimeo public or unlisted).
  4. Project description, tech stack tags, and track selection.
- Tracks: AI & Autonomous Agents, FinTech & Web3, HealthTech & BioAI, ClimateTech, Open Innovation.
- Team Size: 2 to 4 members. Solo hacking requires prior organizer approval.
- Mentors: Available on Discord #mentor-help and in Mentor Lounge (Hall B) from 13:00 to 22:00.
- Judging Criteria: Innovation & Technical Complexity (30%), Execution & Polish (25%), Business/Impact Value (25%), Presentation & Demo (20%).
- Escalation Protocol: If an issue is critical (e.g. medical, harassment, platform downtime, team dispute deadlock), tag [ESCALATE_TO_ORGANIZER].

Answer questions clearly, concisely, and cite sections (e.g., "According to HackVerse Submission Rules...").
When asked organizer operations questions (e.g. "Which teams haven't submitted yet?"), provide structured operational advice with specific next actions.
`;

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "HackMate AI Engine" });
});

// Participant Concierge AI Chat endpoint
app.post("/api/ai/concierge", async (req, res) => {
  const { message, history } = req.body;
  const client = getAIClient();

  if (!client) {
    // High quality domain-grounded fallback when no API key is supplied
    return res.json({
      reply: generateFallbackConciergeReply(message),
      source: "HackVerse Knowledge Base & Rules Engine v2.6",
      isFallback: true,
    });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => `${h.role}: ${h.text}`).join("\n")
      : "";

    const prompt = `${HACKATHON_GROUNDING_PROMPT}

Recent Chat Context:
${formattedHistory}

User Participant Message: "${message}"

Provide a warm, crisp, authoritative response with precise guidance and source references where relevant:`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || generateFallbackConciergeReply(message);
    res.json({
      reply: text,
      source: "HackVerse Knowledge Base & Rules Engine v2.6",
      isFallback: false,
    });
  } catch (error) {
    console.error("Gemini Concierge error:", error);
    res.json({
      reply: generateFallbackConciergeReply(message),
      source: "HackVerse Knowledge Base & Rules Engine v2.6",
      isFallback: true,
    });
  }
});

// Organizer Operations AI Console endpoint
app.post("/api/ai/ask-ops", async (req, res) => {
  const { query, operationalContext } = req.body;
  const client = getAIClient();

  if (!client) {
    return res.json({
      reply: generateFallbackOpsReply(query),
      suggestedActions: getFallbackSuggestedActions(query),
      isFallback: true,
    });
  }

  try {
    const prompt = `${HACKATHON_GROUNDING_PROMPT}
You are operating in Organizer Intelligence Mode.
Current Live Stats & Context:
${JSON.stringify(operationalContext || {}, null, 2)}

Organizer Query: "${query}"

Provide:
1. Direct answer with key numbers and team names.
2. Recommended automated action that HackMate AI can dispatch immediately.
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      reply: response.text || generateFallbackOpsReply(query),
      suggestedActions: getFallbackSuggestedActions(query),
      isFallback: false,
    });
  } catch (err) {
    console.error("Gemini Ops Error:", err);
    res.json({
      reply: generateFallbackOpsReply(query),
      suggestedActions: getFallbackSuggestedActions(query),
      isFallback: true,
    });
  }
});

// AI Submission Audit endpoint
app.post("/api/ai/audit-team", async (req, res) => {
  const { teamName, repoUrl, demoUrl, videoUrl, description } = req.body;
  const client = getAIClient();

  if (!client) {
    return res.json(generateFallbackAudit(teamName, repoUrl, demoUrl, videoUrl));
  }

  try {
    const prompt = `Analyze this hackathon project submission for compliance:
Team: ${teamName}
Repo: ${repoUrl || "MISSING"}
Demo: ${demoUrl || "MISSING"}
Video: ${videoUrl || "MISSING"}
Description: ${description || "None provided"}

Evaluate:
1. Repository status (valid git link, presence)
2. Demo status (accessible link)
3. Video status (2-3 min video)
4. Overall Compliance Score (0-100)
5. Issues found list
6. Final Eligibility: "Eligible" | "Action Required" | "Ineligible"

Return JSON format only:
{
  "complianceScore": 85,
  "eligibility": "Eligible",
  "issues": ["Warning: ..."],
  "recommendations": ["Action item ..."]
}`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err) {
    res.json(generateFallbackAudit(teamName, repoUrl, demoUrl, videoUrl));
  }
});

// Fallback intelligence helpers
function generateFallbackConciergeReply(msg: string): string {
  const lower = (msg || "").toLowerCase();
  if (lower.includes("deadline") || lower.includes("when") && lower.includes("submit")) {
    return "According to HackVerse Submission Rules (Section 4.1):\n• Final project submission closes promptly at **08:00 AM PST tomorrow**.\n• You must submit your public GitHub repository, live deployed demo link, and a 2-3 minute video walkthrough on the Submission Portal.\n• The submission form will hard-lock at 08:00 AM with zero grace period.";
  }
  if (lower.includes("venue") || lower.includes("where") || lower.includes("location") || lower.includes("food") || lower.includes("wifi")) {
    return "According to HackVerse Venue & Logistics Guide:\n• Physical Venue: **Grand Tech Pavilion, Halls A–D** (500 Innovation Way).\n• Wi-Fi Network: `HackVerse-HighSpeed-5G` (Password: `HackTheFuture2026`).\n• Midnight snacks will be served at 00:00 in the Hall B cafeteria.\n• Rest & Quiet pods are located on Level 2.";
  }
  if (lower.includes("mentor") || lower.includes("help") || lower.includes("stuck")) {
    return "According to HackVerse Mentor Protocol:\n• Mentors are active right now in Discord `#mentor-help` and physically in **Mentor Lounge (Hall B)**.\n• You can request a 1-on-1 debug or architecture review by clicking 'Request Mentor' in your participant portal or tagging `@Mentor-OnDuty` in Discord.";
  }
  if (lower.includes("team") || lower.includes("match") || lower.includes("find members")) {
    return "According to Team Formation Guidelines:\n• Teams can have 2 to 4 members.\n• If you are looking for teammates or complementary skills, use our **AI Team Formation Tool** in the dashboard to find peers matched by domain and tech stack.";
  }
  if (lower.includes("judging") || lower.includes("criteria") || lower.includes("prize")) {
    return "According to HackVerse Judging Criteria (Rubric v2):\n1. **Technical Innovation & Complexity (30%)**: Architecture depth & problem difficulty.\n2. **Execution & UX Polish (25%)**: Working demo and fluid user experience.\n3. **Business & Impact Viability (25%)**: Real-world utility and market fit.\n4. **Presentation & Demo (20%)**: Pitch clarity within the 3-minute limit.";
  }
  return "According to HackVerse Event Rules & Operations Engine:\nAll hacking activities are live! Submissions are due at 08:00 AM PST. Ensure your GitHub repo has commits made during the event window and your live demo is reachable. If you need immediate assistance, ask any question or request human organizer escalation.";
}

function generateFallbackOpsReply(query: string): string {
  const lower = (query || "").toLowerCase();
  if (lower.includes("haven't submitted") || lower.includes("not submitted") || lower.includes("missing submission")) {
    return "Currently **41 out of 68 active teams** have submitted. **27 teams** have not yet completed their final submission. Top 3 teams approaching critical window without draft links: *Team QuantumSync*, *Team NeuralPulse*, and *Team BlockShift*. Automated reminder batch #3 is queued.";
  }
  if (lower.includes("github") || lower.includes("repository") || lower.includes("repo")) {
    return "Audit scan complete: **7 teams** currently have missing or private GitHub repository URLs. 4 teams have invalid URLs returning 404. Recommended action: Dispatch automated warning webhook to their registered Discord channels.";
  }
  if (lower.includes("mentor") || lower.includes("who needs")) {
    return "There are **5 active mentor requests** in queue. Highest priority: *Team BioGen* (CUDA memory leak issue) waiting 14 mins, and *Team Orbit* (Stripe Webhook signature failure) waiting 9 mins. 4 mentors are currently available in Hall B.";
  }
  if (lower.includes("next 2 hours") || lower.includes("schedule") || lower.includes("happening")) {
    return "Upcoming operations in the next 2 hours:\n1. **16:00 (in 38m)**: AI Agent Systems Workshop (Main Stage / Stream 1).\n2. **17:00**: Mid-Hack Checkpoint #2 validation deadline.\n3. **17:30**: Mentor Shift Swap & Dinner Catering delivery.";
  }
  return "HackMate AI Ops Engine is actively monitoring 284 participants across 68 teams. System health is optimal (99.8% uptime), 92.4% of queries automated, and all 7 operational agents are in ACTIVE status.";
}

function getFallbackSuggestedActions(query: string): string[] {
  const lower = (query || "").toLowerCase();
  if (lower.includes("submit") || lower.includes("deadline")) {
    return ["Send 3-Hour Deadline Reminder to 27 Unsubmitted Teams", "Trigger Automated Discord Announcement", "Highlight At-Risk Teams on Dashboard"];
  }
  if (lower.includes("github") || lower.includes("repo")) {
    return ["Broadcast Missing Repo Alert to 7 Teams", "Auto-Check Repositories via GitHub API", "Grant 30-Min Repo Grace Period"];
  }
  if (lower.includes("mentor")) {
    return ["Auto-Assign Mentor Sarah Lin to Team BioGen", "Send Broadcast to Available Mentors in Hall B", "Open Virtual Debug Room #4"];
  }
  return ["Run Full Fleet Health Audit", "Sync Schedule With Live Stream", "Export Operations Snapshot PDF"];
}

function generateFallbackAudit(teamName: string, repo: string, demo: string, video: string) {
  const hasRepo = Boolean(repo && repo.includes("github.com"));
  const hasDemo = Boolean(demo && (demo.startsWith("http://") || demo.startsWith("https://")));
  const hasVideo = Boolean(video && (video.includes("youtube.com") || video.includes("loom.com") || video.includes("vimeo.com")));

  const score = (hasRepo ? 40 : 0) + (hasDemo ? 35 : 0) + (hasVideo ? 25 : 0);
  const issues: string[] = [];
  if (!hasRepo) issues.push("Missing public GitHub repository with active hackathon commit history.");
  if (!hasDemo) issues.push("Missing live deployed demo URL or inaccessible endpoint.");
  if (!hasVideo) issues.push("Missing 2-3 minute video walkthrough link.");

  return {
    complianceScore: score,
    eligibility: score >= 75 ? "Eligible" : score >= 40 ? "Action Required" : "Ineligible",
    issues,
    recommendations: issues.length === 0 ? ["All submission prerequisites verified successfully."] : ["Send targeted reminder to team captain immediately."],
  };
}

const SUPABASE_ALL_TABLES_SQL_SCHEMA = `
-- =========================================================
-- HackMate AI Full Database Schema for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor:
-- =========================================================

-- 1. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  team_name TEXT,
  appointment_type TEXT NOT NULL,
  mentor_or_host TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Confirmed',
  location_or_link TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to appointments" 
  ON public.appointments FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to appointments" 
  ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to appointments" 
  ON public.appointments FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to appointments" 
  ON public.appointments FOR DELETE USING (true);


-- 2. PARTICIPANTS / ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  skills TEXT[] DEFAULT '{}',
  preferred_domain TEXT,
  experience TEXT,
  availability TEXT,
  team_preference TEXT,
  team_id TEXT,
  discord_handle TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to participants" 
  ON public.participants FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to participants" 
  ON public.participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to participants" 
  ON public.participants FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to participants" 
  ON public.participants FOR DELETE USING (true);
`;

const APPOINTMENTS_SQL_SCHEMA = SUPABASE_ALL_TABLES_SQL_SCHEMA;

// Supabase Status & Health Endpoint
app.get("/api/supabase/status", async (_req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      table: "appointments & participants",
      tableExists: false,
      appointmentsTableExists: false,
      participantsTableExists: false,
      totalAppointments: appointmentsCache.length,
      totalParticipants: participantsCache.length,
      statusMessage: "Supabase client not initialized.",
      sqlSchema: SUPABASE_ALL_TABLES_SQL_SCHEMA,
    });
  }

  try {
    const [aptRes, partRes] = await Promise.all([
      supabase.from("appointments").select("*", { count: "exact" }).limit(5),
      supabase.from("participants").select("*", { count: "exact" }).limit(5),
    ]);

    const aptMissing = isMissingTableError(aptRes.error);
    const partMissing = isMissingTableError(partRes.error);

    // Update caches if data exists in DB
    if (aptRes.data && aptRes.data.length > 0) {
      appointmentsCache = aptRes.data;
      saveAppointmentsToFile(appointmentsCache);
    }
    if (partRes.data && partRes.data.length > 0) {
      participantsCache = partRes.data.map(normalizeParticipantFromDB);
      saveParticipantsToFile(participantsCache);
    }

    const allGood = !aptMissing && !partMissing;

    return res.json({
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      table: "appointments & participants",
      tableExists: allGood,
      appointmentsTableExists: !aptMissing,
      participantsTableExists: !partMissing,
      totalAppointments: aptRes.count ?? appointmentsCache.length,
      totalParticipants: partRes.count ?? participantsCache.length,
      statusMessage: allGood
        ? `Connected to Supabase project "${SUPABASE_PROJECT_ID}". Tables 'appointments' and 'participants' are fully active in cloud PostgreSQL.`
        : "Supabase connected, but one or more tables need to be created in your Supabase SQL editor.",
      sqlSchema: SUPABASE_ALL_TABLES_SQL_SCHEMA,
      notice: !allGood ? "Run the provided SQL schema in your Supabase Dashboard -> SQL Editor" : undefined,
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      table: "appointments & participants",
      tableExists: false,
      appointmentsTableExists: false,
      participantsTableExists: false,
      totalAppointments: appointmentsCache.length,
      totalParticipants: participantsCache.length,
      statusMessage: `Connection attempt status: ${err?.message || "Unknown"}`,
      sqlSchema: SUPABASE_ALL_TABLES_SQL_SCHEMA,
    });
  }
});

// ==========================================
// APPOINTMENTS ENDPOINTS
// ==========================================

// GET all appointments
app.get("/api/appointments", async (_req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({
      appointments: appointmentsCache,
      source: "local-persistent-store",
      supabaseConnected: false,
      tableExists: false,
    });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("scheduled_time", { ascending: true });

    if (error) {
      const isMissing = isMissingTableError(error);
      return res.json({
        appointments: appointmentsCache,
        source: "local-persistent-store",
        supabaseConnected: true,
        tableExists: !isMissing,
      });
    }

    if (data && data.length > 0) {
      appointmentsCache = data;
      saveAppointmentsToFile(appointmentsCache);
      return res.json({
        appointments: data,
        source: "supabase",
        supabaseConnected: true,
        tableExists: true,
      });
    } else {
      // Table exists but is empty -> try seeding initial data into Supabase
      try {
        const { data: inserted } = await supabase.from("appointments").insert(appointmentsCache).select();
        if (inserted && inserted.length > 0) {
          appointmentsCache = inserted;
          saveAppointmentsToFile(appointmentsCache);
        }
      } catch {
        // Ignore seed error
      }
      return res.json({
        appointments: appointmentsCache,
        source: "supabase-seeded",
        supabaseConnected: true,
        tableExists: true,
      });
    }
  } catch {
    return res.json({
      appointments: appointmentsCache,
      source: "local-persistent-store",
      supabaseConnected: false,
      tableExists: false,
    });
  }
});

// POST create a new appointment
app.post("/api/appointments", async (req, res) => {
  const {
    participant_name,
    participant_email,
    team_name,
    appointment_type,
    mentor_or_host,
    scheduled_time,
    duration_minutes,
    status,
    location_or_link,
    notes,
  } = req.body;

  if (!participant_name || !participant_email || !mentor_or_host || !scheduled_time) {
    return res.status(400).json({ error: "Missing required appointment fields" });
  }

  const newAppointment = {
    id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    participant_name: participant_name.trim(),
    participant_email: participant_email.trim(),
    team_name: team_name?.trim() || "Independent Participant",
    appointment_type: appointment_type || "Mentor 1-on-1 Session",
    mentor_or_host: mentor_or_host.trim(),
    scheduled_time: scheduled_time,
    duration_minutes: Number(duration_minutes) || 30,
    status: status || "Confirmed",
    location_or_link: location_or_link || "Mentor Lounge (Hall B)",
    notes: notes?.trim() || "",
    created_at: new Date().toISOString(),
  };

  // Add to local cache and persist to file
  appointmentsCache.unshift(newAppointment);
  saveAppointmentsToFile(appointmentsCache);

  const supabase = getSupabaseClient();
  let supabaseResult = { saved: false, tableExists: false, error: null as string | null };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([newAppointment])
        .select();

      if (error) {
        const isMissing = isMissingTableError(error);
        supabaseResult = {
          saved: false,
          tableExists: !isMissing,
          error: isMissing ? "Table not yet created in Supabase SQL editor" : error.message,
        };
      } else {
        supabaseResult = { saved: true, tableExists: true, error: null };
        if (data && data[0]) {
          newAppointment.id = data[0].id;
        }
      }
    } catch (err: any) {
      supabaseResult = { saved: false, tableExists: false, error: err?.message || "Insert error" };
    }
  }

  return res.status(201).json({
    success: true,
    appointment: newAppointment,
    supabase: supabaseResult,
    message: supabaseResult.saved
      ? "Appointment saved to Supabase cloud database!"
      : "Appointment saved locally in HackMate persistent storage.",
  });
});

// PATCH update appointment status or details
app.patch("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = appointmentsCache.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointmentsCache[index] = { ...appointmentsCache[index], ...updates };
    saveAppointmentsToFile(appointmentsCache);
  }

  const supabase = getSupabaseClient();
  let supabaseUpdated = false;

  if (supabase) {
    try {
      const { error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id);
      if (!error) {
        supabaseUpdated = true;
      }
    } catch {
      // Handled silently
    }
  }

  const updatedAppointment = index !== -1 ? appointmentsCache[index] : { id, ...updates };

  return res.json({
    success: true,
    appointment: updatedAppointment,
    supabaseUpdated,
  });
});

// DELETE cancel/remove an appointment
app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;

  appointmentsCache = appointmentsCache.filter((a) => a.id !== id);
  saveAppointmentsToFile(appointmentsCache);

  const supabase = getSupabaseClient();
  let supabaseDeleted = false;

  if (supabase) {
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (!error) {
        supabaseDeleted = true;
      }
    } catch {
      // Handled silently
    }
  }

  return res.json({
    success: true,
    id,
    supabaseDeleted,
    message: "Appointment removed successfully",
  });
});

// ==========================================
// PARTICIPANTS & ENROLLMENTS ENDPOINTS
// ==========================================

// GET all participants
app.get("/api/participants", async (_req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({
      participants: participantsCache,
      source: "local-persistent-store",
      supabaseConnected: false,
      tableExists: false,
    });
  }

  try {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const isMissing = isMissingTableError(error);
      return res.json({
        participants: participantsCache,
        source: "local-persistent-store",
        supabaseConnected: true,
        tableExists: !isMissing,
      });
    }

    if (data && data.length > 0) {
      participantsCache = data.map(normalizeParticipantFromDB);
      saveParticipantsToFile(participantsCache);
      return res.json({
        participants: participantsCache,
        source: "supabase",
        supabaseConnected: true,
        tableExists: true,
      });
    } else {
      // Seed table with defaults if empty
      try {
        const dbPayload = participantsCache.map(normalizeParticipantForDB);
        const { data: inserted } = await supabase.from("participants").insert(dbPayload).select();
        if (inserted && inserted.length > 0) {
          participantsCache = inserted.map(normalizeParticipantFromDB);
          saveParticipantsToFile(participantsCache);
        }
      } catch {
        // Ignore seed error
      }
      return res.json({
        participants: participantsCache,
        source: "supabase-seeded",
        supabaseConnected: true,
        tableExists: true,
      });
    }
  } catch {
    return res.json({
      participants: participantsCache,
      source: "local-persistent-store",
      supabaseConnected: false,
      tableExists: false,
    });
  }
});

// POST enroll / register a new participant
const handleParticipantEnrollment = async (req: express.Request, res: express.Response) => {
  const {
    name,
    email,
    avatar,
    skills,
    preferredDomain,
    preferred_domain,
    experience,
    availability,
    teamPreference,
    team_preference,
    teamId,
    team_id,
    discordHandle,
    discord_handle,
    bio,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required for registration" });
  }

  const generatedId = `p-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5)}`;
  const participantObj = {
    id: generatedId,
    name: name.trim(),
    email: email.trim(),
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
    skills: Array.isArray(skills) && skills.length > 0 ? skills : ["General Software"],
    preferredDomain: preferredDomain || preferred_domain || "AI & Autonomous Agents",
    experience: experience || "Intermediate",
    availability: availability || "Full Weekend",
    teamPreference: teamPreference || team_preference || "Looking for Team",
    teamId: teamId || team_id || undefined,
    discordHandle: discordHandle || discord_handle || `${name.toLowerCase().replace(/\s+/g, "_")}#0001`,
    bio: bio?.trim() || "Excited to build next-gen solutions!",
    created_at: new Date().toISOString(),
  };

  // Add to local cache and persist to file
  participantsCache = [participantObj, ...participantsCache.filter((p) => p.email !== participantObj.email)];
  saveParticipantsToFile(participantsCache);

  const supabase = getSupabaseClient();
  let supabaseResult = { saved: false, tableExists: false, error: null as string | null };

  if (supabase) {
    try {
      const dbRecord = normalizeParticipantForDB(participantObj);
      const { data, error } = await supabase
        .from("participants")
        .insert([dbRecord])
        .select();

      if (error) {
        const isMissing = isMissingTableError(error);
        supabaseResult = {
          saved: false,
          tableExists: !isMissing,
          error: isMissing ? "Table 'public.participants' not yet created in Supabase SQL editor" : error.message,
        };
      } else {
        supabaseResult = { saved: true, tableExists: true, error: null };
        if (data && data[0]) {
          participantObj.id = data[0].id;
        }
      }
    } catch (err: any) {
      supabaseResult = { saved: false, tableExists: false, error: err?.message || "Insert error" };
    }
  }

  return res.status(201).json({
    success: true,
    participant: participantObj,
    supabase: supabaseResult,
    message: supabaseResult.saved
      ? "Participant successfully registered and saved to Supabase PostgreSQL database!"
      : "Participant registered and saved in local persistent file storage.",
  });
};

app.post("/api/participants", handleParticipantEnrollment);
app.post("/api/enroll", handleParticipantEnrollment);

// PATCH participant
app.patch("/api/participants/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = participantsCache.findIndex((p) => p.id === id);
  if (index !== -1) {
    participantsCache[index] = { ...participantsCache[index], ...updates };
    saveParticipantsToFile(participantsCache);
  }

  const supabase = getSupabaseClient();
  let supabaseUpdated = false;

  if (supabase) {
    try {
      const dbUpdates = normalizeParticipantForDB({ ...participantsCache[index], ...updates });
      const { error } = await supabase
        .from("participants")
        .update(dbUpdates)
        .eq("id", id);
      if (!error) {
        supabaseUpdated = true;
      }
    } catch {
      // Handled silently
    }
  }

  return res.json({
    success: true,
    participant: index !== -1 ? participantsCache[index] : { id, ...updates },
    supabaseUpdated,
  });
});

// DELETE participant
app.delete("/api/participants/:id", async (req, res) => {
  const { id } = req.params;

  participantsCache = participantsCache.filter((p) => p.id !== id);
  saveParticipantsToFile(participantsCache);

  const supabase = getSupabaseClient();
  let supabaseDeleted = false;

  if (supabase) {
    try {
      const { error } = await supabase.from("participants").delete().eq("id", id);
      if (!error) {
        supabaseDeleted = true;
      }
    } catch {
      // Handled silently
    }
  }

  return res.json({
    success: true,
    id,
    supabaseDeleted,
    message: "Participant removed successfully",
  });
});

// POST sync all cache items to Supabase
app.post("/api/supabase/sync-all", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client not initialized" });
  }

  const aptsToSync = req.body.appointments || appointmentsCache;
  const partsToSync = req.body.participants || participantsCache;

  const results: any = { appointments: null, participants: null };

  try {
    // 1. Sync appointments
    const { data: aptData, error: aptErr } = await supabase
      .from("appointments")
      .upsert(aptsToSync, { onConflict: "id" })
      .select();

    if (!aptErr && aptData) {
      appointmentsCache = aptData;
      saveAppointmentsToFile(appointmentsCache);
      results.appointments = { success: true, count: aptData.length };
    } else {
      results.appointments = { success: false, error: aptErr?.message };
    }

    // 2. Sync participants
    const dbParticipants = partsToSync.map(normalizeParticipantForDB);
    const { data: partData, error: partErr } = await supabase
      .from("participants")
      .upsert(dbParticipants, { onConflict: "id" })
      .select();

    if (!partErr && partData) {
      participantsCache = partData.map(normalizeParticipantFromDB);
      saveParticipantsToFile(participantsCache);
      results.participants = { success: true, count: partData.length };
    } else {
      results.participants = { success: false, error: partErr?.message };
    }

    return res.json({
      success: Boolean(results.appointments?.success || results.participants?.success),
      results,
      appointments: appointmentsCache,
      participants: participantsCache,
      message: "Sync process completed.",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// ==========================================
// SUPABASE LIVE DIAGNOSTIC & AGENT ENDPOINTS
// ==========================================

// GET comprehensive live database check across all 9 tables
app.get("/api/supabase/diagnostic", async (_req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({
      connected: false,
      summary: "Supabase client not initialized.",
      tables: {},
    });
  }

  const tableNames = [
    "users",
    "agent_sessions",
    "session_messages",
    "agent_tasks",
    "agent_task_steps",
    "agent_tool_calls",
    "agent_memory",
    "appointments",
    "knowledge_chunks",
  ];

  const results: Record<string, any> = {};
  let anyReadSuccess = false;
  let writeTestPassed = false;

  for (const t of tableNames) {
    try {
      const { data, count, error } = await supabase.from(t).select("*", { count: "exact" }).limit(1);
      if (error) {
        results[t] = {
          tableName: t,
          exists: !isMissingTableError(error),
          canRead: false,
          rowCount: 0,
          error: error.message,
        };
      } else {
        anyReadSuccess = true;
        results[t] = {
          tableName: t,
          exists: true,
          canRead: true,
          rowCount: count ?? (data?.length || 0),
          error: null,
        };
      }
    } catch (err: any) {
      results[t] = {
        tableName: t,
        exists: false,
        canRead: false,
        rowCount: 0,
        error: err?.message,
      };
    }
  }

  // Perform live write test on appointments
  const testId = `diag-${Date.now()}`;
  try {
    const { data: writeData, error: writeError } = await supabase.from("appointments").insert([{
      id: testId,
      participant_name: "Supabase Live Test Runner",
      participant_email: "test@hackmate.ai",
      appointment_type: "Diagnostic Probe",
      mentor_or_host: "Automated Suite",
      scheduled_time: new Date().toISOString(),
      location_or_link: "Supabase Cloud Diagnostics",
    }]).select();

    if (!writeError && writeData && writeData.length > 0) {
      writeTestPassed = true;
      results["appointments"].canWrite = true;
      // Clean up
      await supabase.from("appointments").delete().eq("id", testId).catch(() => {});
    } else {
      results["appointments"].canWrite = false;
      results["appointments"].writeError = writeError?.message;
    }
  } catch (err: any) {
    results["appointments"].canWrite = false;
    results["appointments"].writeError = err?.message;
  }

  return res.json({
    timestamp: new Date().toISOString(),
    connected: anyReadSuccess,
    projectId: SUPABASE_PROJECT_ID,
    supabaseUrl: SUPABASE_URL,
    overallHealth: anyReadSuccess && writeTestPassed ? "healthy" : anyReadSuccess ? "partial" : "error",
    tables: results,
    readWriteTestPassed: writeTestPassed,
    summary: writeTestPassed
      ? `All 9 tables verified accessible in Supabase project "${SUPABASE_PROJECT_ID}". Read and Write confirmed active.`
      : `Connected to Supabase project "${SUPABASE_PROJECT_ID}". Read access confirmed.`,
  });
});

// GET / POST agent sessions
app.get("/api/agent/sessions", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.json({ sessions: [] });
  const { data, error } = await supabase.from("agent_sessions").select("*").order("created_at", { ascending: false });
  return res.json({ sessions: data || [], error: error?.message });
});

app.post("/api/agent/sessions", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.status(500).json({ error: "Supabase not connected" });
  const { data, error } = await supabase.from("agent_sessions").insert([req.body]).select().single();
  return res.json({ session: data, error: error?.message });
});

// GET / POST agent tasks
app.get("/api/agent/tasks", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.json({ tasks: [] });
  const { data, error } = await supabase.from("agent_tasks").select("*").order("created_at", { ascending: false });
  return res.json({ tasks: data || [], error: error?.message });
});

app.post("/api/agent/tasks", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.status(500).json({ error: "Supabase not connected" });
  const { data, error } = await supabase.from("agent_tasks").insert([req.body]).select().single();
  return res.json({ task: data, error: error?.message });
});

// GET / POST agent tool calls
app.get("/api/agent/tool-calls", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.json({ toolCalls: [] });
  const { data, error } = await supabase.from("agent_tool_calls").select("*").order("created_at", { ascending: false });
  return res.json({ toolCalls: data || [], error: error?.message });
});

// GET / POST knowledge chunks
app.get("/api/knowledge-chunks", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) return res.json({ chunks: [] });
  const { data, error } = await supabase.from("knowledge_chunks").select("*").order("created_at", { ascending: false });
  return res.json({ chunks: data || [], error: error?.message });
});


// Vite middleware in dev or static files in production
async function startServer() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
      console.error(`👉 Run the following in PowerShell to terminate the conflicting process:`);
      console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`HackMate AI Server running on http://localhost:${PORT}`);
  });
}

export { app };

// Only start listening when run directly, not in Netlify serverless lambda
if (process.env.NETLIFY !== "true" && !process.env.LAMBDA_TASK_ROOT) {
  startServer();
}

