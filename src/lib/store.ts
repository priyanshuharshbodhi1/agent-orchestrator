"use client";

import { topics as initialTopics } from "./data";
import { Topic } from "./types";

let topics = [...initialTopics];
const listeners = new Set<() => void>();

export function getTopics(): Topic[] {
  return topics;
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function vote(topicId: string, debaterId: string) {
  topics = topics.map((t) => {
    if (t.id !== topicId) return t;
    const updateSide = (side: Topic["forSide"]) => ({
      ...side,
      debaters: side.debaters.map((d) =>
        d.id === debaterId ? { ...d, votes: d.votes + 1 } : d,
      ),
    });
    return {
      ...t,
      forSide: updateSide(t.forSide),
      againstSide: updateSide(t.againstSide),
      totalVotes: t.totalVotes + 1,
    };
  });
  listeners.forEach((l) => l());
}

export function addTopic(topic: Omit<Topic, "id" | "totalVotes" | "createdAt">) {
  const newTopic: Topic = {
    ...topic,
    id: String(Date.now()),
    totalVotes: 0,
    createdAt: new Date().toISOString(),
  };
  topics = [newTopic, ...topics];
  listeners.forEach((l) => l());
  return newTopic;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
