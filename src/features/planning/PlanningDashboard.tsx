import React, { useState, useMemo } from "react";
import {
  TrainingPlan,
  PlanSession,
  PlanTask,
  RecordType,
  WeightUnit,
  User,
  WorkoutRecord,
} from "./types";
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClipboardIcon,
  DownloadIcon,
} from "./Icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { PlanProgressLog } from "./types";

interface PlanningDashboardProps {
  plans: TrainingPlan[];
  onAddPlan: (plan: TrainingPlan) => void;
  onDeletePlan: (id: string) => void;
  onUpdatePlan: (plan: TrainingPlan) => void;
  records: WorkoutRecord[];
  user: User;
}

const PlanningDashboard: React.FC<PlanningDashboardProps> = ({
  plans,
  onAddPlan,
  onDeletePlan,
  onUpdatePlan,
  records,
  user,
}) => {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history" | "stats">(
    "active",
  );
  const [transcription, setTranscription] = useState("");
  const [planName, setPlanName] = useState("");
  const [planObjective, setPlanObjective] = useState("");
  const [planFrequency, setPlanFrequency] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Weekly");
  const [planLevel, setPlanLevel] = useState("");
  const [planMetrics, setPlanMetrics] = useState("");
  const [newLog, setNewLog] = useState({ level: "", metrics: "", note: "" });

  const activePlan = useMemo(() => plans.find((p) => p.isActive), [plans]);

  const handleAddLog = () => {
    if (!activePlan || !newLog.level || !newLog.metrics) return;

    const log: PlanProgressLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      level: newLog.level,
      metrics: newLog.metrics,
      note: newLog.note,
    };

    const updatedPlan = {
      ...activePlan,
      progressLogs: [...(activePlan.progressLogs || []), log],
    };

    onUpdatePlan(updatedPlan);
    setNewLog({ level: "", metrics: "", note: "" });
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activePlan) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      const newLogs: PlanProgressLog[] = [];

      // Skip header if needed, but let's assume: Date,Level,Metrics,Note
      lines.forEach((line, index) => {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 3) {
          const [date, level, metrics, note] = parts;
          // Basic validation
          if (level && metrics) {
            newLogs.push({
              id: Math.random().toString(36).substr(2, 9),
              date:
                index === 0 && isNaN(Date.parse(date))
                  ? new Date().toISOString()
                  : isNaN(Date.parse(date))
                    ? new Date().toISOString()
                    : new Date(date).toISOString(),
              level,
              metrics,
              note: note || "",
            });
          }
        }
      });

      if (newLogs.length > 0) {
        const updatedPlan = {
          ...activePlan,
          progressLogs: [...(activePlan.progressLogs || []), ...newLogs],
        };
        onUpdatePlan(updatedPlan);
        alert(`${newLogs.length} registros cargados correctamente.`);
      }
    };
    reader.readAsText(file);
  };

  const parseTranscription = (text: string): PlanSession[] => {
    const lines = text.split("\n");
    const sessions: PlanSession[] = [];
    let currentSession: PlanSession | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("Day") || trimmed.startsWith("Session")) {
        if (currentSession) sessions.push(currentSession);
        currentSession = {
          id: Math.random().toString(36).substr(2, 9),
          title: trimmed,
          tasks: [],
        };
      } else if (trimmed.startsWith("-") && currentSession) {
        // Format: - Exercise: SetsxReps @ Value Unit
        const match = trimmed.match(
          /^- (.*?): (\d+)x(\d+) @ ([\d.]+)\s*(\w+)?/,
        );
        if (match) {
          const [_, exercise, sets, reps, value, unit] = match;
          currentSession.tasks.push({
            id: Math.random().toString(36).substr(2, 9),
            exercise,
            targetValue: parseFloat(value),
            targetType:
              unit === "kg" || unit === "lbs"
                ? "Weight"
                : unit === "s" || unit === "min"
                  ? "Time"
                  : "Reps",
            targetUnit:
              unit === "kg" || unit === "lbs"
                ? (unit as WeightUnit)
                : undefined,
            sets: parseInt(sets),
            reps: parseInt(reps),
            completed: false,
          });
        }
      }
    });

    if (currentSession) sessions.push(currentSession);
    return sessions;
  };

  const handleAddPlan = () => {
    const sessions = parseTranscription(transcription);
    if (sessions.length === 0 || !planName) {
      alert("Please provide a name and at least one session with tasks.");
      return;
    }

    const newPlan: TrainingPlan = {
      id: Math.random().toString(36).substr(2, 9),
      name: planName,
      objective: planObjective,
      frequency: planFrequency,
      startDate: new Date().toISOString(),
      sessions,
      isActive: plans.length === 0, // Make active if it's the first one
      level: planLevel,
      metrics: planMetrics,
    };

    onAddPlan(newPlan);
    setIsAddingPlan(false);
    setTranscription("");
    setPlanName("");
    setPlanObjective("");
    setPlanLevel("");
    setPlanMetrics("");
  };

  const toggleTaskCompletion = (sessionId: string, taskId: string) => {
    if (!activePlan) return;
    const updatedPlan = { ...activePlan };
    const session = updatedPlan.sessions.find((s) => s.id === sessionId);
    if (session) {
      const task = session.tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.completionDate = task.completed
          ? new Date().toISOString()
          : undefined;
      }
    }
    onUpdatePlan(updatedPlan);
  };

  const getProgressData = (exercise: string) => {
    return records
      .filter((r) => r.exercise === exercise)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: new Date(r.date).toLocaleDateString(),
        value: r.value,
      }));
  };

  const uniquePlannedExercises = useMemo(() => {
    if (!activePlan) return [];
    const exercises = new Set<string>();
    activePlan.sessions.forEach((s) =>
      s.tasks.forEach((t) => exercises.add(t.exercise)),
    );
    return Array.from(exercises);
  }, [activePlan]);

  return (
    <div className="bg-[var(--card)] rounded-xl shadow-xl overflow-hidden border border-[var(--border)]">
      <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--secondary)] flex items-center">
            <ClipboardIcon className="w-6 h-6 mr-2 text-[var(--primary)]" />
            Planificación Personalizada
          </h2>
          <p className="text-sm text-[var(--muted-text)]">
            Gestiona tus objetivos y sigue tu evolución.
          </p>
        </div>
        {!isAddingPlan && (
          <button
            onClick={() => setIsAddingPlan(true)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:opacity-90 transition-all shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Nuevo Plan
          </button>
        )}
      </div>

      {isAddingPlan ? (
        <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                Nombre del Plan
              </label>
              <input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Ej: Fuerza Máxima"
                className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                Frecuencia
              </label>
              <select
                value={planFrequency}
                onChange={(e) => setPlanFrequency(e.target.value as any)}
                className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
              >
                <option value="Daily">Diario</option>
                <option value="Weekly">Semanal</option>
                <option value="Monthly">Mensual</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                Nivel de Avance
              </label>
              <input
                value={planLevel}
                onChange={(e) => setPlanLevel(e.target.value)}
                placeholder="Ej: Intermedio"
                className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                Métricas de Medición
              </label>
              <input
                value={planMetrics}
                onChange={(e) => setPlanMetrics(e.target.value)}
                placeholder="Ej: RM, Reps, Tiempo"
                className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-text)]">
              Transcripción Simple
            </label>
            <p className="text-xs text-[var(--muted-text)] mb-2">
              Formato: Day X: Título
              <br />- Ejercicio: SetsxReps @ Peso Unidad
            </p>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder={
                "Day 1: Empuje\n- Bench Press: 3x10 @ 60 kg\n- OHP: 3x8 @ 40 kg"
              }
              rows={8}
              className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddingPlan(false)}
              className="px-6 py-2 rounded-lg font-semibold text-[var(--muted-text)] hover:bg-[var(--input)] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPlan}
              className="bg-[var(--primary)] text-white px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              Guardar Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="p-0">
          <div className="flex border-b border-[var(--border)]">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "active" ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--input)]/30" : "text-[var(--muted-text)] hover:text-[var(--text)]"}`}
            >
              Plan Activo
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "stats" ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--input)]/30" : "text-[var(--muted-text)] hover:text-[var(--text)]"}`}
            >
              Evolución
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "history" ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--input)]/30" : "text-[var(--muted-text)] hover:text-[var(--text)]"}`}
            >
              Historial
            </button>
          </div>

          <div className="p-6">
            {activeTab === "active" && (
              <div className="space-y-6">
                {activePlan ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text)]">
                          {activePlan.name}
                        </h3>
                        <p className="text-[var(--primary)] font-medium">
                          {activePlan.objective}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-[var(--input)] text-[var(--muted-text)] text-xs rounded-md font-mono">
                            Desde:{" "}
                            {new Date(
                              activePlan.startDate,
                            ).toLocaleDateString()}
                          </span>
                          {activePlan.level && (
                            <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-md font-bold">
                              Nivel: {activePlan.level}
                            </span>
                          )}
                          {activePlan.metrics && (
                            <span className="px-2 py-1 bg-[var(--secondary)]/10 text-[var(--secondary)] text-xs rounded-md font-bold">
                              Métricas: {activePlan.metrics}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeletePlan(activePlan.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar Plan"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activePlan.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="bg-[var(--input)]/50 rounded-xl p-5 border border-[var(--border)] space-y-4"
                        >
                          <h4 className="font-bold text-lg border-b border-[var(--border)] pb-2">
                            {session.title}
                          </h4>
                          <div className="space-y-3">
                            {session.tasks.map((task) => (
                              <div
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${task.completed ? "bg-green-500/10 border-green-500/30" : "bg-[var(--card)] border-[var(--border)]"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      toggleTaskCompletion(session.id, task.id)
                                    }
                                    className={`transition-colors ${task.completed ? "text-green-500" : "text-[var(--muted-text)] hover:text-[var(--primary)]"}`}
                                  >
                                    <CheckCircleIcon className="w-6 h-6" />
                                  </button>
                                  <div>
                                    <p
                                      className={`font-semibold ${task.completed ? "line-through opacity-50" : ""}`}
                                    >
                                      {task.exercise}
                                    </p>
                                    <p className="text-xs text-[var(--muted-text)]">
                                      {task.sets}x{task.reps} @{" "}
                                      {task.targetValue} {task.targetUnit || ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <ClipboardIcon className="w-16 h-16 mx-auto text-[var(--muted-text)] opacity-20" />
                    <p className="text-[var(--muted-text)]">
                      No tienes ningún plan activo.
                    </p>
                    <button
                      onClick={() => setIsAddingPlan(true)}
                      className="text-[var(--primary)] font-bold hover:underline"
                    >
                      Crear uno ahora
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-8">
                {activePlan && (
                  <div className="bg-[var(--input)]/20 p-6 rounded-xl border border-[var(--border)] space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold flex items-center">
                        <ChartBarIcon className="w-5 h-5 mr-2 text-[var(--primary)]" />
                        Análisis de Avance Personalizado
                      </h4>
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-[var(--input)] text-[var(--text)] px-3 py-1 rounded-md text-xs font-bold border border-[var(--border)] hover:bg-[var(--border)] transition-colors flex items-center">
                          <DownloadIcon className="w-4 h-4 mr-1" /> Cargar CSV
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Progress Logging Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                          Nivel Actual
                        </label>
                        <input
                          value={newLog.level}
                          onChange={(e) =>
                            setNewLog({ ...newLog, level: e.target.value })
                          }
                          placeholder="Ej: 75%"
                          className="w-full bg-[var(--input)] border border-[var(--border)] p-2 rounded-md text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                          Métrica (Valor)
                        </label>
                        <input
                          value={newLog.metrics}
                          onChange={(e) =>
                            setNewLog({ ...newLog, metrics: e.target.value })
                          }
                          placeholder="Ej: 100kg"
                          className="w-full bg-[var(--input)] border border-[var(--border)] p-2 rounded-md text-sm outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleAddLog}
                          className="w-full bg-[var(--primary)] text-white py-2 rounded-md font-bold text-sm hover:opacity-90 transition-all"
                        >
                          Registrar Avance
                        </button>
                      </div>
                    </div>

                    {/* Progress Visualization */}
                    {activePlan.progressLogs &&
                    activePlan.progressLogs.length > 0 ? (
                      <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={activePlan.progressLogs.sort(
                              (a, b) =>
                                new Date(a.date).getTime() -
                                new Date(b.date).getTime(),
                            )}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.1)"
                            />
                            <XAxis
                              dataKey="date"
                              stroke="var(--muted-text)"
                              fontSize={10}
                              tickFormatter={(val) =>
                                new Date(val).toLocaleDateString()
                              }
                            />
                            <YAxis stroke="var(--muted-text)" fontSize={10} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                                color: "var(--text)",
                              }}
                              labelFormatter={(val) =>
                                new Date(val).toLocaleDateString()
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="level"
                              name="Nivel de Avance"
                              stroke="var(--primary)"
                              strokeWidth={3}
                              dot={{ r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="metrics"
                              name="Métrica"
                              stroke="var(--secondary)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[var(--muted-text)] text-sm italic">
                        Carga un CSV (Fecha, Nivel, Métrica, Nota) o registra un
                        avance para ver la evolución.
                      </div>
                    )}
                  </div>
                )}

                {uniquePlannedExercises.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    {uniquePlannedExercises.map((exercise) => {
                      const data = getProgressData(exercise);
                      if (data.length < 2) return null;
                      return (
                        <div
                          key={exercise}
                          className="bg-[var(--input)]/30 rounded-xl p-6 border border-[var(--border)]"
                        >
                          <h4 className="text-lg font-bold mb-4 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2 text-[var(--primary)]" />
                            Evolución: {exercise}
                          </h4>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={data}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                  dataKey="date"
                                  stroke="var(--muted-text)"
                                  fontSize={12}
                                />
                                <YAxis
                                  stroke="var(--muted-text)"
                                  fontSize={12}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderColor: "var(--border)",
                                    color: "var(--text)",
                                  }}
                                  itemStyle={{ color: "var(--primary)" }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="var(--primary)"
                                  strokeWidth={3}
                                  dot={{ r: 6, fill: "var(--primary)" }}
                                  activeDot={{ r: 8 }}
                                  name="Valor"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                    {uniquePlannedExercises.every(
                      (ex) => getProgressData(ex).length < 2,
                    ) && (
                      <div className="text-center py-12 text-[var(--muted-text)]">
                        Registra más entrenamientos para ver gráficas de
                        evolución.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[var(--muted-text)]">
                    No hay ejercicios planificados para analizar.
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                {plans.filter((p) => !p.isActive).length > 0 ? (
                  plans
                    .filter((p) => !p.isActive)
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-[var(--input)]/30 p-4 rounded-lg border border-[var(--border)] flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold">{plan.name}</h4>
                          <p className="text-xs text-[var(--muted-text)]">
                            {new Date(plan.startDate).toLocaleDateString()} -{" "}
                            {plan.objective}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            onUpdatePlan({ ...plan, isActive: true })
                          }
                          className="text-xs font-bold text-[var(--primary)] hover:underline"
                        >
                          Reactivar
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12 text-[var(--muted-text)]">
                    No hay planes en el historial.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningDashboard;
