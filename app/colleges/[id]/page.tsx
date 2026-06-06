import { notFound } from "next/navigation";
import { MOCK_COLLEGES, MOCK_REVIEWS, MOCK_QUESTIONS } from "@/lib/data";
import { CollegeDetailClient } from "./CollegeDetailClient";
import type { College } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_COLLEGES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const college = MOCK_COLLEGES.find((c) => c.id === id);
  if (!college) return {};
  return {
    title: `${college.name} – CollegeFinder`,
    description: college.overview.slice(0, 155),
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = MOCK_COLLEGES.find((c) => c.id === id) as College | undefined;
  if (!college) notFound();

  const reviews  = MOCK_REVIEWS.filter((r) => r.collegeId === id);
  const questions = MOCK_QUESTIONS.filter((q) => q.collegeId === id || q.collegeId === null);

  return <CollegeDetailClient college={college} reviews={reviews} questions={questions} />;
}
