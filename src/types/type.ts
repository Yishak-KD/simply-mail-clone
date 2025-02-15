import { Audience, Recipient } from "@prisma/client";

export interface ChurchMember {
  Church?: string;
  Role?: string;
  Name: string;
  Email: string;
  Website?: string;
  Address?: string;
}

export interface AudienceAndRecipientCount {
  audience: Audience | null;
  recipientCount: number;
}

export interface AudienceWithRecipient {
  id: string;
  name: string;
  recipients: Recipient[];
}