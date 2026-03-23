import React from "react";
import { notFound } from "next/navigation";
import { converterTools } from "@/modules/converter/constants/tools";
import ConverterToolInterface from "@/modules/converter/components/ConverterToolInterface";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const toolDef = converterTools.find((t: any) => t.id === tool);
  
  if (!toolDef) {
    return { title: "Tool Not Found | Omni-Tool" };
  }

  return {
    title: `${toolDef.name} | Omni-Tool Converter`,
    description: toolDef.description,
  };
}

export default async function ConverterToolPage({ params }: PageProps) {
  const { tool } = await params;
  const toolDef = converterTools.find((t: any) => t.id === tool);

  if (!toolDef) {
    notFound();
  }

  return <ConverterToolInterface tool={toolDef} />;
}
