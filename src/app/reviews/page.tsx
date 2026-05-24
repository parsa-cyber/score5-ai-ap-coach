import { Star, Quote } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";

const reviews = [
  {
    name: "Jake",
    course: "AP Physics 1",
    quote: "Score5 made my studying way more targeted. Instead of guessing what to review, it showed my weak topics and gave me practice right away.",
  },
  {
    name: "Calvin",
    course: "AP Chemistry",
    quote: "The explanations are the best part. It breaks down why an answer is wrong and gives you the exact concept to fix next.",
  },
  {
    name: "Amir",
    course: "APUSH",
    quote: "The FRQ feedback feels like having someone check your answer before the real test. It helped me make my writing more specific.",
  },
  {
    name: "Ali",
    course: "AP Calculus BC",
    quote: "I like that it tracks mistakes and keeps pushing the weak areas. It feels much more useful than just doing random practice questions.",
  },
];

export default function ReviewsPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Student reviews</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Loved by early AP testers</h1>
            <p className="mt-3 max-w-3xl text-slate-600">Five-star student feedback from early testers who used Score5 for AP-style practice, AI explanations, and rubric-based review.</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-brand-50 px-5 py-3 text-brand-700">
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill="currentColor" />)}
            <span className="ml-2 text-sm font-black">5.0 average</span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <StatCard label="Average rating" value="5.0" helper="early testers" />
          <StatCard label="Reviews" value={reviews.length} helper="student quotes" />
          <StatCard label="AP courses" value="42" helper="supported subjects" />
          <StatCard label="Core promise" value="Score 5" helper="practice smarter" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <Card key={review.name} className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <Quote className="text-brand-600" />
                <div className="flex text-brand-600">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}
                </div>
              </div>
              <p className="flex-1 text-sm leading-7 text-slate-700">“{review.quote}”</p>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="font-black text-slate-950">{review.name}</p>
                <p className="text-sm font-semibold text-slate-500">{review.course} student</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
