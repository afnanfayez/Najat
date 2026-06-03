export type AdminAidViewTab = 'distribution' | 'donors'

export type DistributionPointStatus = 'open' | 'crowded' | 'closed'

export type InventoryItemStatus = 'available' | 'limited' | 'out'

export type DonationStatus = 'completed' | 'processing'

export type AdminAidDistributionStats = {
  totalBeneficiaries: number
  distributedQuantities: number
  availableInventory: number
  avgDailyDelivery: number
}

export type AdminAidAreaCoverage = {
  id: string
  label: string
  value: number
  color: string
}

export type AdminAidResponsePoint = {
  day: string
  value: number
}

export type AdminAidInventoryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate: string
  status: InventoryItemStatus
  active: boolean
}

export type AdminAidDistributionPoint = {
  id: string
  name: string
  region: string
  address: string
  manager: string
  phone: string
  status: DistributionPointStatus
  category: string
  remaining: number
  total: number
  lastUpdated: string
  aidTypes: string[]
  inventory: AdminAidInventoryItem[]
  workingDays: number[]
  startTime: string
  endTime: string
  targetGroups: string[]
  latitude: number | null
  longitude: number | null
}

export type AdminAidDonorStats = {
  totalDonations: number
  totalDonationsLabel: string
  lastContribution: string
  partnersCount: number
  renewalsCount: number
  distribution: { label: string; percent: number; color: string }[]
}

export type AdminAidDonor = {
  id: string
  name: string
  subtitle: string
  totalAmount: number
  lastDonation: string
}

export type DonorType = 'international' | 'local' | 'individual' | 'strategic'

export type DonorPartnershipStatus = 'active' | 'renewal' | 'ended'

export type AdminAidDonorDetail = AdminAidDonor & {
  donorType: DonorType
  sector: string
  contactPerson: string
  email: string
  phone: string
  website: string
  country: string
  partnershipStatus: DonorPartnershipStatus
  agreementStart: string
  agreementEnd: string
  focusAreas: string[]
  notes: string
  active: boolean
}

export type AdminAidDonationRecord = {
  id: string
  donorName: string
  date: string
  amount: number
  status: DonationStatus
  active: boolean
}
