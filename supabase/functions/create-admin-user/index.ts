import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// This slug used to contain an unrelated user-provisioning implementation.
// Keep an inert implementation in source control so a future deployment cannot
// accidentally restore privileged behavior or embedded credentials.
Deno.serve(() =>
  Response.json(
    { error: "This legacy function has been disabled." },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  ),
);
