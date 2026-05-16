import { NextResponse } from "next/server";
import { getPortfolio, savePortfolio, type PortfolioData } from "@/lib/portfolio";

export async function GET() {
  const data = await getPortfolio();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const data = (await request.json()) as PortfolioData;

  if (!data.profile || !Array.isArray(data.projects) || !Array.isArray(data.skills) || !Array.isArray(data.socials)) {
    return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
  }

  await savePortfolio(data);
  return NextResponse.json(data);
}
