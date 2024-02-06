import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
    Form,
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteSticker, getSticker, moveSticker, updateSticker } from "~/models/sticker.server";

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

    const move = formData.get("move");
    invariant(params.stickerId, "stickerId not found");

    if (move) {
        await moveSticker({id: Number(params.stickerId), userId, stage: Number(move)});
    } else if (formData.get("delete") === "delete") {
        await deleteSticker({ id: Number(params.stickerId), userId });
    }

    return redirect("/board");
};

export default function stickerDetailsPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <div>
            <h3 className="text-2xl font-bold">{data.sticker.title}</h3>
            <p className="py-6">{data.sticker.summary}</p>
            <p className="py-6">{data.sticker.createdAt}</p>
            <p className="py-1">{data.sticker.updatedAt || "null"}</p>
            <hr className="my-4" />
            <div className="flex items-center justify-between">
                <Link to={"/board/edit/" + data.sticker.id} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                    Edit
                </Link>
                <Form method="post">
                    <button
                        type="submit"
                        name="move"
                        value={data.sticker.stage > 0 ? data.sticker.stage-1 : 0}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                    >
                        L
                    </button>
                    <button
                        type="submit"
                        name="move"
                        value={data.sticker.stage < 3 ? data.sticker.stage+1 : 3}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                    >
                        R
                    </button>
                </Form>
                <Form method="post">
                    <button
                        type="submit"
                        name="delete"
                        value="delete"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                    >
                        Delete
                    </button>
                </Form>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (error instanceof Error) {
        return <div>An unexpected error occurred: {error.message}</div>;
    }

    if (!isRouteErrorResponse(error)) {
        return <h1>Unknown Error</h1>;
    }

    if (error.status === 404) {
        return <div>sticker not found</div>;
    }

    return <div>An unexpected error occurred: {error.statusText}</div>;
}
