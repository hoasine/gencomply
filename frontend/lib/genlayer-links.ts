/** Official GenLayer resources surfaced in the UI. */
export const GENLAYER_LINKS = {
  home: "https://www.genlayer.com/",
  docs: "https://docs.genlayer.com/",
  studio: "https://studio.genlayer.com/",
  sdk: "https://sdk.genlayer.com/",
  sdkApi: "https://sdk.genlayer.com/main/_static/ai/api.txt",
  intelligentContracts:
    "https://docs.genlayer.com/developers/intelligent-contracts/introduction",
  deploying:
    "https://docs.genlayer.com/developers/intelligent-contracts/deploying",
  examples:
    "https://docs.genlayer.com/developers/intelligent-contracts/examples/storage",
} as const;

export const GENLAYER_FEATURES = [
  {
    title: "Internet-native contracts",
    desc: "Intelligent contracts call gl.nondet.web.render to crawl live policy and suspect URLs — no oracles required.",
    tag: "web.render",
  },
  {
    title: "On-chain AI reasoning",
    desc: "gl.nondet.exec_prompt builds compliance fingerprints and jury verdicts inside consensus.",
    tag: "exec_prompt",
  },
  {
    title: "Equivalence principle",
    desc: "Validators agree on non-deterministic outputs via strict_eq and comparative LLM checks.",
    tag: "consensus",
  },
  {
    title: "Python + GenVM",
    desc: "GenComply is written in Python — natural for multi-step AI + web pipelines.",
    tag: "GenVM",
  },
] as const;
