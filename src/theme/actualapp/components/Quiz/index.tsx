"use client";

import { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { QuizSchema } from "wpjs-api";

type Props = { quiz: QuizSchema };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function QuizRenderer({ quiz }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const totalQuestions = quiz.questions.length;
  const answeredCount = useMemo(
    () => quiz.questions.filter((q) => (answers[q.id]?.length ?? 0) > 0).length,
    [answers, quiz.questions]
  );
  const isComplete = answeredCount === totalQuestions;

  const handleChange = (qid: string, value: string, multiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[qid] ?? [];
      if (multiple) {
        return {
          ...prev,
          [qid]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [qid]: [value] };
    });
  };

  const traitTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const q of quiz.questions) {
      const selected = answers[q.id] || [];
      for (const sel of selected) {
        const ans = q.answers.find((a) => a.value === sel);
        const weights = ans?.weights || {};
        for (const [trait, w] of Object.entries(weights)) {
          totals[trait] = (totals[trait] ?? 0) + (w ?? 0);
        }
      }
    }
    return totals;
  }, [answers, quiz.questions]);

  const computeResult = () => {
    if (
      quiz.scoring.method === "sum_weights" ||
      quiz.scoring.method === "max_category"
    ) {
      const sorted = Object.entries(traitTotals).sort((a, b) => b[1] - a[1]);
      const winnerTrait = sorted[0]?.[0];
      const res =
        quiz.results.find((r) => r.id === winnerTrait) ?? quiz.results[0];
      return res;
    }
    return quiz.results[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = computeResult();
    setResult(res);
  };

  if (result) {
    const breakdown = Object.entries(traitTotals).sort((a, b) => b[1] - a[1]);

    return (
      <div className={styles.resultCard}>
        <h2 className={styles.resultTitle}>{result.title}</h2>
        <p className={styles.resultDesc}>{result.description}</p>

        {breakdown.length > 0 && (
          <details
            className={styles.details}
            open={showBreakdown}
            onToggle={(e) =>
              setShowBreakdown((e.target as HTMLDetailsElement).open)
            }
          >
            <summary className={styles.summary}>
              Ver desglose de puntuaciones
            </summary>
            <ul className={styles.breakdownList}>
              {breakdown.map(([trait, score]) => (
                <li key={trait} className={styles.breakdownItem}>
                  <span className={styles.breakdownTrait}>{trait}</span>
                  <span className={styles.breakdownScore}>{score}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setResult(null);
          }}
          className={cx(styles.button, styles.secondary)}
        >
          Volver a intentarlo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.progressWrap} aria-label="Progreso del quiz">
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {answeredCount}/{totalQuestions} respondidas
        </div>
      </div>

      {quiz.questions.map((q, idx) => (
        <fieldset key={q.id} className={styles.fieldset}>
          <legend className={styles.legend}>
            <span className={styles.qIndex}>{idx + 1}.</span> {q.text}
          </legend>

          <div
            className={styles.optionsGrid}
            role={q.multiple ? "group" : "radiogroup"}
            aria-label={q.text}
          >
            {q.answers.map((a) => {
              const selected = (answers[q.id] || []).includes(a.value);
              return (
                <label
                  key={a.value}
                  className={cx(
                    styles.optionCard,
                    selected && styles.optionSelected
                  )}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleChange(q.id, a.value, q.multiple);
                    }
                  }}
                >
                  <input
                    className={styles.optionInput}
                    type={q.multiple ? "checkbox" : "radio"}
                    name={q.id}
                    value={a.value}
                    checked={selected}
                    onChange={() => handleChange(q.id, a.value, q.multiple)}
                  />
                  <span className={styles.optionLabel}>{a.label}</span>
                  <span className={styles.optionTick} aria-hidden="true">
                    ✓
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={!isComplete}
          className={cx(styles.button, !isComplete && styles.buttonDisabled)}
        >
          Ver resultado
        </button>
      </div>
    </form>
  );
}
