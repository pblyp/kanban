import { Sticker, User } from "@prisma/client";
import { prisma } from "~/db.server";

export interface IExportData {
    exportVersion: number;
    export_data?: Sticker[];
}

export function getSticker({
    id,
    userId,
}: Pick<Sticker, "id"> & {
    userId: User["id"];
}) {
    return prisma.sticker.findFirst({
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true, stage: true, estimate: true, spentHours: true, startedAt: true, endedAt: true },
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

export function exportBoard({ userId }: { userId: User["id"] }) {
    return prisma.sticker.findMany({
        where: { userId },
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true, stage: true, estimate: true, spentHours: true, startedAt: true, endedAt: true },
        orderBy: { updatedAt: "desc" },
    });
}

export function importBoard({ exported, userId }: { exported: IExportData } & { userId: User["id"] }) {
    if (!exported.export_data) {
        return;
    }
    return prisma.sticker.deleteMany({ where: { userId } })
        .then(() => {
            console.log("amog");
            var promises = exported.export_data!.map((sticker: Sticker) => prisma.sticker.create({
                data: {
                    user: {
                        connect: {
                            id: userId,
                        }
                    },
                    title: sticker.title,
                    summary: sticker.summary,
                    stage: sticker.stage,
                    estimate: sticker.estimate,
                    spentHours: sticker.spentHours,
                    createdAt: sticker.createdAt,
                    updatedAt: sticker.updatedAt,
                    startedAt: sticker.startedAt,
                    endedAt: sticker.endedAt,
                }
            }))
            Promise.all(promises);
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
            estimate: 0,
            spentHours: 0,
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
    estimate,
    spentHours,
    startedAt,
    endedAt,
    userId,
}: Pick<Sticker, "id" | "title" | "summary" | "estimate" | "spentHours" | "startedAt" | "endedAt"> & {
    userId: User["id"];
}) {
    return prisma.sticker.update({
        select: { id: true, summary: true, title: true, createdAt: true, updatedAt: true, estimate: true, spentHours: true, startedAt: true, endedAt: true },
        where: { id },
        data: {
            title,
            summary,
            estimate,
            spentHours,
            startedAt,
            endedAt
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