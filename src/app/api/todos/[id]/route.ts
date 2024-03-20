// rag
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

interface Segments {
	params: { id: string };
}

export async function GET(request: Request, { params }: Segments) {
	// console.log(segments); { params: { id: 'c6502216-b54d-4d36-9644-ab69649ccf16' } }

	const { id } = params;

	// const todos = await prisma.todo.findMany();

	// const todo = todos.find((ids) => ids.id === id);

	// if (todo == todo?.id) {
	// 	return NextResponse.json(
	// 		{ message: `todo con el id: ${id} no se encuentra en la lista` },
	// 		{ status: 404 },
	// 	);
	// }

	// return NextResponse.json(params.id);

	const todo = await prisma.todo.findFirst({ where: { id } });
	if (!todo) {
		return NextResponse.json(
			{ message: `todo con el id: ${id} no existe` },
			{ status: 404 },
		);
	}

	return NextResponse.json(todo);
}

// Validar con Yup
const putSchema = yup.object({
	description: yup.string().optional(),
	complete: yup.boolean().optional(),
});

// Method PUT
export async function PUT(request: Request, { params }: Segments) {
	const { id } = params;

	const todo = await prisma.todo.findFirst({ where: { id } });
	if (!todo) {
		return NextResponse.json(
			{ message: `todo con el id: ${id} no existe` },
			{ status: 404 },
		);
	}

	try {
		const { complete, description, ...rest } = await putSchema.validate(
			await request.json(),
		);

		const updateTodo = await prisma.todo.update({
			where: { id },
			data: { complete, description },
			// data: body,
		});

		// return NextResponse.json(todo);
		return NextResponse.json(updateTodo);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}
