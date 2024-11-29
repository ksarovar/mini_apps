"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "DeFi Lending Protocol",
    description: "A decentralized lending platform built on Ethereum with smart contracts for lending and borrowing crypto assets.",
    technologies: ["Solidity", "Web3.js", "React", "Hardhat"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "NFT Marketplace",
    description: "A marketplace for trading NFTs with support for multiple collections and royalties.",
    technologies: ["Solidity", "IPFS", "Next.js", "Ethers.js"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Cross-Chain Bridge",
    description: "A bridge protocol enabling asset transfers between different blockchain networks.",
    technologies: ["Rust", "Substrate", "Polkadot", "React"],
    github: "https://github.com",
    live: "https://example.com",
  },
];

export default function Portfolio() {
  return (
    <div className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-10">
          My Projects
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}