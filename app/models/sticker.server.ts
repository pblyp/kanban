import { Sticker, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getSticker({
    id,
    userId,
}: Pick<Sticker, "id"> & {
    userId: User["id"];
}) {
    return prisma.sticker.findFirst({
        select: { id: true, summary: true, title: true },
        where: { id, userId },
    });
}

export function getStickerListItems({ userId }: { userId: User["id"] }) {
    return prisma.sticker.findMany({
        where: { userId },
        select: { id: true, title: true },
        orderBy: { updatedAt: "desc" },
    });
}