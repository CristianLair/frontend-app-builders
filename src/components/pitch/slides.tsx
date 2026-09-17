import type { ReactNode } from "react";
import Link from "next/link";
import { PitchLauncher, PitchLauncherLine } from "@/components/pitch/pitch-launcher";
import { formatMoney } from "@/lib/utils";

export interface SlideProps {
  go: (index: number) => void;
  next: () => void;
}

export interface Slide {
  id: string;
  label: string;
  render: (props: SlideProps) => ReactNode;
}

function SlideShell(props: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-4xl px-6 py-10 ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-pink-300">
      {children}
    </span>
  );
}

function Headline({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}

function Copy({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-2xl text-base text-gray-400">{children}</p>;
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pink-400" />
      <span className="text-gray-200">{children}</span>
    </li>
  );
}

function DemoModuleCard(props: { module: "dashboard" | "transferencias" | "creditos" | "inversiones"; title: string; description: string }) {
  return (
    <PitchLauncher {...props} />
  );
}

export const SLIDES: Slide[] = [
  {
    id: "cover",
    label: "Portada",
    render: ({ go }) => (
      <SlideShell className="flex min-h-[62vh] flex-col items-start justify-center py-16">
        <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
          Presto
        </p>
        <span className="mt-8 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-purple-200">
          Demo de producto · Préstamos y créditos con inteligencia
        </span>
        <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl">
          Tu dinero en
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            una sola app.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Cuenta, transferencias, créditos, inversiones y un asistente con IA en una sola
          experiencia. <span className="font-semibold text-white">Funcionando hoy</span>, con
          simuladores reales de decisión.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => go(3)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 px-5 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-400 hover:to-violet-500"
          >
            Ver el producto en vivo
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-white/10 px-5 text-sm font-medium text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
          >
            Contar la historia →
          </button>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <span>Cuenta · Transferencias · Créditos · Inversiones · IA</span>
          <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:block" />
          <span>Next.js 16 · API Gateway · Microservicios</span>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "problema",
    label: "El problema",
    render: () => (
      <SlideShell>
        <Kicker>El problema</Kicker>
        <Headline>
          Las finanzas personales están
          <span className="text-gray-500"> fragmentadas</span>.
        </Headline>
        <Copy>
          En cualquier mercado emergente convivir con el dinero implica saltar entre bancos,
          billeteras, créditos y apps de inversión que no hablan entre sí. Decidir bien es
          costoso, opaco y lento.
        </Copy>
        <ul className="mt-8 space-y-4">
          <Bullet>
            <span>
              <strong className="text-white">Nada te dice cómo estás hoy:</strong> saldo,
              deuda y rendimiento viven en lugares distintos.
            </span>
          </Bullet>
          <Bullet>
            <span>
              <strong className="text-white">Créditos sin transparencia:</strong> cuota,
              interés total y capacidad de pago suelen calcularse a mano o con letra chica.
            </span>
          </Bullet>
          <Bullet>
            <span>
              <strong className="text-white">Invertir da miedo:</strong> no hay simuladores
              claros que muestren cuánto recibirías al vencimiento.
            </span>
          </Bullet>
          <Bullet>
            <span>
              <strong className="text-white">Sin asistencia:</strong> nadie te acompaña a
              simular, comparar y decidir con confianza.
            </span>
          </Bullet>
        </ul>
        <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-300">
            <strong className="text-white">El resultado:</strong> personas y pequeñas
            empresas dejan dinero sin hacer crecer y pagan tasas que no comprenden. Eso es
            una oportunidad de plataforma con margen.
          </p>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "solucion",
    label: "La solución",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>La solución</Kicker>
        <Headline>
          Presto: la capa inteligente entre
          <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> tu dinero </span>
          y tus decisiones.
        </Headline>
        <Copy>
          Una app que unifica en un solo lugar lo que hoy está disperso y agrega lo que
          ninguna app tiene: una capa de decisión con IA. Cada módulo incluye un simulador
          transparente que el usuario ve antes de comprometerse.
        </Copy>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Billetera",
              body: "Saldo, cuentas y movimientos en tiempo real, con el dinero bajo control.",
            },
            {
              title: "Transferencias",
              body: "Recibí y envía dinero con historial completo de ingresos y egresos.",
            },
            {
              title: "Créditos",
              body: "Simulá monto y cuotas, mirá la tasa total y pedí con un solo toque.",
            },
            {
              title: "Inversiones",
              body: "Simulá rendimiento a 1–24 meses y sabé exactamente cuánto vas a recibir.",
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">{feature.title}</p>
              <p className="mt-1 text-sm text-gray-400">{feature.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 flex gap-3">
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 px-4 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-400 hover:to-violet-500"
          >
            Ver cada módulo →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "vivo",
    label: "Producto en vivo",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Producto en vivo</Kicker>
        <Headline>
          No es un mockup.
          <span className="text-gray-500"> Es la app.</span>
        </Headline>
        <Copy>
          Tocá cualquier módulo: se abre la aplicación funcionando con datos de ejemplo al
          instante. Sin instalación, sin backend, lista para explorar en la reunión.
        </Copy>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <DemoModuleCard module="dashboard" title="Inicio" description="Tu saldo, tu patrimonio y tus movimientos" />
          <DemoModuleCard module="transferencias" title="Transferencias" description="Recibí y enviá dinero" />
          <DemoModuleCard module="creditos" title="Créditos" description="Simulá y solicitá en cuotas" />
          <DemoModuleCard module="inversiones" title="Inversiones" description="Simulá rendimiento y crecé" />
        </div>
        <div className="mt-9 flex justify-between">
          <p className="text-xs text-gray-500">Los datos son simulados para la demostración.</p>
          <button
            type="button"
            onClick={next}
            className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300"
          >
            Siguiente: módulos →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "transferencias",
    label: "Transferencias",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Módulo · Billetera y transferencias</Kicker>
        <Headline>
          El dinero que entra y sale,
          <span className="text-gray-500"> siempre claro.</span>
        </Headline>
        <Copy>
          Cash-in y cash-out con origen, destino y estado. El saldo disponible se actualiza al
          instante y el historial queda registrado para siempre.
        </Copy>
        <ul className="mt-8 space-y-4">
          <Bullet>Registro de ingresos con origen y descripción.</Bullet>
          <Bullet>Transferencias con estado pendiente / completado.</Bullet>
          <Bullet>Historial completo que sustenta el dashboard.</Bullet>
        </ul>
        <div className="mt-8">
          <PitchLauncherLine module="transferencias" title="Probar transferencias" description="abre la demo" />
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: créditos →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "creditos",
    label: "Créditos",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Módulo · Créditos</Kicker>
        <Headline>
          Un simulador que
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> no esconde nada.</span>
        </Headline>
        <Copy>
          El usuario elige monto y cuotas, y ve en vivo la tasa total, la cuota equivalente,
          el interés y el total a pagar. La capacidad se calcula contra su salario y el sistema
          valida que pida dentro de su margen (30%).
        </Copy>
        <ul className="mt-8 space-y-4">
          <Bullet>Transparencia total: el cliente entiende lo que firma.</Bullet>
          <Bullet>Solicitud en un toque con aprobación inmediata en demo.</Bullet>
          <Bullet>Capacidad de pago validada por sistema, no al ojo.</Bullet>
        </ul>
        <div className="mt-8">
          <PitchLauncherLine module="creditos" title="Probar créditos" description="abre la demo" />
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: inversiones →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "inversiones",
    label: "Inversiones",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Módulo · Inversiones</Kicker>
        <Headline>
          Rendimiento simulado,
          <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> riesgo entendido.</span>
        </Headline>
        <Copy>
          Plazos de 1 a 24 meses con tasas crecientes y cálculo transparente: monto ·
          rendimiento total · lo que recibís al finalizar. La persona invierte con números
          en la mano, no con promesas.
        </Copy>
        <ul className="mt-8 space-y-4">
          <Bullet>Ejemplo real del simulador: 100.000 a 24 meses → recibís 130.000.</Bullet>
          <Bullet>Portafolio visible: capital, ganancia, vencimiento y estado.</Bullet>
          <Bullet>Motor financiero listo para conectarse a instrumentos reales.</Bullet>
        </ul>
        <div className="mt-8">
          <PitchLauncherLine module="inversiones" title="Probar inversiones" description="abre la demo" />
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: IA →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "ia",
    label: "Asistente IA",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Diferenciador · Asistente con IA</Kicker>
        <Headline>
          La IA que acompaña cada
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"> decisión financiera.</span>
        </Headline>
        <Copy>
          Un asistente conversacional integrado que simula inversiones y revisa la situación de
          créditos en lenguaje natural. No es un chat decorativo: está conectado a los datos
          del usuario.
        </Copy>
        <ul className="mt-8 space-y-4">
          <Bullet>Responde con datos de la cuenta, no con texto genérico.</Bullet>
          <Bullet>Opciones rápidas para guiar al usuario hacia la acción.</Bullet>
          <Bullet>Es el gancho de retención: el usuario vuelve a conversar.</Bullet>
        </ul>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="font-mono text-sm text-gray-300">
            «¿Cuánto recibo si invierto $100.000 a 12 meses?»
          </p>
          <p className="mt-2 font-mono text-sm text-pink-300">
            → Recibís $115.000 al vencimiento (15% total, ~1,25% mensual). ¿Lo simulamos?
          </p>
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: arquitectura →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "arquitectura",
    label: "Arquitectura",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Detrás de la demo</Kicker>
        <Headline>
          Plataforma lista para
          <span className="text-gray-500"> escalar, no para reinventar.</span>
        </Headline>
        <Copy>
          La app web corre sobre Next.js con una base de microservicios desacoplados detrás de
          un API Gateway único. Lo que se ve en la reunión ya se comunica con servicios
          reales de auth, transacciones, créditos e inversiones.
        </Copy>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Frontend", body: "Next.js 16 + TypeScript, responsive y mobile-first." },
            { title: "API Gateway", body: "Un solo punto de entrada para todos los servicios." },
            { title: "Microservicios", body: "Auth, transacciones, créditos e inversiones por separado." },
            { title: "Seguridad", body: "Tokens JWT y sesión protegida en cada llamada." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-gray-400">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: negocio →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "negocio",
    label: "Negocio",
    render: ({ go }) => {
      const invested = 1000000;
      const owed = 500000;
      const available = 1700000;
      return (
        <SlideShell>
          <Kicker>Métricas y modelo de negocio</Kicker>
          <Headline>
            El producto mide lo que
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> el negocio necesita.</span>
          </Headline>
          <Copy>
            El dashboard expone los KPIs que un negocio financiero necesita operar: saldo
            disponible, capital invertido, deuda activa y rendimiento. Esa base de datos es
            el activo sobre el que se construye la monetización.
          </Copy>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-500">Disponible</p>
              <p className="mt-1 text-xl font-semibold text-white">{formatMoney(available)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-500">Invertido</p>
              <p className="mt-1 text-xl font-semibold text-white">{formatMoney(invested)}</p>
              <p className="text-xs text-green-400">Rendimiento en curso</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-500">Deuda activa</p>
              <p className="mt-1 text-xl font-semibold text-white">{formatMoney(owed)}</p>
              <p className="text-xs text-gray-500">Cartera de crédito</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Modelo de ingresos
            </p>
            <ul className="mt-4 space-y-3">
              <Bullet>Margen de financiación sobre créditos.</Bullet>
              <Bullet>Fee sobre inversiones colocadas.</Bullet>
              <Bullet>Suscripción premium con asistencia y análisis avanzados.</Bullet>
              <Bullet>White-label / B2B para entidades que quieran el producto listo.</Bullet>
            </ul>
          </div>
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => go(8)}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-pink-300"
            >
              ← Arquitectura
            </button>
            <button
              type="button"
              onClick={() => go(10)}
              className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300"
            >
              Siguiente: hoja de ruta →
            </button>
          </div>
        </SlideShell>
      );
    },
  },
  {
    id: "roadmap",
    label: "Hoja de ruta",
    render: ({ next }) => (
      <SlideShell>
        <Kicker>Hoja de ruta</Kicker>
        <Headline>
          Lo que ya está, y lo que
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"> destraba el capital.</span>
        </Headline>
        <div className="mt-9 space-y-4">
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-green-300">Fase 1 · Hoy</p>
            <p className="mt-2 text-sm text-gray-200">
              MVP funcional: cuenta, transferencias, créditos, inversiones y asistente IA,
              todo con simuladores en vivo. Listo para demostrar y validar.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-white">Fase 2 · Con capital</p>
            <p className="mt-2 text-sm text-gray-300">
              Pagos reales, integraciones bancarias, tarjetas, KYC/onboarding y métricas de
              negocio. Es el puente entre demo y operación con facturación.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-white">Fase 3 · Escala</p>
            <p className="mt-2 text-sm text-gray-300">
              IA avanzada, white-label para entidades financieras y expansión a otros
              mercados de la región.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={next} className="text-sm font-medium text-pink-400 transition-colors hover:text-pink-300">
            Siguiente: inversión →
          </button>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "inversion",
    label: "Inversión",
    render: () => (
      <SlideShell className="flex min-h-[62vh] flex-col justify-center py-16 text-center">
        <Kicker>Por qué invertir hoy</Kicker>
        <Headline>
          No estamos pidiendo que nos escuches.
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Estamos mostrando el producto.
          </span>
        </Headline>
        <Copy>
          Hay un MVP funcional, una arquitectura desacoplada y una ventaja clara: la capa de
          decisión con IA. El capital de la Fase 2 convierte esta plataforma en un negocio
          con facturación.
        </Copy>
        <ul className="mx-auto mt-8 max-w-2xl space-y-3 text-left">
          <Bullet>Producto en vivo hoy, validado con usuarios reales en la demo.</Bullet>
          <Bullet>Stack moderno y desacoplado: listo para integrar pagos reales.</Bullet>
          <Bullet>Roadmap claro con hitos medibles a 90 días.</Bullet>
          <Bullet>Equipo con ingeniería sobre el terreno: de la idea a la demo, en semanas.</Bullet>
        </ul>
        <div className="mt-9">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 px-7 text-base font-semibold text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-400 hover:to-violet-500"
          >
            Explorar la app ahora
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Equipo Presto · Conversemos mañana sobre el siguiente paso
          </p>
        </div>
      </SlideShell>
    ),
  },
];