/** Simulates network latency for mock responses so loading states stay visible. */
export function simulateDelay(min = 150, max = 500): Promise<void> {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}
