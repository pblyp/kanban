import { Sticker, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getSticker({
    id,
    userId,
}: Pick<Sticker, "id"> & {
    userId: User["id"];
}) {
    return prisma.sticker.findFirst({
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true, stage: true },
        where: { id, userId },
    });
}

export function getStickerListItems({ userId }: { userId: User["id"] }) {
    return prisma.sticker.findMany({
        where: { userId },
        select: { id: true, title: true, stage: true },
        orderBy: { updatedAt: "desc" },
    });
}

export function createSticker({
    title,
    summary,
    userId,
}: Pick<Sticker, "title" | "summary"> & {
    userId: User["id"];
}) {
    return prisma.sticker.create({
        data: {
            title,
            summary,
            stage: 0,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}

export function deleteSticker({
    id,
    userId,
}: Pick<Sticker, "id"> & { userId: User["id"] }) {
    return prisma.sticker.deleteMany({
        where: { id, userId },
    });
}

export function updateSticker({
    id,
    title,
    summary,
    userId,
}: Pick<Sticker, "id" | "title" | "summary"> & {
    userId: User["id"];
}) {
    return prisma.sticker.update({
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true },
        where: { id },
        data: {
            title,
            summary,
        }
    })
}

export function moveSticker({
    id,
    userId,
    stage,
}: Pick<Sticker, "id" | "stage"> & {
    userId: User["id"];
}) {
    return prisma.sticker.update({
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true },
        where: { id },
        data: {
            stage
        }
    })
}