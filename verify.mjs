#!/usr/bin/env node
/* Verify a Nostradamus Intellect ledger seal from public data alone. Node 18+, no dependencies.
     node verify.mjs CAL-12     one seal
     node verify.mjs all        every seal, then the ledger root
   A seal's hash is SHA-256 of JSON.stringify(sealed), where `sealed` holds the nine sealed fields in the stamped
   order; the ledger root is SHA-256 of JSON.stringify of the list of sealed objects in ledger order. The .ots proof
   named on each card anchors the hash to Bitcoin (verify it with the OpenTimestamps client: ots verify <file>). */
import { createHash } from 'node:crypto'

const BASE = (process.env.NI_BASE_URL || 'https://nostradamusintellect.com').replace(/\/+$/, '')
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex')
const get = async (p) => {
  const r = await fetch(BASE + p, { signal: AbortSignal.timeout(20000) })
  if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`)
  return r.json()
}

const want = String(process.argv[2] || 'all').toLowerCase()
const record = await get('/engine/record.json')
const seals = record.cards.filter((c) => c.kind === 'ledger-seal')
const pick = want === 'all' ? seals : seals.filter((c) => c.code.toLowerCase() === want || c.id === want)
if (!pick.length) {
  console.error(`no ledger seal "${process.argv[2]}" — codes run CAL-01 … CAL-${String(seals.length).padStart(2, '0')}`)
  process.exit(1)
}

let bad = 0
const sealedList = []
for (const c of pick) {
  const card = await get(new URL(c.json).pathname)
  const mine = sha(card.sealed)
  sealedList.push(card.sealed)
  const ok = mine === card.sha256
  if (!ok) bad++
  console.log(`${ok ? 'MATCH   ' : 'MISMATCH'} ${card.code}  ${mine}${ok ? '' : `  (published ${card.sha256})`}`)
  if (pick.length === 1) console.log(`proof   ${card.timestamp_proof}\nsealed  ${JSON.stringify(card.sealed)}`)
  if (want === 'all' && c === pick[pick.length - 1]) {
    const root = sha(sealedList)
    const rootOk = root === card.ledger_root
    if (!rootOk) bad++
    console.log(`${rootOk ? 'MATCH   ' : 'MISMATCH'} ledger root  ${root}`)
  }
}
console.log(bad ? `\n${bad} did not verify — please open an issue.` : '\nVerified: exactly what was stamped.')
process.exit(bad ? 1 : 0)
