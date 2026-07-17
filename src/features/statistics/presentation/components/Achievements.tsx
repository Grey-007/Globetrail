import React from 'react';
import { motion } from 'motion/react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
}

export const AchievementsList = ({ achievements }: { achievements: Achievement[] }) => {
  return (
    <div className="grid gap-3">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl transition-colors",
            achievement.unlocked 
              ? "emboss" 
              : "deboss bg-card text-text-muted"
          )}
        >
          <div 
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              achievement.unlocked ? "deboss text-accent" : "deboss bg-card text-text-muted grayscale"
            )}
          >
            {achievement.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-text-main text-sm">{achievement.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">
              {achievement.unlocked ? 'Unlocked' : 'Keep traveling to unlock'}
            </p>
          </div>
          {achievement.unlocked && (
            <CheckCircle2 className="w-5 h-5 text-accent" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
