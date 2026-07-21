export interface OrganizationMember {
  _id: string;
  fullName: string;
  role: string;
  biography: string;
  photo?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface OrganizationRequest {
  locale: string;
}
