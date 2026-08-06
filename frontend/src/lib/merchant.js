const TECHNICAL_PREFIXES = [
  /^(upi|imps|neft|rtgs|ach|ecs|nfs|card|debit|credit|txn|tx|trf|payment|transfer|autopay|auto\s+debit|direct\s+debit|dr|cr)\b[\s:_-]*/i,
  /^(to|from|via|at)\b[\s:_-]*/i,
]

const TECHNICAL_TOKENS = new Set([
  'upi', 'imps', 'neft', 'rtgs', 'ach', 'ecs', 'nfs', 'card', 'debit', 'credit',
  'txn', 'tx', 'trf', 'payment', 'transfer', 'autopay', 'auto', 'debit', 'direct',
  'dr', 'cr', 'mandate', 'ref', 'rrn', 'utr', 'id', 'no', 'number', 'mmt', 'p2p', 'p2m'
])

const ACRONYM_REPLACEMENTS = [
  [/\bupi\b/gi, 'UPI'],
  [/\bimps\b/gi, 'IMPS'],
  [/\bneft\b/gi, 'NEFT'],
  [/\brtgs\b/gi, 'RTGS'],
  [/\bach\b/gi, 'ACH'],
  [/\becs\b/gi, 'ECS'],
]

function detectRailLabel(value) {
  const lower = String(value || '').toLowerCase()

  if (lower.includes('upi')) return 'UPI Transfer'
  if (lower.includes('imps')) return 'IMPS Transfer'
  if (lower.includes('neft')) return 'NEFT Transfer'
  if (lower.includes('rtgs')) return 'RTGS Transfer'
  if (lower.includes('ach')) return 'ACH Debit'
  if (lower.includes('ecs')) return 'ECS Debit'
  if (lower.includes('card')) return 'Card Payment'
  if (lower.includes('transfer') || lower.includes('trf')) return 'Bank Transfer'

  return 'Other'
}

function cleanSegment(segment) {
  let value = String(segment || '').trim()
  if (!value) return ''

  value = value.replace(/[_]+/g, ' ')
  value = value.replace(/\s+/g, ' ')
  value = value.replace(/[@#].*$/g, '')
  value = value.replace(/\b\d{4,}\b/g, '')

  for (const prefix of TECHNICAL_PREFIXES) {
    value = value.replace(prefix, '')
  }

  value = value
    .split(/[|/\\-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ')

  value = value.replace(/\s+/g, ' ').trim()
  return value
}

function scoreMerchant(segment) {
  const words = segment.split(/\s+/).filter(Boolean)
  const alphaCount = segment.replace(/[^a-zA-Z]/g, '').length
  const digitCount = segment.replace(/[^0-9]/g, '').length
  return (words.length * 8) + alphaCount - (digitCount * 3)
}

function titleCaseMerchant(value) {
  let result = value.toLowerCase()

  result = result.replace(/\b([a-z])/g, (_, letter) => letter.toUpperCase())
  result = result.replace(/'S\b/g, "'s")
  result = result.replace(/\bLt\b/g, 'Ltd')
  result = result.replace(/\bCo\b/g, 'Co')

  for (const [pattern, replacement] of ACRONYM_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  return result
}

export function normalizeMerchantName(input) {
  const raw = String(input || '').trim()
  if (!raw) return 'Other'

  const candidates = raw
    .split(/\s*[-|/]\s*|\s{2,}/)
    .map(cleanSegment)
    .filter(Boolean)

  const bestCandidate = candidates.length > 0
    ? candidates.sort((left, right) => scoreMerchant(right) - scoreMerchant(left))[0]
    : cleanSegment(raw)

  const normalized = titleCaseMerchant(bestCandidate || raw)
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.replace(/[^A-Za-z]/g, '').length < 3) {
    return detectRailLabel(raw)
  }

  return normalized.slice(0, 100) || 'Other'
}

export function normalizeMerchantKey(input) {
  return normalizeMerchantName(input).toLowerCase()
}