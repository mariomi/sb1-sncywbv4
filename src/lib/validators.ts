import { z } from 'zod';

export const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date is required'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/, 'Time is required'),
  guests: z.number().min(1).max(20),
  occasion: z.string().max(60).optional(),
  special_requests: z.string().max(1000).optional(),
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().trim().email('Invalid email address').max(254),
  phone: z.string()
    .trim()
    .min(7, 'Phone number is too short')
    .max(40, 'Phone number is too long')
    .regex(/^\+[\d\s\-()]{5,}$/, 'Enter a valid phone number with country code (e.g. +39 041 520 4603)'),
  marketing_consent: z.boolean().default(false)
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
