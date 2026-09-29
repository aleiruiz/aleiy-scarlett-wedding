export type Guest = {
  id: string;
  name: string;
};

export type Invitation = {
  token: string;
  groupName: string;
  greeting: string;
  guests: Guest[];
  maxPasses: number;
  active: boolean;
  civil?: boolean;
  expiresAt?: string;
  response?: {
    guests: GuestResponse[];
    phone: string;
    message?: string;
  };
};

export type GuestResponse = {
  guestId: string;
  attending: boolean;
  dietary?: string;
};

export type RsvpSubmission = {
  token: string;
  guests: GuestResponse[];
  phone: string;
  message?: string;
};
