"use client";

import Image from "next/image";
import Link from "next/link";
/**
 * Banner primário idêntico ao Figma
 * - Desktop: 2704x1600 (aspect-[169/100])
 * - Mobile: usa imagem mobile
 * - Gradient: #7459ED -> #D4D7E4
 */
export default function HeroBanner() {
  return (
    <section className="px-5 md:px-0">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#7459ED_0%,#D4D7E4_100%)] shadow-md">
        {/* imagem mobile */}
        <Image
          src="/hero-mobile.png"
          alt="Leve uma vida com estilo"
          fill
          priority
          className="object-cover object-center md:hidden"
          sizes="100vw"
        />
        {/* imagem desktop */}
        <Image
          src="/hero-desktop.png"
          alt="Leve uma vida com estilo"
          fill
          priority
          className="hidden object-cover object-center md:block"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
        <div className="absolute bottom-5 left-0 mt-10 w-full text-center">
          <button className="z-2 cursor-pointer rounded-full border border-white bg-white/30 px-6 py-2 font-semibold text-white backdrop-blur-sm transition hover:bg-white/50">
            <Link href="/category/jaquetas-moletons">Comprar</Link>
          </button>
        </div>
        {/* Mantém a altura do mock no desktop */}
        <div className="invisible block aspect-[4/5] md:aspect-[169/100]" />
      </div>
    </section>
  );
}
