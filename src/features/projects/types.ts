export interface Project {
  id: string;
  name: string;
  description?: string;
  iconBase64?: string;
  accessType: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerFullName: string;
  projectUsersCount: number;
  testCasesCount: number;
  defectsCount: number;
}
