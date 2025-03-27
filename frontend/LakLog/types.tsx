export interface Shift {
    _id: string;
    date: string;
    role: string;
    location: string;
    startTime: string;
    endTime: string;
    jobTitle: string;
    employee?: {
      _id: string;
      name: string;
      email: string;
    };
  }
  