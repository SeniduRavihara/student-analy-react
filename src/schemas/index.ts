import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  whatsapp: z.string().min(1, { message: "Whatsapp number is required" }),
  nic: z.string().min(1, { message: "NIC number is required" }),
  bDate: z.date().min(new Date(), { message: "Birth date is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

export const exameDetailsSchema = z.object({
  school: z.string().min(1, { message: "School is required" }),
  examYear: z.string().min(1, { message: "Exam year is required" }),
  media: z.string().min(1, { message: "Media is required" }),
  stream: z.string().min(1, { message: "Stream is required" }),
});

export const parentDetailsSchema = z.object({
  GuardianName: z.string().min(1, { message: "Parent name is required" }),
  parentNic: z.string().min(1, { message: "Parent NIC is required" }),
  parentWhatsapp: z.string().min(1, { message: "Parent Whatsapp is required" }),
  parentEmail: z.string().email({ message: "Parent email is required" }),
  parentPhone: z.string().min(1, { message: "Parent phone is required" }),
});
