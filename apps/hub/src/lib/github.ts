import 'server-only'

// Dispatches the code-writing GitHub Actions workflow. This credential is
// scoped to Actions:write ONLY (never Contents) — even if it leaked, it
// could trigger more workflow runs but could never push code itself. The
// actual coding happens in an isolated runner with its own, separately
// scoped GitHub App credential (see .github/workflows/jarvis-code.yml).
// Merging is a fully separate credential too, used only by the session-gated
// /api/proposals/code/merge route — never reachable from this file or from
// any Jarvis tool.

const GITHUB_OWNER = 'journeystorage'
const GITHUB_REPO = 'journey.storage'
const WORKFLOW_FILE = 'jarvis-code.yml'

// Which branch the workflow file is read from (and checked out by default).
// `main` is currently 26+ commits behind the branch this actually ships
// from — flip this once that's resolved (see DEPLOYMENT.md).
const DISPATCH_REF = process.env.GITHUB_DISPATCH_REF || 'locations-redesign'

// proposalId is passed through as a workflow input so the run's own
// callback step can report against the right hub_code_proposals row —
// workflow_dispatch's REST response doesn't return the created run's id,
// so this is the reliable way to correlate the two.
export async function dispatchCodeWorkflow(
  instruction: string,
  proposalId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = process.env.GITHUB_DISPATCH_TOKEN
  if (!token) return { ok: false, error: 'code-change dispatch is not configured (no GITHUB_DISPATCH_TOKEN)' }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: DISPATCH_REF,
        inputs: { instruction: instruction.slice(0, 4000), proposal_id: proposalId },
      }),
    },
  )

  if (!res.ok) {
    return { ok: false, error: `GitHub dispatch failed (${res.status}): ${await res.text().then((t) => t.slice(0, 300))}` }
  }
  return { ok: true }
}
