import { NextResponse } from "next/server";
import { createUser } from "@/controller/userController";

export const POST = async (request) => {
  const { status, body } = await createUser(request);
  return NextResponse.json(body, { status });
};
