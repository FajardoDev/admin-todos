import { FormatearFecha } from "@/helpers/FormatearFecha";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

export async function GET(request: Request) {
	// Paginación simple
	const { searchParams } = new URL(request.url);

	const take = Number(searchParams.get("take") ?? 10);
	const skip = Number(searchParams.get("skip") ?? 0);

	if (isNaN(take)) {
		return NextResponse.json(
			{ message: "Take tiene que ser un número" },
			{ status: 400 },
		);
	}
	if (isNaN(skip)) {
		return NextResponse.json(
			{ message: "Skip tiene que ser un número" },
			{ status: 400 },
		);
	}

	const todos = await prisma.todo.findMany({
		take: take,
		skip: skip,
	});

	return NextResponse.json(todos);
}

// Validar con Yup
const postSchema = yup.object({
	description: yup.string().required(),
	complete: yup.boolean().optional().default(false), //! TODO: Mostrar algo interesante
	// createAt: yup.date().optional().default(FormatearFecha),
});

export async function POST(request: Request) {
	try {
		// obj a validar body
		const { complete, description } = await postSchema.validate(
			await request.json(),
		);
		// const body = await postSchema.validate(await request.json());

		const todo = await prisma.todo.create({ data: { complete, description } });
		// const todo = await prisma.todo.create({ data: body });

		return NextResponse.json(todo);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}
