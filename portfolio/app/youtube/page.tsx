"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import Link from "next/link";

const videos = [
  {
    title: "Introduction to Smart Contract Development",
    description: "Learn the basics of writing smart contracts with Solidity.",
    url: "https://youtube.com",
    views: "10K",
    date: "2024-02-01",
  },
  {
    title: "Building DeFi Applications",
    description: "Step-by-step guide to creating decentralized finance applications.",
    url: "https://youtube.com",
    views: "8K",
    date: "2024-01-15",
  },
  {
    title: "Cross-Chain Development Tutorial",
    description: "Understanding cross-chain protocols and implementations.",
    url: "https://youtube.com",
    views: "12K",
    date: "2024-01-01",
  },
];

export default function YouTubePage() {
  return (
    <div className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-center space-x-4">
          <Youtube className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            YouTube Channel
          </h1>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={video.url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{video.views} views</span>
                      <span>{video.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}