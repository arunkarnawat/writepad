import type { AppState, Todo, ThemePreset, CustomOverrides, ThemeState } from './types';
import type { Block } from '@blocknote/core';

interface WireTodo {
  i: string;
  x: string;
  k?: 1;
  o: number;
  a?: number;
}

interface WireStateV2 {
  v: 2;
  d: unknown[];
  td: WireTodo[];
  th?: { p: ThemePreset; ov?: CustomOverrides };
}

function wireTodos(td: WireTodo[]): Todo[] {
  return (td || []).map(wt => ({
    id: wt.i,
    text: wt.x,
    completed: !!wt.k,
    order: wt.o,
    createdAt: wt.a ? wt.a * 1000 : Date.now(),
  }));
}

function wireTheme(th?: { p: ThemePreset; ov?: CustomOverrides }): ThemeState {
  return th ? { preset: th.p, overrides: th.ov || {} } : { preset: 'paper', overrides: {} };
}

function isWireStateV2(wire: unknown): wire is WireStateV2 {
  if (!wire || typeof wire !== 'object') return false;
  const o = wire as Record<string, unknown>;
  return o.v === 2 && Array.isArray(o.d) && (o.td === undefined || Array.isArray(o.td));
}

export function serialize(state: AppState): WireStateV2 {
  const todos: WireTodo[] = state.todos.map(t => ({
    i: t.id,
    x: t.text,
    k: t.completed ? 1 : undefined,
    o: t.order,
    a: Math.floor(t.createdAt / 1000),
  }));

  const th =
    state.theme.preset === 'paper' && Object.keys(state.theme.overrides).length === 0
      ? undefined
      : { p: state.theme.preset, ov: state.theme.overrides };

  return {
    v: 2,
    d: state.doc as unknown[],
    td: todos,
    th,
  };
}

/** Returns `null` if the payload is not a v2 document (unknown or legacy format). */
export function hydrate(wire: unknown): AppState | null {
  if (!isWireStateV2(wire)) return null;

  return {
    v: 2,
    doc: (wire.d || []) as Block[],
    todos: wireTodos(Array.isArray(wire.td) ? wire.td : []),
    theme: wireTheme(wire.th),
  };
}
