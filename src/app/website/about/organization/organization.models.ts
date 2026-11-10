export type OrganizationCategory =
  | 'president'
  | 'vice-president'
  | 'secretary-general'
  | 'contact-person'
  | 'central-committee'
  | 'executive-committee';

export interface OrganizationMember {
  _id: string;
  fullName: string;
  role: string;
  category: OrganizationCategory;
  biography: string;
  photo?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface OrganizationRequest {
  locale: string;
  category?: OrganizationCategory;
}

export interface OrganizationMemberRequest {
  locale: string;
  category?: OrganizationCategory;
  id?: string;
}
