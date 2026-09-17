import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

const SERIES = [
  { month: "Feb", value: 1.4 },
  { month: "Mar", value: 1.55 },
  { month: "Abr", value: 1.7 },
  { month: "May", value: 1.9 },
  { month: "Jun", value: 2.05 },
  { month: "Jul", value: 2.2 },
  { month: "Ago", value: 2.45 },
  { month: "Sep", value: 2.7 },
];

const AVAILABLE = 1700000;
const INVESTED = 1000000;
const OWED = 500000;
const ASSETS = AVAILABLE + INVESTED;

const W = 360;
const H = 150;
const PAD_X = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 26;
const MIN = 1.2;
const MAX = 2.9;
const RANGE = MAX - MIN;

const CHART_W = W - PAD_X * 2;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

function xAt(i: number) {
  return PAD_X + (i / (SERIES.length - 1)) * CHART_W;
}

function yAt(value: number) {
  return PAD_TOP + ((MAX - value) / RANGE) * CHART_H;
}

const points = SERIES.map((point, i) => `${xAt(i)},${yAt(point.value)}`).join(" ");
const areaPath = `M ${xAt(0)} ${yAt(SERIES[0].value)} L ${points.split(" ").join(" L ")} L ${xAt(SERIES.length - 1)} ${PAD_TOP + CHART_H} L ${xAt(0)} ${PAD_TOP + CHART_H} Z`;

function Stat({ label, value, sub, tone = "neutral" }: { label: string; value: string; sub: string; tone?: "neutral" | "positive" | "negative" }) {
  const toneClass =
    tone === "positive" ? "text-green-400" : tone === "negative" ? "text-red-400" : "text-white";
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${toneClass}`}>{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </Card>
  );
}

function Delta({ children, tone = "positive" }: { children: React.ReactNode; tone?: "positive" | "negative" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        tone === "positive" ? "text-green-400" : "text-red-400"
      }`}
    >
      {children}
    </span>
  );
}

export function DemoMetrics() {
  const patrimony = (ASSETS / 1000000).toFixed(1).replace(".", ",");
  const monthlyDelta = ((2.7 - 2.45) / 2.45) * 100;
  const periodDelta = ((2.7 - 1.4) / 1.4) * 100;

  const availablePct = Math.round((AVAILABLE / ASSETS) * 100);
  const investedPct = 100 - availablePct;
  const investedDelta = 12.5;

  const income = 1500000;
  const expense = 185000;
  const net = income - expense;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
          Tu panorama financiero
        </h2>
        <p className="text-sm text-gray-400">
          Indicadores clave de tu actividad · datos de ejemplo
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Patrimonio total"
          value={`$ ${patrimony}M`}
          sub={`+${monthlyDelta.toFixed(1).replace(".", ",")}% este mes`}
          tone="positive"
        />
        <Stat label="Saldo disponible" value={formatMoney(AVAILABLE)} sub="Líquido para operar" />
        <Stat
          label="Invertido"
          value={formatMoney(INVESTED)}
          sub={`+${investedDelta.toFixed(1).replace(".", ",")}% este mes`}
          tone="positive"
        />
        <Stat label="Deuda activa" value={formatMoney(OWED)} sub="Créditos en curso" tone="negative" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
            Distribución de tu dinero
          </h3>
          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
            <div
              className="bg-gradient-to-r from-indigo-400 to-violet-500"
              style={{ width: `${availablePct}%` }}
            />
            <div
              className="bg-gradient-to-r from-pink-500 to-violet-600"
              style={{ width: `${investedPct}%` }}
            />
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-300">
                <span className="size-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500" />
                Disponible
              </span>
              <span className="text-white">
                {formatMoney(AVAILABLE)} · {availablePct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-300">
                <span className="size-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
                Invertido
              </span>
              <span className="text-white">
                {formatMoney(INVESTED)} · {investedPct}%
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Ingresos este mes</p>
              <p className="mt-1 text-sm font-semibold text-green-400">+{formatMoney(income)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Egresos este mes</p>
              <p className="mt-1 text-sm font-semibold text-red-400">−{formatMoney(expense)}</p>
            </div>
            <div className="col-span-2 rounded-lg bg-white/5 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Saldo neto del mes</p>
              <p className="mt-1 font-semibold text-white">+{formatMoney(net)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
              Crecimiento del patrimonio
            </h3>
            <Delta>+{periodDelta.toFixed(1).replace(".", ",")}% en 8 meses</Delta>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Gráfico de crecimiento del patrimonio">
            <defs>
              <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#growth-area)" />
            <polyline
              points={points}
              fill="none"
              stroke="url(#growth-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {SERIES.map((point, i) => (
              <circle key={point.month} cx={xAt(i)} cy={yAt(point.value)} r="3" fill="#0f0728" stroke="#ec4899" strokeWidth="1.5" />
            ))}
            {SERIES.map((point, i) => (
              <text
                key={`${point.month}-label`}
                x={xAt(i)}
                y={H - 8}
                textAnchor="middle"
                className="fill-gray-500 text-[10px]"
              >
                {point.month}
              </text>
            ))}
          </svg>
          <p className="mt-2 text-xs text-gray-500">
            Patrimonio disponible + invertido (en millones de pesos) · últimos 8 meses
          </p>
        </Card>
      </div>
    </section>
  );
}