export interface DayAvailability {
  isOpen:    boolean;
  schedule:  Schedule[];
  dayOfWeek: DayOfWeek;
}

export interface DayOfWeek {
  id:           string;
  relation:     string;
  description:  string;
  languageCode: string;
}

export interface Schedule {
  end:       string;
  start:     string;
  hourEnd:   string[];
  hourStart: string[];
}
