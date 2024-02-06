import { Sticker } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getStickerListItems } from "~/models/sticker.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    const stickerListItems = await getStickerListItems({ userId });
    return json({ stickerListItems });
};

export default function BoardPage() {
    const data = useLoaderData<typeof loader>();
    const user = useUser();

    return (
        <div className="flex h-full min-w-[600px] flex-col">
            <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
                <h1 className="text-3xl font-bold">
                    <Link to=".">{user.email}</Link>
                </h1>
                <div className="flex flex-row">
                    <Link to="newtask" className="rounded bg-slate-600 px-4 py-2 mx-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600">
                        +Task
                    </Link>
                    <Form action="/logout" method="post">
                        <button
                            type="submit"
                            className="rounded bg-slate-600 px-4 py-2 mx-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                        >
                            Logout
                        </button>
                    </Form>
                </div>
            </header>

            <main className="flex h-fit bg-white flex-col-reverse xl:flex-row px-4 pb-2">
                <div className="min-h-screen border-r bg-gray-50 basis-3/5 flex flex-row">
                    <div className="h-full basis-1/4 w-1/4 border-x bg-gray-50">
                        <h1 className="p-4 text-lg">Backlog</h1>
                        <hr />
                        <ol>
                            {data.stickerListItems.filter((item) => item.stage === 0)
                                .map((sticker) => (
                                    <li key={sticker.id}>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `block border-b p-4 ${isActive ? "bg-white" : ""}`
                                            }
                                            to={sticker.id.toString()}
                                        >
                                            📝 {sticker.title}
                                        </NavLink>
                                    </li>
                                ))}
                        </ol>
                    </div>

                    <div className="h-full basis-1/4 w-1/4 border-r bg-gray-50">
                        <h1 className="p-4 text-lg">To do</h1>
                        <hr />
                        <ol>
                            {data.stickerListItems.filter((item) => item.stage === 1)
                                .map((sticker) => (
                                    <li key={sticker.id}>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `block border-b p-4 ${isActive ? "bg-white" : ""}`
                                            }
                                            to={sticker.id.toString()}
                                        >
                                            📝 {sticker.title}
                                        </NavLink>
                                    </li>
                                ))}
                        </ol>
                    </div>

                    <div className="h-full basis-1/4 w-1/4 border-r bg-gray-50">
                        <h1 className="p-4 text-lg">In progress</h1>
                        <hr />
                        <ol>
                            {data.stickerListItems.filter((item) => item.stage === 2)
                                .map((sticker) => (
                                    <li key={sticker.id}>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `block border-b p-4 ${isActive ? "bg-white" : ""}`
                                            }
                                            to={sticker.id.toString()}
                                        >
                                            📝 {sticker.title}
                                        </NavLink>
                                    </li>
                                ))}
                        </ol>
                    </div>

                    <div className="h-full basis-1/4 w-1/4 border-r bg-gray-50">
                        <h1 className="p-4 text-lg">Done</h1>
                        <hr />
                        <ol>
                            {data.stickerListItems.filter((item) => item.stage === 3)
                                .map((sticker) => (
                                    <li key={sticker.id}>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `block border-b p-4 ${isActive ? "bg-white" : ""}`
                                            }
                                            to={sticker.id.toString()}
                                        >
                                            📝 {sticker.title}
                                        </NavLink>
                                    </li>
                                ))}
                        </ol>
                    </div>
                </div>
                <div className="basis-2/5 p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
