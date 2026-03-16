import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let description = "An unexpected error occurred while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`.trim();
    description = typeof error.data === "string" ? error.data : description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Application Error</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-4 text-slate-600">{description}</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="rounded bg-brand-600 px-4 py-2 font-medium text-white">
          Go to Home
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded border border-slate-300 px-4 py-2 font-medium text-slate-700"
        >
          Reload
        </button>
      </div>
    </main>
  );
}