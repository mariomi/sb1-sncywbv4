import { z } from 'zod';

export const reservationSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().min(1).max(20),
  occasion: z.string().optional(),
  special_requests: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  marketing_consent: z.boolean().default(false)
});

export type ReservationFormData = z.infer<typeof reservationSchema>;