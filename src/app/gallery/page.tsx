import Image from "next/image";
import { Section } from "@/components/section";
import { getGalleryItems } from "@/lib/content";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <Section eyebrow="Gallery" title="Crew Gallery">
      {galleryItems.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <a key={item.id} href={item.imageUrl} target="_blank" rel="noreferrer" className="ec-panel ec-accent-gallery group rounded-lg p-3">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
              </div>
              <p className="mt-3 font-bold text-white">{item.title}</p>
              <p className="text-sm text-[color:var(--ec-magenta)]">{item.tag}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="ec-panel ec-accent-gallery rounded-lg p-5 text-[color:var(--ec-muted)]">
          No gallery photos selected yet.
        </div>
      )}
    </Section>
  );
}
