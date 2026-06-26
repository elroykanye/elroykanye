import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryForm from "@/components/StoryForm";
import { stories } from "@/lib/site";

export const metadata: Metadata = {
  title: "Share your story",
  description:
    "Are you a developer in Cameroon? Share your experience — the opportunities, the obstacles, the ridicule — for an honest series about building software from here.",
  alternates: { canonical: "/share" },
};

export default function SharePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-32">
        <p className="font-mono text-sm text-accent-2">Notes from the Grassfields</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Share your <span className="gradient-text">story</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {stories.intro}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {stories.themes.map((theme) => (
            <div key={theme.title} className="glass rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-foreground">
                {theme.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {theme.prompt}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <StoryForm />
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Prefer to read first?{" "}
          <Link href="/blog" className="text-accent transition-colors hover:text-accent-2">
            See the series →
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
