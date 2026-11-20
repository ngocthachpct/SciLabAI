"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SIM_TYPE_LABEL_VI,
  clampSimParams,
  matchesTask,
  simKey,
  type SimExperiment,
  type SimTask,
} from "@/lib/sim";
import { SimControls } from "@/components/lab/sims/shared";
import { SimStage } from "@/components/lab/sims/SimStage";
import { SimTaskCard } from "@/components/lab/sims/SimTaskCard";
import { SimInsightPanel } from "@/components/lab/sims/SimInsightPanel";

interface SimulationLabProps {
  sim: SimExperiment;
  entryId: string;
  title: string;
  note?: string;
  onCompleteTask: (key: string, label: string) => void;
}

export function SimulationLab({ sim, entryId, title, note, onCompleteTask }: SimulationLabProps) {
  const [params, setParams] = useState<Record<string, number>>(() =>
    clampSimParams(sim.type, sim.params)
  );
  const [doneKeys, setDoneKeys] = useState<ReadonlySet<string>>(new Set());
  const [interacted, setInteracted] = useState(false);
  const doneRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fresh = clampSimParams(sim.type, sim.params);
    setParams(fresh);
    doneRef.current = new Set();
    setDoneKeys(new Set());
    setInteracted(false);
  }, [entryId, sim.type, sim.params]);

  const completeTask = useCallback(
    (task: SimTask) => {
      if (doneRef.current.has(task.id)) return;
      doneRef.current.add(task.id);
      setDoneKeys(new Set(doneRef.current));
      onCompleteTask(
        simKey(entryId, task.id),
        `${SIM_TYPE_LABEL_VI[sim.type]} — ${task.prompt}`
      );
    },
    [entryId, sim.type, onCompleteTask]
  );

  useEffect(() => {
    if (!interacted) return;
    for (const task of sim.tasks) {
      if (matchesTask(params, task.target)) completeTask(task);
    }
  }, [interacted, params, sim.tasks, completeTask]);

  const handleChange = useCallback((key: string, value: number) => {
    setInteracted(true);
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyTask = useCallback(
    (task: SimTask) => {
      setInteracted(true);
      setParams((prev) => ({ ...prev, ...clampSimParams(sim.type, task.target) }));
      completeTask(task);
    },
    [sim.type, completeTask]
  );

  return (
    <>
      <SimTaskCard
        lessonTitle={title}
        note={note}
        tasks={sim.tasks}
        doneKeys={doneKeys}
        onApply={handleApplyTask}
      />
      <div className="grid flex-1 grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-[260px_1fr_340px]">
        <div className="order-2 min-h-[300px] lg:order-1 lg:min-h-0">
          <SimControls type={sim.type} params={params} onChange={handleChange} />
        </div>
        <div className="order-1 min-h-[440px] lg:order-2 lg:min-h-0">
          <SimStage type={sim.type} title={title} params={params} />
        </div>
        <div className="order-3 min-h-[360px] md:col-span-2 md:min-h-[440px] lg:col-span-1 lg:min-h-0">
          <SimInsightPanel
            type={sim.type}
            params={params}
            doneCount={doneKeys.size}
            total={sim.tasks.length}
          />
        </div>
      </div>
    </>
  );
}
