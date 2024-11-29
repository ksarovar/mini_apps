"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SkillCardProps {
  name: string;
  level: number;
  index: number;
}

export function SkillCard({ name, level, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{name}</span>
              <span className="text-sm text-muted-foreground">{level}%</span>
            </div>
            <Progress value={level} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}