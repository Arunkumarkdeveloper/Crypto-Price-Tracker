const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
import { emailRegex, passwordRegex } from "@/lib/utils/validation";
import { prisma } from "@/lib/config/prisma";

const createUser = async (request) => {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return { status: 400, body: { message: "All fields are required." } };
    }

    if (!emailRegex.test(email)) {
      return { status: 400, body: { message: "Invalid email format." } };
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (userExist) {
      return { status: 400, body: { message: "Email already exists" } };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password,
        provider: "credentials",
      },
    });
    return {
      status: 201,
      body: { message: "User registered successfully" },
    };
  } catch (error) {
    console.error("createUser error:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
};

export { createUser };
