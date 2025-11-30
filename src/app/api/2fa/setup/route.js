import { NextResponse } from "next/server";
import { setup2FA } from "@/controller/2faController";

export const POST = async (request) => {
  const { status, body } = await setup2FA(request);
  return NextResponse.json(body, { status });
};
