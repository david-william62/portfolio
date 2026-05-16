import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPortfolio, savePortfolio, type PortfolioData } from "@/lib/portfolio";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = await getPortfolio();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = (await request.json()) as PortfolioData;

  if (!data.profile || !Array.isArray(data.projects) || !Array.isArray(data.skills) || !Array.isArray(data.socials)) {
    return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
  }

  await savePortfolio(data);
  return NextResponse.json(data);
}
