export interface ContactNative {
  contactId: string;
  name?: Name;
  phones?: Phone[];
  organization?: Organization;
  emails?: Email[];
  birthday?: Birthday;
}

interface Birthday {
  year: number;
  month: number;
  day: number;
}

interface Email {
  type: string;
  label?: string;
  isPrimary: boolean;
  address: string;
}

interface Organization {
  company: string;
  jobTitle?: string;
}

interface Phone {
  type: string;
  label?: string;
  isPrimary: boolean;
  number: string;
}

interface Name {
  display: string;
  given: string;
  family?: string;
  middle?: string;
}
