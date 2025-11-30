import { NextResponse } from "next/server";
import { status2FA } from "@/controller/2faController";

export const GET = async (request) => {
  const { status, body } = await status2FA(request);
  return NextResponse.json(body, { status });
};
