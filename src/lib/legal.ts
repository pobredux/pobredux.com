import { DISCORD_URL, ISSUES_URL, REPO_URL, type Rich } from "./content.js";

export interface LegalPage {
  path: string;
  title: string;
  description: string;
  note: string;
  lede: Rich[];
  sections: { title: string; items: { term: string; text: Rich[] }[] }[];
}

export const PRIVACY: LegalPage = {
  path: "privacy",
  title: "Privacy policy",
  description: "What PoB Redux sends over the network, to whom, and when. It sends no analytics, telemetry or crash reports.",
  note: "Updated 19 November 2026",
  lede: [
    "PoB Redux runs on your computer. It has no account of its own and sends no analytics, telemetry or crash reports. Your builds stay on your computer until you share one.",
  ],
  sections: [
    {
      title: "On its own",
      items: [
        { term: "Update check", text: ["A few seconds after it starts, the app asks pobredux.com and GitHub whether a newer version exists."] },
        {
          term: "Game files",
          text: ["When you open a passive tree or a feature whose files the installer does not include, the app downloads them from art.pobredux.com."],
        },
        {
          term: "What these requests show",
          text: [
            "Like any download, they show the server your IP address and the app version. pobredux.com and art.pobredux.com run on Cloudflare, and GitHub hosts the releases. Both keep standard request logs under their own privacy policies.",
          ],
        },
      ],
    },
    {
      title: "When you ask",
      items: [
        { term: "Opening a build link", text: ["The app downloads the build from the site in the link, such as pobb.in, Maxroll or poe.ninja."] },
        { term: "Sharing a build", text: ["The app uploads the build code to the site you pick."] },
        {
          term: "Signing in with Path of Exile",
          text: [
            "The app talks to pathofexile.com to list and import your characters and to run trade searches. Your system's credential store keeps the sign-in token, and the app sends it only to pathofexile.com.",
          ],
        },
        {
          term: "The assistant",
          text: [
            "The assistant runs the AI app you choose, such as Claude Code, Codex, GitHub Copilot or Ollama. Your messages and the open build go to that app's provider, under your own account and that provider's privacy policy. Ollama runs on your computer. Antigravity needs a connector, which the app downloads from Google the first time you pick it. The assistant asks before it reads a website.",
          ],
        },
        {
          term: "Your own API keys",
          text: [
            "If you add an API key for an experimental model provider, such as TypeSafe, Cloudflare or OpenRouter, the build data you ask about goes to that provider.",
          ],
        },
        {
          term: "Voice input",
          text: ["The first time you use it, the app downloads a speech model from Hugging Face. It turns speech into text on your computer."],
        },
        { term: "The MCP server", text: ["It stays off until you turn it on in Options. It then listens only on your computer and requires a token."] },
      ],
    },
    {
      title: "Questions",
      items: [
        { term: "Changes to this policy", text: ["We update this page before the app starts sending anything new."] },
        { term: "Contact", text: ["Ask on ", { href: ISSUES_URL, text: "GitHub" }, " or ", { href: DISCORD_URL, text: "Discord" }, "."] },
      ],
    },
  ],
};

export const CODE_SIGNING: LegalPage = {
  path: "code-signing",
  title: "Code signing policy",
  description: "How PoB Redux signs its Windows releases: free code signing by SignPath.io, certificate by SignPath Foundation.",
  note: "Windows releases",
  lede: [
    "Free code signing provided by ",
    { href: "https://about.signpath.io/", text: "SignPath.io" },
    ", certificate by ",
    { href: "https://signpath.org/", text: "SignPath Foundation" },
    ".",
  ],
  sections: [
    {
      title: "Policy",
      items: [
        {
          term: "What is signed",
          text: [
            "The Windows installer and the PoB Redux program it installs. We sign only files built from this project's own source code. Releases made before signing began are not signed.",
          ],
        },
        {
          term: "How a signed release is made",
          text: [
            "The release workflow in the public ",
            { href: REPO_URL, text: "GitHub repository" },
            " builds every signed file on GitHub-hosted runners. SignPath checks that each file came from that workflow. An approver checks and approves each signing request by hand before SignPath signs it.",
          ],
        },
        {
          term: "Team roles",
          text: [
            "Committers and reviewers: ",
            { href: "https://github.com/orgs/pobredux/people", text: "members of the pobredux team" },
            ". Approvers: ",
            { href: "https://github.com/orgs/pobredux/people?query=role%3Aowner", text: "owners of the pobredux team" },
            ". Everyone in these roles signs in to GitHub and SignPath with two-factor authentication.",
          ],
        },
        {
          term: "Privacy",
          text: ["PoB Redux sends no analytics, telemetry or crash reports. The ", { href: "/privacy", text: "privacy policy" }, " lists every service the app contacts and when."],
        },
      ],
    },
  ],
};
