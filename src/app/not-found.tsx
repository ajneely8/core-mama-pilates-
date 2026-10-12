import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="display-lg mt-4">That page has wandered off.</h1>
      <p className="lede mt-4 max-w-md">Let&apos;s get you back to the studio.</p>
      <Button className="mt-8" render={<Link href="/" />}>
        Back home
      </Button>
    </section>
  );
}
