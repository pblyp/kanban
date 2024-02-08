import { LoaderFunctionArgs, createReadableStreamFromReadable, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Readable } from "stream";
import { exportBoard } from "~/models/sticker.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    const export_data = await exportBoard({ userId });
    return json({ exportVersion:0, export_data }, {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Disposition": `attachment; filename=export (${new Date().toISOString()}).json`,
          "Content-Type": "application/json; charset=utf-8"
        },
      });
};

export function BoardDownload() {
    const data = useLoaderData<typeof loader>();
    const user = useUser();
    return data;
}