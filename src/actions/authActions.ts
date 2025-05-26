
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";
import type { UserRole } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export async function registerUserAction(data: z.infer<typeof registerSchema>) {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input.", errors: validation.error.flatten().fieldErrors };
  }

  const { name, email, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role - if it's the admin email, set role to ADMIN
    let role: UserRole = 'CUSTOMER';
    if (email === process.env.ADMIN_EMAIL) {
      role = 'ADMIN';
    }

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role, // Set role here
      },
    });

    return { success: true, message: "User registered successfully." };
  } catch (error) {
    console.error("Error in registerUserAction:", error);
    return { success: false, message: "Failed to register user due to a server error." };
  }
}
