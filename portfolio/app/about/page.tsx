"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillCard } from "@/components/skill-card";
import { AnimatedText } from "@/components/animated-text";
import { Calendar, Code2, Trophy } from "lucide-react";

const skills = [
  { name: "Solidity", level: 95 },
  { name: "Smart Contracts", level: 90 },
  { name: "Web3.js", level: 85 },
  { name: "React/Next.js", level: 88 },
  { name: "Rust", level: 80 },
  { name: "Cross-Chain Development", level: 85 }
];

const achievements = [
  {
    icon: Trophy,
    title: "Hackathon Winner",
    description: "First place in ETHGlobal 2023"
  },
  {
    icon: Code2,
    title: "Open Source",
    description: "100+ GitHub contributions"
  },
  {
    icon: Calendar,
    title: "Experience",
    description: "5+ years in blockchain"
  }
];

export default function About() {
  return (
    <div className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <AnimatedText
            text="About Me"
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
          >
            I'm a passionate blockchain developer with extensive experience in both EVM and non-EVM compatible chains.
            My journey in Web3 started in 2017, and I've been building decentralized applications ever since.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <achievement.icon className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-xl">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Skills & Expertise</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                name={skill.name}
                level={skill.level}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}