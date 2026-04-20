export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  appointmentStatus: 'Pending' | 'Confirmed' | 'Completed';
  clinicalNotes: string;
  createdAt: string;
}