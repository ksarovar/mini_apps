"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import { ThreeDBackground } from "@/components/3d-background";
import { AnimatedText } from "@/components/animated-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  "Solidity", "Ethereum", "Smart Contracts", "DeFi", "NFTs",
  "Web3", "Cross-Chain", "Blockchain"
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out",
      });

      gsap.from(".tech-badge", {
        scrollTrigger: {
          trigger: ".tech-badge",
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <ThreeDBackground />

      <motion.div
        style={{ y, opacity }}
        className="flex min-h-screen flex-col"
      >
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 p-4"
                >
                  <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    Blockchain Developer
                  </span>
                </motion.div>

                <AnimatedText
                  text="Building the Future of Web3"
                  className="hero-title text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                />

                <motion.p 
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  Specializing in EVM and non-EVM compatible blockchains. 
                  Creating secure and efficient smart contracts for the future of Web3.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Link href="/portfolio">
                    <Button className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                      View My Work
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="group border-primary/20 hover:border-primary/40">
                      Contact Me
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-3 mt-8"
                >
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="tech-badge inline-block rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 text-sm text-primary border border-primary/10 hover:border-primary/20 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          <motion.section 
            className="w-full py-12 md:py-24 lg:py-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Connect With Me
                </h2>
                <div className="flex space-x-4">
                  {[
                    { icon: Github, href: "https://github.com" },
                    { icon: Linkedin, href: "https://linkedin.com" },
                    { icon: Youtube, href: "https://youtube.com" }
                  ].map(({ icon: Icon, href }, index) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.8, duration: 0.3 }}
                    >
                      <Link href={href} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all hover:scale-110"
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </motion.div>
    </div>
  );
}