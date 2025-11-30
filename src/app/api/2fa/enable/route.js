import { NextResponse } from "next/server";
import { enable2FA } from "@/controller/2faController";

export const POST = async (request) => {
  const { status, body } = await enable2FA(request);
  return NextResponse.json(body, { status });
};
