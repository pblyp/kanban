import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { useRef } from "react";
import invariant from "tiny-invariant";

import { getSticker, updateSticker } from "~/models/sticker.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    invariant(params.stickerId, "stickerId not found");

    const sticker = await getSticker({ id: Number(params.stickerId), userId });
    if (!sticker) {
        throw new Response("Not Found", { status: 404 });
    }
    const html = await marked(sticker.summary);
    return json({ sticker, html });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const title = formData.get("title");
    const summary = formData.get("summary");
    const estimate = formData.get("estimate");
    const spentHours = formData.get("spentHours");
    const startedAt = formData.get("taskstart");
    const endedAt = formData.get("taskend");

    console.log(startedAt, endedAt)


    if (typeof title !== "string" || title.length === 0) {
        return json(
            { error: "Title is required" },
            { status: 400 },
        );
    }

    if (typeof summary !== "string" || summary.length === 0) {
        return json(
            { error: "Summary is required" },
            { status: 400 },
        );
    }

    if (title.length > 100) {
        return json(
            { error: "Title is longer than 100 symbols" },
            { status: 400 },
        );
    }

    if (summary.length > 1337) {
        return json(
            { error: "Summary is longer than 1337 symbols" },
            { status: 400 },
        );
    }

    const est = Number(estimate);
    const spent = Number(spentHours);
    const start = startedAt ? new Date(startedAt) : null;
    const end = endedAt ? new Date(endedAt) : null;

    const Sticker = await updateSticker({ id: Number(params.stickerId), summary, title, estimate: est, spentHours: spent, startedAt: start, endedAt: end, userId });
    return redirect(`/board/${Sticker.id}`);
};

export default function NewStickerPage() {
    const data = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const titleRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLTextAreaElement>(null);
    const estimateRef = useRef<HTMLInputElement>(null);
    const spentHoursRef = useRef<HTMLInputElement>(null);

    return (
        <Form
            method="post"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
            }}
        >
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Title: </span>
                    <input
                        ref={titleRef}
                        name="title"
                        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                        aria-invalid={actionData?.error ? true : undefined}
                        aria-errormessage={
                            actionData?.error ? "title-error" : undefined
                        }
                        defaultValue={data.sticker.title}
                    />
                </label>
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>summary: </span>
                    <textarea
                        ref={summaryRef}
                        name="summary"
                        rows={8}
                        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
                        aria-invalid={actionData?.error ? true : undefined}
                        aria-errormessage={
                            actionData?.error ? "summary-error" : undefined
                        }
                        defaultValue={data.sticker.summary}
                    />
                </label>
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>estimate in hours: </span>
                    <input
                        ref={estimateRef}
                        type="number"
                        min={0}
                        name="estimate"
                        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
                        aria-invalid={actionData?.error ? true : undefined}
                        aria-errormessage={
                            actionData?.error ? "summary-error" : undefined
                        }
                        defaultValue={data.sticker.estimate || 0}
                    />
                </label>
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>hours spent: </span>
                    <input
                        ref={spentHoursRef}
                        type="number"
                        min={0}
                        name="spentHours"
                        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
                        aria-invalid={actionData?.error ? true : undefined}
                        aria-errormessage={
                            actionData?.error ? "summary-error" : undefined
                        }
                        defaultValue={data.sticker.spentHours || 0}
                    />
                </label>
                {actionData?.error ? (
                    <div className="pt-1 text-red-700" id="summary-error">
                        {actionData.error}
                    </div>
                ) : null}
            </div>

            <input type="date" id="start" name="taskstart" min="1970-01-01" />
            <input type="date" id="start" name="taskend" min="1970-01-01" />

            <div className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Save
                </button>
            </div>
        </Form>
    );
}