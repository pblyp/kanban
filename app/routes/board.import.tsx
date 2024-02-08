import { ActionFunctionArgs, NodeOnDiskFile, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { useRef, useEffect } from "react";
import { IExportData, importBoard } from "~/models/sticker.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);

    const uploadHandler = unstable_composeUploadHandlers(
        // parse everything else into memory
        unstable_createMemoryUploadHandler()
    );
    const formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    );

    const file = formData.getAll("file") as Blob[];

    const str = await file[0].text();

    const exported:IExportData = JSON.parse(str);

    if (exported.exportVersion === undefined) {
        return json(
            { errors: { upload: "Export version undetermined" } },
            { status: 400 },
        );
    }

    const Sticker = await importBoard({ exported, userId });

    return redirect(`/board`);
};

export default function NewStickerPage() {
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
            encType="multipart/form-data"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
            }}
        >
            <div>
                <input
                    ref={titleRef}
                    name="file"
                    type="file"
                    className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                    aria-invalid={actionData?.errors?.title ? true : undefined}
                    aria-errormessage={
                        actionData?.errors?.title ? "title-error" : undefined
                    }
                />
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Import
                </button>
            </div>
        </Form>
    );
}