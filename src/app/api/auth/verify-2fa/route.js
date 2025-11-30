import { NextResponse } from "next/server";
import { verify2FA } from "@/controller/2faController";

export const POST = async (request) => {
  const { status, body } = await verify2FA(request);
  return NextResponse.json(body, { status });
};
