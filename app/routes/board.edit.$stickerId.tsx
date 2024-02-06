import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import { createSticker, getSticker, updateSticker } from "~/models/sticker.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    invariant(params.stickerId, "stickerId not found");

    const sticker = await getSticker({ id: Number(params.stickerId), userId });
    if (!sticker) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ sticker });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const title = formData.get("title");
    const summary = formData.get("summary");

    if (typeof title !== "string" || title.length === 0) {
        return json(
            { errors: { summary: null, title: "Title is required" } },
            { status: 400 },
        );
    }

    if (typeof summary !== "string" || summary.length === 0) {
        return json(
            { errors: { summary: "summary is required", title: null } },
            { status: 400 },
        );
    }

    const Sticker = await updateSticker({ id: Number(params.stickerId), summary, title, userId });

    return redirect(`/board/${Sticker.id}`);
};

export default function NewStickerPage() {
    const data = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const titleRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (actionData?.errors?.title) {
            titleRef.current?.focus();
        } else if (actionData?.errors?.summary) {
            summaryRef.current?.focus();
        }
    }, [actionData]);

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
                        aria-invalid={actionData?.errors?.title ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.title ? "title-error" : undefined
                        }
                        defaultValue={data.sticker.title}
                    />
                </label>
                {actionData?.errors?.title ? (
                    <div className="pt-1 text-red-700" id="title-error">
                        {actionData.errors.title}
                    </div>
                ) : null}
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>summary: </span>
                    <textarea
                        ref={summaryRef}
                        name="summary"
                        rows={8}
                        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
                        aria-invalid={actionData?.errors?.summary ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.summary ? "summary-error" : undefined
                        }
                        defaultValue={data.sticker.summary}
                    />
                </label>
                {actionData?.errors?.summary ? (
                    <div className="pt-1 text-red-700" id="summary-error">
                        {actionData.errors.summary}
                    </div>
                ) : null}
            </div>

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