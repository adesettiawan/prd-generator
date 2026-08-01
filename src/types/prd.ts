export interface PRDParams {
  projectName: string
  coreGoals: string
  targetAudience: string
  keyFeatures: string
  outOfScope: string
  deadlines: string
}

export interface PRDDocument {
  id: string
  params: PRDParams
  content: string
  createdAt: Date
  updatedAt: Date
}
